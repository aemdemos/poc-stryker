/* eslint-disable */
/* global WebImporter */

/**
 * Converts Scene7 image URLs to DAM paths using og:image or other available sources.
 * Falls back to the Scene7 URL with query params stripped if no DAM path found.
 */
function resolveImageUrl(img, document) {
  const src = img ? img.src : '';
  if (!src) return src;

  // If already a DAM path, use it
  if (src.includes('/content/dam/')) return src;

  // Try to find the DAM equivalent from og:image meta
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && ogImage.content) {
    return ogImage.content;
  }

  // Strip Scene7 query params as fallback
  if (src.includes('media-assets.stryker.com/is/image/')) {
    return src.split('?')[0];
  }

  return src;
}

/**
 * Parses the Stryker product hero carousel into an EDS Hero block.
 * Extracts the product image, heading, subtitle, description, and CTA.
 * @param {Element} element - The .c-autocarousel element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  // Find the product image
  const img = element.querySelector('.c-standalone-image img');

  // Find the overlay content
  const overlay = element.querySelector('.overlayparsys');

  // Extract heading
  const h1 = overlay ? overlay.querySelector('h1') : element.querySelector('h1');

  // Extract subtitle
  const h2 = overlay ? overlay.querySelector('h2') : element.querySelector('h2');

  // Extract description paragraph
  const desc = overlay ? overlay.querySelector('p') : null;

  // Extract CTA link
  const cta = overlay
    ? overlay.querySelector('.curatedcta a, a.btn')
    : element.querySelector('a.btn');

  // Build the block content
  const contentCell = document.createElement('div');

  if (h1) contentCell.appendChild(h1.cloneNode(true));
  if (h2) contentCell.appendChild(h2.cloneNode(true));
  if (desc) contentCell.appendChild(desc.cloneNode(true));
  if (cta) contentCell.appendChild(cta.cloneNode(true));

  const cells = [['Hero']];

  if (img) {
    const imgClone = document.createElement('img');
    imgClone.src = resolveImageUrl(img, document);
    imgClone.alt = img.alt || '';
    cells.push([imgClone, contentCell]);
  } else {
    cells.push([contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
