/* eslint-disable */
/* global WebImporter */

/**
 * Parses the two-column overview section into an EDS Columns block.
 * Left column: product description and feature list.
 * Right column: related categories links OR video.
 * @param {Element} element - The .colctrl element inside .cols2
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document, url, params }) {
  const columns = element.querySelectorAll('.row > [class*="col-"]');

  if (columns.length < 2) return;

  const leftCol = columns[0];
  const rightCol = columns[1];

  // Build left column content
  const leftContent = document.createElement('div');
  const leftRte = leftCol.querySelector('.c-rich-text-editor div[style]');
  if (leftRte) {
    Array.from(leftRte.children).forEach((child) => {
      leftContent.appendChild(child.cloneNode(true));
    });
  }

  // Build right column content
  const rightContent = document.createElement('div');
  const rightRte = rightCol.querySelector('.c-rich-text-editor div[style]');
  if (rightRte) {
    Array.from(rightRte.children).forEach((child) => {
      rightContent.appendChild(child.cloneNode(true));
    });
  }

  // Check for video in the right column - use a video link with Scene7 viewer
  const videoAsset = rightCol.querySelector('[data-asset-path]');
  if (videoAsset) {
    const assetPath = videoAsset.getAttribute('data-asset-path') || '';
    const viewerPath = videoAsset.getAttribute('data-viewer-path') || 'https://media-assets.stryker.com/s7viewers/';
    const imageServer = videoAsset.getAttribute('data-imageserver') || 'https://media-assets.stryker.com/is/image/';
    const videoServer = videoAsset.getAttribute('data-videoserver') || 'https://media-assets.stryker.com/is/content/';

    if (assetPath) {
      const videoUrl = `${viewerPath}html5/VideoViewer.html?asset=${assetPath}&serverurl=${imageServer}&videoserverurl=${videoServer}`;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = videoUrl;
      a.textContent = videoUrl;
      p.appendChild(a);
      rightContent.appendChild(p);
    }
  }

  const cells = [
    ['Columns'],
    [leftContent, rightContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
