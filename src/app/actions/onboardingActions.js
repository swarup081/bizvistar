'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- HELPER: Get Current Website ID ---
async function getWebsiteId() {
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

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: Please sign in.');
  }

  // Fetch website ID for this user
  const { data: website, error: websiteError } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (websiteError) {
     const { data: firstWebsite } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

     if (firstWebsite) return firstWebsite.id;
     throw new Error('No website found for this user.');
  }

  return website.id;
}

// --- HELPER: Sync Website Data ---
async function syncWebsiteData(websiteId) {
    // Re-use logic from productActions or import it?
    // For now, I'll copy the logic to avoid circular dependency issues if productActions imports this.
    // Actually, I can just fetch products and update website_data.
    try {
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('website_id', websiteId)
          .order('id');

        const { data: website } = await supabaseAdmin
          .from('websites')
          .select('website_data')
          .eq('id', websiteId)
          .single();

        if (!website) return;

        const currentData = website.website_data || {};

        const mappedProducts = products ? products.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            category: p.category_id ? String(p.category_id) : 'uncategorized',
            description: p.description,
            image: p.image_url,
            stock: p.stock
        })) : [];

        const newData = {
            ...currentData,
            allProducts: mappedProducts,
        };

        await supabaseAdmin
          .from('websites')
          .update({ website_data: newData })
          .eq('id', websiteId);

    } catch (err) {
        console.error("Sync Error:", err);
    }
}


// --- ACTION: Get Onboarding Status ---
export async function getOnboardingStatus() {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) return { error: 'No website found' };

    // 1. Fetch Website Data (for pre-fill)
    const { data: website } = await supabaseAdmin
      .from('websites')
      .select('website_data, site_slug')
      .eq('id', websiteId)
      .single();

    // 2. Fetch Onboarding Data
    let { data: onboarding, error } = await supabaseAdmin
      .from('onboarding_data')
      .select('*')
      .eq('website_id', websiteId)
      .single();

    if (error && error.code === 'PGRST116') {
       // Create if missing
       const { data: newOnboarding, error: createError } = await supabaseAdmin
         .from('onboarding_data')
         .insert({ website_id: websiteId })
         .select()
         .single();

       if (createError) {
           console.error("Failed to create onboarding record:", createError);
           // Fallback to memory object if DB fails (e.g. table missing)
           onboarding = { website_id: websiteId, is_completed: false };
       } else {
           onboarding = newOnboarding;
       }
    }

    return {
      success: true,
      isCompleted: onboarding?.is_completed || false,
      data: onboarding,
      websiteData: website?.website_data || {},
      websiteId
    };

  } catch (err) {
    console.error('getOnboardingStatus Error:', err);
    return { success: false, error: err.message };
  }
}

