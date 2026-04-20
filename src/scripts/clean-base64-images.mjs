/**
 * One-time migration script to clean base64 image data from website_data JSON.
 * 
 * This replaces inline base64 data URLs (data:image/...) stored in the
 * website_data.allProducts[].image field with empty strings,
 * reducing the JSON column size dramatically.
 * 
 * Run: node src/scripts/clean-base64-images.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanBase64Images() {
  console.log('🔍 Fetching all websites with website_data...\n');

  const { data: websites, error } = await supabase
    .from('websites')
    .select('id, website_data, draft_data');

  if (error) {
    console.error('❌ Failed to fetch websites:', error.message);
    return;
  }

  console.log(`📦 Found ${websites.length} website(s)\n`);

  let totalCleaned = 0;

  for (const website of websites) {
    const data = website.website_data;
    if (!data) continue;

    let modified = false;
    let cleanedCount = 0;

    // Clean allProducts images
    if (Array.isArray(data.allProducts)) {
      for (const product of data.allProducts) {
        // Clean main image
        if (product.image && typeof product.image === 'string' && product.image.startsWith('data:image/')) {
          const sizeMB = (product.image.length / (1024 * 1024)).toFixed(2);
          console.log(`  🧹 Cleaning product "${product.name}" main image (${sizeMB}MB base64)`);
          product.image = ''; // Clear the base64
          modified = true;
          cleanedCount++;
        }
        // Clean additional_images
        if (Array.isArray(product.additional_images)) {
          product.additional_images = product.additional_images.map(img => {
            if (typeof img === 'string' && img.startsWith('data:image/')) {
              cleanedCount++;
              modified = true;
              return '';
            }
            return img;
          }).filter(img => img !== ''); // Remove empty entries
        }
      }
    }

    // Clean logo
    if (data.logo && typeof data.logo === 'string' && data.logo.startsWith('data:image/')) {
      const sizeMB = (data.logo.length / (1024 * 1024)).toFixed(2);
      console.log(`  🧹 Cleaning logo for website ${website.id} (${sizeMB}MB base64)`);
      data.logo = '';
      modified = true;
      cleanedCount++;
    }

    // Clean hero image
    if (data.hero?.backgroundImage && typeof data.hero.backgroundImage === 'string' && data.hero.backgroundImage.startsWith('data:image/')) {
      console.log(`  🧹 Cleaning hero background for website ${website.id}`);
      data.hero.backgroundImage = '';
      modified = true;
      cleanedCount++;
    }

    // Clean about image
    if (data.about?.image && typeof data.about.image === 'string' && data.about.image.startsWith('data:image/')) {
      console.log(`  🧹 Cleaning about image for website ${website.id}`);
      data.about.image = '';
      modified = true;
      cleanedCount++;
    }

    // Clean category images  
    if (Array.isArray(data.categories)) {
      for (const cat of data.categories) {
        if (cat.image && typeof cat.image === 'string' && cat.image.startsWith('data:image/')) {
          console.log(`  🧹 Cleaning category "${cat.name}" image for website ${website.id}`);
          cat.image = '';
          modified = true;
          cleanedCount++;
        }
      }
    }

    if (modified) {
      console.log(`  ✏️  Website ${website.id}: cleaned ${cleanedCount} base64 image(s) from website_data`);
      
      const { error: updateError } = await supabase
        .from('websites')
        .update({ website_data: data })
        .eq('id', website.id);

      if (updateError) {
        console.error(`  ❌ Failed to update website ${website.id}:`, updateError.message);
      } else {
        console.log(`  ✅ Website ${website.id}: website_data updated\n`);
        totalCleaned += cleanedCount;
      }
    } else {
      console.log(`  ⏭️  Website ${website.id}: no base64 in website_data\n`);
    }

    // --- Also clean draft_data ---
    const draft = website.draft_data;
    if (draft) {
      let draftModified = false;
      let draftCleanedCount = 0;

      if (Array.isArray(draft.allProducts)) {
        for (const product of draft.allProducts) {
          if (product.image && typeof product.image === 'string' && product.image.startsWith('data:image/')) {
            product.image = '';
            draftModified = true;
            draftCleanedCount++;
          }
          if (Array.isArray(product.additional_images)) {
            product.additional_images = product.additional_images.filter(img =>
              typeof img !== 'string' || !img.startsWith('data:image/')
            );
          }
        }
      }
      if (draft.logo && typeof draft.logo === 'string' && draft.logo.startsWith('data:image/')) {
        draft.logo = '';
        draftModified = true;
        draftCleanedCount++;
      }
      if (draft.hero?.backgroundImage && typeof draft.hero.backgroundImage === 'string' && draft.hero.backgroundImage.startsWith('data:image/')) {
        draft.hero.backgroundImage = '';
        draftModified = true;
        draftCleanedCount++;
      }
      if (draft.about?.image && typeof draft.about.image === 'string' && draft.about.image.startsWith('data:image/')) {
        draft.about.image = '';
        draftModified = true;
        draftCleanedCount++;
      }
      if (Array.isArray(draft.categories)) {
        for (const cat of draft.categories) {
          if (cat.image && typeof cat.image === 'string' && cat.image.startsWith('data:image/')) {
            cat.image = '';
            draftModified = true;
            draftCleanedCount++;
          }
        }
      }

      if (draftModified) {
        console.log(`  ✏️  Website ${website.id}: cleaned ${draftCleanedCount} base64 image(s) from draft_data`);
        const { error: draftErr } = await supabase
          .from('websites')
          .update({ draft_data: draft })
          .eq('id', website.id);
        if (draftErr) {
          console.error(`  ❌ Failed to update draft_data for website ${website.id}:`, draftErr.message);
        } else {
          console.log(`  ✅ Website ${website.id}: draft_data updated\n`);
          totalCleaned += draftCleanedCount;
        }
      }
    }
  }

  // Also clean base64 from the products table directly
  console.log('\n🔍 Checking products table for base64 image_url...\n');
  
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name, image_url, additional_images');

  if (!prodError && products) {
    for (const product of products) {
      let prodModified = false;
      const updates = {};
      
      if (product.image_url && product.image_url.startsWith('data:image/')) {
        const sizeMB = (product.image_url.length / (1024 * 1024)).toFixed(2);
        console.log(`  🧹 Product #${product.id} "${product.name}": clearing ${sizeMB}MB base64 image_url`);
        updates.image_url = '';
        prodModified = true;
        totalCleaned++;
      }

      if (Array.isArray(product.additional_images)) {
        const cleaned = product.additional_images.filter(img => 
          typeof img !== 'string' || !img.startsWith('data:image/')
        );
        if (cleaned.length !== product.additional_images.length) {
          console.log(`  🧹 Product #${product.id} "${product.name}": clearing ${product.additional_images.length - cleaned.length} base64 additional image(s)`);
          updates.additional_images = cleaned;
          prodModified = true;
          totalCleaned++;
        }
      }

      if (prodModified) {
        const { error: upErr } = await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id);
        
        if (upErr) {
          console.error(`  ❌ Failed to update product ${product.id}:`, upErr.message);
        } else {
          console.log(`  ✅ Product #${product.id} cleaned`);
        }
      }
    }
  }

  console.log(`\n🎉 Done! Cleaned ${totalCleaned} total base64 image(s) from the database.`);
}

cleanBase64Images().catch(console.error);
