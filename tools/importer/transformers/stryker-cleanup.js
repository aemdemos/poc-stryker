/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker site cleanup.
 * Removes non-authorable content: header, footer, cookie banner, nav, modals, back-to-top.
 * Converts styled span patterns to semantic HTML for import.
 * Selectors from captured DOM of stryker.com pages.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    const doc = element.ownerDocument || document;

    // Convert "Shoulder Talks:" dimensional-box to <p><strong>Shoulder</strong> Talks:</p>
    // Source: div.dimensional-box > p > span.fontsize-1-25em > span.futura-bold ("Shoulder") + span.urw-egyptienne ("Talks:")
    const dimBoxes = element.querySelectorAll('.dimensional-box');
    dimBoxes.forEach((container) => {
      const boldSpan = container.querySelector('span.futura-bold');
      const serifSpan = container.querySelector('span.urw-egyptienne');
      if (!boldSpan && !serifSpan) return;

      const p = doc.createElement('p');
      if (boldSpan) {
        const strong = doc.createElement('strong');
        strong.textContent = boldSpan.textContent.replace(/\s+/g, ' ').trim();
        p.appendChild(strong);
      }
      if (serifSpan) {
        p.appendChild(doc.createTextNode(` ${serifSpan.textContent.trim()}`));
      }

      const origP = container.querySelector('p');
      if (origP) {
        origP.replaceWith(p);
      }
    });

    // Convert "Reverse Shoulder Replacements" largeheadline to <h1><em>...</em></h1>
    // Source: div.largeheadline span.fontsize-3-5-vw > span.futura-bold > b
    // The gold futura-bold text maps to <em> for CSS color targeting
    const largeHeadlines = element.querySelectorAll('div.largeheadline span.fontsize-3-5-vw');
    largeHeadlines.forEach((container) => {
      const boldSpan = container.querySelector('span.futura-bold');
      if (!boldSpan) return;

      const text = boldSpan.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;

      const h1 = doc.createElement('h1');
      const em = doc.createElement('em');
      em.textContent = text;
      h1.appendChild(em);

      const wrapper = container.closest('div.c-largeheadline') || container.closest('div.largeheadline');
      if (wrapper) {
        wrapper.replaceWith(h1);
      }
    });

    // Convert "TEACH Talks: Course overview" golden-gradient to semantic H2
    // Source: div.bg-golden-gradient > p > span.fontsize-1-75em > span.futura-bold ("TEACH") + span.urw-egyptienne ("Talks: Course overview")
    // Target: <h2><em>TE</em><strong>ACH</strong> Talks: Course overview</h2>
    const goldenGradients = element.querySelectorAll('.bg-golden-gradient');
    goldenGradients.forEach((container) => {
      const bigSpan = container.querySelector('span.fontsize-1-75em');
      if (!bigSpan) return;

      const h2 = doc.createElement('h2');

      const boldSpan = bigSpan.querySelector('span.futura-bold');
      if (boldSpan) {
        const boldText = boldSpan.textContent.replace(/\s+/g, ' ').trim();
        if (boldText.length > 2) {
          const em = doc.createElement('em');
          em.textContent = boldText.substring(0, 2);
          h2.appendChild(em);
          const strong = doc.createElement('strong');
          strong.textContent = boldText.substring(2);
          h2.appendChild(strong);
        } else {
          const em = doc.createElement('em');
          em.textContent = boldText;
          h2.appendChild(em);
        }
      }

      const remainingSpans = bigSpan.querySelectorAll('span.urw-egyptienne');
      remainingSpans.forEach((s) => {
        h2.appendChild(doc.createTextNode(` ${s.textContent.trim()}`));
      });

      const p = container.querySelector('p');
      if (p) {
        p.replaceWith(h2);
      }
    });

    // Remove cookie banners and consent dialogs
    WebImporter.DOMUtils.remove(element, [
      '#cookie-alert',
      '#onetrust-consent-sdk',
      '#CybotCookiebotDialog',
    ]);

    // Remove modals
    WebImporter.DOMUtils.remove(element, [
      '#c-country-switch-modal',
      '.modal',
    ]);

    // Remove hidden inputs used by AEM
    WebImporter.DOMUtils.remove(element, [
      'input[type="hidden"]',
      'input#hdnRunMode',
      'input#indexUrl',
      'input#hdnShowAlert',
      'input#hdnAlertTitle',
      'input#hdnAlertMsg',
      'input#hdnAlertContBtnText',
      'input#hdnAlertCancelBtnText',
      'input#hdnDisplayHcpConfirmation',
      'input#hdnShowFooter',
      'input#businessUnitTag',
      'input#hiddenPublishedDate',
      'input#header-search',
    ]);
  }

  if (hookName === H.after) {
    // Remove header
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'header.g-header',
    ]);

    // Remove footer
    WebImporter.DOMUtils.remove(element, [
      'footer#footer',
      'footer.footer',
    ]);

    // Remove HCP banner
    WebImporter.DOMUtils.remove(element, [
      '.g-hcpbanner',
    ]);

    // Remove local page navigation
    WebImporter.DOMUtils.remove(element, [
      '.localpagenavigation',
    ]);

    // Remove back-to-top button
    WebImporter.DOMUtils.remove(element, [
      '.c-back-to-top',
    ]);

    // Remove overlay elements
    WebImporter.DOMUtils.remove(element, [
      '.overlay',
    ]);

    // Remove hidden spans
    WebImporter.DOMUtils.remove(element, [
      'span.hidden',
    ]);

    // Remove tracking iframes, noscript, link elements, and Demdex/Adobe tracking links
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'a[href*="demdex.net"]',
    ]);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-content-type');
      el.removeAttribute('data-business-unit-list');
    });
  }
}
