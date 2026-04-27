/* eslint-disable */
/* global WebImporter */

/**
 * Columns parser for Stryker product pages.
 * Matches three distinct patterns based on which selector triggered:
 *
 * 1. Hero (.c-page-hero-content): 1 row, 2 cols — text left, product image right
 * 2. Description (#product-detail-container > .row): 1 row, 2 cols — description left, categories right
 * 3. Feature comparison (.cols2_1-3_2-3 .colctrl): 2 rows, 2 cols — image+text / features, CTA / figure
 */
export default function parse(element, { document }) {
  const cols = element.querySelectorAll(':scope > [class*="col-"], :scope > .row > [class*="col-"]');
  if (cols.length < 2) return;

  // Detect which pattern we're in based on ancestor context
  const isHero = !!element.closest('.pagehero, .c-page-hero');
  const isDescription = !!element.closest('#product-detail-container');
  const isFeatureComparison = !!element.closest('.cols2_1-3_2-3');

  let cells;

  if (isHero) {
    // Pattern 1: Hero — text left, image right
    const leftCol = cols[0];
    const rightCol = cols[1];

    const leftContent = [];
    const h1 = leftCol.querySelector('h1');
    const h2 = leftCol.querySelector('h2');
    const desc = leftCol.querySelector('p.content, p:not(:empty)');
    if (h1) leftContent.push(h1);
    if (h2) leftContent.push(h2);
    if (desc) leftContent.push(desc);

    const rightContent = [];
    const img = rightCol.querySelector('picture, img');
    if (img) rightContent.push(img);

    cells = [[leftContent, rightContent]];
  } else if (isDescription) {
    // Pattern 2: Description — product details left, categories right
    const leftCol = cols[0];
    const rightCol = cols[1];

    const leftContent = [];
    const heading = leftCol.querySelector('h3, .c-page-short-description h3');
    if (heading) leftContent.push(heading);

    const descDiv = leftCol.querySelector('.c-page-short-description-content');
    if (descDiv) {
      descDiv.querySelectorAll(':scope > p, :scope > ul').forEach((el) => {
        if (el.textContent.trim() || el.querySelector('img')) leftContent.push(el);
      });
    } else {
      leftCol.querySelectorAll('p, ul').forEach((el) => {
        if (el.textContent.trim()) leftContent.push(el);
      });
    }

    const rightContent = [];
    // Categories (.c-tagcrumb)
    const tagcrumb = rightCol.querySelector('.c-tagcrumb');
    if (tagcrumb) {
      const catTitle = tagcrumb.querySelector('h4');
      if (catTitle) rightContent.push(catTitle);
      tagcrumb.querySelectorAll('.c-tagcrumb-item a').forEach((a) => {
        const p = document.createElement('p');
        p.appendChild(a.cloneNode(true));
        rightContent.push(p);
      });
    }
    // Contact button if present
    const contactBtn = rightCol.querySelector('.c-contact-button a');
    if (contactBtn) rightContent.push(contactBtn);

    if (leftContent.length === 0 && rightContent.length === 0) return;
    cells = [[leftContent, rightContent]];
  } else if (isFeatureComparison) {
    // Pattern 3: Feature comparison — 2 rows, 2 cols
    const leftCol = cols[0];
    const rightCol = cols[1];

    // Row 1 left: image + decorative text
    const row1Left = [];
    const leftImg = leftCol.querySelector('.standaloneimage img, .c-standalone-image img');
    if (leftImg) row1Left.push(leftImg);
    leftCol.querySelectorAll('.c-rich-text-editor p').forEach((p) => {
      if (p.textContent.trim()) row1Left.push(p);
    });

    // Row 1 right: feature descriptions
    const row1Right = [];
    rightCol.querySelectorAll('.text.parbase .c-rich-text-editor').forEach((rt) => {
      rt.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) row1Right.push(p);
      });
    });

    // Row 2 left: white paper CTA
    const row2Left = [];
    const ctaTitle = rightCol.querySelector('.c-curatedcta .cta-title, .c-curatedcta h4');
    const ctaLink = rightCol.querySelector('.c-curatedcta a.btn, .c-curatedcta a.btn-teal');
    if (ctaTitle) row2Left.push(ctaTitle);
    if (ctaLink) row2Left.push(ctaLink);

    // Row 2 right: comparison figure image
    const row2Right = [];
    const figureImg = rightCol.querySelector('.standaloneimage img, .c-standalone-image img');
    if (figureImg) row2Right.push(figureImg);

    cells = [
      [row1Left, row1Right],
      [row2Left, row2Right],
    ];
  } else {
    // Generic fallback: just pass columns through
    const row = [];
    cols.forEach((col) => {
      const content = [];
      col.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, img, a.btn, a.action-link').forEach((el) => {
        if (el.tagName === 'P' && !el.textContent.trim() && !el.querySelector('img')) return;
        content.push(el);
      });
      row.push(content);
    });
    if (row.every((col) => col.length === 0)) return;
    cells = [row];
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
