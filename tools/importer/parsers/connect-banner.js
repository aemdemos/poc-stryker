/* eslint-disable */
/* global WebImporter */

/**
 * Parses the connect banner (gold background heading) into a Banner block.
 * @param {Element} element - The .cols > .colctrl with .bg-gold content
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const rte = element.querySelector('.has-background');
  if (!rte) return;

  const contentCell = document.createElement('div');
  Array.from(rte.children).forEach((child) => {
    contentCell.appendChild(child.cloneNode(true));
  });

  // Determine background style from class
  let style = '';
  if (rte.classList.contains('bg-gold')) style = 'gold';
  else if (rte.classList.contains('bg-black')) style = 'dark';

  const blockName = style ? `Banner (${style})` : 'Banner';

  const cells = [
    [blockName],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
