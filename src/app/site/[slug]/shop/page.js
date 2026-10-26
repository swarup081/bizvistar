export const revalidate = 60; // ISR: cache for 60s, then revalidate in background
// src/app/site/[slug]/shop/page.js
import { createClient } from '@supabase/supabase-js';

// Import all template layouts and shop pages
import FlaraLayout from '@/app/templates/flara/layout';
import FlaraShopPage from '@/app/templates/flara/shop/page';
import AvenixLayout from '@/app/templates/avenix/layout';
import AvenixShopPage from '@/app/templates/avenix/shop/page';
import BlisslyLayout from '@/app/templates/blissly/layout';
import BlisslyShopPage from '@/app/templates/blissly/shop/page';
import FlavornestLayout from '@/app/templates/flavornest/layout';
import FlavornestShopPage from '@/app/templates/flavornest/shop/page';
import AuroraLayout from '@/app/templates/aurora/layout';
import AuroraShopPage from '@/app/templates/aurora/shop/page';
import FrostifyLayout from '@/app/templates/frostify/layout';
import FrostifyShopPage from '@/app/templates/frostify/shop/page';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

// CHANGED: The function signature is now (props)
export default async function LiveShopPage(props) {
  // CHANGED: We now await props.params to get the slug
  const { slug } = await props.params;

  if (!slug || slug === 'undefined') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>404 - Not Found</h1>
        <p>This page does not exist.</p>
      </div>
    );
  }

  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select(`id, is_published, website_data, template:templates ( name )`)
    .eq('site_slug', slug)
    .single();

  if (error || !site) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>404 - Site Not Found</h1>
        <p>No site matches this slug: <strong>{slug}</strong></p>
      </div>
    );
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

  // Render the correct template's shop page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={finalData} websiteId={site.id}><FlaraShopPage /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={finalData} websiteId={site.id}><AvenixShopPage /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={finalData} websiteId={site.id}><BlisslyShopPage /></BlisslyLayout>;
    case 'flavornest':
      return <FlavornestLayout serverData={finalData} websiteId={site.id}><FlavornestShopPage /></FlavornestLayout>;
    case 'aurora':
      return <AuroraLayout serverData={finalData} websiteId={site.id}><AuroraShopPage /></AuroraLayout>;
    case 'frostify':
      return <FrostifyLayout serverData={finalData} websiteId={site.id}><FrostifyShopPage /></FrostifyLayout>;
    default:
      return <div>Shop not found for this template.</div>;
  }
}