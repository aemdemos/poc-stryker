/**
 * Post-import image downloader.
 * Scans all .plain.html files in content/, downloads external images,
 * saves them in a sibling media/ folder, and rewrites src attributes to local paths.
 *
 * Usage:
 *   node tools/importer/download-images.mjs
 *   node tools/importer/download-images.mjs --file content/us/en/.../page.plain.html
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, basename, resolve } from 'node:path';
import { get as httpsGet } from 'node:https';
import { get as httpGet } from 'node:http';

const CONTENT_DIR = resolve(process.cwd(), 'content');

import { readdirSync } from 'node:fs';

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? httpsGet : httpGet;
    client(url, { headers: { 'User-Agent': 'Mozilla/5.0 (aem-import)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        writeFileSync(destPath, buffer);
        resolve(buffer.length);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function urlToFilename(url) {
  const urlObj = new URL(url);
  let name = urlObj.pathname.split('/').pop() || 'image';
  const params = urlObj.search.replace(/[^a-zA-Z0-9]/g, '_');
  if (params) name += params;
  if (!name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) name += '.jpg';
  return name;
}

async function processFile(filePath) {
  let html = readFileSync(filePath, 'utf8');
  const externalUrls = new Set();
  const regex = /src="(https:\/\/[^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    externalUrls.add(match[1]);
  }

  if (externalUrls.size === 0) return { file: filePath, downloaded: 0, skipped: true };

  const pageDir = filePath.replace('.plain.html', '');
  const mediaDir = join(dirname(filePath), 'media');
  mkdirSync(mediaDir, { recursive: true });

  let downloaded = 0;
  let failed = 0;

  for (const url of externalUrls) {
    const filename = urlToFilename(url);
    const localPath = join(mediaDir, filename);
    const relativePath = `./media/${filename}`;

    if (existsSync(localPath)) {
      html = html.split(url).join(relativePath);
      downloaded++;
      continue;
    }

    try {
      const size = await downloadFile(url, localPath);
      if (size) {
        html = html.split(url).join(relativePath);
        downloaded++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  writeFileSync(filePath, html);
  return { file: filePath, total: externalUrls.size, downloaded, failed };
}

async function main() {
  const args = process.argv.slice(2);
  const singleFileIdx = args.indexOf('--file');

  let files;
  if (singleFileIdx >= 0 && args[singleFileIdx + 1]) {
    files = [resolve(args[singleFileIdx + 1])];
  } else {
    files = [];
    function walk(dir) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.plain.html')) files.push(full);
      }
    }
    if (!existsSync(CONTENT_DIR)) {
      console.error('No content/ directory found');
      process.exit(1);
    }
    walk(CONTENT_DIR);
  }

  console.log(`Processing ${files.length} file(s)...`);

  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (let i = 0; i < files.length; i++) {
    const result = await processFile(files[i]);
    if (result.skipped) {
      totalSkipped++;
    } else {
      totalDownloaded += result.downloaded;
      totalFailed += result.failed || 0;
      const rel = files[i].replace(CONTENT_DIR + '/', '');
      console.log(`[${i + 1}/${files.length}] ${rel}: ${result.downloaded} images${result.failed ? `, ${result.failed} failed` : ''}`);
    }
  }

  console.log(`\nDone. ${totalDownloaded} images downloaded, ${totalFailed} failed, ${totalSkipped} files had no external images.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
