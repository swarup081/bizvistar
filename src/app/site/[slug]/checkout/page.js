export const runtime = 'edge';
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
  const websiteData = site.website_data;

  // Render the correct template's checkout page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={websiteData} websiteId={site.id}><FlaraCheckoutPage /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={websiteData} websiteId={site.id}><AvenixCheckoutPage /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={websiteData} websiteId={site.id}><BlisslyCheckoutPage /></BlisslyLayout>;
    case 'flavornest':
      return <FlavornestLayout serverData={websiteData} websiteId={site.id}><FlavornestCheckoutPage /></FlavornestLayout>;
    default:
      return <div>Checkout not found for this template.</div>;
  }
}