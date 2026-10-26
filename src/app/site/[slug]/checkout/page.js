export const revalidate = 60; // ISR: cache for 60s, then revalidate in background
// src/app/site/[slug]/checkout/page.js
import { createClient } from '@supabase/supabase-js';

// Import all template layouts and checkout pages
import FlaraLayout from '@/app/templates/flara/layout';
import FlaraCheckoutPage from '@/app/templates/flara/checkout/page';
import AvenixLayout from '@/app/templates/avenix/layout';
import AvenixCheckoutPage from '@/app/templates/avenix/checkout/page';
import BlisslyLayout from '@/app/templates/blissly/layout';
import BlisslyCheckoutPage from '@/app/templates/blissly/checkout/page';
import FlavornestLayout from '@/app/templates/flavornest/layout';
import FlavornestCheckoutPage from '@/app/templates/flavornest/checkout/page';
import AuroraLayout from '@/app/templates/aurora/layout';
import AuroraCheckoutPage from '@/app/templates/aurora/checkout/page';
import FrostifyLayout from '@/app/templates/frostify/layout';
import FrostifyCheckoutPage from '@/app/templates/frostify/checkout/page';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

// CHANGED: The function signature is now (props)
export default async function LiveCheckoutPage(props) {
  // CHANGED: We now await props.params to get the slug
  const { slug } = await props.params;

  if (!slug || slug === 'undefined') {
    return <div>404 - Not Found</div>;
  }

  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select(`id, is_published, website_data, template:templates ( name )`)
    .eq('site_slug', slug)
    .single();

  if (error || !site) {
    return <div>404 - Site Not Found</div>;
  }

  if (!site.is_published) {
    const { redirect } = await import('next/navigation');
    redirect('/site-unavailable');
  }

  const templateName = site.template.name;
  const rawWebsiteData = site.website_data;

  // --- INJECT REAL PRODUCTS & CATEGORIES (same as site/[slug]/page.js) ---
  const [ { data: realProducts }, { data: realCategories } ] = await Promise.all([
     supabaseAdmin
        .from("products")
        .select("*")
        .eq("website_id", site.id)
        .order("id", { ascending: false }),
     supabaseAdmin
        .from("categories")
        .select("*")
        .eq("website_id", site.id)
        .order("name")
  ]);

  const finalData = rawWebsiteData ? { ...rawWebsiteData } : {};
  
  finalData.allProducts = (realProducts || []).map(p => ({
      ...p,
      id: p.id,
      name: p.name,
      price: Number(p.price),
      category: p.category_id ? String(p.category_id) : 'uncategorized',
      description: p.description,
      image: p.image_url,
      stock: p.stock,
      additional_images: p.additional_images || [],
      variants: p.variants || []
  }));
  
  finalData.allCategories = realCategories || [];
  finalData.categories = finalData.allCategories;
  // -----------------------------------------------

  // Render the correct template's checkout page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={finalData} websiteId={site.id}><FlaraCheckoutPage /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={finalData} websiteId={site.id}><AvenixCheckoutPage /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={finalData} websiteId={site.id}><BlisslyCheckoutPage /></BlisslyLayout>;
    case 'flavornest':
      return <FlavornestLayout serverData={finalData} websiteId={site.id}><FlavornestCheckoutPage /></FlavornestLayout>;
    case 'aurora':
      return <AuroraLayout serverData={finalData} websiteId={site.id}><AuroraCheckoutPage /></AuroraLayout>;
    case 'frostify':
      return <FrostifyLayout serverData={finalData} websiteId={site.id}><FrostifyCheckoutPage /></FrostifyLayout>;
    default:
      return <div>Checkout not found for this template.</div>;
  }
}