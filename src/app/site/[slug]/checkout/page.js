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

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function LiveCheckoutPage({ params }) {
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

  // Render the correct template's checkout page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={websiteData}><FlaraCheckoutPage /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={websiteData}><AvenixCheckoutPage /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={websiteData}><BlisslyCheckoutPage /></BlisslyLayout>;
    case 'flavornest':
      return <FlavornestLayout serverData={websiteData}><FlavornestCheckoutPage /></FlavornestLayout>;
    default:
      return <div>Checkout not found for this template.</div>;
  }
}