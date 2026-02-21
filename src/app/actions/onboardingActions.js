'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

function getAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// --- HELPER: Verify Website Ownership ---
async function verifyWebsiteOwnership(websiteId) {
  if (!websiteId) throw new Error('Website ID is required');

  const cookieStore = await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
           try {
             cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
           } catch {
             // Pass
           }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: Please sign in.');
  }

  const supabaseAdmin = getAdminClient();
  // Verify ownership
  const { data: website, error } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('id', websiteId)
    .eq('user_id', user.id)
    .single();

   if (error || !website) {
       throw new Error('Unauthorized or Website not found.');
   }
   return website.id;
}

export async function getOnboardingStatus(websiteId) {
  try {
    await verifyWebsiteOwnership(websiteId);
    const supabaseAdmin = getAdminClient();

    // Get onboarding data
    const { data: onboarding, error } = await supabaseAdmin
      .from('onboarding_data')
      .select('*')
      .eq('website_id', websiteId)
      .maybeSingle();

    if (error) throw error;

    // Get product count
    const { count, error: countError } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('website_id', websiteId);

    if (countError) throw countError;

    // Get current business data (for pre-filling step 1 if needed)
    const { data: websiteData, error: websiteError } = await supabaseAdmin
      .from('websites')
      .select('website_data')
      .eq('id', websiteId)
      .single();

    if (websiteError) throw websiteError;

    return {
      isCompleted: onboarding?.is_completed || false,
      data: onboarding || {},
      productCount: count || 0,
      websiteData: websiteData?.website_data || {},
      websiteId
    };

  } catch (err) {
    console.error("Error fetching onboarding status:", err);
    return { error: err.message };
  }
}

export async function saveOnboardingStep1(websiteId, data) {
  try {
    await verifyWebsiteOwnership(websiteId);
    const supabaseAdmin = getAdminClient();
    const { businessName, ownerName, socialInstagram, socialFacebook, logoUrl } = data;

    // 1. Update Onboarding Table
    const { error: onboardingError } = await supabaseAdmin
      .from('onboarding_data')
      .upsert({
        website_id: websiteId,
        owner_name: ownerName,
        social_instagram: socialInstagram,
        social_facebook: socialFacebook,
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      }, { onConflict: 'website_id' });

    if (onboardingError) throw onboardingError;

    // 2. Update Website Data (Business Data JSON)
    const { data: currentSite, error: fetchError } = await supabaseAdmin
      .from('websites')
      .select('website_data')
      .eq('id', websiteId)
      .single();

    if (fetchError) throw fetchError;

    let businessData = currentSite.website_data || {};

    // Update fields
    businessData.name = businessName;
    businessData.logoText = businessName; // Sync logo text
    businessData.logoImage = logoUrl; // Save logo image
    businessData.ownerName = ownerName; // Save owner name

    // Ensure footer exists
    if (!businessData.footer) businessData.footer = {};
    if (!businessData.footer.socials) businessData.footer.socials = [];

    // Update socials in footer
    const newSocials = [];
    if (socialInstagram) newSocials.push({ platform: 'Instagram', url: socialInstagram });
    if (socialFacebook) newSocials.push({ platform: 'Facebook', url: socialFacebook });

    const otherSocials = (businessData.footer.socials || []).filter(s =>
        s.platform.toLowerCase() !== 'instagram' && s.platform.toLowerCase() !== 'facebook'
    );
    businessData.footer.socials = [...otherSocials, ...newSocials];

    // Save back to websites table
    const { error: updateError } = await supabaseAdmin
      .from('websites')
      .update({ website_data: businessData })
      .eq('id', websiteId);

    if (updateError) throw updateError;

    return { success: true, businessData };

  } catch (err) {
    console.error("Error saving step 1:", err);
    return { success: false, error: err.message };
  }
}

