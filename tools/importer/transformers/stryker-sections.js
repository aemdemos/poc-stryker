/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker section breaks and section-metadata.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Section-metadata is placed at the end of each section for a cleaner authoring experience.
 * Runs in afterTransform only.
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

    // First pass (forward): insert <hr> before each non-first section
    template.sections.forEach((section, index) => {
      if (index === 0) return;

      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (sectionEl) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });

    // Second pass (forward): insert section-metadata at the end of each styled section
    // "End of section" = just before the next <hr> sibling, or at end of parent
    template.sections.forEach((section) => {
      if (!section.style) return;

      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      // Walk forward from sectionEl to find the next <hr> (section boundary) or end of parent
      let insertBefore = null;
      let sibling = sectionEl.nextElementSibling;
      while (sibling) {
        if (sibling.tagName === 'HR') {
          insertBefore = sibling;
          break;
        }
        sibling = sibling.nextElementSibling;
      }

      if (insertBefore) {
        insertBefore.before(sectionMetadata);
      } else {
        sectionEl.parentElement.appendChild(sectionMetadata);
      }
    });
  }
}
