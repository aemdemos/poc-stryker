/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Source: Stryker portfolio category pages (.c-feature-content-context)
 * Structure: 3-column layout with title column + 2 feature item columns.
 * May be empty on some pages - handles gracefully.
 *
 * Target table (from block library):
 *   Row 1: block name
 *   Each subsequent row: [cell1 | cell2 | cell3 ...]
 */
export default function parse(element, { document }) {
  // Check if the section has any meaningful content
  const allText = element.textContent.trim();
  if (!allText) {
    // Section is empty - remove it entirely rather than creating an empty block
    element.remove();
    return;
  }

  const cells = [];

  // Extract the 3-column layout
  const rows = element.querySelectorAll(':scope .row');

  // Find the main content row (the one with feature items, not the empty header/footer rows)
  let contentRow = null;
  for (const row of rows) {
    const cols = row.querySelectorAll(':scope > [class*="col-"]');
    if (cols.length >= 2) {
      contentRow = row;
      break;
    }
  }

  if (!contentRow) {
    // No meaningful column layout found - remove
    element.remove();
    return;
  }

  const columns = contentRow.querySelectorAll(':scope > [class*="col-"]');
  const rowCells = [];

  columns.forEach((col) => {
    const cellContent = document.createElement('div');

    // Extract title/heading
    const title = col.querySelector('.feature-content-context-title h3, h3');
    if (title && title.textContent.trim()) {
      cellContent.append(title);
    }

    // Extract description
    const desc = col.querySelector('.m-c-subheading-description');
    if (desc) {
      const h4 = desc.querySelector('h4');
      const h5 = desc.querySelector('h5');
      if (h4 && h4.textContent.trim()) cellContent.append(h4);
      if (h5 && h5.textContent.trim()) cellContent.append(h5);
    }

    // Extract feature items
    const featureItems = col.querySelectorAll('.feature-content-context-item');
    featureItems.forEach((item) => {
      const img = item.querySelector('img, a > img');
      const link = item.querySelector('a[href]');
      const heading = item.querySelector('h4');
      const subheading = item.querySelector('h5');
      const itemLink = item.querySelector('.feature-content-context-item-lnk a');

      if (img) cellContent.append(img);
      if (heading && heading.textContent.trim()) cellContent.append(heading);
      if (subheading && subheading.textContent.trim()) cellContent.append(subheading);
      if (itemLink && itemLink.textContent.trim()) cellContent.append(itemLink);
    });

    // Only add cell if it has content
    if (cellContent.textContent.trim() || cellContent.querySelector('img')) {
      rowCells.push(cellContent);
    }
  });

  if (rowCells.length > 0) {
    cells.push(rowCells);
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
    element.replaceWith(block);
  } else {
    // No content in any column - remove the element
    element.remove();
  }
}
