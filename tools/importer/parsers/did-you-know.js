/* eslint-disable */
/* global WebImporter */

/**
 * Parses the "Did you know?" experience fragment into a Columns block.
 * Left: image. Right: heading, stats, bullets, CTA.
 * @param {Element} element - The .experiencefragment containing "Did you know"
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const xfContent = element.querySelector('.xf-content-height');
  if (!xfContent) return;

  // Get image from the left building block (3-col grid)
  const img = xfContent.querySelector('img');

  // Get the right-side content
  const rightBlock = xfContent.querySelector('.aem-GridColumn--default--9, [class*="GridColumn--default--9"]');
  if (!rightBlock) return;

  // Build right column content
  const rightContent = document.createElement('div');

  // Heading "Did you know?"
  const h2 = rightBlock.querySelector('h2');
  if (h2) {
    const heading = document.createElement('h2');
    heading.textContent = h2.textContent.trim();
    rightContent.appendChild(heading);
  }

  // Stats - look for large font paragraphs
  const statContainers = rightBlock.querySelectorAll('.buildingblock .c-rich-text-editor div[style]');
  statContainers.forEach((container) => {
    const statNumber = container.querySelector('.fontsize-3em, .fontsize-2-5em, .futura-bold');
    const statDesc = container.querySelectorAll('p');
    if (statNumber && statDesc.length > 1) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = statNumber.textContent.trim();
      p.appendChild(strong);
      p.appendChild(document.createTextNode(` — ${statDesc[statDesc.length - 1].textContent.trim()}`));
      rightContent.appendChild(p);
    }
  });

  // Bullet list
  const list = rightBlock.querySelector('ul');
  if (list) {
    rightContent.appendChild(list.cloneNode(true));
  }

  // Description paragraph and CTA
  const rteContainers = rightBlock.querySelectorAll('.c-rich-text-editor div[style]');
  rteContainers.forEach((rte) => {
    const paragraphs = rte.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const link = p.querySelector('a');
      if (link && link.textContent.includes('Learn more')) {
        const ctaP = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        ctaP.appendChild(a);
        rightContent.appendChild(ctaP);
      } else if (p.textContent.trim().length > 50 && !p.querySelector('.futura-bold')) {
        const descP = document.createElement('p');
        descP.textContent = p.textContent.trim();
        rightContent.appendChild(descP);
      }
    });
  });

  // Build Columns block with image on left, content on right
  const leftContent = document.createElement('div');
  if (img) {
    const imgEl = document.createElement('img');
    const src = (img.src || '').split('?')[0];
    imgEl.src = src.includes('media-assets.stryker.com') ? src.replace('media-assets.stryker.com', 'www.stryker.com') : src;
    imgEl.alt = img.alt || '';
    leftContent.appendChild(imgEl);
  }

  const cells = [
    ['Columns'],
    [leftContent, rightContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
