/* eslint-disable */
/* global WebImporter */

/**
 * Parses the two-column overview section into an EDS Columns block.
 * Left column: product description and feature list.
 * Right column: related categories links.
 * @param {Element} element - The .colctrl element inside .cols2
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll('.row > [class*="col-"]');

  if (columns.length < 2) return;

  const leftCol = columns[0];
  const rightCol = columns[1];

  // Build left column content
  const leftContent = document.createElement('div');
  const leftRte = leftCol.querySelector('.c-rich-text-editor div[style]');
  if (leftRte) {
    Array.from(leftRte.children).forEach((child) => {
      leftContent.appendChild(child.cloneNode(true));
    });
  }

  // Build right column content
  const rightContent = document.createElement('div');
  const rightRte = rightCol.querySelector('.c-rich-text-editor div[style]');
  if (rightRte) {
    Array.from(rightRte.children).forEach((child) => {
      rightContent.appendChild(child.cloneNode(true));
    });
  }

  const cells = [
    ['Columns'],
    [leftContent, rightContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
