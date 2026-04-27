/**
 * Post-import: Download Dynamic Media images and update HTML references.
 * DA's content bus can't ingest external DM URLs directly.
 * Downloads each DM image, saves it alongside the .plain.html,
 * and updates img src to use a relative local path with sanitized filename.
 *
 * Usage: node tools/importer/download-dm-images.js [content-dir]
 */
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';

const DM_PATTERN = /https:\/\/media-assets\.stryker\.com\/is\/image\/stryker\/[^\s"'<>]+/g;
const CONTENT_DIR = process.argv[2] || 'content';

async function findHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.plain.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`  Failed to download ${url}: ${response.status}`);
    return false;
  }
  const contentType = response.headers.get('content-type') || '';
  const buffer = Buffer.from(await response.arrayBuffer());

  let ext = 'jpg';
  if (contentType.includes('png')) ext = 'png';
  else if (contentType.includes('webp')) ext = 'webp';
  else if (contentType.includes('gif')) ext = 'gif';

  const finalPath = outputPath.replace(/\.[^.]+$/, `.${ext}`);
  await writeFile(finalPath, buffer);
  return finalPath;
}

async function processFile(htmlPath) {
  let html = await readFile(htmlPath, 'utf-8');
  const dmUrls = [...new Set(html.match(DM_PATTERN) || [])];

  if (dmUrls.length === 0) return 0;

  const htmlDir = dirname(htmlPath);
  let count = 0;

  for (const dmUrl of dmUrls) {
    const rawName = decodeURIComponent(dmUrl.split('/').pop().split('?')[0]);
    const assetName = rawName.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').toLowerCase();
    const hash = createHash('md5').update(dmUrl).digest('hex').slice(0, 8);
    const localName = `${assetName}-${hash}.jpg`;
    const localPath = join(htmlDir, localName);

    if (!existsSync(localPath)) {
      const downloaded = await downloadImage(dmUrl, localPath);
      if (!downloaded) continue;
      console.log(`  Downloaded: ${assetName} → ${localName}`);
    }

    const actualFiles = (await readdir(htmlDir)).filter((f) => f.startsWith(`${assetName}-${hash}`));
    const actualName = actualFiles[0] || localName;

    html = html.split(dmUrl).join(actualName);
    count += 1;
  }

  // Extract Scene7 video assets: replace -AVS poster images with Embed blocks
  // The -AVS image is inside <p><a href="blob:..."><img src="...-AVS..."></a></p>
  html = html.replace(
    /<p>[^<]*<a[^>]*blob:[^>]*>[^<]*<img[^>]*\/is\/image\/stryker\/(.+?)-AVS[^>]*>[^<]*<\/a>[^<]*<\/p>/g,
    (match, assetNameEncoded) => {
      const assetName = decodeURIComponent(assetNameEncoded);
      const videoUrl = `https://media-assets.stryker.com/is/content/stryker/${encodeURIComponent(assetName)}`;
      return `<div class="embed"><div><div><a href="${videoUrl}">${videoUrl}</a></div></div></div>`;
    },
  );

  // Strip remaining Scene7 video player artifacts
  html = html.replace(/<p>[^<]*<a[^>]*blob:[^>]*>.*?<\/a>[^<]*<\/p>/g, '');
  html = html.replace(/<p>[^<]*<img[^>]*\/s7viewers\/[^>]*>[^<]*<\/p>/g, '');
  html = html.replace(/<p>[^<]*<img[^>]*\/s7sdk\/[^>]*>[^<]*<\/p>/g, '');
  html = html.replace(/<p>[^<]*<img[^>]*-AVS[^>]*>[^<]*<\/p>/g, '');
  html = html.replace(/<p>\s*(0:\d\d[^<]*|AUDIO|default|Cancel\w*[^<]*)\s*<\/p>/g, '');
  html = html.replace(/<p>[^<]*(Email this|Wrong email|Embed Size|Embed Link|Share Link|To share this|copy and past)[^<]*<\/p>/g, '');
  html = html.replace(/<p>(<a href="">[^<]*<\/a>)+<\/p>/g, '');
  html = html.replace(/<a[^>]*blob:[^>]*><img[^>]*><\/a>/g, '');
  html = html.replace(/<img[^>]*\/s7viewers\/[^>]*>/g, '');
  html = html.replace(/<img[^>]*\/s7sdk\/[^>]*>/g, '');
  html = html.replace(/<img[^>]*-AVS[^>]*>/g, '');
  html = html.replace(/<ul>\s*<li>default<\/li>\s*<\/ul>/g, '');

  // Remove empty H1 tags (Ortho Q double-H1 pattern has an empty first H1)
  html = html.replace(/<h1 id="">\s*<\/h1>/g, '');

  // Hero split: if the first section starts with an H1 followed by paragraphs and an image
  // but NO columns block, split into a hero block + remaining content section.
  // This handles Modern Rich pages (Ortho Q, etc.) where the hero isn't in a .pagehero container.
  // Only apply to the first <div> section (line 1).
  const firstDivMatch = html.match(/^(<div>)([\s\S]*?)(<\/div>)\n/);
  if (firstDivMatch) {
    const sectionContent = firstDivMatch[2];
    // Only split if there's an H1 but NO columns block already
    if (sectionContent.includes('<h1') && !sectionContent.includes('class="columns"')) {
      // Find the first <img> — everything up to and including its <p> wrapper is the hero
      const imgMatch = sectionContent.match(/([\s\S]*?<p>[^<]*<img [^>]+>[^<]*<\/p>)/);
      if (imgMatch) {
        const heroContent = imgMatch[1];
        const restContent = sectionContent.slice(heroContent.length);

        // Only split if there's meaningful content after the image
        if (restContent.trim().length > 20) {
          const heroBlock = `<div>${heroContent}</div>\n<div>${restContent}</div>\n`;
          html = heroBlock + html.slice(firstDivMatch[0].length);
        }
      }
    }
  }

  await writeFile(htmlPath, html);
  return count;
}

async function main() {
  console.log(`Processing DM images in ${CONTENT_DIR}...`);
  const htmlFiles = await findHtmlFiles(CONTENT_DIR);
  let totalImages = 0;

  for (const file of htmlFiles) {
    console.log(`Processing: ${file}`);
    const count = await processFile(file);
    totalImages += count;
  }

  console.log(`\nDone. Downloaded and replaced ${totalImages} DM image references across ${htmlFiles.length} files.`);
}

main().catch(console.error);
