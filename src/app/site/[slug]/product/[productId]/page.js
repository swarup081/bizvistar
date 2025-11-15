// src/app/site/[slug]/product/[productId]/page.js
import { createClient } from '@supabase/supabase-js';

// Import all template layouts and product pages
import FlaraLayout from '@/app/templates/flara/layout';
import FlaraProductPage from '@/app/templates/flara/product/page';
import AvenixLayout from '@/app/templates/avenix/layout';
import AvenixProductPage from '@/app/templates/avenix/product/page';
import BlisslyLayout from '@/app/templates/blissly/layout';
import BlisslyProductPage from '@/app/templates/blissly/product/page';
import FlavornestLayout from '@/app/templates/flavornest/layout';
import FlavornestProductPage from '@/app/templates/flavornest/product/page';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function LiveProductPage({ params }) {
  const { slug, productId } = params;

  if (!slug || !productId || slug === 'undefined' || productId === 'undefined') {
    return <div>404 - Not Found</div>;
  }

  const { data: site, error: siteError } = await supabaseAdmin
    .from('websites')
    .select('id, is_published, website_data, template:templates ( name )')
    .eq('site_slug', slug)
    .single();

  if (siteError || !site || !site.is_published) {
    return <div>404 - Site Not Found</div>;
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('website_id', site.id)
    .single();

  if (productError || !product) {
    return <div>404 - Product Not Found</div>;
  }

  const templateName = site.template.name;
  const websiteData = site.website_data;

  // Render the correct template's product page
  switch (templateName) {
    case 'flara':
      return <FlaraLayout serverData={websiteData}><FlaraProductPage product={product} /></FlaraLayout>;
    case 'avenix':
      return <AvenixLayout serverData={websiteData}><AvenixProductPage product={product} /></AvenixLayout>;
    case 'blissly':
      return <BlisslyLayout serverData={websiteData}><BlisslyProductPage product={product} /></BlisslyLayout>;
    case 'flavornest':
      return <FlavornestLayout serverData={websiteData}><FlavornestProductPage product={product} /></FlavornestLayout>;
    default:
      return <div>Product page not found for this template.</div>;
  }
}