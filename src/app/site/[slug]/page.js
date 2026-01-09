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

  const templateName = site.template?.name;
  const websiteData = site.website_data;

  // Render selected template
  switch (templateName) {
    case "flara":
      return (
        <FlaraLayout serverData={websiteData} websiteId={site.id}>
          <FlaraPage />
        </FlaraLayout>
      );

    case "avenix":
      return (
        <AvenixLayout serverData={websiteData} websiteId={site.id}>
          <AvenixPage />
        </AvenixLayout>
      );

    case "blissly":
      return (
        <BlisslyLayout serverData={websiteData} websiteId={site.id}>
          <BlisslyPage />
        </BlisslyLayout>
      );

    case "flavornest":
      return (
        <FlavornestLayout serverData={websiteData} websiteId={site.id}>
          <FlavornestPage />
        </FlavornestLayout>
      );

    default:
      return <div>Unknown template: {templateName}</div>;
  }
}