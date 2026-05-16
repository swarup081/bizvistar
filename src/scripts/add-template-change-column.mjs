// Run this script to add the last_template_change_at column to the websites table.
// Usage: node src/scripts/add-template-change-column.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env.local') });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addColumn() {
  console.log('Adding last_template_change_at column to websites table...');
  
  // Check if column already exists by trying to query it
  const { data, error: checkError } = await supabaseAdmin
    .from('websites')
    .select('last_template_change_at')
    .limit(1);

  if (!checkError) {
    console.log('✅ Column already exists. No changes needed.');
    return;
  }

  // Column doesn't exist, add it via RPC or raw query
  // Since Supabase JS client doesn't support raw DDL, we'll use the REST API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        query: 'ALTER TABLE public.websites ADD COLUMN IF NOT EXISTS last_template_change_at timestamptz;'
      })
    }
  );

  if (response.ok) {
    console.log('✅ Column added successfully!');
  } else {
    console.log('⚠️  Could not add column via RPC. Please run this SQL manually in Supabase Dashboard:');
    console.log('');
    console.log('  ALTER TABLE public.websites ADD COLUMN IF NOT EXISTS last_template_change_at timestamptz;');
    console.log('');
  }
}

addColumn().catch(console.error);
