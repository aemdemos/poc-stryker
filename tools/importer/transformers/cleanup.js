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

    // Replace Scene7 social icon images with :iconname: text for EDS icons
    const iconMap = {
      LinkedIn_100x100: 'linkedin',
      facebook_logo_100x100: 'facebook',
    };
    element.querySelectorAll('img').forEach((img) => {
      const src = img.src || img.getAttribute('src') || '';
      if (src.includes('media-assets.stryker.com/is/image/stryker/')) {
        const match = src.match(/\/is\/image\/stryker\/([^?]+)/);
        if (match && iconMap[match[1]]) {
          const link = img.closest('a');
          if (link) {
            link.textContent = `:${iconMap[match[1]]}:`;
          } else {
            img.replaceWith(document.createTextNode(`:${iconMap[match[1]]}:`));
          }
        } else if (!img.closest('table')) {
          img.src = src.replace('media-assets.stryker.com', 'www.stryker.com').split('?')[0];
        }
      }
    });

    // Clean up empty divs (but not inside tables)
    element.querySelectorAll('div:empty').forEach((el) => {
      if (!el.closest('table')) el.remove();
    });
  }
}
