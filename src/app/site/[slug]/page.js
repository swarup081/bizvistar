// src/app/site/[slug]/page.js
import { createClient } from '@supabase/supabase-js';

// Template Layouts
import FlaraLayout from '@/app/templates/flara/layout';
import AvenixLayout from '@/app/templates/avenix/layout';
import BlisslyLayout from '@/app/templates/blissly/layout';
import FlavornestLayout from '@/app/templates/flavornest/layout';

// Template Pages
import FlaraPage from '@/app/templates/flara/page';
import AvenixPage from '@/app/templates/avenix/page';
import BlisslyPage from '@/app/templates/blissly/page';
import FlavornestPage from '@/app/templates/flavornest/page';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function LiveSitePage(props) {
  // --- FIX FOR NEXT.JS 15+ ---
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const isPreview = searchParams.preview === 'true';
  // ---------------------------

  if (!slug || slug === "undefined") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>404 - Not Found</h1>
        <p>This page does not exist.</p>
      </div>
    );
  }

  // Fetch website
  const { data: site, error } = await supabaseAdmin
    .from("websites")
    .select(
      `
      id,
      is_published,
      website_data,
      draft_data,
      template:templates ( name )
      `
    )
    .eq("site_slug", slug)
    .single();

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>500 - Server Error</h1>
        <p>Could not query database.</p>
        <p style={{ color: "red" }}>Error: {error.message}</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>404 - Site Not Found</h1>
        <p>No site matches slug: <strong>{slug}</strong></p>
      </div>
    );
  }

  if (!site.is_published && !isPreview) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Site Not Published</h1>
        <p>This site is created but not published yet.</p>
      </div>
    );
  }

  const templateName = site.template?.name;
  const rawWebsiteData = (isPreview && site.draft_data) ? site.draft_data : site.website_data;

  // --- INJECT REAL PRODUCTS & CATEGORIES (Remove Demo Data) ---
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

  // Create a mutable copy to ensure we override the template data
  const finalData = rawWebsiteData ? { ...rawWebsiteData } : {}; 
  
  // Always inject real data (even if empty) to prevent fallback to demo data
  // Map raw DB columns to the shape expected by templates (matching websiteSync.js)
  finalData.allProducts = (realProducts || []).map(p => ({
      ...p,
      id: p.id,
      name: p.name,
      price: Number(p.price),
      category: p.category_id ? String(p.category_id) : 'uncategorized', // Map category_id -> category
      description: p.description,
      image: p.image_url, // Map image_url -> image
      stock: p.stock,
      additional_images: p.additional_images || [],
      variants: p.variants || []
  }));

  finalData.allCategories = realCategories || [];
  finalData.categories = finalData.allCategories; // Ensure both keys exist if templates use either
  // -----------------------------------------------

  // Render selected template
  switch (templateName) {
    case "flara":
      return (
        <FlaraLayout serverData={finalData} websiteId={site.id}>
          <FlaraPage />
        </FlaraLayout>
      );

    case "avenix":
      return (
        <AvenixLayout serverData={finalData} websiteId={site.id}>
          <AvenixPage />
        </AvenixLayout>
      );

    case "blissly":
      return (
        <BlisslyLayout serverData={finalData} websiteId={site.id}>
          <BlisslyPage />
        </BlisslyLayout>
      );

    case "flavornest":
      return (
        <FlavornestLayout serverData={finalData} websiteId={site.id}>
          <FlavornestPage />
        </FlavornestLayout>
      );

    default:
      return <div>Unknown template: {templateName}</div>;
  }
}