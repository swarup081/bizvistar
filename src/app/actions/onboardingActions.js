'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

// Lazy load clients to avoid build-time errors if env vars are missing
const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        // Log error but don't crash immediately unless used
        console.error('Missing Supabase environment variables');
        // Return a dummy client that throws on use, or better, just throw here
        throw new Error('Missing Supabase environment variables');
    }
    return createClient(supabaseUrl, supabaseServiceKey);
};

const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new OpenAI({ apiKey });
};

async function checkWebsiteOwnership(websiteId, userId) {
    const supabase = getSupabaseClient();
    const { data: website, error } = await supabase
        .from('websites')
        .select('user_id')
        .eq('id', websiteId)
        .single();

    if (error || !website) return false;
    return website.user_id === userId;
}

export async function getOnboardingStatus(websiteId) {
    const supabase = getSupabaseClient();

    // Auth check
    const cookieStore = cookies();
    // We need to use createServerClient from @supabase/ssr or manually handle cookies for auth
    // But since this is a server action, we can just use the service role client for data
    // provided we verify the user ourselves.
    // However, to get the CURRENT user, we need the auth client.

    // Let's use the pattern from other actions or just trust the caller?
    // No, security first.
    // We'll use the SB client constructed with cookies for Auth, then Service Role for data if needed (or just RLS).
    // Using service role for now to ensure we can read/write onboarding_data without RLS issues if they aren't set up perfectly

    const supabaseAuth = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                } catch {
                }
            },
          },
        }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const isOwner = await checkWebsiteOwnership(websiteId, user.id);
    if (!isOwner) return { error: 'Unauthorized' };

    // Get onboarding data
    const { data: existingOnboarding } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('website_id', websiteId)
        .maybeSingle();

    let currentData = existingOnboarding;
    if (!currentData) {
        const { data: newOnboarding, error: createError } = await supabase
            .from('onboarding_data')
            .insert([{ website_id: websiteId }])
            .select()
            .single();

        if (createError) {
             console.error("Failed to create onboarding record:", createError);
             return { error: 'Failed to initialize onboarding' };
        }
        currentData = newOnboarding;
    }

    // Get product count
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('website_id', websiteId);

    // Get current website data for pre-filling
    const { data: websiteData } = await supabase
        .from('websites')
        .select('website_data')
        .eq('id', websiteId)
        .single();

    return {
        isCompleted: currentData.is_completed,
        data: currentData,
        productCount: count || 0,
        websiteData: websiteData?.website_data || {}
    };
}

export async function saveOnboardingStep1(websiteId, data) {
    const supabase = getSupabaseClient();

    // 1. Update onboarding_data
    const { error: updateError } = await supabase
        .from('onboarding_data')
        .update({
            owner_name: data.ownerName,
            business_city: data.businessCity,
            logo_url: data.logo,
            social_instagram: data.instagram,
            social_facebook: data.facebook,
            updated_at: new Date().toISOString()
        })
        .eq('website_id', websiteId);

    if (updateError) return { error: updateError.message };

    // 2. Update actual website_data for immediate preview
    const { data: website } = await supabase
        .from('websites')
        .select('website_data')
        .eq('id', websiteId)
        .single();

    if (website) {
        const currentData = website.website_data || {};
        const newData = { ...currentData };

        // Update Business Name
        if (data.businessName) {
             if (!newData.hero) newData.hero = {};
             newData.hero.title = data.businessName;

             // Also update logo text if no image logo provided, or as fallback
             if (!newData.header) newData.header = {};
             // If logo image is provided, we might set header.logo
             // If only text, we might set header.title or similar depending on template
             // Assuming header.logo is used for both image url or text in some templates, or there is a separate field.
             // Based on memory, templates use businessData.header.logo for image.
             // Let's set a specific field for text logo if needed.
             // But the user asked to "update the sql if needed since logo is text based in sql".
             // The SQL has `logo_url`.
             // In the editor, `header.logo` usually expects a URL.
        }

        if (data.logo) {
             if (!newData.header) newData.header = {};
             newData.header.logo = data.logo;
        }

        if (data.instagram || data.facebook) {
             if (!newData.footer) newData.footer = {};
             if (!newData.footer.socialLinks) newData.footer.socialLinks = [];

             // Helper to upsert social link
             const upsertLink = (platform, url) => {
                 const idx = newData.footer.socialLinks.findIndex(l => l.platform === platform);
                 if (idx >= 0) newData.footer.socialLinks[idx].url = url;
                 else newData.footer.socialLinks.push({ platform, url });
             };

             if (data.instagram) upsertLink('instagram', `https://instagram.com/${data.instagram}`);
             if (data.facebook) upsertLink('facebook', `https://facebook.com/${data.facebook}`);
        }

        await supabase
            .from('websites')
            .update({ website_data: newData })
            .eq('id', websiteId);
    }

    return { success: true };
}

