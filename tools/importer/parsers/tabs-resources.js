/* eslint-disable */
/* global WebImporter */

/**
 * Parses the tabbed resources section.
 * Product info stays in the Tabs block.
 * Videos are extracted as separate Video blocks AFTER the tabs.
 * @param {Element} element - The .c-tabs element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const tabLinks = element.querySelectorAll('.tab-link');
  const tabContents = element.querySelectorAll('.tab-content');

  if (tabLinks.length === 0) return;

  // Collect video blocks to append after the tabs table
  const videoBlocks = [];

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

      // Handle videos - extract them as separate Video blocks
      const videos = content.querySelectorAll('.standalonevideo');
      videos.forEach((video) => {
        const videoTitle = video.querySelector('h3, .desc-content h3');
        const videoAsset = video.querySelector('[data-asset-path]');

        if (videoAsset) {
          const assetName = videoAsset.getAttribute('data-asset-name') || '';
          const assetPath = videoAsset.getAttribute('data-asset-path') || '';
          const videoServer = videoAsset.getAttribute('data-videoserver') || 'https://media-assets.stryker.com/is/content/';

          if (assetPath) {
            // Ensure the URL ends with .mp4 extension for proper video playback
            let videoUrl = `${videoServer}${assetPath}`;
            if (assetName && assetName.endsWith('.mp4')) {
              videoUrl = `${videoUrl}/${assetName}`;
            } else if (!videoUrl.includes('.mp4')) {
              videoUrl = `${videoUrl}.mp4`;
            }

            const titleEl = videoTitle ? videoTitle.cloneNode(true) : null;

            const videoLinkP = document.createElement('p');
            const videoLink = document.createElement('a');
            videoLink.href = videoUrl;
            videoLink.textContent = videoUrl;
            videoLinkP.appendChild(videoLink);

            const videoCells = [
              ['Video'],
              [videoLinkP],
            ];
            const videoTable = WebImporter.DOMUtils.createTable(videoCells, document);

            videoBlocks.push({ title: titleEl, table: videoTable });
          }
        }
      });

      // For the Videos tab with no other content, skip adding it to tabs
      if (videos.length > 0 && contentCell.children.length === 0) {
        return;
      }
    }

    if (contentCell.children.length > 0) {
      cells.push([label, contentCell]);
    }
  });

  // Only create tabs table if we have content rows
  if (cells.length <= 1) {
    element.remove();
    return;
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the tabs table followed by video blocks
  const container = document.createElement('div');
  container.appendChild(table);

  videoBlocks.forEach(({ title, table: videoTable }) => {
    if (title) container.appendChild(title);
    container.appendChild(videoTable);
  });

  element.replaceWith(container);
}
