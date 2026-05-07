/* eslint-disable */
/* global WebImporter */

/**
 * Parses the HCP (Healthcare Professional) banner into a block.
 * Outputs a "Section Metadata" style heading that identifies this as HCP content.
 * @param {Element} element - The .g-hcpbanner element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const h3 = element.querySelector('h3');
  const text = h3 ? h3.textContent.trim() : 'Information for healthcare professionals';

  const contentCell = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = text;
  contentCell.appendChild(p);

  const cells = [
    ['HCP Banner'],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
