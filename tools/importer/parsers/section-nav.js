/* eslint-disable */
/* global WebImporter */

/**
 * Parser for section-nav
 * Base block: section-nav
 * Source: https://www.stryker.com/us/en/joint-replacement/procedures/dart-direct-anterior-reconstructive-technology.html
 * Generated: 2026-04-27
 *
 * Extracts sticky section navigation anchors from .c-navigation-bar.
 * Source structure: .c-navigation-bar > .bar-nav > .nav-wrap > nav.container > a.anchor > span > em
 * Target: One row per anchor link with [label](#section-id) format.
 */
export default function parse(element, { document }) {
  // Extract all anchor elements from the navigation bar
  const navAnchors = element.querySelectorAll('nav.container a.anchor, .nav-wrap a.anchor, .bar-nav a.anchor');

  const cells = [];

  navAnchors.forEach((anchor) => {
    // Extract label text from span > em structure, or fallback to direct text
    const emElement = anchor.querySelector('span > em, em');
    const labelText = emElement
      ? emElement.textContent.trim()
      : anchor.textContent.trim();

    if (!labelText) return;

    // Generate section ID slug from label text
    // Convert to lowercase, replace special chars, collapse spaces to hyphens
    const sectionId = labelText
      .toLowerCase()
      .replace(/[™®©]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Create a proper anchor link element
    const link = document.createElement('a');
    link.href = `#${sectionId}`;
    link.textContent = labelText;

    cells.push([link]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'section-nav', cells });
  element.replaceWith(block);
}
