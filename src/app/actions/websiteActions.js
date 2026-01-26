'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- HELPER: Get Authenticated User's Website ID ---
async function getWebsiteId() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
           try {
             cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
           } catch {
             // Pass
           }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: Please sign in.');
  }

  // Fetch website ID for this user
  const { data: website, error: websiteError } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .single();

   if (websiteError || !website) {
       // Try maybeSingle just in case multiple rows exist (shouldn't per unique constraint on user? actually user_id usually unique for website ownership in this app context)
       const { data: firstWebsite } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

       if (firstWebsite) return firstWebsite.id;
       throw new Error('No website found for this user.');
   }
   return website.id;
}


export async function checkSlugAvailability(slug) {
  try {
    if (!slug) return false;
    // Sanitize first to be safe
    const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean) return false;

    // Check in DB
    const { data, error } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('site_slug', clean)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Slug check error:", error);
        return false; // Assume unavailable on error
    }

    // If data exists, it's taken. If null, it's free.
    return !data;

  } catch (err) {
      console.error(err);
      return false;
  }
}

export async function getSlugSuggestions(baseSlug) {
   if (!baseSlug) return [];

   // Generate alternatives
   const clean = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');
   const currentYear = new Date().getFullYear();

   const suggestions = [
       `${clean}-store`,
       `${clean}-official`,
       `${clean}-${currentYear}`,
       `${clean}-shop`
   ];

   // Check availability for suggestions
   const available = [];
   for (const s of suggestions) {
       const isFree = await checkSlugAvailability(s);
       if (isFree) available.push(s);
       if (available.length >= 3) break;
   }

   // If all taken (rare), fallback to random
   if (available.length === 0) {
       available.push(`${clean}-${Math.floor(Math.random() * 1000)}`);
   }

   return available;
}

export async function updateSiteSlug(newSlug) {
    try {
        const websiteId = await getWebsiteId();
        const clean = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');

        if (clean.length < 3) {
             return { success: false, message: 'Slug must be at least 3 characters.' };
        }

        // 1. Check availability again to be sure
        const isFree = await checkSlugAvailability(clean);
        if (!isFree) {
            return { success: false, message: 'Slug is already taken.' };
        }

        // 2. Update
        const { error } = await supabaseAdmin
            .from('websites')
            .update({ site_slug: clean })
            .eq('id', websiteId);

        if (error) throw error;

        return { success: true, slug: clean };

    } catch (err) {
        return { success: false, message: err.message };
    }
}
