/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Source: Stryker portfolio category pages
 * Handles TWO variant instances:
 *   1. Cards (highlight) - Category CTA cards (.c-high-level-cta .cta-container) - image + label + link
 *   2. Cards (product) - Product grid cards (.c-filtered-content-type-grid .products-container) - image + name + link
 *
 * Using distinct variants so each can be styled independently without one overwriting the other.
 *
 * Target table (from block library):
 *   Row 1: block name (with variant)
 *   Each subsequent row: [image | text content (title + desc + CTA link)]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which instance this is
  const isHighLevelCta = !!element.closest('.c-high-level-cta') || !!element.querySelector('.c-high-level-cta-container');
  const isProductGrid = !!element.closest('.c-filtered-content-type-grid') || !!element.querySelector('.product-item');

  if (isHighLevelCta) {
    // Category CTA cards
    const ctaItems = element.querySelectorAll('.c-high-level-cta-container');
    ctaItems.forEach((item) => {
      const link = item.querySelector('a.c-high-level-cta-link, a[href]');
      const label = item.querySelector('.c-high-level-cta-label, a.c-high-level-cta-label');
      const href = link ? link.getAttribute('href') : '';
      const labelText = label ? label.textContent.trim() : '';

      // Try to get image - these are often CSS background-images on the anchor
      // Extract from style attribute or data attributes
      let img = item.querySelector('img');

      if (!img && link) {
        // Check for background-image style on the link element
        const style = link.getAttribute('style') || '';
        const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/i);
        if (bgMatch) {
          // Fix escaped URL characters (e.g., \2f -> /)
          let imgUrl = bgMatch[1].replace(/\\2f/gi, '/').replace(/\\27/gi, "'").replace(/\\22/gi, '"');
          img = document.createElement('img');
          img.setAttribute('src', imgUrl);
          img.setAttribute('alt', labelText);
        }
      }

      // Build card row: [image | text content with link]
      const textCell = document.createElement('div');
      if (labelText) {
        const heading = document.createElement('h4');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = labelText;
        heading.append(a);
        textCell.append(heading);
      }

      if (img) {
        cells.push([img, textCell]);
      } else {
        // No image available, use text-only card
        cells.push([textCell]);
      }
    });
  } else if (isProductGrid) {
    // Build tag-path → display-label lookup from sibling filter dropdowns
    const tagLabelMap = new Map();
    const filterLabels = new Map();
    const gridRoot = element.closest('.c-filtered-content-type-grid') || element.parentElement;
    if (gridRoot) {
      gridRoot.querySelectorAll('.filters-container select').forEach((sel) => {
        const filterName = sel.id
          || sel.closest('[class*="col-"]')?.querySelector('.filter-name')?.textContent?.trim()
          || '';
        [...sel.options].forEach((opt) => {
          if (opt.value && opt.value !== 'all') {
            tagLabelMap.set(opt.value, opt.textContent.trim());
            filterLabels.set(opt.value, filterName);
          }
        });
      });
    }

    // Product grid cards
    const productItems = element.querySelectorAll('.product-item');
    productItems.forEach((item) => {
      const link = item.querySelector(':scope > a[href]');
      const img = item.querySelector('.img-container img, img.img-responsive');
      const nameEl = item.querySelector('h4.component-subheading, h4');
      const href = link ? link.getAttribute('href') : '';
      const productName = nameEl ? nameEl.textContent.trim() : '';
      const imgAlt = img ? (img.getAttribute('alt') || productName) : productName;

      // Preserve Dynamic Media URL on image
      if (img) {
        const src = img.getAttribute('src') || '';
        if (src.startsWith('./images/') || src.startsWith('/images/')) {
          const originalSrc = img.getAttribute('data-original-src') || img.getAttribute('data-src');
          if (originalSrc) {
            img.setAttribute('src', originalSrc);
          }
        }
        if (!img.getAttribute('alt')) {
          img.setAttribute('alt', imgAlt);
        }
      }

      // Build card row: [image | text content]
      const textCell = document.createElement('div');
      if (productName) {
        const heading = document.createElement('h4');
        if (href) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.textContent = productName;
          heading.append(a);
        } else {
          heading.textContent = productName;
        }
        textCell.append(heading);
      }

      // Check for product flags (may be empty on this page but populated on others)
      const flagEl = item.querySelector('.display-product-flag');
      if (flagEl && flagEl.textContent.trim()) {
        const flagP = document.createElement('p');
        flagP.textContent = flagEl.textContent.trim();
        textCell.append(flagP);
      }

      // Resolve data-tags to human-readable filter labels grouped by filter name
      const rawTags = item.getAttribute('data-tags') || '';
      if (rawTags && tagLabelMap.size > 0) {
        const tagPaths = rawTags.split(',').map((t) => t.trim());
        const grouped = new Map();
        tagPaths.forEach((tp) => {
          const label = tagLabelMap.get(tp);
          const filterName = filterLabels.get(tp);
          if (label && filterName) {
            if (!grouped.has(filterName)) grouped.set(filterName, []);
            grouped.get(filterName).push(label);
          }
        });
        if (grouped.size > 0) {
          const tagsCell = document.createElement('div');
          grouped.forEach((values, fName) => {
            const p = document.createElement('p');
            p.textContent = `${fName}: ${values.join(', ')}`;
            tagsCell.append(p);
          });
          if (img) {
            cells.push([img, textCell, tagsCell]);
          } else {
            cells.push([textCell, tagsCell]);
          }
          return;
        }
      }

      if (img) {
        cells.push([img, textCell]);
      } else {
        cells.push([textCell]);
      }
    });
  }

  if (cells.length > 0) {
    // Use distinct variant names so each can be styled independently
    const variantName = isHighLevelCta ? 'Cards (highlight)' : 'Cards (product)';
    const block = WebImporter.Blocks.createBlock(document, { name: variantName, cells });
    element.replaceWith(block);
  }
}
