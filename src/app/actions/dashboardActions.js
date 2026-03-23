"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Use supabaseAdmin to bypass potential RLS, and use limit(1).single() to avoid 'multiple rows' error
  const { data, error } = await supabaseAdmin
    .from('websites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching website details:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
