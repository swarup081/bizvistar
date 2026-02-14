import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
// This client uses the Service Role Key, so it bypasses RLS.
// This utility should ONLY be used in server-side contexts (Server Actions, API Routes).
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Creates a notification in the database.
 * This is an internal utility function, NOT a Server Action.
 * 
 * @param {object} params
 * @param {string} params.websiteId - The ID of the website.
 * @param {string} params.type - 'new_order', 'low_stock', 'out_of_stock'.
 * @param {string} params.title - Notification title.
 * @param {string} params.message - Notification message.
 * @param {object} params.data - Additional data (e.g., product_id, order_id).
 */
export async function createNotification({ websiteId, type, title, message, data = {} }) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .insert({
        website_id: websiteId,
        type,
        title,
        message,
        data,
        is_read: false
      });
      
    if (error) {
        console.error('Supabase Error creating notification:', error);
        throw error;
    }
    return { success: true };
  } catch (err) {
    console.error('Error creating notification (Internal):', err);
    return { success: false, error: err.message };
  }
}
