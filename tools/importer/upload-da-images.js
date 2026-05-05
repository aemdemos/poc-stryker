#!/usr/bin/env node

/**
 * Upload images to DA for imported content.
 *
 * Downloads images referenced in the .plain.html content file and uploads
 * them to the DA shadow folder for the page.
 *
 * DA stores page images in a hidden "shadow folder" named .{pagename}
 * next to the page file. For example, a page at:
 *   /us/en/procedures/dart.html
 * has its images at:
 *   /us/en/procedures/.dart/image-name.png
 *
 * Usage:
 *   node tools/importer/upload-da-images.js \
 *     --org aemdemos \
 *     --repo poc-stryker \
 *     --content content/us/en/joint-replacement/procedures/dart-direct-anterior-reconstructive-technology.plain.html \
 *     --token YOUR_DA_TOKEN
 *
 * To get a DA token:
 *   1. Open https://da.live in your browser and log in
 *   2. Open DevTools > Application > Cookies
 *   3. Copy the value of the 'auth_token' cookie
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, basename, extname, join } from 'path';

const DA_ADMIN_API = 'https://admin.da.live/source';

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      parsed[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  if (!parsed.org || !parsed.repo || !parsed.content) {
    console.error('Usage: node upload-da-images.js --org ORG --repo REPO --content PATH [--token TOKEN]');
    console.error('  --token can also be set via DA_TOKEN environment variable');
    process.exit(1);
  }
  parsed.token = parsed.token || process.env.DA_TOKEN;
  if (!parsed.token) {
    console.error('Error: No auth token provided. Use --token or set DA_TOKEN env var.');
    console.error('Get your token from https://da.live (DevTools > Application > Cookies > auth_token)');
    process.exit(1);
  }
  return parsed;
}

function extractImageUrls(html) {
  const urls = new Set();
  const srcRegex = /src="([^"]+)"/g;
  let match;
  while ((match = srcRegex.exec(html)) !== null) {
    const url = match[1];
    if (url.startsWith('http') && (
      url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') ||
      url.includes('.gif') || url.includes('.webp') || url.includes('.svg') ||
      url.includes('/is/image/') || url.includes('/dam/')
    )) {
      urls.add(url);
    }
  }
  return [...urls];
}

function getShadowFolder(contentPath) {
  const dir = dirname(contentPath);
  const filename = basename(contentPath, '.plain.html');
  return join(dir, `.${filename}`);
}

function sanitizeFilename(url) {
  try {
    const urlObj = new URL(url);
    let name = basename(urlObj.pathname);
    name = decodeURIComponent(name);
    name = name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    if (!extname(name)) name += '.png';
    return name;
  } catch {
    return 'image-' + Date.now() + '.png';
  }
}

async function downloadImage(url) {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return Buffer.from(await resp.arrayBuffer());
}

async function uploadToDA(buffer, daPath, token, contentType) {
  const resp = await fetch(`${DA_ADMIN_API}${daPath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': contentType,
    },
    body: buffer,
  });
  return resp.status;
}

async function main() {
  const { org, repo, content, token } = parseArgs();

  const contentPath = resolve(content);
  if (!existsSync(contentPath)) {
    console.error(`Content file not found: ${contentPath}`);
    process.exit(1);
  }

  const html = readFileSync(contentPath, 'utf-8');
  const imageUrls = extractImageUrls(html);

  if (imageUrls.length === 0) {
    console.log('No external images found in content.');
    process.exit(0);
  }

  console.log(`Found ${imageUrls.length} images to upload.`);

  // Compute shadow folder path relative to content root
  const relContentPath = content.replace(/^content\//, '');
  const shadowFolder = getShadowFolder(relContentPath);
  console.log(`DA shadow folder: /${org}/${repo}/${shadowFolder}/`);

  let updatedHtml = html;
  let success = 0;
  let failed = 0;

  for (const url of imageUrls) {
    const filename = sanitizeFilename(url);
    const daPath = `/${org}/${repo}/${shadowFolder}/${filename}`;
    const daRefPath = `/${shadowFolder}/${filename}`;

    process.stdout.write(`  ${filename}... `);

    try {
      const buffer = await downloadImage(url);

      const ext = extname(filename).toLowerCase();
      const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.gif' ? 'image/gif'
        : ext === '.svg' ? 'image/svg+xml'
        : ext === '.webp' ? 'image/webp'
        : 'image/png';

      const status = await uploadToDA(buffer, daPath, token, contentType);

      if (status >= 200 && status < 300) {
        console.log(`OK (${status})`);
        updatedHtml = updatedHtml.split(url).join(daRefPath);
        success++;
      } else {
        console.log(`FAILED (${status})`);
        failed++;
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      failed++;
    }
  }

  // Save updated HTML with DA paths
  writeFileSync(contentPath, updatedHtml);

  console.log('');
  console.log(`Done. Uploaded: ${success}, Failed: ${failed}`);
  console.log(`Content file updated with DA image paths.`);

  if (failed > 0) {
    console.log('');
    console.log('NOTE: Failed uploads may be due to:');
    console.log('  - Expired auth token (get a fresh one from da.live)');
    console.log('  - Image source blocking downloads');
    console.log('  - Network issues');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
