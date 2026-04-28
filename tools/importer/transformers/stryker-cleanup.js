/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie banners, modals, nav, widgets).
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie alert banner (line 4: <div id="cookie-alert" class="c-cookie-alert bg-info">)
    // OneTrust consent SDK (line 2032: <div id="onetrust-consent-sdk">)
    // OneTrust floating cookie button (line 2279: <div id="ot-sdk-btn-floating">)
    // Country switch modal (line 387: <div id="c-country-switch-modal" class="modal fade">)
    // Overlay element (line 378: <div class="overlay hidden-md hidden-lg">)
    WebImporter.DOMUtils.remove(element, [
      '#cookie-alert',
      '#onetrust-consent-sdk',
      '#ot-sdk-btn-floating',
      '#c-country-switch-modal',
      '.overlay.hidden-md.hidden-lg',
    ]);

    // Remove hidden input elements used for CMS state
    const hiddenInputs = element.querySelectorAll(
      'input[id="indexUrl"], input[id^="hdn"], input[id="hiddenPublishedDate"], input[id="businessUnitTag"]',
    );
    hiddenInputs.forEach((input) => input.remove());

    // Remove all hidden config p tags inside carousel containers
    // (localNav, localNavBgColor, trans, firstItem, hcpTag, etc.)
    // but keep the carousel container itself (it may contain hero videos)
    element.querySelectorAll('.carouselslidegroup p[id]').forEach((p) => p.remove());

    // Remove empty column spacers before parsers run (prevents empty columns blocks)
    element.querySelectorAll('.colctrl').forEach((col) => {
      const row = col.querySelector(':scope > .row');
      if (row && row.textContent.trim() === '' && !row.querySelector('img, video, a')) {
        col.closest('.cols, .cols2, .cols3, .cols4')?.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Site header (line 32: <header id="header" class="g-header">)
    // Site footer (line 1942: <footer id="footer" class="footer">)
    // Jump bar navigation (line 524: <div class="jumpbarnav">)
    // Back to top button (line 1935: <div class="c-back-to-top ...">)
    // Local page navigation (line 421: <div class="... localpagenavigation">)
    // Section separator HRs between resource items (line 472, 635, etc.: <hr class="c-section-separator ...">)
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'footer#footer',
      '.jumpbarnav',
      '.c-back-to-top',
      '.localpagenavigation',
      'hr.c-section-separator',
      'noscript',
      'iframe',
      'link',
    ]);

  }
}
