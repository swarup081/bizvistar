import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Directories to upload
const DIRS = ['avenix', 'blissly', 'flaraImage', 'flavournestImage', 'aurora', 'frostify'];

// Image extensions to include
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.avif', '.webp', '.gif', '.svg'];

async function uploadDir(dirName) {
  const dirPath = path.join(PUBLIC_DIR, dirName);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: /public/${dirName} — skipping`);
    return {};
  }

  const files = fs.readdirSync(dirPath).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXTS.includes(ext);
  });

  const results = {};
  console.log(`\n📁 Uploading ${files.length} images from /public/${dirName}...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(dirPath, file);
    const publicId = `bizvistar/${dirName}/${path.parse(file).name}`;

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });

      const localPath = `/${dirName}/${file}`;
      results[localPath] = result.secure_url;
      console.log(`  ✅ [${i + 1}/${files.length}] ${file}`);
      console.log(`     → ${result.secure_url}`);
    } catch (err) {
      console.error(`  ❌ [${i + 1}/${files.length}] Failed: ${file}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  return results;
}

async function main() {
  // Validate env vars
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Missing Cloudinary credentials in .env.local');
    console.error('   Required: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  console.log('🚀 Starting Cloudinary upload...');
  console.log(`   Cloud Name: ${cloudName}`);
  console.log(`   Folders to upload: ${DIRS.join(', ')}`);
  console.log('─'.repeat(60));

  const allMappings = {};
  let totalUploaded = 0;
  let totalFailed = 0;

  for (const dir of DIRS) {
    const mappings = await uploadDir(dir);
    const count = Object.keys(mappings).length;
    totalUploaded += count;
    Object.assign(allMappings, mappings);
  }

  // Save mapping to file
  const outputPath = path.join(ROOT, 'scripts', 'cloudinary-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(allMappings, null, 2));

  console.log('\n' + '─'.repeat(60));
  console.log(`✨ Upload complete!`);
  console.log(`   📊 Total uploaded: ${totalUploaded} images`);
  console.log(`   📄 Mapping saved to: scripts/cloudinary-mapping.json`);
  console.log(`\n   Next step: Run "node scripts/sync-cloudinary-urls.mjs" to update your data files.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
