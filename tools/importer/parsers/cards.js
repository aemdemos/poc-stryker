/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: stryker.com TEACH TALKS video page.
 * Extracts chapter cards from 4-column grids: each card = video col + text col pair.
 * Source DOM: div.cols4 > .colctrl > .row > .col-xs-12.col-sm-6.col-md-3 (alternating video/text pairs)
 * Each card row: [video link, chapter title + RSA link]
 */
export default function parse(element, { document }) {
  const row = element.querySelector('.colctrl > .row');
  if (!row) return;

  const cols = [...row.children].filter((el) => el.classList.contains('col-xs-12'));
  const cells = [];

  // Process columns in pairs: even = video, odd = text
  for (let i = 0; i < cols.length; i += 2) {
    const videoCol = cols[i];
    const textCol = cols[i + 1];

    // Skip empty column pairs
    const hasVideo = videoCol && videoCol.querySelector('iframe[src*="youtube"]');
    const hasText = textCol && textCol.querySelector('.c-rich-text-editor');
    if (!hasVideo && !hasText) continue;

    const cardContent = [];

    // Extract YouTube video as a link
    if (hasVideo) {
      const iframe = videoCol.querySelector('iframe[src*="youtube"]');
      const src = iframe.getAttribute('src');
      const videoIdMatch = src.match(/embed\/([^?]+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        const link = document.createElement('a');
        link.href = `https://www.youtube.com/watch?v=${videoId}`;
        link.textContent = iframe.getAttribute('title') || `YouTube Video ${videoId}`;
        cardContent.push(link);
      }
    }

    // Extract chapter title
    if (hasText) {
      const titleP = textCol.querySelector('.c-rich-text-editor p');
      if (titleP) {
        const p = document.createElement('p');
        p.innerHTML = titleP.innerHTML;
        cardContent.push(p);
      }

      // Extract RSA link from second text block
      const textBlocks = textCol.querySelectorAll('.c-rich-text-editor');
      if (textBlocks.length > 1) {
        const linkEl = textBlocks[1].querySelector('a');
        if (linkEl) {
          const link = document.createElement('a');
          link.href = linkEl.getAttribute('href');
          link.textContent = linkEl.textContent.trim();
          cardContent.push(link);
        }
      }
    }

    if (cardContent.length > 0) {
      cells.push([cardContent]);
    }
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
