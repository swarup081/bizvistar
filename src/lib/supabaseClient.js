'use client';

import { createBrowserClient } from '@supabase/ssr';

// Ensure you have these in a .env.local file. Add fallback to prevent build crash.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
