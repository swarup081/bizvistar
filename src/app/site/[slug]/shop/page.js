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

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function LiveShopPage({ params }) {
  const { slug } = params;

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
      is_published,
      website_data,
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

  if (!site.is_published) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Site Not Published</h1>
        <p>This site is created but not published yet.</p>
      </div>
    );
  }

  const templateName = site.template.name;
  const websiteData = site.website_data;

  // Render the correct template's shop page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={websiteData}><FlaraShopPage /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={websiteData}><AvenixShopPage /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={websiteData}><BlisslyShopPage /></BlisslyLayout>;
    case 'flavornest':
      return <FlavornestLayout serverData={websiteData}><FlavornestShopPage /></FlavornestLayout>;
    default:
      return <div>Shop not found for this template.</div>;
  }
}