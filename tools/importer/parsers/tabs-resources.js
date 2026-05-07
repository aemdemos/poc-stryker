/* eslint-disable */
/* global WebImporter */

/**
 * Parses the tabbed resources section into an EDS Tabs block.
 * Extracts tab labels and content (downloadable documents, videos).
 * @param {Element} element - The .c-tabs element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  // Extract tab labels from the nav
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

      // Handle videos (Videos tab)
      const videos = content.querySelectorAll('.standalonevideo');
      videos.forEach((video) => {
        const videoTitle = video.querySelector('h3, .desc-content h3');
        const videoAsset = video.querySelector('[data-asset-path]');

        if (videoAsset) {
          const assetPath = videoAsset.getAttribute('data-asset-path');
          const assetName = videoAsset.getAttribute('data-asset-name') || '';
          const videoServer = videoAsset.getAttribute('data-videoserver') || '';

          if (videoTitle) {
            const h = document.createElement('h3');
            h.textContent = videoTitle.textContent.trim();
            contentCell.appendChild(h);
          }

          if (assetPath) {
            const p = document.createElement('p');
            const a = document.createElement('a');
            a.href = `${videoServer}${assetPath}`;
            a.textContent = assetName || assetPath;
            p.appendChild(a);
            contentCell.appendChild(p);
          }
        }
      });
    }

    if (contentCell.children.length > 0) {
      cells.push([label, contentCell]);
    } else {
      cells.push([label, '']);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
