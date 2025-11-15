// src/app/site/[slug]/product/[productId]/page.js
import { createClient } from '@supabase/supabase-js';

// Import all template layouts and product pages
import FlaraLayout from '@/app/templates/flara/layout';
import FlaraProductPage from '@/app/templates/flara/product/[productId]/page';
import AvenixLayout from '@/app/templates/avenix/layout';
import AvenixProductPage from '@/app/templates/avenix/product/[productId]/page';
import BlisslyLayout from '@/app/templates/blissly/layout';
// CHANGED: Corrected import path for Blissly product page
import BlisslyProductPage from '@/app/templates/blissly/product/[productId]/page';
import FlavornestLayout from '@/app/templates/flavornest/layout';
// Flavornest does not have a product page, so we would just render the shop
import FlavornestShopPage from '@/app/templates/flavornest/shop/page';


const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CHANGED: The function signature is now (props)
export default async function LiveProductPage(props) {
  // CHANGED: We now await props.params to get both parameters
  const { slug, productId } = await props.params;

  if (!slug || slug === 'undefined') {
    return <div>404 - Not Found</div>;
  }

  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select(`is_published, website_data, template:templates ( name )`)
    .eq('site_slug', slug)
    .single();

  if (error || !site || !site.is_published) {
    return <div>404 - Site Not Found</div>;
  }

  const templateName = site.template.name;
  const websiteData = site.website_data;

  // Render the correct template's product page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={websiteData}><FlaraProductPage /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={websiteData}><AvenixProductPage /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={websiteData}><BlisslyProductPage /></BlisslyLayout>;
    case 'flavornest':
      // Flavornest has no product page, redirect to its shop
      return <FlavornestLayout serverData={websiteData}><FlavornestShopPage /></FlavornestLayout>;
    default:
      return <div>Product not found for this template.</div>;
  }
}