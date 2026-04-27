/* eslint-disable */
/* global WebImporter */

/**
 * Consolidated transformer for Stryker portfolio category pages.
 * Handles both cleanup (beforeTransform) and section breaks (afterTransform).
 */
export default function transform(hookName, element, payload) {
  // ── Before: remove non-authorable noise ───────────────────────────────────
  if (hookName === 'beforeTransform') {
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#cookie-alert',
      '.c-cookie-alert',
      '#c-country-switch-modal',
    ]);

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

    element.querySelectorAll('img[src*="telemetry.stryker.com"]').forEach((img) => img.remove());
  }

  // ── After: strip site chrome, add section breaks ──────────────────────────
  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'header.g-header',
      'footer#footer',
      'footer.footer',
      '.g-megamenu',
      '.g-hcpbanner',
    ]);

    WebImporter.DOMUtils.remove(element, [
      '.c-back-to-top',
      '.no-results',
      '.button-container',
      '.filter-content',
    ]);

    element.querySelectorAll('.section-title').forEach((el) => {
      if (!el.closest('.c-filtered-content-type-grid')) el.remove();
    });

    WebImporter.DOMUtils.remove(element, [
      '[class*="breadcrumb"]',
    ]);

    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
    });

    // Section breaks
    const { template } = payload || {};
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selector = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of selector) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
