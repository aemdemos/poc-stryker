/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker section breaks.
 * Inserts <hr> section breaks before each .section-title element and before the
 * hero columns layout (.cols2). Also inserts a break before the disclaimer.
 *
 * This works generically across all FocusRN training-article pages regardless
 * of which sections or headings they contain. The structural pattern is:
 *   .experienceFragment (back link + logo)
 *   .cols2 (hero)
 *   .section-title (first category heading)
 *   .cols2_1-3_2-3 (resource items)
 *   .section-title (next category heading)
 *   ... repeats ...
 *   .c-disclaimer (footer disclaimer)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const doc = element.ownerDocument || document;
  const markers = [];

  // Hero section: .cols2 (the two-column hero layout, not .cols2_1-3_2-3)
  const hero = element.querySelector('.cols2:not([class*="_"])');
  if (hero) markers.push(hero);

  // Each .section-title marks a new content category
  const sectionTitles = element.querySelectorAll('.section-title');
  sectionTitles.forEach((st) => markers.push(st));

  // Disclaimer at the bottom
  const disclaimer = element.querySelector('.c-disclaimer');
  if (disclaimer) markers.push(disclaimer);

  // Insert <hr> before each marker (section break)
  markers.forEach((marker) => {
    const hr = doc.createElement('hr');
    marker.before(hr);
  });
}
