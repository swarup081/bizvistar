'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getAuthUserContext } from '@/lib/authUtils';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to get authenticated user
async function getAuthUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    }
  );
  const { data: { user }, error, realUser } = await getAuthUserContext(supabase);
  if (error || !user) throw new Error('Unauthorized');
  return realUser || user;
}

// ─── ADMIN VERIFICATION ───
// Checks if the current user's email is in the admin_users table.
// Uses service role key to bypass RLS (admin_users table blocks all client access).
export async function verifyAdmin() {
  try {
    const user = await getAuthUser();
    
    const { data: adminRecord, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, role')
      .eq('email', user.email)
      .maybeSingle();

    if (error || !adminRecord) {
      return { isAdmin: false };
    }

    // Update user_id if not set (first login after seed)
    if (!adminRecord.user_id) {
      await supabaseAdmin
        .from('admin_users')
        .update({ user_id: user.id })
        .eq('id', adminRecord.id);
    }

    return { isAdmin: true, role: adminRecord.role, email: user.email };
  } catch {
    return { isAdmin: false };
  }
}

// ─── Helper: Ensure admin before any operation ───
async function requireAdmin() {
  const result = await verifyAdmin();
  if (!result.isAdmin) throw new Error('Admin access denied');
  return result;
}

// ─── IMPERSONATION ───
export async function impersonateUser(targetUserId) {
  try {
    await requireAdmin();

    const cookieStore = await cookies();
    cookieStore.set('impersonated_user_id', targetUserId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function stopImpersonating() {
  const cookieStore = await cookies();
  cookieStore.delete('impersonated_user_id');
  return { success: true };
}

// ─── DASHBOARD STATS ───
export async function getAdminDashboardStats() {
  try {
    await requireAdmin();

    // Parallel queries for all stats
    const [
      { data: { users: allUsers }, error: authError },
      { count: totalWebsites },
      { count: publishedWebsites },
      { count: totalOrders },
      { count: activeSubscriptions },
      { data: revenueData },
      { count: totalSharedTemplates },
      { count: totalClaims }
    ] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers(),
      supabaseAdmin.from('websites').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('websites').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).in('status', ['active', 'trialing']),
      supabaseAdmin.from('orders').select('total_amount').neq('status', 'canceled'),
      supabaseAdmin.from('shared_templates').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('template_claims').select('*', { count: 'exact', head: true })
    ]);

    const totalRevenue = (revenueData || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    // Get recent users
    const recentUsers = (allUsers || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 500)
      .map(u => ({ id: u.id, created_at: u.created_at }));

    return {
      success: true,
      stats: {
        totalUsers: (allUsers || []).length,
        totalWebsites: totalWebsites || 0,
        publishedWebsites: publishedWebsites || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        activeSubscriptions: activeSubscriptions || 0,
        totalSharedTemplates: totalSharedTemplates || 0,
        totalClaims: totalClaims || 0,
        recentUsers,
        revenueData: revenueData || []      }
    };
  } catch (error) {
    console.error('getAdminDashboardStats error:', error);
    return { success: false, error: error.message };
  }
}

// ─── USERS MANAGEMENT ───
export async function getAllUsers(page = 1, pageSize = 20, search = '') {
  try {
    await requireAdmin();

    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    let filteredUsers = users || [];
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        (u.email || '').toLowerCase().includes(lowerSearch) ||
        (u.user_metadata?.full_name || '').toLowerCase().includes(lowerSearch) ||
        (u.id).toLowerCase().includes(lowerSearch)
      );
    }
    
    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice((page - 1) * pageSize, page * pageSize);

    const userIds = paginatedUsers.map(u => u.id);

    const [websiteCounts, subscriptionData] = await Promise.all([
      supabaseAdmin.from('websites').select('user_id').in('user_id', userIds),
      supabaseAdmin.from('subscriptions').select('user_id, status, plan:plans(name)').in('user_id', userIds).in('status', ['active', 'trialing', 'past_due'])
    ]);

    const websiteCountMap = {};
    (websiteCounts.data || []).forEach(w => { websiteCountMap[w.user_id] = (websiteCountMap[w.user_id] || 0) + 1; });

    const subscriptionMap = {};
    (subscriptionData.data || []).forEach(s => { subscriptionMap[s.user_id] = { status: s.status, plan: s.plan?.name || 'None' }; });

    const enrichedProfiles = paginatedUsers.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.user_metadata?.full_name || u.email,
      created_at: u.created_at,
      websiteCount: websiteCountMap[u.id] || 0,
      subscription: subscriptionMap[u.id] || { status: 'none', plan: 'None' }
    }));

    return {
      success: true,
      users: enrichedProfiles,
      total: total,
      page,
      pageSize
    };
  } catch (error) {
    console.error('getAllUsers error:', error);
    return { success: false, error: error.message };
  }
}

