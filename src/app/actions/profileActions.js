'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
};

export async function updateProfileDataAction(formData) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { }
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        const supabaseAdmin = getSupabaseAdmin();

        // 1. Update Profile (Full Name)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ full_name: formData.fullName })
            .eq('id', user.id);

        if (profileError) throw profileError;

        // 2. Update Website & Onboarding Data
        const { data: websites } = await supabaseAdmin
            .from('websites')
            .select('id, website_data, draft_data')
            .eq('user_id', user.id)
            .limit(1);

        if (websites && websites.length > 0) {
            const website = websites[0];

            // Update Onboarding Data
            const { error: onboardingError } = await supabaseAdmin
                .from('onboarding_data')
                .update({
                    owner_name: formData.businessName,
                    upi_id: formData.upiId
                })
                .eq('website_id', website.id);

            if (onboardingError) throw onboardingError;

            // Update Website Data (JSON)
            let currentData = website.website_data || {};
            let currentDraft = website.draft_data || {};

            // Update Live Data
            const updatedData = { ...currentData };
            if (formData.businessName) updatedData.businessName = formData.businessName;
            if (formData.upiId) {
                updatedData.payment = { ...(updatedData.payment || {}), upiId: formData.upiId };
            }

            // Update Draft Data
            const updatedDraft = { ...currentDraft };
            if (formData.businessName) updatedDraft.businessName = formData.businessName;
            if (formData.upiId) {
                updatedDraft.payment = { ...(updatedDraft.payment || {}), upiId: formData.upiId };
            }

            const { error: websiteError } = await supabaseAdmin
                .from('websites')
                .update({
                    website_data: updatedData,
                    draft_data: updatedDraft
                })
                .eq('id', website.id);

            if (websiteError) throw websiteError;
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: error.message };
    }
}
