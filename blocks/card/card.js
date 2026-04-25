import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Builds a single card (li) from a block row: moves content into the li and applies
 * cards-card-image / cards-card-body classes to its children.
 * @param {Element} row - A direct child of the cards block (author row)
 * @returns {Element} The card li element
 */
/* eslint-disable import/prefer-default-export */
export function createCard(row) {
  const li = document.createElement('li');
  moveInstrumentation(row, li);
  while (row.firstElementChild) li.append(row.firstElementChild);
  [...li.children].forEach((div) => {
    if (div.children.length === 1 && div.querySelector('picture')) {
      div.className = 'cards-card-image';
    } else if (div.textContent.includes(':') && !div.querySelector('h1,h2,h3,h4,h5,h6,a,picture')) {
      const text = div.textContent.trim();
      const tags = {};
      text.split('\n').forEach((line) => {
        const l = line.trim();
        const idx = l.indexOf(':');
        if (idx > 0) {
          const key = l.substring(0, idx).trim();
          const vals = l.substring(idx + 1).split(',').map((v) => v.trim()).filter(Boolean);
          if (vals.length) tags[key] = vals;
        }
      });
      if (Object.keys(tags).length) {
        li.dataset.tags = JSON.stringify(tags);
        div.remove();
      } else {
        div.className = 'cards-card-body';
      }
    } else {
      div.className = 'cards-card-body';
    }
  });
  return li;
}