// ─── WEBSITES MANAGEMENT ───
export async function getAllWebsites(page = 1, pageSize = 20, search = '', filter = 'all') {
  try {
    await requireAdmin();

    let query = supabaseAdmin
      .from('websites')
      .select('id, site_slug, is_published, created_at, updated_at, user_id, template_id, template:templates(name)', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (search) {
      query = query.ilike('site_slug', `%${search}%`);
    }

    if (filter === 'published') query = query.eq('is_published', true);
    if (filter === 'draft') query = query.eq('is_published', false);

    const { data: websites, count, error } = await query;
    if (error) throw error;

    // Fetch onboarding data for business names
    const websiteIds = (websites || []).map(w => w.id);
    const { data: onboardingData } = await supabaseAdmin
      .from('onboarding_data')
      .select('website_id, owner_name, business_name')
      .in('website_id', websiteIds);

    const onboardingMap = {};
    (onboardingData || []).forEach(o => {
      onboardingMap[o.website_id] = o;
    });

    const enriched = (websites || []).map(w => ({
      ...w,
      businessName: onboardingMap[w.id]?.business_name || onboardingMap[w.id]?.owner_name || w.site_slug,
      templateName: w.template?.name || 'Unknown'
    }));

    return {
      success: true,
      websites: enriched,
      total: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('getAllWebsites error:', error);
    return { success: false, error: error.message };
  }
}

// ─── ORDERS MANAGEMENT ───
export async function getAllOrders(page = 1, pageSize = 20, search = '', statusFilter = 'all') {
  try {
    await requireAdmin();

    let query = supabaseAdmin
      .from('orders')
      .select('id, total_amount, status, created_at, customer_id, website_id', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data: orders, count, error } = await query;
    if (error) throw error;

    // Fetch customer names
    const customerIds = [...new Set((orders || []).map(o => o.customer_id).filter(Boolean))];
    const { data: customers } = customerIds.length > 0
      ? await supabaseAdmin.from('customers').select('id, name, email').in('id', customerIds)
      : { data: [] };

    const customerMap = {};
    (customers || []).forEach(c => { customerMap[c.id] = c; });

    // Fetch websites to know whose shop it is
    const websiteIds = [...new Set((orders || []).map(o => o.website_id).filter(Boolean))];
    const { data: websites } = websiteIds.length > 0
      ? await supabaseAdmin.from('websites').select('id, site_slug, user_id').in('id', websiteIds)
      : { data: [] };
      
    // Fetch users (store owners) for these websites
    const userIds = [...new Set((websites || []).map(w => w.user_id).filter(Boolean))];
    let userMap = {};
    if (userIds.length > 0) {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      (users || []).forEach(u => {
        if (userIds.includes(u.id)) userMap[u.id] = u.email;
      });
    }

    const websiteMap = {};
    (websites || []).forEach(w => { 
      websiteMap[w.id] = { ...w, owner_email: userMap[w.user_id] || 'Unknown' }; 
    });

    const enriched = (orders || []).map(o => ({
      ...o,
      customer: customerMap[o.customer_id] || { name: 'Unknown', email: '' },
      website: websiteMap[o.website_id] || null
    }));

    return {
      success: true,
      orders: enriched,
      total: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('getAllOrders error:', error);
    return { success: false, error: error.message };
  }
}

export async function adminUpdateOrderStatus(orderId, newStatus) {
  try {
    await requireAdmin();

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus, updated_at: new Date() })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('adminUpdateOrderStatus error:', error);
    return { success: false, error: error.message };
  }
}

// ─── WEBSITE ACTIONS (with safeguards) ───

export async function adminTogglePublish(websiteId) {
  try {
    await requireAdmin();

    const { data: website, error } = await supabaseAdmin
      .from('websites')
      .select('id, is_published, site_slug')
      .eq('id', websiteId)
      .single();

    if (error || !website) throw new Error('Website not found');

    const newStatus = !website.is_published;

    const { error: updateError } = await supabaseAdmin
      .from('websites')
      .update({ is_published: newStatus, updated_at: new Date() })
      .eq('id', websiteId);

    if (updateError) throw updateError;

    return { success: true, isPublished: newStatus, slug: website.site_slug };
  } catch (error) {
    console.error('adminTogglePublish error:', error);
    return { success: false, error: error.message };
  }
}

export async function adminDeleteWebsite(websiteId) {
  try {
    await requireAdmin();

    // Soft delete: unpublish and mark as deleted via is_published = false
    // We don't actually delete to prevent data loss
    const { error } = await supabaseAdmin
      .from('websites')
      .update({ is_published: false, updated_at: new Date() })
      .eq('id', websiteId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('adminDeleteWebsite error:', error);
    return { success: false, error: error.message };
  }
}

// ─── RECENT ORDERS (for dashboard) ───
export async function getRecentOrders(limit = 20) {
  try {
    await requireAdmin();

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, status, created_at, customer_id, website_id')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const customerIds = [...new Set((orders || []).map(o => o.customer_id).filter(Boolean))];
    const { data: customers } = customerIds.length > 0
      ? await supabaseAdmin.from('customers').select('id, name').in('id', customerIds)
      : { data: [] };

    const customerMap = {};
    (customers || []).forEach(c => { customerMap[c.id] = c; });

    return {
      success: true,
      orders: (orders || []).map(o => ({
        ...o,
        customerName: customerMap[o.customer_id]?.name || 'Unknown'
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── SUBSCRIPTIONS OVERVIEW ───
export async function getAllSubscriptions(page = 1, pageSize = 20) {
  try {
    await requireAdmin();

    const { data, count, error } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, status, created_at, plan:plans(name, price)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    return { success: true, subscriptions: data || [], total: count || 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── ASK VISTA CHATS ───
export async function getAdminChats(page = 1, pageSize = 20) {
  try {
    await requireAdmin();
    const { data: chats, count, error } = await supabaseAdmin
      .from('chat_sessions')
      .select('*, chat_feedback(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;
    
    // Fetch users for these chats
    const userIds = [...new Set((chats || []).map(c => c.user_id).filter(Boolean))];
    let userMap = {};
    if (userIds.length > 0) {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      (users || []).forEach(u => {
        if (userIds.includes(u.id)) {
          userMap[u.id] = u.email;
        }
      });
    }
    
    const enrichedChats = (chats || []).map(c => ({
      ...c,
      user_email: userMap[c.user_id] || 'Unknown'
    }));

    return { success: true, chats: enrichedChats, total: count || 0, page, pageSize };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── UPDATE SUBSCRIPTION ───
export async function adminUpdateSubscription(userId, newPlanId) {
  try {
    await requireAdmin();
    
    // Check if subscription exists
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (existingSub) {
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({ plan_id: newPlanId, status: 'active', updated_at: new Date() })
        .eq('id', existingSub.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .insert({ 
          user_id: userId, 
          plan_id: newPlanId, 
          status: 'active', 
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
        });
      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── SHARED LINK ANALYTICS ───
export async function getSharedLinkAnalytics(shareId) {
  try {
    await requireAdmin();
    
    // Get analytics events
    const { data: analytics, error } = await supabaseAdmin
      .from('shared_link_analytics')
      .select('ip_address, event_type, created_at')
      .eq('share_id', shareId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Get actual claims
    const { data: claims, error: claimsError } = await supabaseAdmin
      .from('template_claims')
      .select('user_id, created_at, website_id')
      .eq('share_id', shareId)
      .order('created_at', { ascending: false });
      
    if (claimsError) throw claimsError;
    
    // Resolve user emails for claims
    const userIds = [...new Set((claims || []).map(c => c.user_id).filter(Boolean))];
    let userMap = {};
    if (userIds.length > 0) {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      (users || []).forEach(u => {
        if (userIds.includes(u.id)) {
          userMap[u.id] = u.email;
        }
      });
    }
    
    const enrichedClaims = (claims || []).map(c => ({
      ...c,
      user_email: userMap[c.user_id] || 'Unknown'
    }));
    
    return { 
      success: true, 
      analytics: analytics || [],
      claims: enrichedClaims
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

