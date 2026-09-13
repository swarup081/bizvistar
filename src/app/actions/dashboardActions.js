"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getAuthUserContext } from '@/lib/authUtils';

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

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

export async function getWebsiteDetails() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await getAuthUserContext(supabase);
  
  if (userError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Prefer published website, fall back to most recent
  let { data, error } = await supabaseAdmin
    .from('websites')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_published', true)
    .limit(1)
    .maybeSingle();

  if (!data) {
    // No published site — get the most recent one
    const result = await supabaseAdmin
      .from('websites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Error fetching website details:', error);
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: 'No website found' };
  }

  return { success: true, data };
}

export async function getSessionContext() {
  const supabase = await createClient();
  const { data: { user }, error: userError, isImpersonating, realUser } = await getAuthUserContext(supabase);
  
  if (userError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      // Pass real user email if impersonating to show in banner
      realEmail: realUser?.email
    },
    isImpersonating: isImpersonating || false
  };
}
