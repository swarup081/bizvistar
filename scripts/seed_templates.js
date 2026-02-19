require('dotenv').config(); // Load variables from .env by default
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  console.error('Tip: If using .env.local, run: node -r dotenv/config scripts/seed_templates.js dotenv_config_path=.env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const templates = [
  { name: 'aurora', description: 'Modern and sleek design for tech and startups.', preview_url: '/templates/aurora' },
  { name: 'avenix', description: 'Bold and professional layout for agencies.', preview_url: '/templates/avenix' },
  { name: 'blissly', description: 'Calm and minimalist theme for wellness brands.', preview_url: '/templates/blissly' },
  { name: 'flara', description: 'Vibrant and energetic style for creative portfolios.', preview_url: '/templates/flara' },
  { name: 'flavornest', description: 'Appetizing design specifically for restaurants and food.', preview_url: '/templates/flavornest' },
  { name: 'frostify', description: 'Cool and crisp theme perfect for winter or refreshing products.', preview_url: '/templates/frostify' },
];

async function seedTemplates() {
  console.log(`Seeding ${templates.length} templates to 'public.templates'...`);

  for (const template of templates) {
    const { error } = await supabase
      .from('templates')
      .upsert(template, { onConflict: 'name' });

    if (error) {
      console.error(`Failed to insert template ${template.name}:`, error);
    } else {
      console.log(`Synced template: ${template.name}`);
    }
  }

  console.log('Done.');
}

seedTemplates();
