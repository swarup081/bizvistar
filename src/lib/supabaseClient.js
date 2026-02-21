'use client';

import { createBrowserClient } from '@supabase/ssr';

// Ensure you have these in a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In development, you might want to warn
  // console.warn('Supabase URL or Key is missing!');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
