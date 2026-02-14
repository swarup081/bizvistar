'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- HELPER: Get User ---
async function getUser() {
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
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// --- ACTIONS ---

export async function getNotifications(websiteId) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Check if user owns the website
    const { data: website } = await supabaseAdmin
        .from('websites')
        .select('user_id')
        .eq('id', websiteId)
        .single();

    if (!website || website.user_id !== user.id) {
         // Return empty if unauthorized to prevent leakage, or throw error
         return [];
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return [];
  }
}

export async function deleteNotification(notificationId) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership via RLS or explicit check
    // We'll use explicit check for safety with Admin client
    const { data: notif } = await supabaseAdmin
        .from('notifications')
        .select('website_id, websites(user_id)')
        .eq('id', notificationId)
        .single();

    if (!notif || !notif.websites || notif.websites.user_id !== user.id) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error deleting notification:', err);
    return { success: false, error: err.message };
  }
}

export async function clearAllNotifications(websiteId) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership
    const { data: website } = await supabaseAdmin
        .from('websites')
        .select('user_id')
        .eq('id', websiteId)
        .single();

    if (!website || website.user_id !== user.id) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('website_id', websiteId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error clearing notifications:', err);
    return { success: false, error: err.message };
  }
}

export async function markNotificationRead(notificationId) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

     // Verify ownership
    const { data: notif } = await supabaseAdmin
        .from('notifications')
        .select('website_id, websites(user_id)')
        .eq('id', notificationId)
        .single();

    if (!notif || !notif.websites || notif.websites.user_id !== user.id) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error marking notification read:', err);
    return { success: false, error: err.message };
  }
}
