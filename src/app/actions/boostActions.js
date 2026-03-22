"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { verifyWebsiteOwnership } from '@/app/actions/onboardingActions';

const createClient = async () => {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
                set(name, value, options) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {}
                },
                remove(name, options) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {}
                },
            },
        }
    );
};
import { revalidatePath } from 'next/cache';

export async function getOffers(websiteId) {

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching offers:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function createOffer(websiteId, offerData) {
  const verification = await verifyWebsiteOwnership(websiteId);
  if (!verification.success) return { success: false, error: 'Unauthorized' };

  const supabase = await createClient();

  // If making featured, unfeature others
  if (offerData.is_featured) {
      await supabase.from('offers').update({ is_featured: false }).eq('website_id', websiteId);
  }

  const { data, error } = await supabase
    .from('offers')
    .insert([
      {
        website_id: websiteId,
        ...offerData
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating offer:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/apps/boost');
  return { success: true, data };
}

export async function updateOffer(offerId, websiteId, updates) {
  const verification = await verifyWebsiteOwnership(websiteId);
  if (!verification.success) return { success: false, error: 'Unauthorized' };

  const supabase = await createClient();

  // If making featured, unfeature others first
  if (updates.is_featured) {
      await supabase.from('offers').update({ is_featured: false }).eq('website_id', websiteId);
  }

  const { data, error } = await supabase
    .from('offers')
    .update(updates)
    .eq('id', offerId)
    .eq('website_id', websiteId)
    .select()
    .single();

  if (error) {
    console.error('Error updating offer:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/apps/boost');
  return { success: true, data };
}

export async function deleteOffer(offerId, websiteId) {
  const verification = await verifyWebsiteOwnership(websiteId);
  if (!verification.success) return { success: false, error: 'Unauthorized' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', offerId)
    .eq('website_id', websiteId);

  if (error) {
    console.error('Error deleting offer:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/apps/boost');
  return { success: true };
}

export async function updateWebsiteOffersConfig(websiteId, offersConfig) {
  const verification = await verifyWebsiteOwnership(websiteId);
  if (!verification.success) return { success: false, error: 'Unauthorized' };

  const supabase = await createClient();

  // Fetch existing website_data
  const { data: website, error: fetchError } = await supabase
    .from('websites')
    .select('website_data')
    .eq('id', websiteId)
    .single();

  if (fetchError) {
    console.error('Error fetching website data:', fetchError);
    return { success: false, error: fetchError.message };
  }

  const updatedData = {
      ...(website.website_data || {}),
      offersConfig: {
          ...((website.website_data || {}).offersConfig || {}),
          ...offersConfig
      }
  };

  const { error: updateError } = await supabase
    .from('websites')
    .update({ website_data: updatedData })
    .eq('id', websiteId);

  if (updateError) {
    console.error('Error updating website offers config:', updateError);
    return { success: false, error: updateError.message };
  }

  revalidatePath('/dashboard/apps/boost');
  return { success: true };
}

export async function recordOfferClaim(websiteId, offerId, phoneNumber) {

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('offer_claims')
      .insert([{ website_id: websiteId, offer_id: offerId, phone_number: phoneNumber }]);

    if (error) {
        console.error('Error recording offer claim:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
