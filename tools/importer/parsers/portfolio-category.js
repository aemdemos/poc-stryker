/* eslint-disable */
/* global WebImporter */

/**
 * Consolidated parser for Stryker portfolio category pages.
 * Handles all block types: hero, cards (highlight + product), product-filters, and columns.
 *
 * Dispatches based on the block name passed to the parse function.
 */

// ── Hero ──────────────────────────────────────────────────────────────────────
function parseHero(element, { document }) {
  const title = element.querySelector('h1, .title');
  const subtitle = element.querySelector('h2, .subhead');
  const description = element.querySelector('p.content, .c-page-hero-content > div > div > p');
  const heroImg = element.querySelector('picture img, img.img-responsive');

  if (heroImg) {
    const src = heroImg.getAttribute('src') || '';
    if (src.startsWith('./images/') || src.startsWith('/images/')) {
      const originalSrc = heroImg.getAttribute('data-original-src') || heroImg.getAttribute('data-src');
      if (originalSrc) heroImg.setAttribute('src', originalSrc);
    }
  }

  const cells = [];

  const contentContainer = document.createElement('div');
  if (title) contentContainer.append(title);
  if (subtitle) contentContainer.append(subtitle);
  if (description) contentContainer.append(description);
  cells.push([contentContainer]);

  if (heroImg) cells.push([heroImg]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}

// ── Cards (highlight + product) ───────────────────────────────────────────────
function parseCards(element, { document }) {
  const cells = [];
  const isHighLevelCta = !!element.closest('.c-high-level-cta') || !!element.querySelector('.c-high-level-cta-container');
  const isProductGrid = !!element.closest('.c-filtered-content-type-grid') || !!element.querySelector('.product-item');

  if (isHighLevelCta) {
    element.querySelectorAll('.c-high-level-cta-container').forEach((item) => {
      const link = item.querySelector('a.c-high-level-cta-link, a[href]');
      const label = item.querySelector('.c-high-level-cta-label, a.c-high-level-cta-label');
      const href = link ? link.getAttribute('href') : '';
      const labelText = label ? label.textContent.trim() : '';

      let img = item.querySelector('img');
      if (!img && link) {
        const style = link.getAttribute('style') || '';
        const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/i);
        if (bgMatch) {
          let imgUrl = bgMatch[1].replace(/\\2f/gi, '/').replace(/\\27/gi, "'").replace(/\\22/gi, '"');
          img = document.createElement('img');
          img.setAttribute('src', imgUrl);
          img.setAttribute('alt', labelText);
        }
      }

      const textCell = document.createElement('div');
      if (labelText) {
        const heading = document.createElement('h4');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = labelText;
        heading.append(a);
        textCell.append(heading);
      }

      if (img) cells.push([img, textCell]);
      else cells.push([textCell]);
    });
  } else if (isProductGrid) {
    element.querySelectorAll('.product-item').forEach((item) => {
      const link = item.querySelector(':scope > a[href]');
      const img = item.querySelector('.img-container img, img.img-responsive');
      const nameEl = item.querySelector('h4.component-subheading, h4');
      const href = link ? link.getAttribute('href') : '';
      const productName = nameEl ? nameEl.textContent.trim() : '';
      const imgAlt = img ? (img.getAttribute('alt') || productName) : productName;

      if (img) {
        const src = img.getAttribute('src') || '';
        if (src.startsWith('./images/') || src.startsWith('/images/')) {
          const originalSrc = img.getAttribute('data-original-src') || img.getAttribute('data-src');
          if (originalSrc) img.setAttribute('src', originalSrc);
        }
        if (!img.getAttribute('alt')) img.setAttribute('alt', imgAlt);
      }

      const textCell = document.createElement('div');
      if (productName) {
        const heading = document.createElement('h4');
        if (href) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.textContent = productName;
          heading.append(a);
        } else {
          heading.textContent = productName;
        }
        textCell.append(heading);
      }

      const flagEl = item.querySelector('.display-product-flag');
      if (flagEl && flagEl.textContent.trim()) {
        const flagP = document.createElement('p');
        flagP.textContent = flagEl.textContent.trim();
        textCell.append(flagP);
      }

      if (img) cells.push([img, textCell]);
      else cells.push([textCell]);
    });
  }

  if (cells.length > 0) {
    const variantName = isHighLevelCta ? 'Cards (highlight)' : 'Cards (product)';
    const block = WebImporter.Blocks.createBlock(document, { name: variantName, cells });
    element.replaceWith(block);
  }
}

