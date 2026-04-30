/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns variant.
 * Base block: columns
 * Source: https://www.stryker.com/us/en/joint-replacement/procedures/dart-direct-anterior-reconstructive-technology.html
 * Generated: 2026-04-27
 *
 * Handles multiple column layout patterns:
 * 1. .cols2_1-3_2-3 / .cols2_2-3_1-3 — asymmetric columns (1/3 + 2/3 or 2/3 + 1/3)
 * 2. .cols2 — equal columns
 * 3. .experienceFragment .aem-Grid--12 — experience fragment grid with side-by-side components
 *
 * Each column can contain: images, rich text (headings/paragraphs), and CTA links.
 */
export default function parse(element, { document }) {
  // Determine column containers based on the source pattern
  let columns = [];

  // Pattern 1: colctrl-based layouts (.cols2, .cols2_1-3_2-3, .cols2_2-3_1-3)
  const colctrl = element.querySelector(':scope > .colctrl, :scope .colctrl');
  if (colctrl) {
    const topRow = colctrl.querySelector(':scope > .row');
    if (topRow) {
      // Direct child col-* divs of the top row are the columns
      const colDivs = topRow.querySelectorAll(':scope > [class*="col-sm-"]');
      colDivs.forEach((col) => {
        columns.push(col);
      });
    }
  }

  // Pattern 2: Experience Fragment grid layout (.aem-Grid--12 with side-by-side components)
  if (columns.length === 0) {
    const grid = element.querySelector(':scope .aem-Grid--12, :scope.aem-Grid--12');
    if (grid) {
      // Look for direct child components that form columns
      const gridChildren = grid.querySelectorAll(':scope > .text, :scope > .standaloneimage, :scope > .buildingblock, :scope > [class*="aem-GridColumn"]');
      if (gridChildren.length >= 2) {
        // Group into two columns: first half and second half
        const midpoint = Math.ceil(gridChildren.length / 2);
        const col1Container = document.createElement('div');
        const col2Container = document.createElement('div');
        gridChildren.forEach((child, index) => {
          if (index < midpoint) {
            col1Container.appendChild(child.cloneNode(true));
          } else {
            col2Container.appendChild(child.cloneNode(true));
          }
        });
        columns = [col1Container, col2Container];
      }
    }
  }

  // Pattern 3: Direct children as columns (fallback for .experienceFragment patterns)
  if (columns.length === 0) {
    const directDivs = element.querySelectorAll(':scope > div, :scope > .text, :scope > .standaloneimage');
    if (directDivs.length >= 2) {
      columns = [directDivs[0], directDivs[1]];
    }
  }

  // If we still don't have 2 columns, treat the whole element as single-column fallback
  if (columns.length < 2) {
    columns = [element, document.createElement('div')];
  }

  // Extract content from each column
  function extractColumnContent(col) {
    const content = [];

    // Extract images
    const images = col.querySelectorAll('.c-standalone-image img, .c-standalone-image-content img, img.img-responsive, img');
    images.forEach((img) => {
      if (img.src || img.getAttribute('src')) {
        content.push(img);
      }
    });

    // Extract headings from largeheadline or rich text
    const headings = col.querySelectorAll('.c-largeheadline h2, .c-largeheadline h3, .c-rich-text-editor h2, .c-rich-text-editor h3, h2, h3');
    headings.forEach((heading) => {
      content.push(heading);
    });

    // Extract paragraphs from rich text editor
    const richTexts = col.querySelectorAll('.c-rich-text-editor');
    richTexts.forEach((rt) => {
      const paragraphs = rt.querySelectorAll('p');
      paragraphs.forEach((p) => {
        // Skip empty paragraphs
        if (p.textContent.trim()) {
          content.push(p);
        }
      });
    });

    // If no structured rich text found, look for standalone paragraphs
    if (richTexts.length === 0) {
      const paragraphs = col.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim() && !content.includes(p)) {
          content.push(p);
        }
      });
    }

    // Extract CTA links
    const ctas = col.querySelectorAll('.c-curatedcta a, a.btn, a.cta, a.button');
    ctas.forEach((cta) => {
      content.push(cta);
    });

    // If nothing was extracted, use the column's inner HTML as-is
    if (content.length === 0) {
      const allContent = col.querySelectorAll('img, h1, h2, h3, h4, p, a, ul, ol, li');
      allContent.forEach((el) => {
        if (el.textContent.trim() || el.tagName === 'IMG') {
          content.push(el);
        }
      });
    }

    return content;
  }

  // Build cells: 1 row with 2 cells (one per column)
  const col1Content = extractColumnContent(columns[0]);
  const col2Content = extractColumnContent(columns[1]);

  // Skip empty columns — don't create a block if there's no content
  if (col1Content.length === 0 && col2Content.length === 0) {
    element.remove();
    return;
  }

  const cells = [
    [col1Content, col2Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
