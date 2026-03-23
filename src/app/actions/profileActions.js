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

        // 1. Format Billing Data
        const billingAddress = {
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber || '',
            address: formData.address || '',
            city: formData.city || '',
            state: formData.state || '',
            zipCode: formData.zipCode || '',
            country: formData.country || 'India',
            companyName: formData.companyName || '',
            gstNumber: formData.gstNumber || ''
        };

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                id: user.id,
                full_name: formData.fullName,
                billing_address: billingAddress
            });

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
                    upi_id: formData.upiId,
                    whatsapp_number: formData.phoneNumber,
                    logo_url: formData.logoUrl
                })
                .eq('website_id', website.id);
            
            if (onboardingError) throw onboardingError;

            // Update Website Data (JSON)
            let currentData = website.website_data || {};
            let currentDraft = website.draft_data || {};

            // Update Live Data
            const updatedData = { ...currentData };
            if (formData.businessName !== undefined) {
                updatedData.name = formData.businessName;
                updatedData.logoText = formData.businessName;
            }
            if (formData.logoUrl !== undefined) updatedData.logo = formData.logoUrl;
            if (formData.upiId !== undefined) {
                updatedData.payment = { ...(updatedData.payment || {}), upiId: formData.upiId };
            }
            if (formData.phoneNumber !== undefined) {
                updatedData.whatsappNumber = formData.phoneNumber;
            }
            if (formData.deliveryType !== undefined) {
                updatedData.delivery = {
                    ...(updatedData.delivery || {}),
                    type: formData.deliveryType || 'fixed',
                    cost: Number(formData.deliveryCost || 0),
                    threshold: Number(formData.deliveryThreshold || 0)
                };
            }

            // Update Draft Data
            const updatedDraft = { ...currentDraft };
            if (formData.businessName !== undefined) {
                updatedDraft.name = formData.businessName;
                updatedDraft.logoText = formData.businessName;
            }
            if (formData.logoUrl !== undefined) updatedDraft.logo = formData.logoUrl;
            if (formData.upiId !== undefined) {
                updatedDraft.payment = { ...(updatedDraft.payment || {}), upiId: formData.upiId };
            }
            if (formData.phoneNumber !== undefined) {
                updatedDraft.whatsappNumber = formData.phoneNumber;
            }
            if (formData.deliveryType !== undefined) {
                updatedDraft.delivery = {
                    ...(updatedDraft.delivery || {}),
                    type: formData.deliveryType || 'fixed',
                    cost: Number(formData.deliveryCost || 0),
                    threshold: Number(formData.deliveryThreshold || 0)
                };
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
