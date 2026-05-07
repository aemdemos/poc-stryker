/* eslint-disable */
/* global WebImporter */

/**
 * Parses a cols3 section (3-column icon cards) into an EDS Cards block.
 * Each card has an icon image, title, and description.
 * @param {Element} element - The .cols3 element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.col-xs-12[class*="col-sm"], .col-xs-12[class*="col-md"]');
  if (cards.length === 0) return;

  const cells = [['Cards']];

  cards.forEach((card) => {
    const img = card.querySelector('img');
    const paragraphs = card.querySelectorAll('p');
    const title = paragraphs[0] ? paragraphs[0].textContent.trim() : '';
    const description = paragraphs[1] ? paragraphs[1].textContent.trim() : '';

    const contentCell = document.createElement('div');
    if (title) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title;
      p.appendChild(strong);
      contentCell.appendChild(p);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      contentCell.appendChild(p);
    }

    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || title;
      cells.push([imgEl, contentCell]);
    } else {
      cells.push([contentCell]);
    }
  });

  // Include the preceding section title if it exists
  const prevSibling = element.previousElementSibling;
  const sectionHeading = prevSibling ? prevSibling.querySelector('h2') : null;

  const container = document.createElement('div');
  if (sectionHeading) {
    const h2 = document.createElement('h2');
    h2.textContent = sectionHeading.textContent.trim();
    container.appendChild(h2);
    prevSibling.remove();
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  container.appendChild(table);
  element.replaceWith(container);
}
