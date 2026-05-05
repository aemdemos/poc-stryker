/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero variant.
 * Base block: hero
 * Source: https://www.stryker.com/us/en/joint-replacement/procedures/dart-direct-anterior-reconstructive-technology.html
 * Instances:
 *   1. .carouselslidegroup .autoplay-slide (main DART hero with desktop image, h1 heading, subtitle)
 *   2. .experienceFragment:last-of-type (ASC promotion hero with image, richtext paragraphs, CTA link)
 * Generated: 2026-04-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which instance type: carousel hero has .experienceFragment-ef child
  const isCarouselHero = !!element.querySelector('.experienceFragment-ef');

  // --- Row 1: Image ---
  // Instance 1 uses .experienceFragment-ef .c-standalone-image img (desktop hero image)
  // Instance 2 uses .c-standalone-image img directly
  const heroImage = isCarouselHero
    ? element.querySelector('.experienceFragment-ef .c-standalone-image img')
    : element.querySelector('.c-standalone-image img');

  if (heroImage) {
    cells.push([heroImage]);
  }

  // --- Row 2: Richtext content (single cell) ---
  // Wrap all content in a div so createBlock treats it as one cell, not multiple columns
  const wrapper = document.createElement('div');

  if (isCarouselHero) {
    // Instance 1: Wordmark overlay image + H1 heading + subtitle
    const wordmark = element.querySelector('.overlayparsys .cta-img img')
      || element.querySelector('.curatedcta .cta-img img');

    if (wordmark) {
      const p = document.createElement('p');
      const img = document.createElement('img');
      img.src = wordmark.src;
      img.alt = wordmark.alt || 'DART';
      p.appendChild(img);
      wrapper.appendChild(p);
    }

    const heading = element.querySelector('.overlayparsys .largeheadline h1')
      || element.querySelector('.largeheadline h1')
      || element.querySelector('h1');

    if (heading) {
      const h = document.createElement('h1');
      h.textContent = heading.textContent.trim().replace(/\s+/g, ' ');
      wrapper.appendChild(h);
    } else {
      // Fallback: some pages use span.line1 instead of h1 for the primary heading
      const line1 = element.querySelector('.overlayparsys .largeheadline span.line1')
        || element.querySelector('.largeheadline span.line1');
      if (line1 && line1.textContent.trim()) {
        // Check if line1 has multiple differently-styled inner spans (e.g. ASC hero)
        // If so, skip here and let the multi-span fallback below handle it
        const styledSpans = line1.querySelectorAll(':scope > span > span');
        const hasMultipleStyles = styledSpans.length > 1;
        if (!hasMultipleStyles) {
          const h = document.createElement('h1');
          h.textContent = line1.textContent.trim().replace(/\s+/g, ' ');
          wrapper.appendChild(h);
        }
      }
    }

    const subtitle = element.querySelector('.overlayparsys .largeheadline span.line2')
      || element.querySelector('.largeheadline span.line2')
      || element.querySelector('span.line2');

    if (subtitle && subtitle.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = subtitle.textContent.trim();
      wrapper.appendChild(p);
    }

    // Fallback for carousel heroes with span-based text (no h1, no wordmark)
    // e.g. ASC gradient hero: "Let's create solutions" (serif) + "that build and grow your ASC." (bold)
    if (wrapper.children.length === 0) {
      const lineContainer = element.querySelector('.largeheadline span.line1');
      if (lineContainer) {
        const innerSpans = lineContainer.querySelectorAll(':scope > span > span');
        innerSpans.forEach((span) => {
          const text = span.textContent.trim().replace(/\s+/g, ' ');
          if (text) {
            const para = document.createElement('p');
            if (span.classList.contains('futura-bold')) {
              const strong = document.createElement('strong');
              strong.textContent = text;
              para.appendChild(strong);
            } else {
              const em = document.createElement('em');
              em.textContent = text;
              para.appendChild(em);
            }
            wrapper.appendChild(para);
          }
        });
      }
    }
  } else {
    // Instance 2: ASC promotion - richtext paragraphs + CTA link
    // Try multiple selector strategies for richtext paragraphs
    let paragraphs = element.querySelectorAll('.c-rich-text-editor p');

    // Fallback: if no .c-rich-text-editor found, try direct text divs
    if (paragraphs.length === 0) {
      paragraphs = element.querySelectorAll('.text p');
    }

    // Further fallback: any paragraph in the element
    if (paragraphs.length === 0) {
      paragraphs = element.querySelectorAll('p');
    }

    paragraphs.forEach((p) => {
      const text = p.textContent.trim().replace(/\s+/g, ' ');
      if (text) {
        const para = document.createElement('p');
        // Bold the first paragraph as the main heading text
        if (wrapper.children.length === 0) {
          const strong = document.createElement('strong');
          strong.textContent = text;
          para.appendChild(strong);
        } else {
          para.textContent = text;
        }
        wrapper.appendChild(para);
      }
    });

    // CTA link
    const ctaLink = element.querySelector('.c-curatedcta a[href]')
      || element.querySelector('a.btn[href]')
      || element.querySelector('.cta-container a[href]');

    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(link);
      wrapper.appendChild(p);
    }
  }

  if (wrapper.children.length > 0) {
    cells.push([wrapper]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
