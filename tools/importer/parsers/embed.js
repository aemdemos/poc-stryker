/* eslint-disable */
/* global WebImporter */

/**
 * Embed parser for Dynamic Media video links.
 * Matches <a> tags pointing to media-assets.stryker.com/is/content/stryker/
 * created by the cleanup transformer from Scene7 .interactivemedia containers.
 *
 * Block library structure (Embed video):
 *   Row 1: Block name "Embed (video)"
 *   Row 2: Video URL link
 */
export default function parse(element, { document }) {
  const href = element.getAttribute('href') || '';
  if (!href.includes('media-assets.stryker.com/is/content/stryker/')) return;

  const link = document.createElement('a');
  link.href = href;
  link.textContent = href;

  const cells = [[link]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
