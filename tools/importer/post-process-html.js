/**
 * Post-import step: Fixes structural issues in imported HTML.
 * - Moves orphaned headings before cards blocks into the cards section.
 * - Downloads Scene7 images that DA can't fetch.
 *
 * Usage: node tools/importer/post-process-html.js <path-to-plain-html>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { createHash } from 'crypto';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node tools/importer/post-process-html.js <path-to-plain-html>');
  process.exit(1);
}

let html = readFileSync(filePath, 'utf-8');

// Fix 1: Move any heading (h2 or h3) stuck at the end of a section to the start of the next section.
// Pattern: <h2 ...>...</h2></div>\n<div> or <h3 ...>...</h3></div>\n<div>
const orphanedHeadingRegex = /(<h[23][^>]*>[^<]*<\/h[23]>)(<\/div>\n<div>)/g;
let headingFixCount = 0;
html = html.replace(orphanedHeadingRegex, (match, heading, sectionBreak) => {
  headingFixCount++;
  return `${sectionBreak}${heading}`;
});
if (headingFixCount > 0) {
  console.log(`✅ Moved ${headingFixCount} orphaned heading(s) into their correct sections`);
} else {
  console.log('ℹ️  No orphaned headings to fix');
}

// Fix 3: Download Scene7 images
const docDir = dirname(filePath);
const imgRegex = /src="(https:\/\/media-assets\.stryker\.com\/is\/image\/stryker\/[^"]+)"/g;
let imgMatch;
const replacements = [];

while ((imgMatch = imgRegex.exec(html)) !== null) {
  replacements.push({ original: imgMatch[1], fullMatch: imgMatch[0] });
}

if (replacements.length > 0) {
  console.log(`Found ${replacements.length} Scene7 image(s) to download...`);
  for (const { original, fullMatch } of replacements) {
    try {
      const fetchUrl = original.includes('?') ? original : `${original}?fmt=jpg`;
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        console.error(`  ❌ Failed (${response.status}): ${fetchUrl}`);
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const hash = createHash('sha1').update(buffer).digest('hex').substring(0, 20);
      const filename = `media_${hash}.jpg`;
      if (!existsSync(docDir)) mkdirSync(docDir, { recursive: true });
      writeFileSync(join(docDir, filename), buffer);
      html = html.replace(fullMatch, `src="./${filename}"`);
      console.log(`  ✅ ${filename}`);
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
    }
  }
}

writeFileSync(filePath, html, 'utf-8');
console.log('Done.');
