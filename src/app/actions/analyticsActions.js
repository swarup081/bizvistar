"use server";
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function saveMonthlyTarget(websiteId, targetAmount) {
    if (!websiteId) return { error: "Missing website ID" };

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {}
                },
            },
        }
    );


    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Unauthorized" };

    // Verify ownership
    const { data: website } = await supabase.from('websites').select('id').eq('id', websiteId).eq('user_id', user.id).single();
    if (!website) return { error: "Website not found or access denied" };

    // Use Admin client to bypass RLS for targets table
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );

    try {
        const now = new Date();
        const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

        // Check for existing record
        const { data: existingTarget } = await supabaseAdmin
            .from('monthly_targets')
            .select('id')
            .eq('website_id', websiteId)
            .eq('month', monthString)
            .maybeSingle();

        if (existingTarget) {
            const { error: updateError } = await supabaseAdmin
                .from('monthly_targets')
                .update({ target_revenue: targetAmount, updated_at: new Date().toISOString() })
                .eq('id', existingTarget.id);
            if (updateError) return { error: updateError.message };
        } else {
            const { error: insertError } = await supabaseAdmin
                .from('monthly_targets')
                .insert({
                    website_id: websiteId,
                    month: monthString,
                    target_revenue: targetAmount
                });
            if (insertError) return { error: insertError.message };
        }

        return { success: true, targetAmount };

    } catch (e) {
        console.error("Save target error:", e);
        return { error: "Internal error saving target" };
    }
}

export async function getMonthlyTarget(websiteId) {
    if (!websiteId) return { error: "Missing website ID" };

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {}
                },
            },
        }
    );


    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Unauthorized" };

    // Verify ownership
    const { data: website } = await supabase.from('websites').select('id').eq('id', websiteId).eq('user_id', user.id).single();
    if (!website) return { error: "Website not found or access denied" };

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );

    try {
        const now = new Date();
        const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

        const { data: targetData, error: fetchError } = await supabaseAdmin
            .from('monthly_targets')
            .select('target_revenue')
            .eq('website_id', websiteId)
            .eq('month', monthString)
            .maybeSingle();

        if (fetchError) return { error: fetchError.message };

        if (targetData && targetData.target_revenue) {
            return { data: Number(targetData.target_revenue) };
        }
        return { data: null }; // no target found

    } catch (e) {
        console.error("Get target error:", e);
        return { error: "Internal error retrieving target" };
    }
}
