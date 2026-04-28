/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Reusable across Stryker pages with product/content card grids.
 *
 * Pattern A — .customizable .c-customizeable (product pages)
 *   .item > .img-cont > a > img
 *   .item > .desc-container > h3 > a, p, a.action-link
 *
 * Pattern B — .experienceFragment with 2+ .buildingblock (hub pages)
 *   .buildingblock > .xf-master-building-block > .standaloneimage > a > img
 *   .buildingblock > .xf-master-building-block > .text.parbase (title + description)
 *   Skips EFs with only 1 building block (those are single-content sections, not card grids)
 *
 * Pattern C — .c-latestnews (news article cards)
 *   .item > img + .m-c-subheading-description > h3 + .description + a.news-link
 */

function parseCustomizableItems(element, document) {
  const items = element.querySelectorAll('.item');
  if (!items.length) return null;

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('.img-cont img');
    const titleLink = item.querySelector('.desc-container h3 a');
    const description = item.querySelector('.desc-container p');
    const actionLink = item.querySelector('.desc-container a.action-link');

    const imageCell = [];
    if (img) imageCell.push(img);

    const textCell = [];
    if (titleLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleLink.textContent.trim();
      h3.appendChild(a);
      textCell.push(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }
    if (actionLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = actionLink.href;
      a.textContent = actionLink.textContent.trim();
      p.appendChild(a);
      textCell.push(p);
    }

    cells.push([imageCell, textCell]);
  });
  return cells;
}

function parseBuildingBlocks(element, document) {
  const blocks = element.querySelectorAll('.buildingblock');
  if (blocks.length < 2) return null;

  const cells = [];
  blocks.forEach((block) => {
    const imgLink = block.querySelector('.standaloneimage a');
    const img = block.querySelector('.standaloneimage img');
    const richTexts = block.querySelectorAll('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');

    const imageCell = [];
    if (imgLink && img) {
      const link = document.createElement('a');
      link.href = imgLink.href;
      link.appendChild(img.cloneNode(true));
      imageCell.push(link);
    } else if (img) {
      imageCell.push(img);
    }

    const textCell = [];
    richTexts.forEach((rt) => {
      const elements = rt.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > ul, :scope > ol');
      elements.forEach((el) => textCell.push(el));
    });

    if (imageCell.length || textCell.length) {
      cells.push([imageCell, textCell]);
    }
  });
  return cells.length >= 2 ? cells : null;
}

function parseLatestNews(element, document) {
  const items = element.querySelectorAll('.item');
  if (!items.length) return null;

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector(':scope > img');
    const h3 = item.querySelector('h3');
    const desc = item.querySelector('.description');
    const link = item.querySelector('a.news-link');

    const imageCell = [];
    if (img) imageCell.push(img);

    const textCell = [];
    if (h3 && link) {
      const heading = document.createElement('h3');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = h3.textContent.trim();
      heading.appendChild(a);
      textCell.push(heading);
    } else if (h3) {
      const heading = document.createElement('h3');
      heading.textContent = h3.textContent.trim();
      textCell.push(heading);
    }
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      textCell.push(p);
    }

    if (imageCell.length || textCell.length) {
      cells.push([imageCell, textCell]);
    }
  });
  return cells;
}

export default function parse(element, { document }) {
  const isLatestNews = !!element.querySelector('.c-latestnews, .latestnews-container');
  const cells = isLatestNews
    ? parseLatestNews(element, document)
    : (parseCustomizableItems(element, document) || parseBuildingBlocks(element, document));

  if (!cells || !cells.length) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
