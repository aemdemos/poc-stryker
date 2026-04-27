/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker site cleanup.
 * Removes non-authorable content, normalizes DM images, strips empty containers.
 * Selectors from captured DOM of stryker.com product pages.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent banners and overlays
    WebImporter.DOMUtils.remove(element, [
      '#cookie-alert',
      '.c-cookie-alert',
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '#c-country-switch-modal',
      '.modal.fade',
      '.overlay.hidden-md',
    ]);

    // Remove hidden inputs and non-visible form elements
    WebImporter.DOMUtils.remove(element, [
      'input[type="hidden"]',
      'input:not([type])',
      '#hdnDisplayHcpConfirmation',
      '#hdnShowAlert',
      '#hdnAlertTitle',
      '#hdnAlertMsg',
      '#hdnAlertContBtnText',
      '#hdnAlertCancelBtnText',
      '#hdnRunMode',
      '#indexUrl',
      '#hdnShowFooter',
      '#hiddenPublishedDate',
      '#businessUnitTag',
    ]);

    // Remove ALL empty layout containers (spacers)
    // Covers: .cols, .cols2, .cols3, .cols2_1-3_2-3, .cols2_2-3_1-3, .fullbleedpanel
    element.querySelectorAll('[class^="cols"], [class*=" cols"], .fullbleedpanel').forEach((container) => {
      const hasContent = container.querySelector('p, h1, h2, h3, h4, h5, h6, img, a, ul, ol, form, video');
      if (!hasContent) container.remove();
    });

    // Remove empty customizable, resourcesanddownload, cross-promotional
    element.querySelectorAll('.customizable, .resourcesanddownload').forEach((div) => {
      if (!div.textContent.trim()) div.remove();
    });
    element.querySelectorAll('.c-cross-promotional').forEach((promo) => {
      if (!promo.textContent.trim()) {
        const tilesContainer = promo.closest('.c-tiles');
        if (tilesContainer) tilesContainer.remove();
      }
    });

    // Remove empty #product-detail-container (Modern Rich pages have this empty)
    const prodDetail = element.querySelector('#product-detail-container');
    if (prodDetail && !prodDetail.querySelector('p, h1, h2, h3, h4, h5, h6, img, a, ul, ol, form')) {
      prodDetail.remove();
    }

    // Extract Scene7 video asset from .interactivemedia, then clean up artifacts
    // If an -AVS poster image exists, extract the asset name and replace with a DM video link
    // If empty (like SmartPump), just remove the container
    const { document } = payload;
    element.querySelectorAll('.interactivemedia').forEach((media) => {
      const posterImg = media.querySelector('img[src*="-AVS"]');
      if (posterImg) {
        const posterSrc = posterImg.getAttribute('src') || '';
        const match = posterSrc.match(/\/is\/image\/stryker\/([^?]+)-AVS/);
        if (match) {
          const assetName = decodeURIComponent(match[1]);
          const videoUrl = `https://media-assets.stryker.com/is/content/stryker/${encodeURIComponent(assetName)}`;
          const link = document.createElement('a');
          link.href = videoUrl;
          link.textContent = videoUrl;
          media.replaceWith(link);
        } else {
          media.remove();
        }
      } else {
        media.remove();
      }
    });
    // Find -AVS video poster images anywhere in the DOM (not just in .interactivemedia)
    // These appear on pages like Zip where Scene7 renders without an .interactivemedia wrapper
    // Use getAttribute + JS filter since CSS attribute selectors may not match encoded URLs
    element.querySelectorAll('img').forEach((img) => {
      const posterSrc = img.getAttribute('src') || '';
      if (!posterSrc.includes('-AVS')) return;
      const match = posterSrc.match(/\/is\/image\/stryker\/([^?]+)-AVS/);
      if (match) {
        const assetName = decodeURIComponent(match[1]);
        const videoUrl = `https://media-assets.stryker.com/is/content/stryker/${encodeURIComponent(assetName)}`;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.textContent = videoUrl;
        // Replace the closest block-level parent (p or div) with the video link
        const parent = img.closest('p') || img.closest('div') || img;
        parent.replaceWith(link);
      } else {
        img.remove();
      }
    });
    // Strip any leaked s7viewers/s7sdk sprite images
    element.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('/s7viewers/') || src.includes('/s7sdk/')) {
        img.remove();
      }
    });

    // Normalize Dynamic Media image URLs
    const DM_BASE = 'https://media-assets.stryker.com/is/image/stryker/';
    const DAM_PREFIX = '/content/dam/stryker/';

    element.querySelectorAll('img[src]').forEach((img) => {
      let src = img.getAttribute('src');

      // Convert DAM paths to DM URLs
      if (src.includes(DAM_PREFIX)) {
        const damPath = src.includes('://') ? new URL(src).pathname : src;
        const segments = damPath.replace(DAM_PREFIX, '').split('/');
        const filename = segments[segments.length - 1].replace(/\.[^.]+$/, '');
        src = DM_BASE + filename;
      }

      // Strip Scene7 preset/query parameters from DM URLs
      if (src.includes('media-assets.stryker.com/is/image/stryker/')) {
        src = src.split('?')[0];
        img.setAttribute('src', src);

        // Ensure DM images have alt text
        if (!img.getAttribute('alt')) {
          const assetName = src.split('/').pop().replace(/[-_]/g, ' ');
          img.setAttribute('alt', assetName);
        }
      }
    });

    // Normalize og:image meta tag
    const ogImage = element.ownerDocument.querySelector('meta[property="og:image"]');
    if (ogImage) {
      let content = ogImage.getAttribute('content') || '';
      if (content.includes(DAM_PREFIX)) {
        const damPath = content.includes('://') ? new URL(content).pathname : content;
        const segments = damPath.replace(DAM_PREFIX, '').split('/');
        const filename = segments[segments.length - 1].replace(/\.[^.]+$/, '');
        ogImage.setAttribute('content', DM_BASE + filename);
      }
      if (content.includes('media-assets.stryker.com/is/image/stryker/')) {
        ogImage.setAttribute('content', content.split('?')[0]);
      }
    }

    // Fix srcset attributes on source elements
    element.querySelectorAll('source[srcset]').forEach((source) => {
      let srcset = source.getAttribute('srcset');
      if (srcset.includes('media-assets.stryker.com/is/image/stryker/')) {
        srcset = srcset.split('?')[0];
        source.setAttribute('srcset', srcset);
      }
    });

    // Move #publishedDate into the regulatory .c-disclaimer container
    // so the sections transformer picks it up as part of the regulatory section
    const publishedDate = element.querySelector('#publishedDate');
    const regulatoryDisclaimer = element.querySelector('div.c-disclaimer:not(.page-section)');
    if (publishedDate && regulatoryDisclaimer) {
      regulatoryDisclaimer.appendChild(publishedDate);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove global header, footer, nav (non-authorable)
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'header',
      '.g-header',
      '.g-megamenu',
      'footer#footer',
      'footer',
      '.g-footer',
      '.g-hcpbanner',
      '.c-back-to-top',
    ]);

    // Remove iframes, link tags, noscript, source elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Clean up tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-trackable');
      el.removeAttribute('data-aem-asset-id');
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-component');
      el.removeAttribute('data-namespace');
    });

    // Remove Scene7 video player artifacts (afterTransform to catch JS-rendered content)
    // Strip s7viewers/s7sdk sprite images and -AVS video poster images
    element.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('/s7viewers/') || src.includes('/s7sdk/') || src.includes('-AVS')) {
        img.closest('p') ? img.closest('p').remove() : img.remove();
      }
    });
  }
}
