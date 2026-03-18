"use server";
import { createServerClient } from '@supabase/ssr';
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

    try {
        // Fetch current website data to merge
        const { data: website, error: fetchError } = await supabase
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !website) return { error: "Website not found or access denied" };

        let websiteData = website.website_data || {};
        if (!websiteData.analytics) websiteData.analytics = {};

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const key = `${currentYear}-${currentMonth}`;

        if (!websiteData.analytics.monthly_targets) {
             websiteData.analytics.monthly_targets = {};
        }

        websiteData.analytics.monthly_targets[key] = targetAmount;

        const { error: updateError } = await supabase
            .from('websites')
            .update({ website_data: websiteData })
            .eq('id', websiteId)
            .eq('user_id', user.id);

        if (updateError) return { error: updateError.message };

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

    try {
        const { data: website, error: fetchError } = await supabase
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !website) return { error: "Website not found" };

        const websiteData = website.website_data || {};
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const key = `${currentYear}-${currentMonth}`;

        if (websiteData.analytics?.monthly_targets && websiteData.analytics.monthly_targets[key]) {
            return { data: websiteData.analytics.monthly_targets[key] };
        }
        return { data: null }; // no target found
    } catch (e) {
        console.error("Get target error:", e);
        return { error: "Internal error retrieving target" };
    }
}