// --- ACTION: Upload Logo ---
export async function uploadLogo(formData) {
  try {
    const file = formData.get('file');
    const websiteId = await getWebsiteId();

    if (!file || !websiteId) throw new Error("Invalid upload");

    const fileExt = file.name.split('.').pop();
    const fileName = `${websiteId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Ensure bucket exists (best effort)
    await supabaseAdmin.storage.createBucket('logos', { public: true }).catch(() => {});

    const { error: uploadError } = await supabaseAdmin.storage
      .from('logos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('logos')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

// --- ACTION: Save Business Info ---
export async function saveBusinessInfo(data) {
  try {
    const websiteId = await getWebsiteId();
    const { name, ownerName, instagram, facebook, logoUrl } = data;

    // 1. Update Onboarding Data
    const { error: onboardingError } = await supabaseAdmin
      .from('onboarding_data')
      .update({
        owner_name: ownerName,
        social_instagram: instagram,
        social_facebook: facebook,
        logo_url: logoUrl
        // business_name: name // If column exists
      })
      .eq('website_id', websiteId);

    if (onboardingError) throw onboardingError;

    // 2. Update Website Data (Live Preview)
    const { data: website } = await supabaseAdmin
      .from('websites')
      .select('website_data')
      .eq('id', websiteId)
      .single();

    const currentData = website?.website_data || {};

    // Merge updates
    const newData = {
        ...currentData,
        name: name || currentData.name,
        logoText: name || currentData.logoText, // Sync logo text
        // Update socials in footer/contact if they exist
        footer: {
            ...currentData.footer,
            socials: [
                { platform: 'Instagram', url: instagram || '' },
                { platform: 'Facebook', url: facebook || '' },
                ...(currentData.footer?.socials || []).filter(s => s.platform !== 'Instagram' && s.platform !== 'Facebook')
            ]
        },
        // Update Hero Logo if applicable (some templates use hero.logo)
        hero: {
            ...currentData.hero,
            logo: logoUrl || currentData.hero?.logo
        }
    };

    // Also update logo in global settings if exists
    if (logoUrl) {
        newData.logo = logoUrl;
    }

    await supabaseAdmin
      .from('websites')
      .update({ website_data: newData })
      .eq('id', websiteId);

    return { success: true };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

// --- ACTION: Save Product (Wizard) ---
export async function saveWizardProduct(productData) {
    try {
        const websiteId = await getWebsiteId();

        // 1. Check Limit (10)
        const { count, error: countError } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('website_id', websiteId);

        if (countError) throw countError;
        if (count >= 10) {
            return { success: false, error: 'Product limit reached (Max 10).' };
        }

        // 2. Insert
        const { error: insertError } = await supabaseAdmin
            .from('products')
            .insert({
                website_id: websiteId,
                name: productData.name,
                price: parseFloat(productData.price),
                description: productData.description,
                image_url: productData.imageUrl,
                stock: -1 // Default unlimited for wizard
            });

        if (insertError) throw insertError;

        // 3. Sync
        await syncWebsiteData(websiteId);

        return { success: true };

    } catch (err) {
        return { success: false, error: err.message };
    }
}

// --- ACTION: Save Payment Info ---
export async function savePaymentInfo(data) {
    try {
        const websiteId = await getWebsiteId();
        const { upiId, isCodOnly } = data;

        // 1. Update Onboarding Data
        await supabaseAdmin
            .from('onboarding_data')
            .update({ upi_id: isCodOnly ? null : upiId })
            .eq('website_id', websiteId);

        // 2. Update Website Data (Disclaimer)
        const { data: website } = await supabaseAdmin
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .single();

        const currentData = website?.website_data || {};

        let disclaimer = "";
        if (isCodOnly) {
            disclaimer = "Note: Since we cannot redirect users to a payment gateway, you are responsible for collecting payment upon delivery. Please ensure you have a process in place to settle these transactions.";
        } else {
            disclaimer = "Please note: Payments are processed directly between you and your customer. We do not facilitate transactions or charge commissions. You are responsible for verifying all payments received.";
        }

        // Inject into footer description or create a new field
        const newData = {
            ...currentData,
            footer: {
                ...currentData.footer,
                paymentDisclaimer: disclaimer, // New field we can render in template
                description: currentData.footer?.description ? `${currentData.footer.description}\n\n${disclaimer}` : disclaimer
            },
            payment: {
                upiId: isCodOnly ? '' : upiId,
                mode: isCodOnly ? 'COD' : 'UPI'
            }
        };

        await supabaseAdmin
            .from('websites')
            .update({ website_data: newData })
            .eq('id', websiteId);

        return { success: true };

    } catch (err) {
        return { success: false, error: err.message };
    }
}

// --- ACTION: Generate AI Content ---
export async function generateAIContent(description) {
    try {
        const websiteId = await getWebsiteId();

        const { data: website } = await supabaseAdmin
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .single();

        const currentData = website?.website_data || {};

        // Construct Prompt
        const prompt = `
            You are a professional website copywriter.
            I have a website data JSON structure.
            Update the text content (headings, paragraphs, hero titles, about text) to match this business description: "${description}".

            Strict Rules:
            1. Return ONLY valid JSON.
            2. Do NOT change the structure of the JSON. Only change string values of text fields.
            3. Do NOT change image URLs, product lists, or navigational links.
            4. Keep the tone professional and engaging.
            5. Use the existing keys: hero.title, hero.subtitle, about.text, services.title, etc.

            Current JSON:
            ${JSON.stringify(currentData).substring(0, 15000)}
        `; // Truncate to avoid token limits if necessary

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo-1106", // or gpt-4
            response_format: { type: "json_object" },
        });

        const newContent = JSON.parse(completion.choices[0].message.content);

        // Merge safely? Or assume AI returned full structure?
        // AI might return partial or full. Prompt asked for update.
        // It's safer to merge top-level keys.

        const mergedData = { ...currentData, ...newContent };

        await supabaseAdmin
            .from('websites')
            .update({ website_data: mergedData })
            .eq('id', websiteId);

        return { success: true, data: mergedData };

    } catch (err) {
        console.error("AI Generation Error:", err);
        return { success: false, error: err.message };
    }
}

// --- ACTION: Complete Onboarding ---
export async function completeOnboarding() {
    try {
        const websiteId = await getWebsiteId();
        await supabaseAdmin
            .from('onboarding_data')
            .update({ is_completed: true })
            .eq('website_id', websiteId);

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}
