/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed block — handles Scene7 videos and spin sets.
 * Reusable across Stryker pages.
 *
 * Selectors:
 *   .standalonevideo .c-standalone-video  — video embeds
 *   .mixedmediagallery                    — spin sets / mixed media
 *
 * At runtime Scene7 injects data attributes on a descendant div:
 *   data-asset-type    "videoavs" | "spinset"
 *   data-asset-name    e.g. "2_RISE_Hype Video.mp4"
 *   data-asset-path    e.g. "stryker/RISE_cart"
 *   data-videoserver   e.g. "https://media-assets.stryker.com/is/content/"
 *   data-imageserver   e.g. "https://media-assets.stryker.com/is/image/"
 *
 * Video URL  = data-videoserver + "stryker/" + basename(data-asset-name)
 * Spin URL   = data-imageserver + data-asset-path
 */
export default function parse(element, { document }) {
  if (element.closest('.colctrl')) return;

  const dm = element.querySelector('[data-asset-path]') || element.querySelector('[data-asset-name]');
  if (!dm) return;

  const assetType = dm.getAttribute('data-asset-type') || '';
  let url;

  if (assetType === 'spinset') {
    const imageServer = dm.getAttribute('data-imageserver') || 'https://media-assets.stryker.com/is/image/';
    const assetPath = dm.getAttribute('data-asset-path');
    if (!assetPath) return;
    url = imageServer + assetPath;
  } else {
    const server = dm.getAttribute('data-videoserver') || 'https://media-assets.stryker.com/is/content/';
    const assetName = dm.getAttribute('data-asset-name');
    if (!assetName) return;
    const baseName = assetName.replace(/\.[^.]+$/, '');
    url = `${server}stryker/${baseName}`;
  }

  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;

  const cells = [[link]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
