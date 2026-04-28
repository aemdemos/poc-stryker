/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (2, 3, 4, or 1/3-2/3 column layouts).
 * Reusable across Stryker pages.
 * Selectors: .cols2 > .colctrl, .cols2_1-3_2-3 > .colctrl, .cols3 > .colctrl, .cols4 > .colctrl
 *
 * Each column cell can contain a mix of:
 *   .standaloneimage — image (optionally linked)
 *   .largeheadline — styled heading text
 *   .text.parbase > .c-rich-text-editor — rich text (headings, paragraphs, lists)
 *   .curatedcta — CTA button/link
 *   .standalonevideo — embedded video (handled by embed parser if run first,
 *     but we preserve it as-is if still present)
 *
 * The parser walks child components in DOM order to preserve the content sequence.
 */

function extractComponentContent(component, document) {
  const items = [];
  const cls = component.className || '';

  if (cls.includes('standaloneimage')) {
    const imgLink = component.querySelector('a');
    const img = component.querySelector('img');
    if (imgLink && img) {
      const link = document.createElement('a');
      link.href = imgLink.href;
      link.appendChild(img.cloneNode(true));
      items.push(link);
    } else if (img) {
      items.push(img);
    }
  } else if (cls.includes('largeheadline')) {
    const lines = component.querySelectorAll('.line');
    let headingText = '';
    lines.forEach((line) => {
      const t = line.textContent.trim();
      if (t) headingText += (headingText ? ' ' : '') + t;
    });
    if (!headingText) headingText = component.textContent.trim();
    if (headingText) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = headingText;
      p.appendChild(strong);
      items.push(p);
    }
  } else if (cls.includes('text') && cls.includes('parbase') || component.querySelector('.c-rich-text-editor')) {
    const richTextAreas = component.querySelectorAll('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');
    richTextAreas.forEach((area) => {
      const contentElements = area.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > ul, :scope > ol');
      contentElements.forEach((el) => items.push(el));
    });
  } else if (cls.includes('curatedcta')) {
    const cta = component.querySelector('a.btn');
    if (cta) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      p.appendChild(link);
      items.push(p);
    }
  } else if (cls.includes('standalonevideo')) {
    const dm = component.querySelector('[data-asset-name]');
    if (dm) {
      const server = dm.getAttribute('data-videoserver') || 'https://media-assets.stryker.com/is/content/';
      const assetName = dm.getAttribute('data-asset-name');
      if (assetName) {
        const baseName = assetName.replace(/\.[^.]+$/, '');
        const videoUrl = `${server}stryker/${baseName}`;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.textContent = videoUrl;
        items.push(link);
      }
    }
  }

  return items;
}

function extractColumnContent(col, document) {
  const cell = [];
  const innerRow = col.querySelector(':scope > .row');
  if (!innerRow) return cell;

  const components = innerRow.querySelectorAll(':scope > div');
  components.forEach((component) => {
    const items = extractComponentContent(component, document);
    items.forEach((item) => cell.push(item));
  });

  return cell;
}

function isImageOnlyCell(cell) {
  return cell.length === 1 && (cell[0].tagName === 'IMG' || cell[0].tagName === 'A');
}

function isTextOnlyCell(cell) {
  return cell.length > 0 && cell.every((el) => !['IMG', 'A'].includes(el.tagName) || el.querySelector?.('img') === null);
}

function parseTextColumnsEF(element, document) {
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return null;

  const textBlocks = grid.querySelectorAll(':scope > .text.parbase');
  if (textBlocks.length < 2) return null;

  const contentRow = [];
  textBlocks.forEach((tb) => {
    const cell = [];
    const richTexts = tb.querySelectorAll('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');
    richTexts.forEach((rt) => {
      const elements = rt.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > ul, :scope > ol');
      elements.forEach((el) => cell.push(el));
    });
    contentRow.push(cell);
  });

  return contentRow;
}

function parseImageGalleryEF(element, document) {
  const bb = element.querySelector('.buildingblock');
  if (!bb) return null;

  const grid = bb.querySelector('.xf-master-building-block, .aem-Grid');
  if (!grid) return null;

  const images = grid.querySelectorAll(':scope > .standaloneimage');
  if (images.length < 2) return null;

  const beforeElements = [];
  const afterElements = [];
  const imageRow = [];
  let pastImages = false;

  [...grid.children].forEach((child) => {
    const cls = child.className || '';
    if (cls.includes('standaloneimage')) {
      const img = child.querySelector('img');
      if (img) imageRow.push([img]);
      pastImages = true;
    } else if (!pastImages) {
      const items = extractComponentContent(child, document);
      items.forEach((item) => beforeElements.push(item));
    } else {
      const items = extractComponentContent(child, document);
      items.forEach((item) => afterElements.push(item));
    }
  });

  if (imageRow.length < 2) return null;
  return { beforeElements, imageRow, afterElements };
}

export default function parse(element, { document }) {
  // Skip orphaned elements (already consumed by another parser like cards)
  if (!element.isConnected) return;

  // Pattern: experience fragment with sibling text blocks or image gallery
  if (element.classList.contains('experienceFragment')) {
    // Try image gallery first (awards badges, logo rows, etc.)
    const gallery = parseImageGalleryEF(element, document);
    if (gallery && gallery.imageRow.length >= 2) {
      const container = document.createElement('div');
      gallery.beforeElements.forEach((el) => container.appendChild(el));
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [gallery.imageRow] });
      container.appendChild(block);
      gallery.afterElements.forEach((el) => container.appendChild(el));
      element.replaceWith(container);
      return;
    }

    // Try text columns (Quick Links, etc.)
    const contentRow = parseTextColumnsEF(element, document);
    if (contentRow && contentRow.length >= 2) {
      const cells = [contentRow];
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
      element.replaceWith(block);
    }
    return;
  }

  const row = element.querySelector(':scope > .row');
  if (!row) return;

  const columns = row.querySelectorAll(':scope > [class*="col-"]');
  if (columns.length < 2) return;

  const rawCells = [];
  columns.forEach((col) => {
    rawCells.push(extractColumnContent(col, document));
  });

  // Merge image+caption pairs: [img][text][img][text] → [img+text][img+text]
  let contentRow;
  if (rawCells.length >= 4
    && rawCells.length % 2 === 0
    && rawCells.every((c, i) => (i % 2 === 0 ? isImageOnlyCell(c) : isTextOnlyCell(c)))) {
    contentRow = [];
    for (let i = 0; i < rawCells.length; i += 2) {
      contentRow.push([...rawCells[i], ...rawCells[i + 1]]);
    }
  } else {
    contentRow = rawCells;
  }

  const cells = [contentRow];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
