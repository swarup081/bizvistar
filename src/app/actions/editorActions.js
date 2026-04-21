'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { validateUserSubscription } from './subscriptionUtils';

// Helper: Re-sync products/categories from DB into website_data JSON after publish
async function resyncProductsIntoWebsiteData(supabaseAdmin, websiteId) {
  try {
    const [{ data: products }, { data: categories }] = await Promise.all([
      supabaseAdmin
        .from('products')
        .select('id, name, price, category_id, description, image_url, stock, additional_images, variants')
        .eq('website_id', websiteId)
        .order('id', { ascending: false }),
      supabaseAdmin
        .from('categories')
        .select('id, name')
        .eq('website_id', websiteId)
    ]);

    const { data: website } = await supabaseAdmin
      .from('websites')
      .select('website_data')
      .eq('id', websiteId)
      .single();

    if (!website) return;

    const currentData = website.website_data || {};

    const mappedProducts = (products || []).map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      category: p.category_id ? String(p.category_id) : 'uncategorized',
      description: p.description,
      image: p.image_url,
      stock: p.stock,
      additional_images: p.additional_images || [],
      variants: p.variants || []
    }));

    const mappedCategories = (categories || []).map(c => ({
      id: String(c.id),
      name: c.name
    }));

    const newData = {
      ...currentData,
      allProducts: mappedProducts,
      categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || [])
    };

    await supabaseAdmin
      .from('websites')
      .update({ website_data: newData })
      .eq('id', websiteId);
  } catch (err) {
    console.error('resyncProductsIntoWebsiteData error:', err);
  }
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to get authenticated user ID
async function getUserId() {
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

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user.id;
}

// Action: Save Draft
export async function saveDraft(websiteId, draftData) {
  try {
    const userId = await getUserId();

    // Verify ownership
    const { error: verifyError } = await supabaseAdmin
      .from('websites')
      .select('id')
      .eq('id', websiteId)
      .eq('user_id', userId)
      .single();

    if (verifyError) throw new Error('Unauthorized access to website.');

    const { error } = await supabaseAdmin
      .from('websites')
      .update({ draft_data: draftData, updated_at: new Date() })
      .eq('id', websiteId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Save Draft Error:', error);
    return { success: false, error: error.message };
  }
}

// Action: Publish Website
// NOTE: No longer accepts currentData param — reads from DB draft_data to avoid
// exceeding Next.js 1MB Server Action body limit.
export async function publishWebsite(websiteId) {
  try {
    const userId = await getUserId();

    // 1. Verify ownership
    const { data: website, error: verifyError } = await supabaseAdmin
        .from('websites')
        .select('id, draft_data, website_data, is_published')
        .eq('id', websiteId)
        .eq('user_id', userId)
        .single();
    
    if (verifyError || !website) throw new Error('Unauthorized access or website not found.');

    // 2. Check Subscription
    // Requirement: If already published, allow direct update (skip payment check).
    // If not published (first time), check payment.
    if (!website.is_published) {
        try {
            await validateUserSubscription(userId);
        } catch (subError) {
            // If subscription is invalid/inactive
            return { success: false, error: 'PAYMENT_REQUIRED', message: subError.message };
        }
    }

    // 3. Publish from draft_data (already auto-saved by editor) or existing website_data
    const dataToPublish = website.draft_data || website.website_data;
    
    if (!dataToPublish) {
        return { success: false, error: 'No data to publish.' };
    }

    const { error: updateError } = await supabaseAdmin
        .from('websites')
        .update({ 
            website_data: dataToPublish, 
            is_published: true,
            draft_data: null, // Clear draft after publishing to indicate sync state
            updated_at: new Date()
        })
        .eq('id', websiteId);

    if (updateError) throw updateError;

    // 4. Re-sync products/categories from DB into the published website_data
    // This ensures correct field mapping (image_url -> image, category_id -> category)
    await resyncProductsIntoWebsiteData(supabaseAdmin, websiteId);

    return { success: true };

  } catch (error) {
    console.error('Publish Error:', error);
    return { success: false, error: error.message };
  }
}


// Action: Revert to Published (Restart)
export async function revertToPublished(websiteId) {
    try {
        const userId = await getUserId();

        // 1. Verify ownership and get published data
        const { data: website, error: verifyError } = await supabaseAdmin
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .eq('user_id', userId)
            .single();

        if (verifyError || !website) throw new Error('Unauthorized or website not found.');

        // 2. Clear draft_data so next load uses website_data
        const { error: updateError } = await supabaseAdmin
            .from('websites')
            .update({ draft_data: null }) 
            .eq('id', websiteId);

        if (updateError) throw updateError;

        return { success: true, data: website.website_data };

    } catch (error) {
        console.error('Revert Error:', error);
        return { success: false, error: error.message };
    }
}
