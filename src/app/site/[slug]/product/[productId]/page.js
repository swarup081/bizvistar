export const runtime = 'edge';
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
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

function generateFallbackFavicon(text) {
  const firstLetter = text ? text.charAt(0).toUpperCase() : 'B';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#8A63D2" rx="20" />
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" dominant-baseline="central" text-anchor="middle">
        ${firstLetter}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export async function generateMetadata({ params }) {
  const { slug, productId } = await params;

  if (!slug || !productId) return {};

  const { data: site } = await supabaseAdmin
    .from("websites")
    .select("website_data, id")
    .eq("site_slug", slug)
    .single();

  if (!site) return {};

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("name, description, image_url")
    .eq("id", productId)
    .eq("website_id", site.id)
    .single();

  if (!product) return {};

  const websiteData = site.website_data || {};
  let businessName = websiteData.name || websiteData.businessName || websiteData.business?.name || '';
  let logoUrl = websiteData.logo || '';

  if (!businessName || !logoUrl) {
    const { data: onboarding } = await supabaseAdmin
      .from("onboarding_data")
      .select("owner_name, logo_url")
      .eq("website_id", site.id)
      .single();

    if (onboarding) {
      businessName = businessName || onboarding.owner_name || '';
      logoUrl = logoUrl || onboarding.logo_url || '';
    }
  }

  const title = `${product.name} | ${businessName || 'Bizvistar'}`;
  const description = product.description || `Buy ${product.name} at ${businessName || 'our store'}.`;
  
  // Image priority: Product Image -> Shop Logo -> SVG generation -> Dashboard fallback
  let ogImageUrl = product.image_url;
  if (!ogImageUrl) {
    if (logoUrl) {
      ogImageUrl = logoUrl;
    } else if (businessName) {
      ogImageUrl = generateFallbackFavicon(businessName);
    } else {
      ogImageUrl = 'https://bizvistar.in/dashboard.png';
    }
  }

  return {
    title,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [ogImageUrl],
    },
  };
}

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