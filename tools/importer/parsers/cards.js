/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards variant.
 *
 * Produces the standard EDS cards block structure:
 *   Row 0: ['Cards'] (block header)
 *   Row N: [picture-element, body-element]
 *
 * The cards.js decorate function calls createCard(row) for each row.
 * createCard expects row children to be:
 *   - A div with a single <picture> child → gets class "cards-card-image"
 *   - A div with other content → gets class "cards-card-body"
 *
 * So each card row must have exactly 2 cells:
 *   Cell 1: A <picture> wrapping the card image
 *   Cell 2: A container with title (strong/p), description (p), and link (p>a)
 */
export default function parse(element, { document }) {
  const cells = [];

  let cardItems = [];

  if (element.classList.contains('cols3')) {
    cardItems = [...element.querySelectorAll('[class*="col-md-4"], [class*="col-sm-6"]')];
    const seen = new Set();
    cardItems = cardItems.filter((el) => {
      if (seen.has(el)) return false;
      seen.add(el);
      return true;
    });
  } else if (element.classList.contains('buildingblock')) {
    cardItems = [element];
  } else {
    cardItems = [...element.querySelectorAll('.buildingblock')];
    if (cardItems.length === 0) cardItems = [element];
  }

  cardItems.forEach((card) => {
    const img = card.querySelector('.c-standalone-image img, .standaloneimage img, img');

    const bodyDiv = document.createElement('div');

    const richText = card.querySelector('.c-rich-text-editor');
    if (richText) {
      const paragraphs = [...richText.querySelectorAll('p')];
      paragraphs.forEach((p) => {
        const titleSpan = p.querySelector('.fontsize-1-5em, .fontsize-1-25em');
        if (titleSpan) {
          const titleP = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = titleSpan.textContent.trim();
          titleP.appendChild(strong);
          bodyDiv.appendChild(titleP);
        } else {
          const link = p.querySelector('a[href]');
          if (link) {
            const linkP = document.createElement('p');
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.textContent.trim();
            linkP.appendChild(a);
            bodyDiv.appendChild(linkP);
          } else {
            const text = p.textContent.trim();
            if (text) {
              const descP = document.createElement('p');
              descP.textContent = text;
              bodyDiv.appendChild(descP);
            }
          }
        }
      });
    }

    const ctaLink = card.querySelector('.c-curatedcta a, .curatedcta a');
    if (ctaLink && !bodyDiv.querySelector('a')) {
      const linkP = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      linkP.appendChild(a);
      bodyDiv.appendChild(linkP);
    }

    if (img || bodyDiv.children.length > 0) {
      const imgCell = document.createElement('div');
      if (img) {
        const picture = document.createElement('picture');
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = img.alt || '';
        picture.appendChild(imgEl);
        imgCell.appendChild(picture);
      }
      cells.push([imgCell, bodyDiv]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
