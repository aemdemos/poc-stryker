/* eslint-disable */
/* global WebImporter */

export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    // Remove non-content elements (preserving .c-navigation-bar and .g-hcpbanner for parsers)
    const selectorsToRemove = [
      'footer',
      '.breadcrumb',
      '#product-detail-container',
      '.c-tiles',
      '.c-cross-promotional',
      'script',
      'style',
      'link[rel="stylesheet"]',
      'noscript',
      'iframe',
      '[style*="display:none"]',
      '#localNav',
      '#localNavBgColor',
      '#trans',
      '#localNavTextColor',
      '#firstItem',
      '#hcpcheckbox',
      '#hcptextcolor',
      '#hcpTag',
      '.slider-nav',
      '.slick-dots',
      '.global-header',
      '.g-megamenu',
      '.g-footer',
    ];

    selectorsToRemove.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Move HCP banner out of header before removing header
    const hcpBanner = element.querySelector('.g-hcpbanner');
    if (hcpBanner && hcpBanner.closest('header')) {
      const header = hcpBanner.closest('header');
      header.parentNode.insertBefore(hcpBanner, header);
    }

    // Remove headers
    element.querySelectorAll('header').forEach((el) => el.remove());

    // Remove nav elements that are NOT inside .c-navigation-bar or .c-tabs
    element.querySelectorAll('nav').forEach((nav) => {
      const parent = nav.parentNode;
      if (parent && (parent.closest('.c-navigation-bar') || parent.closest('.c-tabs'))) return;
      if (nav.closest('.c-navigation-bar') || nav.closest('.c-tabs')) return;
      nav.remove();
    });

    // Remove cookie banners
    element.querySelectorAll('[class*="cookie"], [class*="consent"], [id*="onetrust"]').forEach((el) => el.remove());

    // Enable scrolling
    const body = document.body;
    if (body) {
      body.style.removeProperty('overflow');
    }
  }

  if (hookName === 'afterTransform') {
    // Remove any remaining hidden elements
    element.querySelectorAll('[aria-hidden="true"]').forEach((el) => {
      if (!el.closest('table')) el.remove();
    });

    // Convert media-assets.stryker.com image URLs to www.stryker.com/content/dam/ paths
    // EDS cannot proxy Scene7 URLs but can resolve www.stryker.com DAM paths
    element.querySelectorAll('img').forEach((img) => {
      const src = img.src || img.getAttribute('src') || '';
      if (src.includes('media-assets.stryker.com/is/image/stryker/')) {
        // Extract the asset name from Scene7 URL
        // e.g. https://media-assets.stryker.com/is/image/stryker/LinkedIn_100x100?$max_width_1440$
        const match = src.match(/\/is\/image\/stryker\/([^?]+)/);
        if (match) {
          const assetName = match[1];
          // Convert to DAM path
          img.src = `https://www.stryker.com/content/dam/stryker/sage/images/${assetName}.png`;
        }
      }
    });

    // Clean up empty divs (but not inside tables)
    element.querySelectorAll('div:empty').forEach((el) => {
      if (!el.closest('table')) el.remove();
    });
  }
}
