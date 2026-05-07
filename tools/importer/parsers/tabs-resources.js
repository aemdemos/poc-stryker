/* eslint-disable */
/* global WebImporter */

/**
 * Parses the tabbed resources section into an EDS Tabs block.
 * Keeps all tab content (documents and videos) inside the tabs.
 * @param {Element} element - The .c-tabs element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const tabLinks = element.querySelectorAll('.tab-link');
  const tabContents = element.querySelectorAll('.tab-content');

  if (tabLinks.length === 0) return;

  const cells = [['Tabs']];

  tabLinks.forEach((link, index) => {
    const label = link.textContent.trim();
    const content = tabContents[index];
    const contentCell = document.createElement('div');

    if (content) {
      // Handle resource downloads (Product information tab)
      const resources = content.querySelectorAll('.c-resourcesanddownload .item, .resourcesanddownload .item');
      resources.forEach((item) => {
        const itemLink = item.querySelector('a[href]');
        const title = item.querySelector('h5, .title');
        const img = item.querySelector('img');

        if (itemLink && title) {
          if (img) {
            const imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.alt = img.alt || title.textContent.trim();
            contentCell.appendChild(imgEl);
          }
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = itemLink.href;
          a.textContent = title.textContent.trim();
          p.appendChild(a);
          contentCell.appendChild(p);
        }
      });

      // Handle videos - keep inside the tab as a link
      const videos = content.querySelectorAll('.standalonevideo');
      videos.forEach((video) => {
        const videoTitle = video.querySelector('h3, .desc-content h3');
        const videoAsset = video.querySelector('[data-asset-path]');

        if (videoAsset) {
          const assetPath = videoAsset.getAttribute('data-asset-path') || '';
          const viewerPath = videoAsset.getAttribute('data-viewer-path') || 'https://media-assets.stryker.com/s7viewers/';
          const imageServer = videoAsset.getAttribute('data-imageserver') || 'https://media-assets.stryker.com/is/image/';
          const videoServer = videoAsset.getAttribute('data-videoserver') || 'https://media-assets.stryker.com/is/content/';

          if (videoTitle) {
            const h = document.createElement('h3');
            h.textContent = videoTitle.textContent.trim();
            contentCell.appendChild(h);
          }

          if (assetPath) {
            // Use Scene7 VideoViewer URL for the embed
            const videoUrl = `${viewerPath}html5/VideoViewer.html?asset=${assetPath}&serverurl=${imageServer}&videoserverurl=${videoServer}`;
            const p = document.createElement('p');
            const a = document.createElement('a');
            a.href = videoUrl;
            a.textContent = videoUrl;
            p.appendChild(a);
            contentCell.appendChild(p);
          }
        }
      });
    }

    if (contentCell.children.length > 0) {
      cells.push([label, contentCell]);
    }
  });

  if (cells.length <= 1) {
    element.remove();
    return;
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