export async function saveOnboardingStep2Product(websiteId, productData) {
  try {
    await verifyWebsiteOwnership(websiteId);
    const supabaseAdmin = getAdminClient();

    // Check limit
    const { count, error: countError } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('website_id', websiteId);

    if (countError) throw countError;

    // If adding new (no ID) and limit reached
    if (!productData.id && count >= 10) {
        return { success: false, error: "Product limit reached (10). Please delete some products or edit existing ones." };
    }

    const payload = {
        website_id: websiteId,
        name: productData.name,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock), // Should be -1 or finite
        image_url: productData.image,
        description: productData.description || '',
        category_id: productData.category_id || null // Optional
    };

    let result;
    if (productData.id) {
        // Update
        result = await supabaseAdmin
            .from('products')
            .update(payload)
            .eq('id', productData.id)
            .select()
            .single();
    } else {
        // Insert
        result = await supabaseAdmin
            .from('products')
            .insert(payload)
            .select()
            .single();
    }

    if (result.error) throw result.error;

    // Sync to website_data.allProducts for editor preview
    const { data: allProducts } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('website_id', websiteId);

    const { data: currentSite } = await supabaseAdmin
      .from('websites')
      .select('website_data')
      .eq('id', websiteId)
      .single();

    let businessData = currentSite.website_data || {};

    businessData.allProducts = allProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image_url,
        description: p.description,
        category: p.category_id ? String(p.category_id) : '',
        stock: p.stock
    }));

    await supabaseAdmin
      .from('websites')
      .update({ website_data: businessData })
      .eq('id', websiteId);

    return { success: true, product: result.data, businessData };

  } catch (err) {
    console.error("Error saving product:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteOnboardingProduct(websiteId, productId) {
    try {
        await verifyWebsiteOwnership(websiteId);
        const supabaseAdmin = getAdminClient();

        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', productId)
            .eq('website_id', websiteId); // Security check

        if (error) throw error;

        // Sync businessData
        const { data: allProducts } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('website_id', websiteId);

        const { data: currentSite } = await supabaseAdmin
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .single();

        let businessData = currentSite.website_data || {};

        businessData.allProducts = allProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image_url,
            description: p.description,
            category: p.category_id ? String(p.category_id) : '',
            stock: p.stock
        }));

        await supabaseAdmin
            .from('websites')
            .update({ website_data: businessData })
            .eq('id', websiteId);

        return { success: true, businessData };

    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function saveOnboardingStep3(websiteId, data) {
    try {
        await verifyWebsiteOwnership(websiteId);
        const supabaseAdmin = getAdminClient();
        const { upiId, isCodOnly } = data;

        const { error } = await supabaseAdmin
            .from('onboarding_data')
            .upsert({
                website_id: websiteId,
                upi_id: isCodOnly ? null : upiId,
                updated_at: new Date().toISOString()
            }, { onConflict: 'website_id' });

        if (error) throw error;

        const { data: currentSite } = await supabaseAdmin
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .single();

        let businessData = currentSite.website_data || {};

        if (!businessData.payment) businessData.payment = {};
        businessData.payment.upiId = isCodOnly ? '' : upiId;
        businessData.payment.isCodOnly = isCodOnly;

        await supabaseAdmin
            .from('websites')
            .update({ website_data: businessData })
            .eq('id', websiteId);

        return { success: true, businessData };

    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function generateAIContent(websiteId, description) {
    try {
        await verifyWebsiteOwnership(websiteId);
        const supabaseAdmin = getAdminClient();
        const openai = getOpenAIClient();

        // 1. Get current data to know structure
        const { data: currentSite } = await supabaseAdmin
            .from('websites')
            .select('website_data, template_id, templates(name)')
            .eq('id', websiteId)
            .single();

        let businessData = currentSite.website_data || {};
        const templateName = currentSite.templates?.name || 'unknown';

        // 2. Prepare Prompt
        const contentKeys = {
            hero: { title: businessData.hero?.title, subtitle: businessData.hero?.subtitle },
            about: {
                title: businessData.about?.title || businessData.about?.heading,
                text: businessData.about?.text || businessData.about?.statement,
                subtext: businessData.about?.subtext || businessData.about?.subheading
            },
            features: businessData.features ? businessData.features.map(f => ({ title: f.title, text: f.text })) : null,
        };

        const prompt = `
        You are a professional website copywriter.
        The user has a business described as: "${description}".
        The current template is "${templateName}".

        Please rewrite the following website content to match the business description.
        Make it engaging, professional, and SEO-friendly.
        Do NOT change the structure. Only change the text values.
        Return a valid JSON object with the exact same keys as provided below, but with new values.

        Current Content:
        ${JSON.stringify(contentKeys, null, 2)}
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const newContent = JSON.parse(completion.choices[0].message.content);

        // 3. Merge back
        if (newContent.hero) {
            if (businessData.hero) {
                if (newContent.hero.title) businessData.hero.title = newContent.hero.title;
                if (newContent.hero.subtitle) businessData.hero.subtitle = newContent.hero.subtitle;
            }
        }

        if (newContent.about) {
             if (businessData.about) {
                 if (newContent.about.title) businessData.about.title = newContent.about.title;
                 if (newContent.about.heading) businessData.about.heading = newContent.about.heading; // Handle Avenix

                 if (newContent.about.text) businessData.about.text = newContent.about.text;
                 if (newContent.about.statement) businessData.about.statement = newContent.about.statement; // Handle Avenix

                 if (newContent.about.subtext) businessData.about.subtext = newContent.about.subtext;
             }
        }

        if (newContent.features && Array.isArray(businessData.features)) {
             newContent.features.forEach((f, i) => {
                 if (businessData.features[i]) {
                     if (f.title) businessData.features[i].title = f.title;
                     if (f.text) businessData.features[i].text = f.text;
                 }
             });
        }

        // 4. Save
        await supabaseAdmin
            .from('websites')
            .update({ website_data: businessData })
            .eq('id', websiteId);

        return { success: true, businessData };

    } catch (err) {
        console.error("AI Generation Error:", err);
        return { success: false, error: err.message };
    }
}

export async function completeOnboarding(websiteId) {
    try {
        await verifyWebsiteOwnership(websiteId);
        const supabaseAdmin = getAdminClient();

        await supabaseAdmin
            .from('onboarding_data')
            .upsert({
                website_id: websiteId,
                is_completed: true,
                updated_at: new Date().toISOString()
            }, { onConflict: 'website_id' });

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}
