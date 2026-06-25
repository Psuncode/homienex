// Generate WebP siblings for every JPG in public/catalog_images/.
// Run with: node scripts/gen-webp.mjs
import { readdir, stat } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = join(__dirname, '..', 'public', 'catalog_images');

const QUALITY = 78;
const EFFORT = 4;

async function run() {
  const entries = await readdir(IMG_DIR);
  const jpgs = entries.filter((f) => /\.jpe?g$/i.test(f));

  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (const jpg of jpgs) {
    const src = join(IMG_DIR, jpg);
    const out = join(IMG_DIR, basename(jpg).replace(/\.jpe?g$/i, '.webp'));

    try {
      await stat(out);
      skipped++;
      continue; // already exists
    } catch {
      // doesn't exist yet -> generate
    }

    try {
      await sharp(src)
        .webp({ quality: QUALITY, effort: EFFORT })
        .toFile(out);
      made++;
    } catch (err) {
      failed++;
      console.error(`FAILED ${jpg}: ${err.message}`);
    }
  }

  console.log(
    `WebP done. jpgs=${jpgs.length} created=${made} skipped=${skipped} failed=${failed}`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
