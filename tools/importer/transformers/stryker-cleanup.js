/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker DART cleanup.
 * Removes non-authorable elements from the DOM before and after block parsing.
 * All selectors verified against migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie alert banner (lines 3-28 in cleaned.html)
    // Country switch modal (line 403)
    // HCP banner (line 383)
    // Marketo form markup (lines 1180-1400+)
    // Dynamic media player and social sharing widgets (lines 2208-2240)
    // Slick slider nav thumbnails (lines 545-546, 2625-2626)
    WebImporter.DOMUtils.remove(element, [
      '#cookie-alert',
      '.c-cookie-alert',
      '#c-country-switch-modal',
      '.g-hcpbanner',
      '.marketoform',
      '.c-marketo-form',
      '.mktoForm',
      '.s7dm-dynamic-media',
      '.standalonevideo',
      '.c-standalone-video',
      '.s7socialshare',
      '.s7socialsharepanel',
      '.slider-nav',
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '#ot-sdk-btn-floating',
      '.onetrust-pc-dark-filter',
      '.ot-floating-button',
    ]);

    // Hidden inputs without type attribute (lines 33, 38, 397-401, 427, 2654-2655)
    const inputs = element.querySelectorAll('input:not([type])');
    inputs.forEach((input) => input.remove());

    // AEM config paragraphs (lines 449-463, 2560-2574)
    WebImporter.DOMUtils.remove(element, [
      'p#localNav',
      'p#localNavBgColor',
      'p#localNavTextColor',
      'p#trans',
      'p#firstItem',
      'p#hcpcheckbox',
      'p#hcptextcolor',
      'p#hcpTag',
      'p#ef-mobile',
    ]);
  }

  if (hookName === H.after) {
    // Header (line 32), megamenu (line 100), footer (line 2667)
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      '.g-header',
      '.g-megamenu',
      'footer',
      '.g-footer',
    ]);

    // Back to top button (line 2660)
    // Tracking pixels - cookielaw (line 3018)
    WebImporter.DOMUtils.remove(element, [
      '.c-back-to-top',
    ]);

    // Remove tracking pixel images
    const trackingImgs = element.querySelectorAll('img[src*="cookielaw"], img[src*="telemetry"]');
    trackingImgs.forEach((img) => img.remove());

    // Remove hidden spans within cookie alert context (lines 26-27, 402)
    const hiddenSpans = element.querySelectorAll('span.hidden');
    hiddenSpans.forEach((span) => span.remove());

    // Remove empty slick-list elements (lines 546, 2626)
    const emptySlickLists = element.querySelectorAll('.slick-list:empty');
    emptySlickLists.forEach((el) => el.remove());

    // Remove link elements (stylesheet refs from carouselslidegroup)
    WebImporter.DOMUtils.remove(element, ['link']);
  }
}
