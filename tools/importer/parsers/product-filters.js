/* eslint-disable */
/* global WebImporter */

/**
 * Parser for product-filters block.
 * Source: Stryker portfolio pages — .c-filtered-content-type-grid
 *
 * Captures a complete proof-of-concept table of all product index data
 * with source attribution showing where each value was extracted from:
 * - Page taxonomy from <body> data attributes
 * - Filter definitions from <select> dropdowns in .filters-container
 * - Product index: name, page path, and resolved filter tags per .product-item
 *
 * Works universally across capability and specialty template pages,
 * with or without filter dropdowns present.
 */
export default function parse(element, { document }) {
  const cells = [];

  const addRow = (key, value, source) => {
    const keyCell = document.createElement('div');
    keyCell.textContent = key;
    const valCell = document.createElement('div');
    valCell.textContent = value;
    const srcCell = document.createElement('div');
    srcCell.textContent = source;
    cells.push([keyCell, valCell, srcCell]);
  };

  // --- Page Taxonomy (from <body> data attributes) ---
  const body = document.body || document.querySelector('body');
  const taxonomyAttrs = [
    ['template', 'data-template'],
    ['hierarchy', 'data-hierarchy'],
    ['portfolio', 'data-portfolio'],
    ['capability', 'data-capability'],
    ['contentType', 'data-content-type'],
    ['specialty', 'data-specialty'],
  ];

  taxonomyAttrs.forEach(([label, attr]) => {
    const value = body?.getAttribute(attr) || '';
    if (value) {
      addRow(`Page ${label}`, value, `<body ${attr}>`);
    }
  });

  // --- Filter Definitions ---
  const gridRoot = element.closest('.c-filtered-content-type-grid') || element.parentElement;
  const selects = gridRoot ? gridRoot.querySelectorAll('.filters-container select') : element.querySelectorAll('select');
  const tagLabelMap = new Map();
  const filterLabels = new Map();

  selects.forEach((select) => {
    const label = select.id
      || select.closest('[class*="col-"]')?.querySelector('.filter-name')?.textContent?.trim()
      || 'Filter';

    const options = [...select.options]
      .filter((o) => o.value !== 'all' && o.textContent.trim().toLowerCase() !== 'show all');

    const displayOptions = options.map((o) => o.textContent.trim()).filter(Boolean);
    const tagPaths = options.map((o) => o.value).filter(Boolean);

    options.forEach((o) => {
      if (o.value && o.value !== 'all') {
        tagLabelMap.set(o.value, o.textContent.trim());
        filterLabels.set(o.value, label);
      }
    });

    if (displayOptions.length > 0) {
      addRow(
        `Filter: ${label}`,
        displayOptions.join(', '),
        `.filters-container select#${select.id || '(unnamed)'}`,
      );
      addRow(
        `Filter tag paths: ${label}`,
        tagPaths.join(', '),
        `<option value="..."> (JCR tag paths)`,
      );
    }
  });

  // --- Product Index ---
  const productItems = gridRoot
    ? gridRoot.querySelectorAll('.product-item')
    : element.querySelectorAll('.product-item');

  productItems.forEach((item) => {
    const name = item.querySelector('h4')?.textContent?.trim() || '';
    const pagePath = item.getAttribute('data-pagepath') || '';
    const rawTags = item.getAttribute('data-tags') || '';

    // Resolve tags to human-readable filter labels
    const resolvedTags = [];
    if (rawTags && tagLabelMap.size > 0) {
      const tagPaths = rawTags.split(',').map((t) => t.trim());
      const grouped = new Map();
      tagPaths.forEach((tp) => {
        const lbl = tagLabelMap.get(tp);
        const fName = filterLabels.get(tp);
        if (lbl && fName) {
          if (!grouped.has(fName)) grouped.set(fName, []);
          grouped.get(fName).push(lbl);
        }
      });
      grouped.forEach((values, fName) => {
        resolvedTags.push(`${fName}: ${values.join(', ')}`);
      });
    }

    const parts = [name];
    if (pagePath) parts.push(pagePath);
    if (resolvedTags.length) parts.push(resolvedTags.join(' | '));

    const sources = ['.product-item h4'];
    if (pagePath) sources.push('.product-item[data-pagepath]');
    if (resolvedTags.length) sources.push('.product-item[data-tags] → resolved via filter <option> values');

    addRow('Product', parts.join(' :: '), sources.join(', '));
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Product Filters',
      cells,
    });
    element.before(block);
  }
}
