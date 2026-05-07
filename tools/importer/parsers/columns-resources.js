/* eslint-disable */
/* global WebImporter */

/**
 * Parses the resources footer experience fragment into an EDS Columns block.
 * Contains 3 columns: Explore, Learn, Support - each with link lists.
 * @param {Element} element - The .xf-content-height element containing #sage
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  // Find the section title
  const sectionTitle = element.querySelector('#sage h2, .c-section-title h2');

  // Find the 3 building block columns that contain Explore/Learn/Support
  const buildingBlocks = element.querySelectorAll('.buildingblock .c-rich-text-editor div[style]');

  if (buildingBlocks.length < 3) return;

  // Add the heading before the block
  if (sectionTitle) {
    const h2 = document.createElement('h2');
    h2.textContent = sectionTitle.textContent.trim();
    element.parentNode.insertBefore(h2, element);
  }

  // Build column cells - take only the last 3 building blocks (Explore, Learn, Support)
  const columnCells = [];
  const startIdx = buildingBlocks.length - 3;

  for (let i = startIdx; i < buildingBlocks.length; i++) {
    const block = buildingBlocks[i];
    const colContent = document.createElement('div');
    Array.from(block.children).forEach((child) => {
      colContent.appendChild(child.cloneNode(true));
    });
    columnCells.push(colContent);
  }

  const cells = [
    ['Columns'],
    columnCells,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
