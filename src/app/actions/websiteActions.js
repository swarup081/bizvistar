'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- HELPER: Get Authenticated User ---
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

// --- CHECK AVAILABILITY ---
export async function checkSlugAvailability(slug) {
  if (!slug || slug.length < 3) return false;

  // Normalize
  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  try {
      const { data, error } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('site_slug', normalizedSlug)
        .maybeSingle();

      if (error) {
          console.error("Error checking slug availability:", error);
          // If error (e.g. DB down), safer to assume taken to prevent issues,
          // or allow and let insert fail?
          // Assuming taken prevents user frustration if it spins.
          return false;
      }

      return !data; // True if no data found (available)
  } catch (e) {
      console.error("Unexpected error checking slug:", e);
      return false;
  }
}

// --- GET SUGGESTIONS ---
export async function getSlugSuggestions(baseName) {
  if (!baseName) return [];

  const normalizedBase = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  if (!normalizedBase) return [];

  // Candidates to check
  const candidates = [
      `${normalizedBase}-official`,
      `${normalizedBase}-store`,
      `${normalizedBase}-shop`,
      `${normalizedBase}-online`,
      `${normalizedBase}-${new Date().getFullYear()}`, // e.g. -2024
      `the-${normalizedBase}`
  ];

  const suggestions = [];

  // Check each candidate
  for (const slug of candidates) {
      if (suggestions.length >= 3) break; // We need 3 suggestions

      const isAvailable = await checkSlugAvailability(slug);
      if (isAvailable) {
          suggestions.push(slug);
      }
  }

  // If we still don't have 3, append random numbers
  let attempts = 0;
  while (suggestions.length < 3 && attempts < 10) {
      attempts++;
      const rand = Math.floor(100 + Math.random() * 900); // 3 digit
      const slug = `${normalizedBase}-${rand}`;
      const isAvailable = await checkSlugAvailability(slug);
      if (isAvailable && !suggestions.includes(slug)) {
          suggestions.push(slug);
      }
  }

  return suggestions;
}

// --- UPDATE SLUG ---
export async function updateSiteSlug(websiteId, newSlug) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Validate Slug
    const normalizedSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (normalizedSlug.length < 3) throw new Error("Slug must be at least 3 characters.");

    // Check Availability (Double check)
    const available = await checkSlugAvailability(normalizedSlug);
    if (!available) throw new Error("This URL is already taken.");

    // Update DB
    const { error } = await supabaseAdmin
      .from('websites')
      .update({ site_slug: normalizedSlug })
      .eq('id', websiteId)
      .eq('user_id', user.id); // Security: Ensure ownership

    if (error) throw error;

    return { success: true, slug: normalizedSlug };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
