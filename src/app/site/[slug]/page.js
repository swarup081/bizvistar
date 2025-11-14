import { supabaseServer } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';

// Import all the templates
import Flara from '@/app/templates/flara/page';
import Avenix from '@/app/templates/avenix/page';
import Blissly from '@/app/templates/blissly/page';
import Flavornest from '@/app/templates/flavornest/page';

const templateComponents = {
  flara: Flara,
  avenix: Avenix,
  blissly: Blissly,
  flavornest: Flavornest,
};

async function getWebsiteData(slug) {
  const { data, error } = await supabase
    .from('websites')
    .select('*, pages:website_pages(*), products:products(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    console.error('Error fetching website data:', error);
    return null;
  }

  return data;
}

export default async function SitePage({ params }) {
  const { slug } = params;
  const websiteData = await getWebsiteData(slug);

  if (!websiteData) {
    notFound();
  }

  const TemplateComponent = templateComponents[websiteData.template_name];

  if (!TemplateComponent) {
    console.error(`Template "${websiteData.template_name}" not found.`);
    notFound();
  }

  return <TemplateComponent data={websiteData.website_data} />;
}
