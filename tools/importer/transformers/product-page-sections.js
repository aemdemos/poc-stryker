/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Product page section breaks.
 * Inserts <hr> before each .section-title element and before the experience fragment hero.
 * Works generically for Stryker product pages with .section-title boundaries.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const doc = element.ownerDocument || document;
  const markers = [];

  const sectionTitles = element.querySelectorAll('.section-title');
  sectionTitles.forEach((st) => markers.push(st));

  const disclaimer = element.querySelector('.c-disclaimer');
  if (disclaimer) markers.push(disclaimer);

  markers.forEach((marker) => {
    const hr = doc.createElement('hr');
    marker.before(hr);
  });
}