// ── Product Filters (filter definitions + JCR tag paths) ──
function parseProductFilters(element, { document }) {
  const cells = [];

  const gridRoot = element.closest('.c-filtered-content-type-grid') || element.parentElement;
  const selects = gridRoot ? gridRoot.querySelectorAll('.filters-container select') : element.querySelectorAll('select');

  selects.forEach((select) => {
    const label = select.id
      || select.closest('[class*="col-"]')?.querySelector('.filter-name')?.textContent?.trim()
      || 'Filter';

    const options = [...select.options]
      .filter((o) => o.value !== 'all' && o.textContent.trim().toLowerCase() !== 'show all');

    const displayOptions = options.map((o) => o.textContent.trim()).filter(Boolean);
    const tagPaths = options.map((o) => o.value).filter(Boolean);

    if (displayOptions.length > 0) {
      const filterKey = document.createElement('div');
      filterKey.textContent = 'Filter';
      const filterVal = document.createElement('div');
      filterVal.textContent = `${label}: ${displayOptions.join(', ')}`;
      cells.push([filterKey, filterVal]);

      const pathKey = document.createElement('div');
      pathKey.textContent = 'Filter tag paths';
      const pathVal = document.createElement('div');
      pathVal.textContent = `${label}: ${tagPaths.join(', ')}`;
      cells.push([pathKey, pathVal]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Product Filters', cells });
    element.before(block);
  }
}

// ── Columns (featured content) ────────────────────────────────────────────────
function parseColumns(element, { document }) {
  const allText = element.textContent.trim();
  if (!allText) {
    element.remove();
    return;
  }

  const rows = element.querySelectorAll(':scope .row');
  let contentRow = null;
  for (const row of rows) {
    const cols = row.querySelectorAll(':scope > [class*="col-"]');
    if (cols.length >= 2) {
      contentRow = row;
      break;
    }
  }

  if (!contentRow) {
    element.remove();
    return;
  }

  const columns = contentRow.querySelectorAll(':scope > [class*="col-"]');
  const rowCells = [];

  columns.forEach((col) => {
    const cellContent = document.createElement('div');

    const title = col.querySelector('.feature-content-context-title h3, h3');
    if (title && title.textContent.trim()) cellContent.append(title);

    const desc = col.querySelector('.m-c-subheading-description');
    if (desc) {
      const h4 = desc.querySelector('h4');
      const h5 = desc.querySelector('h5');
      if (h4 && h4.textContent.trim()) cellContent.append(h4);
      if (h5 && h5.textContent.trim()) cellContent.append(h5);
    }

    col.querySelectorAll('.feature-content-context-item').forEach((item) => {
      const img = item.querySelector('img, a > img');
      const heading = item.querySelector('h4');
      const subheading = item.querySelector('h5');
      const itemLink = item.querySelector('.feature-content-context-item-lnk a');

      if (img) cellContent.append(img);
      if (heading && heading.textContent.trim()) cellContent.append(heading);
      if (subheading && subheading.textContent.trim()) cellContent.append(subheading);
      if (itemLink && itemLink.textContent.trim()) cellContent.append(itemLink);
    });

    if (cellContent.textContent.trim() || cellContent.querySelector('img')) {
      rowCells.push(cellContent);
    }
  });

  if (rowCells.length > 0) {
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
    element.replaceWith(block);
  } else {
    element.remove();
  }
}

// ── Dispatch ──────────────────────────────────────────────────────────────────
const PARSERS = {
  'hero': parseHero,
  'product-filters': parseProductFilters,
  'cards': parseCards,
  'columns': parseColumns,
};

export default function parse(blockName, element, context) {
  const fn = PARSERS[blockName];
  if (fn) fn(element, context);
}
