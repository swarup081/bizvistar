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
  const { data: { user }, error } = await getAuthUserContext(supabase);
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

// Helper: Ensure admin
async function requireAdmin() {
  const user = await getAuthUser();
  const { data: adminRecord } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .maybeSingle();
  if (!adminRecord) throw new Error('Admin access denied');
  return user;
}

// ─── CREATE SHARED TEMPLATE ───
export async function createSharedTemplate({ templateName, businessName, tagline, theme, customizations }) {
  try {
    const user = await requireAdmin();

    const shareId = generateShareId();

    const { data, error } = await supabaseAdmin
      .from('shared_templates')
      .insert({
        share_id: shareId,
        template_name: templateName,
        business_name: businessName || '',
        tagline: tagline || '',
        theme: theme || '',
        customizations: customizations || {},
        created_by: user.id,
        is_active: true,
        claimed_count: 0
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, shareUrl: `/claim/${shareId}` };
  } catch (error) {
    console.error('createSharedTemplate error:', error);
    return { success: false, error: error.message };
  }
}

// ─── UPDATE SHARED TEMPLATE ───
export async function updateSharedTemplate(id, { businessName, tagline, theme, customizations, isActive, updatedAtCheck }) {
  try {
    await requireAdmin();

    if (updatedAtCheck) {
      // Git-style conflict check
      const { data: currentData } = await supabaseAdmin
        .from('shared_templates')
        .select('updated_at')
        .eq('id', id)
        .single();
        
      if (currentData && currentData.updated_at && new Date(currentData.updated_at).getTime() > new Date(updatedAtCheck).getTime()) {
        return { success: false, error: 'CONFLICT', message: 'This template has been modified by another admin since you started editing. Please refresh and try again.' };
      }
    }

    const updatePayload = { updated_at: new Date() };
    if (businessName !== undefined) updatePayload.business_name = businessName;
    if (tagline !== undefined) updatePayload.tagline = tagline;
    if (theme !== undefined) updatePayload.theme = theme;
    if (customizations !== undefined) updatePayload.customizations = customizations;
    if (isActive !== undefined) updatePayload.is_active = isActive;

    const { data, error } = await supabaseAdmin
      .from('shared_templates')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('updateSharedTemplate error:', error);
    return { success: false, error: error.message };
  }
}

// ─── DELETE (DEACTIVATE) SHARED TEMPLATE ───
export async function deactivateSharedTemplate(id) {
  try {
    await requireAdmin();

    const { error } = await supabaseAdmin
      .from('shared_templates')
      .update({ is_active: false, updated_at: new Date() })
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── GET ALL SHARED TEMPLATES (Admin) ───
export async function getSharedTemplates() {
  try {
    await requireAdmin();

    const { data, error } = await supabaseAdmin
      .from('shared_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, templates: data || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── GET SHARED TEMPLATE BY SHARE ID (Public) ───
export async function getSharedTemplateByShareId(shareId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('shared_templates')
      .select('*')
      .eq('share_id', shareId)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return { success: false, error: 'Template not found or no longer available.' };
    }

    return { success: true, template: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─── CLAIM TEMPLATE ───
// Called after user signs up/in via the claim flow.
// Clones the shared template config into a new website for the user.
export async function claimTemplate(shareId) {
  try {
    const user = await getAuthUser();

    // 1. Get the shared template
    const { data: sharedTemplate, error: fetchError } = await supabaseAdmin
      .from('shared_templates')
      .select('*')
      .eq('share_id', shareId)
      .eq('is_active', true)
      .maybeSingle();

    if (fetchError || !sharedTemplate) {
      return { success: false, error: 'This shared template is no longer available.' };
    }

    // 2. Check if user already claimed this template
    const { data: existingClaim } = await supabaseAdmin
      .from('template_claims')
      .select('id, website_id')
      .eq('shared_template_id', sharedTemplate.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingClaim) {
      return { success: true, alreadyClaimed: true, websiteId: existingClaim.website_id };
    }

    // 3. Check if user already has a website
    const { data: existingWebsite } = await supabaseAdmin
      .from('websites')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    // 4. Look up template ID from templates table
    const { data: templateRecord } = await supabaseAdmin
      .from('templates')
      .select('id')
      .ilike('name', sharedTemplate.template_name)
      .limit(1)
      .maybeSingle();

    if (!templateRecord) {
      return { success: false, error: 'Base template not found.' };
    }

    // 5. Build website data from shared template customizations
    const websiteData = sharedTemplate.customizations || {};

    let websiteId;

    if (existingWebsite) {
      // Update existing website with shared template data
      const { error: updateError } = await supabaseAdmin
        .from('websites')
        .update({
          template_id: templateRecord.id,
          website_data: websiteData,
          draft_data: null,
          updated_at: new Date()
        })
        .eq('id', existingWebsite.id);

      if (updateError) throw updateError;
      websiteId = existingWebsite.id;
    } else {
      // Create new website
      const businessName = sharedTemplate.business_name || 'My Business';
      const cleanSlug = businessName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const timestampSlug = cleanSlug + '-' + Date.now();

      // Try clean slug first, fallback to timestamped
      let { data: newSite, error: insertError } = await supabaseAdmin
        .from('websites')
        .insert({
          user_id: user.id,
          template_id: templateRecord.id,
          site_slug: cleanSlug,
          website_data: websiteData
        })
        .select('id')
        .single();

      if (insertError) {
        const retryResult = await supabaseAdmin
          .from('websites')
          .insert({
            user_id: user.id,
            template_id: templateRecord.id,
            site_slug: timestampSlug,
            website_data: websiteData
          })
          .select('id')
          .single();

        newSite = retryResult.data;
        if (retryResult.error) throw retryResult.error;
      }

      websiteId = newSite.id;
    }

    // 6. Record the claim
    await supabaseAdmin
      .from('template_claims')
      .insert({
        shared_template_id: sharedTemplate.id,
        user_id: user.id,
        website_id: websiteId
      });

    // 7. Increment claimed_count
    await supabaseAdmin
      .from('shared_templates')
      .update({ claimed_count: (sharedTemplate.claimed_count || 0) + 1 })
      .eq('id', sharedTemplate.id);

    return { success: true, websiteId };
  } catch (error) {
    console.error('claimTemplate error:', error);
    return { success: false, error: error.message };
  }
}

// ─── HELPER: Generate URL-safe share ID ───
function generateShareId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
