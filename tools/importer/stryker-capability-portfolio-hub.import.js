/**
 * Helix Importer transformation for Stryker AEM "capability" MedSurg portfolio hub pages.
 * Targets pages like:
 * - /us/en/portfolios/medical-surgical-equipment/bedframes.html
 * - /us/en/portfolios/medical-surgical-equipment/emergency-data-solutions.html
 *
 * Workbench: serve this file over HTTP and set "Transformation file URL"
 * (e.g. http://localhost:3001/tools/importer/stryker-capability-portfolio-hub.import.js).
 *
 * Globals: WebImporter, document (provided by Helix Importer UI).
 */

/* global WebImporter */

const BASE_URL = 'https://www.stryker.com';

/**
 * @param {string} style
 * @returns {string|null}
 */
function parseBackgroundImageUrl(style) {
  if (!style) return null;
  const m = style.match(/url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  if (!m) return null;
  let u = m[1].trim();
  u = u.replace(/\\2f/gi, '/').replace(/\\/g, '');
  if (u.startsWith('//')) return `https:${u}`;
  if (u.startsWith('http')) return u;
  return null;
}

/**
 * @param {string} href
 * @returns {string}
 */
function absolutizeHref(href) {
  if (!href) return '';
  try {
    return new URL(href, BASE_URL).href;
  } catch {
    return href;
  }
}

/**
 * Assigns stable block labels; repeats of the same base+discriminator get -2, -3, …
 */
function createVariantTracker() {
  const counts = new Map();
  return {
    /**
     * @param {string} base
     * @param {string} discriminator
     */
    label(base, discriminator) {
      const key = `${base}::${discriminator}`;
      const n = (counts.get(key) || 0) + 1;
      counts.set(key, n);
      if (n === 1) return `${base} (${discriminator})`;
      return `${base} (${discriminator}-${n})`;
    },
  };
}

/**
 * @param {Document} document
 * @param {URL} url
 */
function shouldTransform(document, url) {
  const body = document.body;
  if (!body) return false;
  const isCapability = body.dataset?.template === 'capability' || body.classList.contains('capability');
  if (!isCapability) return false;
  const p = url.pathname || '';
  return p.includes('/portfolios/');
}

/**
 * @param {Element} root
 */
function stripNoiseFromSubtree(root) {
  root.querySelectorAll('.no-results').forEach((n) => n.remove());
  root.querySelectorAll('script').forEach((n) => n.remove());
}

/**
 * @param {Element} section
 */
function isFeatureSectionMeaningful(section) {
  const items = section.querySelectorAll('.feature-content-context-item');
  for (const item of items) {
    const img = item.querySelector('img');
    const text = (item.textContent || '').replace(/\s+/g, ' ').trim();
    if (img?.getAttribute('src') || text.length > 0) return true;
  }
  const headings = section.querySelectorAll('h2, h3, h4, h5');
  for (const h of headings) {
    if ((h.textContent || '').trim()) return true;
  }
  return false;
}

/**
 * @param {Element} gridRoot
 * @returns {string}
 */
function gridStructuralDiscriminator(gridRoot) {
  const hasFilters = Boolean(gridRoot.querySelector('.filters-container select'));
  return hasFilters ? 'with-filters' : 'no-filters';
}

/**
 * @param {Element} gridRoot
 * @returns {string|null}
 */
function gridSectionTitleSlug(gridRoot) {
  const titleEl = gridRoot.querySelector('.c-section-title h2, .c-section-title [data-title]');
  const fromData = gridRoot.querySelector('.c-section-title[data-title]')?.getAttribute('data-title');
  const text = (titleEl?.textContent || fromData || '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * @param {Document} document
 * @param {Element} heroRoot
 * @param {ReturnType<typeof createVariantTracker>} variants
 */
function buildHeroBlock(document, heroRoot, variants) {
  const rightCol = heroRoot.querySelector('.c-page-hero-content .row .col-sm-6:last-of-type');
  const picture = heroRoot.querySelector('picture');
  const img = heroRoot.querySelector('img.img-responsive');
  const hasMedia = Boolean(picture || (img && rightCol?.contains(img)));

  const h1 = heroRoot.querySelector('h1.title');
  const h2 = heroRoot.querySelector('h2.subhead');
  const paras = [...heroRoot.querySelectorAll('p.content')];

  const disc = hasMedia ? 'with-media' : 'text-only';
  const blockName = variants.label('Stryker Capability Hero', disc);

  const rows = [[blockName]];
  if (h1) rows.push([h1.cloneNode(true)]);
  if (h2 && (h2.textContent || '').trim()) rows.push([h2.cloneNode(true)]);
  paras.forEach((p) => {
    if ((p.textContent || '').trim()) rows.push([p.cloneNode(true)]);
  });
  if (picture) {
    rows.push([picture.cloneNode(true)]);
  } else if (hasMedia && img) {
    rows.push([img.cloneNode(true)]);
  }

  return WebImporter.DOMUtils.createTable(rows, document);
}

/**
 * @param {Document} document
 * @param {Element} ctaRoot
 * @param {ReturnType<typeof createVariantTracker>} variants
 * @param {number} sectionIndex
 */
function buildCtaBlock(document, ctaRoot, variants, sectionIndex) {
  const disc = sectionIndex === 0 ? 'default' : `section-${sectionIndex + 1}`;
  const blockName = variants.label('Stryker Capability Ctas', disc);

  const rows = [[blockName]];
  const containers = [...ctaRoot.querySelectorAll('.c-high-level-cta-container')];

  containers.forEach((box) => {
    const bgLink = box.querySelector('a.c-high-level-cta-link');
    const textLink = box.querySelector('a.c-high-level-cta-label');
    const style = bgLink?.getAttribute('style') || '';
    const bgUrl = parseBackgroundImageUrl(style);

    const cell = document.createElement('div');
    if (bgUrl) {
      const im = document.createElement('img');
      im.src = bgUrl;
      const alt = textLink?.textContent?.trim() || bgLink?.getAttribute('title') || '';
      im.alt = alt;
      cell.appendChild(im);
    }
    if (textLink) {
      const a = textLink.cloneNode(true);
      a.href = absolutizeHref(a.getAttribute('href') || '');
      cell.appendChild(a);
    } else if (bgLink) {
      const a = document.createElement('a');
      a.href = absolutizeHref(bgLink.getAttribute('href') || '');
      a.textContent = bgLink.getAttribute('title') || '';
      cell.appendChild(a);
    }
    rows.push([cell]);
  });

  return WebImporter.DOMUtils.createTable(rows, document);
}

/**
 * @param {Document} document
 * @param {Element} gridRoot
 * @param {ReturnType<typeof createVariantTracker>} variants
 */
function buildProductGridBlock(document, gridRoot, variants) {
  const struct = gridStructuralDiscriminator(gridRoot);
  const slug = gridSectionTitleSlug(gridRoot);
  const discriminator = slug ? `${struct}-${slug}` : struct;
  const blockName = variants.label('Stryker Capability Product Grid', discriminator);

  const rows = [[blockName]];

  const h2 = gridRoot.querySelector('.c-section-title h2');
  if (h2 && (h2.textContent || '').trim()) {
    rows.push([h2.cloneNode(true)]);
  }

  const selects = [...gridRoot.querySelectorAll('.filters-container select')];
  selects.forEach((sel) => {
    const label = sel.id || sel.getAttribute('aria-label') || 'Filter';
    const opts = [...sel.querySelectorAll('option')].map((o) => o.textContent.trim()).filter(Boolean);
    if (opts.length) {
      const p = document.createElement('p');
      p.textContent = `${label}: ${opts.join(', ')}`;
      rows.push([p]);
    }
  });

  const items = [...gridRoot.querySelectorAll('.products-container .product-item')];
  items.forEach((item) => {
    const a = item.querySelector('a[href]');
    if (!a) return;
    const link = a.cloneNode(true);
    link.href = absolutizeHref(link.getAttribute('href') || '');
    const path = item.getAttribute('data-pagepath');
    if (path) {
      link.setAttribute('data-stryker-pagepath', path);
    }
    link.querySelectorAll('img').forEach((img) => {
      const el = img;
      if (!el.src) el.src = absolutizeHref(el.getAttribute('src') || '');
    });
    rows.push([link]);
  });

  return WebImporter.DOMUtils.createTable(rows, document);
}

/**
 * @param {Document} document
 * @param {Element} featureRoot
 * @param {ReturnType<typeof createVariantTracker>} variants
 * @param {number} index
 */
function buildFeatureBlock(document, featureRoot, variants, index) {
  const heading = featureRoot.querySelector('h2, h3, h4');
  const slug = (heading?.textContent || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `band-${index + 1}`;
  const blockName = variants.label('Stryker Capability Feature', slug);
  const rows = [[blockName], [featureRoot.cloneNode(true)]];
  return WebImporter.DOMUtils.createTable(rows, document);
}

/**
 * @param {Document} document
 * @param {URL} pageUrl
 */
function buildMetadataBlock(document, pageUrl) {
  const meta = {};
  const title = document.querySelector('title');
  if (title) meta.Title = title.textContent.replace(/[\n\t]/g, ' ').trim();

  const desc = document.querySelector('meta[property="og:description"]');
  if (desc?.content) meta.Description = desc.content;

  const og = document.querySelector('meta[property="og:image"]');
  if (og?.content) {
    const el = document.createElement('img');
    el.src = og.content;
    meta.Image = el;
  }

  const body = document.body;
  if (body) {
    meta.Template = 'capability';
    if (body.dataset.hierarchy) meta['Stryker hierarchy'] = body.dataset.hierarchy;
    if (body.dataset.capability) meta['Stryker capability'] = body.dataset.capability;
  }

  const published = document.querySelector('#hiddenPublishedDate');
  if (published?.value) meta.Published = published.value;

  meta['Source URL'] = pageUrl.href;

  return WebImporter.Blocks.getMetadataBlock(document, meta);
}

/**
 * @param {Document} document
 * @param {Element} sourceMain
 * @param {URL} pageUrl
 */
function transformCapabilityMain(document, sourceMain, pageUrl) {
  const clone = sourceMain.cloneNode(true);
  stripNoiseFromSubtree(clone);

  const out = document.createElement('div');
  const variants = createVariantTracker();

  const row = clone.querySelector('.main.content.row');
  const sequence = row
    ? [...row.children]
    : [...clone.querySelectorAll('.c-page-hero, .c-high-level-cta, .c-filtered-content-type-grid, .c-feature-content-context')];

  let ctaSectionIndex = 0;
  let featureIndex = 0;
  let firstBlock = true;

  const appendSectionBreak = () => {
    out.appendChild(document.createElement('hr'));
  };

  sequence.forEach((wrapper) => {
    const comp = wrapper.classList?.contains('c-page-hero')
      || wrapper.classList?.contains('c-high-level-cta')
      || wrapper.classList?.contains('c-filtered-content-type-grid')
      || wrapper.classList?.contains('c-feature-content-context')
      ? wrapper
      : wrapper.firstElementChild;
    if (!comp || !comp.classList) return;

    if (comp.classList.contains('c-page-hero')) {
      if (!firstBlock) appendSectionBreak();
      out.appendChild(buildHeroBlock(document, comp, variants));
      firstBlock = false;
      return;
    }

    if (comp.classList.contains('c-high-level-cta')) {
      if (!firstBlock) appendSectionBreak();
      out.appendChild(buildCtaBlock(document, comp, variants, ctaSectionIndex));
      ctaSectionIndex += 1;
      firstBlock = false;
      return;
    }

    if (comp.classList.contains('c-filtered-content-type-grid')) {
      if (!firstBlock) appendSectionBreak();
      out.appendChild(buildProductGridBlock(document, comp, variants));
      firstBlock = false;
      return;
    }

    if (comp.classList.contains('c-feature-content-context')) {
      if (!isFeatureSectionMeaningful(comp)) return;
      if (!firstBlock) appendSectionBreak();
      out.appendChild(buildFeatureBlock(document, comp, variants, featureIndex));
      featureIndex += 1;
      firstBlock = false;
    }
  });

  if (out.childNodes.length > 0) {
    appendSectionBreak();
  }
  out.appendChild(buildMetadataBlock(document, pageUrl));

  return out;
}

export default {
  /**
   * @param {{ document: Document, url: string, html: string, params: Record<string, unknown> }} opts
   * @returns {Element}
   */
  transformDOM: (opts) => {
    const { document, url: urlStr } = opts;
    let url;
    try {
      url = new URL(String(urlStr));
    } catch {
      const sourceMain = document.querySelector('div.container-fluid[role="main"]')
        || document.querySelector('[role="main"]');
      return sourceMain || document.body;
    }

    const sourceMain = document.querySelector('div.container-fluid[role="main"]')
      || document.querySelector('[role="main"]');

    if (!sourceMain || !shouldTransform(document, url)) {
      return sourceMain || document.body;
    }

    return transformCapabilityMain(document, sourceMain, url);
  },

  /**
   * @param {{ document: Document, url: string, html: string, params: Record<string, unknown> }} opts
   * @returns {string}
   */
  generateDocumentPath: (opts) => {
    const { url: urlStr, params } = opts;
    let path = new URL(String(params?.originalURL || urlStr)).pathname;
    if (path.endsWith('/')) path = path.slice(0, -1);
    if (path.endsWith('.html')) path = path.slice(0, -5);
    return WebImporter.FileUtils.sanitizePath(path.toLowerCase().replace(/\/index$/, '/'));
  },
};
