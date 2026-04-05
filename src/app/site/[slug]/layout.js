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
  let businessName = websiteData.businessName;
  let logoUrl = websiteData.logo;

  // Fallback to onboarding data if not in website_data directly
  if (!businessName || !logoUrl) {
    const { data: onboarding } = await supabaseAdmin
      .from("onboarding_data")
      .select("owner_name, logo_url")
      .eq("website_id", site.id)
      .single();

    if (onboarding) {
      businessName = businessName || onboarding.owner_name;
      logoUrl = logoUrl || onboarding.logo_url;
    }
  }

  const title = businessName || 'Bizvistar Site';

  // Use logo if available, otherwise generate a data URI SVG with the first letter
  const iconUrl = logoUrl || generateFallbackFavicon(businessName);

  return {
    title: {
      absolute: title, // This explicitly overrides any layout title template
    },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      title,
      images: logoUrl ? [logoUrl] : [],
    },
  };
}

export default function SiteSlugLayout({ children }) {
  return <>{children}</>;
}
