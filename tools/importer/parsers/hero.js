/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Source: Stryker portfolio category pages (.c-page-hero-content)
 * Structure: H1 title, H2 subtitle, P description, hero image (Dynamic Media)
 *
 * Target table (from block library):
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title (h1) + subheading (h2) + description (p)
 */
export default function parse(element, { document }) {
  // Extract title (H1)
  const title = element.querySelector('h1, .title');

  // Extract subtitle (H2)
  const subtitle = element.querySelector('h2, .subhead');

  // Extract description paragraph
  const description = element.querySelector('p.content, .c-page-hero-content > div > div > p');

  // Extract hero image - preserve Dynamic Media URL
  const heroImg = element.querySelector('picture img, img.img-responsive');

  // If the image has a Dynamic Media URL, ensure we keep the original src
  if (heroImg) {
    const src = heroImg.getAttribute('src') || '';
    // If src is a local path but data-src or original URL exists, restore it
    if (src.startsWith('./images/') || src.startsWith('/images/')) {
      const originalSrc = heroImg.getAttribute('data-original-src') || heroImg.getAttribute('data-src');
      if (originalSrc) {
        heroImg.setAttribute('src', originalSrc);
      }
    }
  }

  // Build cells matching hero block library structure:
  // Row 1 (optional): background image
  // Row 2: text content (title + subtitle + description)
  const cells = [];

  // Row 1: Hero image
  if (heroImg) {
    cells.push([heroImg]);
  }

  // Row 2: Text content - all in a single cell
  const contentContainer = document.createElement('div');
  if (title) contentContainer.append(title);
  if (subtitle) contentContainer.append(subtitle);
  if (description) contentContainer.append(description);
  cells.push([contentContainer]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
