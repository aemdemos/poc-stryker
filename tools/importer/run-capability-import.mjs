/**
 * Fetches Stryker capability hub HTML, runs stryker-capability-portfolio-hub.import.js
 * via @adobe/helix-importer (same contract as Helix Workbench), writes draft HTML + markdown
 * under drafts/ for local preview with: aem up --html-folder drafts --html-mount /
 *
 * Source URLs are read from tools/library-pages.md (section "Helix import — Stryker MedSurg capability hubs").
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { JSDOM } from 'jsdom';
import { Blocks, DOMUtils, FileUtils, html2md } from '@adobe/helix-importer';

import transform from './stryker-capability-portfolio-hub.import.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const DRAFTS_ROOT = join(REPO_ROOT, 'drafts');
const LIBRARY_PAGES = join(REPO_ROOT, 'tools', 'library-pages.md');

/**
 * @param {string} md
 * @returns {string[]}
 */
function loadStrykerCapabilityUrlsFromLibraryPages(md) {
  const re = /https:\/\/www\.stryker\.com\/us\/en\/portfolios\/[^\s)`"<>]+\.html/g;
  const seen = new Set();
  const urls = [];
  for (const m of md.matchAll(re)) {
    const u = m[0];
    if (!seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  }
  return urls;
}

globalThis.WebImporter = { Blocks, DOMUtils, FileUtils };

function buildDraftHtml(title, mainInner) {
  const head = readFileSync(join(REPO_ROOT, 'head.html'), 'utf8');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
${head}
</head>
<body>
<header></header>
<main>
${mainInner}
</main>
<footer></footer>
</body>
</html>
`;
}

async function importOne(pageUrl) {
  const res = await fetch(pageUrl, {
    headers: { 'user-agent': 'poc-stryker-capability-import/1.0' },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${pageUrl}`);
  const html = await res.text();
  const dom = new JSDOM(html, { url: pageUrl });
  const { document } = dom.window;

  const params = { originalURL: pageUrl };
  const out = await html2md(
    pageUrl,
    document,
    transform,
    { setBackgroundImagesFromCSS: false },
    params,
  );

  const relPath = out.path.replace(/^\/+/, '');
  const mdPath = join(DRAFTS_ROOT, `${relPath}.md`);
  const htmlPath = join(DRAFTS_ROOT, `${relPath}.html`);
  mkdirSync(dirname(mdPath), { recursive: true });

  if (out.md) {
    writeFileSync(mdPath, out.md, 'utf8');
  }
  const title = document.querySelector('title')?.textContent?.trim() || relPath;
  const pageHtml = buildDraftHtml(title, out.html || '');
  writeFileSync(htmlPath, pageHtml, 'utf8');

  const fromDrafts = relative(DRAFTS_ROOT, htmlPath).replace(/\\/g, '/').replace(/\.html$/, '');
  return {
    source: pageUrl,
    mdPath: relative(REPO_ROOT, mdPath),
    htmlPath: relative(REPO_ROOT, htmlPath),
    previewPath: `/${fromDrafts}`,
  };
}

async function main() {
  const libraryMd = readFileSync(LIBRARY_PAGES, 'utf8');
  const urls = loadStrykerCapabilityUrlsFromLibraryPages(libraryMd);
  if (urls.length === 0) {
    throw new Error(
      `No Stryker MedSurg capability URLs found in ${relative(REPO_ROOT, LIBRARY_PAGES)}. `
      + 'Add them under the "Paste into https://da.live/apps/import" fenced block.',
    );
  }

  const results = [];
  for (const u of urls) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await importOne(u));
  }
  console.log(JSON.stringify({ ok: true, urlSource: relative(REPO_ROOT, LIBRARY_PAGES), results }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
