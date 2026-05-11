/**
 * Post-import step: Downloads images from media-assets.stryker.com
 * that DA can't fetch, saves them alongside the HTML, and rewrites
 * the src attributes to relative paths.
 *
 * Usage: node tools/importer/download-scene7-images.js <path-to-plain-html>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { createHash } from 'crypto';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node download-scene7-images.js <path-to-plain-html>');
  process.exit(1);
}

const html = readFileSync(filePath, 'utf-8');
const docDir = dirname(filePath);

// Find all media-assets.stryker.com image URLs
const imgRegex = /src="(https:\/\/media-assets\.stryker\.com\/is\/image\/stryker\/[^"]+)"/g;
let match;
const replacements = [];

while ((match = imgRegex.exec(html)) !== null) {
  replacements.push({ original: match[1], fullMatch: match[0] });
}

if (replacements.length === 0) {
  console.log('No Scene7 images found to download.');
  process.exit(0);
}

console.log(`Found ${replacements.length} Scene7 image(s) to download...`);

let updatedHtml = html;

for (const { original, fullMatch } of replacements) {
  try {
    // Add fmt=jpg to get proper image response
    const fetchUrl = original.includes('?') ? original : `${original}?fmt=jpg`;
    console.log(`  Downloading: ${fetchUrl}`);

    const response = await fetch(fetchUrl);
    if (!response.ok) {
      console.error(`  ❌ Failed to fetch (${response.status}): ${fetchUrl}`);
      continue;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const hash = createHash('sha1').update(buffer).digest('hex').substring(0, 20);
    const filename = `media_${hash}.jpg`;
    const outputPath = join(docDir, filename);

    if (!existsSync(docDir)) mkdirSync(docDir, { recursive: true });
    writeFileSync(outputPath, buffer);

    // Rewrite src in HTML
    updatedHtml = updatedHtml.replace(fullMatch, `src="./${filename}"`);
    console.log(`  ✅ Saved as ${filename}`);
  } catch (e) {
    console.error(`  ❌ Error: ${e.message}`);
  }
}

writeFileSync(filePath, updatedHtml, 'utf-8');
console.log('Done. HTML updated with local image references.');
