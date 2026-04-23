/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker site-wide cleanup.
 * Selectors from captured DOM of stryker.com portfolio pages.
 * Removes non-authorable content: header, footer, cookie banners, modals, overlays, tracking pixels.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent banners and overlays (from captured DOM: #onetrust-consent-sdk, #cookie-alert)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#cookie-alert',
      '.c-cookie-alert',
      '#c-country-switch-modal',
    ]);

    // Remove hidden input fields used for AEM internal state (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'input#indexUrl',
      'input#hdnRunMode',
      'input#hdnShowAlert',
      'input#hdnAlertTitle',
      'input#hdnAlertMsg',
      'input#hdnAlertContBtnText',
      'input#hdnAlertCancelBtnText',
      'input#hdnDisplayHcpConfirmation',
      'input#hdnShowFooter',
      'input#businessUnitTag',
      'input#hiddenPublishedDate',
    ]);

    // Remove tracking pixels and telemetry images
    const trackingImgs = element.querySelectorAll('img[src*="telemetry.stryker.com"]');
    trackingImgs.forEach((img) => img.remove());
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome: header, footer, nav, megamenu
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'header.g-header',
      'footer#footer',
      'footer.footer',
      '.g-megamenu',
      '.g-hcpbanner',
    ]);

    // Remove back-to-top button, no-results placeholders, filter UI
    WebImporter.DOMUtils.remove(element, [
      '.c-back-to-top',
      '.no-results',
      '.button-container',
      '.filters-container',
      '.filter-content',
      '.section-title',
    ]);

    // Remove breadcrumb-related elements
    WebImporter.DOMUtils.remove(element, [
      '[class*="breadcrumb"]',
    ]);

    // Remove iframes, link tags, noscript, script leftovers
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean up data attributes used for tracking/analytics
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
    });
  }
}
