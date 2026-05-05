/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table variant.
 * Base block: table
 * Source: https://www.stryker.com/us/en/joint-replacement/procedures/dart-direct-anterior-reconstructive-technology.html
 * Selector: .cols2_1-3_2-3 .c-table table
 * Generated: 2026-04-27
 *
 * Extracts a comparison table from the source DOM. The source table has:
 * - Row 1: single-cell title/header ("Surgical Considerations")
 * - Row 2: column headers (bold text)
 * - Rows 3+: data rows with 2 cells each
 *
 * The EDS Table block treats the first row of cells as thead.
 * All rows are preserved as-is to maintain the full table structure.
 */
export default function parse(element, { document }) {
  // element is the <table> element per the selector: .cols2_1-3_2-3 .c-table table
  const rows = element.querySelectorAll(':scope tbody tr, :scope tr');
  const cells = [];

  rows.forEach((row) => {
    const tds = row.querySelectorAll(':scope > td, :scope > th');
    const rowCells = [];
    tds.forEach((td) => {
      // Clone the cell content to preserve bold tags and text
      const cellContent = document.createDocumentFragment();
      Array.from(td.childNodes).forEach((node) => {
        cellContent.appendChild(node.cloneNode(true));
      });
      // Create a wrapper div to hold the cell content
      const wrapper = document.createElement('div');
      wrapper.appendChild(cellContent);
      rowCells.push(wrapper);
    });
    if (rowCells.length > 0) {
      cells.push(rowCells);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table', cells });
  element.replaceWith(block);
}
