/* eslint-disable */
/* global WebImporter */

/**
 * Parser for product-filters block.
 * Source: Stryker portfolio pages — .filters-container inside .c-filtered-content-type-grid
 *
 * Extracts each <select> dropdown as a filter row with its display-text options.
 * Option values are JCR tag paths; we capture only the human-readable labels.
 *
 * Target table:
 *   Row 1: block name ("Product Filters")
 *   Row 2: Filter | <label>
 *   Row 3: Options | <comma-separated display texts>
 *   (repeat rows 2-3 for each dropdown)
 */
export default function parse(element, { document }) {
  const selects = element.querySelectorAll('select');
  if (selects.length === 0) return;

  const cells = [];

  selects.forEach((select) => {
    const label = select.id
      || select.closest('[class*="col-"]')?.querySelector('.filter-name')?.textContent?.trim()
      || 'Filter';

    const options = [...select.options]
      .filter((o) => o.value !== 'all' && o.textContent.trim().toLowerCase() !== 'show all')
      .map((o) => o.textContent.trim())
      .filter(Boolean);

    if (options.length > 0) {
      const labelCell = document.createElement('div');
      labelCell.textContent = 'Filter';
      const labelVal = document.createElement('div');
      labelVal.textContent = label;
      cells.push([labelCell, labelVal]);

      const optCell = document.createElement('div');
      optCell.textContent = 'Options';
      const optVal = document.createElement('div');
      optVal.textContent = options.join(', ');
      cells.push([optCell, optVal]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Product Filters',
      cells,
    });
    element.replaceWith(block);
  } else {
    element.remove();
  }
}
