/* eslint-disable */
/* global WebImporter */

/**
 * Parses the FAQ panel-group into an EDS Accordion block.
 * Each row has: question (label) | answer (body).
 * @param {Element} element - The .panel-group element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const panels = element.querySelectorAll('[id^="collapse_"]');
  if (panels.length === 0) return;

  const cells = [['Accordion']];

  panels.forEach((panel) => {
    const panelId = panel.id;
    const link = element.querySelector(`a[href="#${panelId}"]`);
    const question = link ? link.textContent.trim() : '';
    const answer = panel.textContent.trim();

    if (question && answer) {
      cells.push([question, answer]);
    }
  });

  if (cells.length <= 1) return;

  // Include the FAQs heading if it exists before the panel-group
  const container = document.createElement('div');
  const prevSibling = element.previousElementSibling;
  if (prevSibling && prevSibling.tagName === 'H3' && prevSibling.textContent.includes('FAQ')) {
    const h3 = document.createElement('h3');
    h3.textContent = prevSibling.textContent.trim();
    container.appendChild(h3);
    prevSibling.remove();
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  container.appendChild(table);
  element.replaceWith(container);
}
