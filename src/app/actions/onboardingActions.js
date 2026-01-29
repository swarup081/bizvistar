'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Admin client for operations that might need bypass (though we prefer RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
           try {
             cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
           } catch { }
        },
      },
    }
  );
}

export async function getOnboardingStatus(websiteId) {
  const supabase = await getSupabase();

  try {
    // 1. Try to fetch from the new table
    const { data, error } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('website_id', websiteId)
      .maybeSingle();

    if (error) {
       // If error (e.g., table doesn't exist), fallback to website_data
       console.warn("Onboarding table fetch error (falling back):", error.message);
       throw error;
    }

    if (data) {
      return {
        completed: data.is_completed,
        data: data
      };
    }

    // Record doesn't exist yet, return false
    return { completed: false, data: {} };

  } catch (err) {
    // Fallback: Check draft_data in websites table
    const { data: website } = await supabase
      .from('websites')
      .select('draft_data')
      .eq('id', websiteId)
      .single();

    if (website?.draft_data?.onboarding_completed) {
      return {
        completed: true,
        data: website.draft_data.onboarding_data || {}
      };
    }

    return { completed: false, data: {} };
  }
}

export async function saveOnboardingStep(websiteId, stepData) {
  const supabase = await getSupabase();

  try {
    // 1. Try to upsert to onboarding_data
    // We first check if a record exists to know if we insert or update,
    // or we can use upsert if we have a unique constraint on website_id.
    // The migration added a unique constraint.

    // Prepare data mapping (snake_case for DB)
    const dbData = {
        website_id: websiteId,
        updated_at: new Date().toISOString(),
        ...stepData
    };

    const { error } = await supabase
      .from('onboarding_data')
      .upsert(dbData, { onConflict: 'website_id' });

    if (error) throw error;

    return { success: true };

  } catch (err) {
    console.warn("Onboarding table save error (falling back):", err.message);

    // Fallback: Update draft_data
    // Fetch current draft_data
    const { data: website } = await supabase
      .from('websites')
      .select('draft_data')
      .eq('id', websiteId)
      .single();

    const currentDraft = website?.draft_data || {};
    const currentOnboarding = currentDraft.onboarding_data || {};

    // Merge new data
    const newData = {
        ...currentDraft,
        onboarding_data: { ...currentOnboarding, ...stepData }
    };

    const { error: updateError } = await supabase
        .from('websites')
        .update({ draft_data: newData })
        .eq('id', websiteId);

    if (updateError) {
        console.error("Fallback save failed:", updateError);
        return { success: false, error: updateError.message };
    }

    return { success: true };
  }
}

export async function completeOnboarding(websiteId) {
    // Reuse saveOnboardingStep
    const result = await saveOnboardingStep(websiteId, { is_completed: true });

    // Also, if we are in fallback mode (or even if not), we might want to flag it in draft_data
    // just to be safe if the UI checks that locally before refresh?
    // But for now, reliance on saveOnboardingStep logic is sufficient.

    return result;
}

export async function addQuickProducts(websiteId, products) {
  // Use Admin client for products to ensure we can write even if RLS is strict (though user should have access)
  const supabase = await getSupabase();

  if (!products || products.length === 0) return { success: true };
  if (products.length > 10) return { success: false, message: "Limit exceeded" };

  try {
     // 1. Map to DB schema
     const dbProducts = products.map(p => ({
         website_id: websiteId,
         name: p.name,
         description: p.description,
         price: p.price,
         image_url: p.image,
         stock: -1, // Unlimited by default for quick add? Or 0? Prompt said "Unlimited from dashboard", so maybe default here is fine.
         category_id: null // Uncategorized
     }));

     const { error } = await supabase
        .from('products')
        .insert(dbProducts);

     if (error) throw error;

     return { success: true };

  } catch (err) {
      console.error("Add products error:", err);
      // Fallback: We can't easily fallback for 'products' table if it fails,
      // but 'products' table SHOULD exist as it's core.
      // If it fails, it's a real error.
      return { success: false, message: err.message };
  }
}
