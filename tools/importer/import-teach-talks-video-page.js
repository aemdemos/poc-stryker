/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';

// TRANSFORMER IMPORTS
import strykerCleanupTransformer from './transformers/stryker-cleanup.js';
import strykerSectionsTransformer from './transformers/stryker-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns': columnsParser,
  'cards': cardsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'teach-talks-video-page',
  description: 'TEACH TALKS video page featuring educational surgical procedure videos with speaker information',
  urls: [
    'https://www.stryker.com/us/en/training-and-education/orthopaedics/trauma-extremities/teach/TEACH-TALKS-home-page/Reverse-Shoulder-Replacements-2020.html',
  ],
  blocks: [
    {
      name: 'columns',
      instances: ['div.cols2_2-3_1-3'],
    },
    {
      name: 'cards',
      instances: ['div.cols4'],
    },
  ],
  sections: [
    {
      id: 'section-1-teach-banner',
      name: 'TEACH Talks Banner',
      selector: 'div.standaloneimage',
      style: 'teach-top',
      blocks: [],
      defaultContent: ['div.standaloneimage .c-standalone-image-content'],
    },
    {
      id: 'section-2-course-intro',
      name: 'Course Introduction',
      selector: ['div.text.parbase:has(.dimensional-box)', 'div.largeheadline:has(.fontsize-3-5-vw)', 'div.cols2_2-3_1-3'],
      style: null,
      blocks: ['columns'],
      defaultContent: ['.dimensional-box', '.largeheadline .fontsize-3-5-vw'],
    },
    {
      id: 'section-3-course-overview',
      name: 'Course Overview - Chapters',
      selector: ['div.text.parbase:has(.bg-golden-gradient)', 'div.cols4'],
      style: 'golden',
      blocks: ['cards'],
      defaultContent: ['.bg-golden-gradient'],
    },
    {
      id: 'section-4-disclaimer',
      name: 'Footer Disclaimer',
      selector: '.c-disclaimer',
      style: null,
      blocks: [],
      defaultContent: ['#publishedDate'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  strykerCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [strykerSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Remove tracking artifacts (demdex iframes converted to links by built-in rules)
    main.querySelectorAll('a').forEach((a) => {
      const href = a.href || a.getAttribute('href') || '';
      if (href.indexOf('demdex') !== -1) {
        const p = a.closest('p');
        if (p) p.remove();
        else a.remove();
      }
    });

    // 7. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
