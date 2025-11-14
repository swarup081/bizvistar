// src/app/site/[slug]/page.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function LiveSitePage({ params }) {
  const { slug } = params;

  // --- THIS IS THE NEW FIX ---
  // If the slug is literally "undefined" (from a favicon request, etc.),
  // stop immediately before we query the database.
  if (!slug || slug === 'undefined') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>404 - Not Found</h1>
        <p>This page does not exist.</p>
      </div>
    );
  }
  // --- END OF FIX ---


  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select(`
      is_published,
      website_data,
      template:templates ( name )
    `)
    .eq('site_slug', slug)
    .single();

  if (error) {
    console.error("Supabase query error:", error.message);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>500 - Server Error</h1>
        <p>Could not query database. Check Vercel logs.</p>
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      </div>
    );
  }

  if (!site) {
    console.warn("Query successful, but no site found.");
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>404 - Site Not Found</h1>
        <p>Query ran, but no site matches this slug:</p>
        <p><strong>{slug}</strong></p>
      </div>
    );
  }

  if (!site.is_published) {
    console.warn("Site found, but it is not published.");
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Site Not Published</h1>
        <p>This site has been created but has not been published yet.</p>
      </div>
    );
  }

  // SUCCESS!
  console.log("Success! Site found and is published.");
  const templateName = site.template.name;
  const websiteData = site.website_data;

  return (
    <div style={{ padding: '40px' }}>
      <h1>Success! Your Live Site Data is Here:</h1>
      <p><strong>Site Slug:</strong> {slug}</p>
      <p><strong>Template to use:</strong> {templateName}</p>
      <hr style={{ margin: '20px 0' }} />
      <h2>Website JSON Data:</h2>
      <pre style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        {JSON.stringify(websiteData, null, 2)}
      </pre>
    </div>
  );
}