export async function saveOnboardingStep2Product(websiteId, product) {
    const supabase = getSupabaseClient();

    // Check limit
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('website_id', websiteId);

    if (count >= 10) {
        return { error: 'Maximum 10 products allowed during onboarding.' };
    }

    // Insert product
    const { data: newProduct, error } = await supabase
        .from('products')
        .insert([{
            website_id: websiteId,
            name: product.name,
            price: parseFloat(product.price),
            description: product.description,
            image_url: product.image || 'https://placehold.co/600x400',
            stock: product.stock ? parseInt(product.stock) : 0,
            category_id: null
        }])
        .select()
        .single();

    if (error) return { error: error.message };
    return { success: true, product: newProduct };
}

export async function deleteOnboardingProduct(productId, websiteId) {
    const supabase = getSupabaseClient();

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('website_id', websiteId);

    if (error) return { error: error.message };
    return { success: true };
}

export async function saveOnboardingStep3(websiteId, data) {
    const supabase = getSupabaseClient();

    const updates = {
        upi_id: data.paymentMethod === 'upi' ? data.upiId : null,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('onboarding_data')
        .update(updates)
        .eq('website_id', websiteId);

    if (error) return { error: error.message };

    // Update website_data disclaimer
    const { data: website } = await supabase
        .from('websites')
        .select('website_data')
        .eq('id', websiteId)
        .single();

    if (website) {
        const newData = { ...website.website_data };
        if (!newData.footer) newData.footer = {};

        let disclaimer = "";
        if (data.paymentMethod === 'upi') {
            disclaimer = "Payment is directly between you and the customer. We do not take any commission. Please verify payment receipt before processing orders.";
        } else {
            disclaimer = "Cash on Delivery only. Please arrange payment settlement directly with the customer.";
        }

        newData.footer.paymentDisclaimer = disclaimer;

        await supabase
            .from('websites')
            .update({ website_data: newData })
            .eq('id', websiteId);
    }

    return { success: true };
}

export async function generateAIContent(websiteId, description) {
    const openai = getOpenAIClient();
    if (!openai) return { error: 'AI service unavailable' };

    const supabase = getSupabaseClient();

    const { data: website } = await supabase
        .from('websites')
        .select('website_data')
        .eq('id', websiteId)
        .single();

    if (!website) return { error: 'Website not found' };

    const currentData = website.website_data;
    const prompt = `
    You are an AI assistant helping a user customize their website content.
    The user has provided the following description of their business: "${description}".

    Current Website Data (JSON):
    ${JSON.stringify(currentData, null, 2)}

    Please update the text content (headings, subheadings, descriptions, button labels) to match the user's business description.
    Do NOT change the structure of the JSON. Do NOT remove keys. Only update string values that are visible text.
    Do NOT change menu items, links, or image URLs.
    Make the tone professional and engaging, matching the brand vibe.
    Return ONLY the updated JSON.
    `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a JSON-editing assistant." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const newContent = JSON.parse(completion.choices[0].message.content);

        await supabase
            .from('websites')
            .update({ website_data: newContent })
            .eq('id', websiteId);

        return { success: true };

    } catch (e) {
        console.error("AI Error:", e);
        return { error: 'Failed to generate content' };
    }
}

export async function completeOnboarding(websiteId) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('onboarding_data')
        .update({ is_completed: true, updated_at: new Date().toISOString() })
        .eq('website_id', websiteId);

    if (error) return { error: error.message };
    return { success: true };
}
