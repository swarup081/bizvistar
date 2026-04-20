export const runtime = 'edge';
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
  const websiteData = site.website_data;

  // Render the correct template's shop page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={websiteData} websiteId={site.id}><FlaraShopPage /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={websiteData} websiteId={site.id}><AvenixShopPage /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={websiteData} websiteId={site.id}><BlisslyShopPage /></BlisslyLayout>;
    case 'flavornest':
      return <FlavornestLayout serverData={websiteData} websiteId={site.id}><FlavornestShopPage /></FlavornestLayout>;
    case 'aurora':
      return <AuroraLayout serverData={websiteData} websiteId={site.id}><AuroraShopPage /></AuroraLayout>;
    case 'frostify':
      return <FrostifyLayout serverData={websiteData} websiteId={site.id}><FrostifyShopPage /></FrostifyLayout>;
    default:
      return <div>Shop not found for this template.</div>;
  }
}