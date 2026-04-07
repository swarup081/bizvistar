export const runtime = 'edge';

import { createClient } from '@supabase/supabase-js';

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
  const { slug } = await params;

  if (!slug) return {};

  const { data: site } = await supabaseAdmin
    .from("websites")
    .select("website_data, id")
    .eq("site_slug", slug)
    .single();

  if (!site) return {};

  const websiteData = site.website_data || {};
  
  // Follow the exact fallback chain used in profile
  let businessName = websiteData.name || websiteData.businessName || websiteData.business?.name || '';
  let logoUrl = websiteData.logo || '';

  // Fallback to onboarding data if not in website_data directly
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

  // If businessName is empty, fallback to "Bizvistar"
  const title = businessName || 'Bizvistar';
  const description = websiteData.description || websiteData.hero?.subtitle || `Welcome to ${title}'s online store.`;
  
  // Logic for the icon:
  // 1. User uploaded logo (logoUrl)
  // 2. SVG letter generated from business name
  // 3. If neither (businessName is empty), fallback to Bizvistar's default favicon
  let iconUrl = '';
  if (logoUrl) {
    iconUrl = logoUrl;
  } else if (businessName) {
    iconUrl = generateFallbackFavicon(businessName);
  } else {
    iconUrl = '/favicon.ico';
  }

  const ogImageUrl = logoUrl ? logoUrl : 'https://bizvistar.in/dashboard.png';

  return {
    title: {
      absolute: title, 
    },
    description: description,
    // We explicitly supply the icons object so it perfectly overrides the parent layout config
    // Using objects with 'url' helps Next.js parse base64/data URIs accurately.
    icons: {
      icon: [{ url: iconUrl }],
      shortcut: [{ url: iconUrl }],
      apple: [{ url: iconUrl }],
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Logo or Banner`,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function SiteSlugLayout({ children }) {
  return <>{children}</>;
}
