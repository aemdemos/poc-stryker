/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: stryker.com TEACH TALKS video page.
 * Extracts 2-column layout: YouTube video embed (left) + rich text description (right).
 * Source DOM: div.cols2_2-3_1-3 > .colctrl > .row > .col-xs-12.col-sm-8 (video) + .col-xs-12.col-sm-4 (text)
 */
export default function parse(element, { document }) {
  // Find the two columns within the colctrl row
  const row = element.querySelector('.colctrl > .row');
  if (!row) return;

  const columns = [...row.children].filter((el) => el.classList.contains('col-xs-12'));

  // Column 1: YouTube video embed - extract iframe src and convert to link
  const col1Content = [];
  const iframe = element.querySelector('iframe[src*="youtube"]');
  if (iframe) {
    const src = iframe.getAttribute('src');
    // Extract video ID from embed URL
    const videoIdMatch = src.match(/embed\/([^?]+)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      const link = document.createElement('a');
      link.href = `https://www.youtube.com/watch?v=${videoId}`;
      link.textContent = iframe.getAttribute('title') || `YouTube Video ${videoId}`;
      col1Content.push(link);
    }
  }

  // Column 2: Rich text content (description, learning objectives, instructor)
  const col2Content = [];
  if (columns.length >= 2) {
    const textContainer = columns[1].querySelector('.c-rich-text-editor .left-to-right, .c-rich-text-editor > div');
    if (textContainer) {
      // Collect all child elements (paragraphs, lists)
      [...textContainer.children].forEach((child) => {
        col2Content.push(child);
      });
    }
  }

  const cells = [
    [col1Content.length ? col1Content : '', col2Content.length ? col2Content : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
