/* eslint-disable */
/* global WebImporter */

/**
 * Parses the sticky navigation bar (Overview/Connect/Resources) into a block.
 * @param {Element} element - The .c-navigation-bar element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const anchors = element.querySelectorAll('a.anchor[data-linking]');
  const items = [];

  anchors.forEach((anchor) => {
    const text = anchor.textContent.trim();
    const linking = anchor.getAttribute('data-linking');
    if (text && !anchor.classList.contains('mobile-only-nav')) {
      items.push({ text, linking });
    }
  });

  if (items.length === 0) return;

  const contentCell = document.createElement('div');
  items.forEach((item) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = `#${item.linking}`;
    a.textContent = item.text;
    p.appendChild(a);
    contentCell.appendChild(p);
  });

  const cells = [
    ['Sticky Nav'],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
