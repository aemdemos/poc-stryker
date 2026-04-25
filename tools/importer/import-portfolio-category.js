/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import productFiltersParser from './parsers/product-filters.js';

// TRANSFORMER IMPORTS
import strykerCleanupTransformer from './transformers/stryker-cleanup.js';
import strykerSectionsTransformer from './transformers/stryker-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'portfolio-category',
  description: 'Portfolio product category page showcasing a product line with hero, product features, related products, and resources',
  urls: [
    'https://www.stryker.com/us/en/portfolios/medical-surgical-equipment/bedframes.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: [
        '.c-page-hero-content',
      ],
    },
    {
      name: 'cards',
      instances: [
        '.c-high-level-cta .cta-container',
        '.c-filtered-content-type-grid .products-container',
      ],
    },
    {
      name: 'product-filters',
      instances: [
        '.c-filtered-content-type-grid .filters-container',
      ],
    },
    {
      name: 'columns',
      instances: [
        '.c-feature-content-context .feature-content-context-content',
      ],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Page Hero',
      selector: '.c-page-hero',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-category-ctas',
      name: 'Category Navigation Cards',
      selector: '.c-high-level-cta',
      style: null,
      blocks: ['cards'],
      defaultContent: [],
    },
    {
      id: 'section-product-grid',
      name: 'Product Grid',
      selector: '.c-filtered-content-type-grid',
      style: null,
      blocks: ['product-filters', 'cards'],
      defaultContent: [],
    },
    {
      id: 'section-featured-content',
      name: 'Featured Content',
      selector: '.c-feature-content-context',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-disclaimer',
      name: 'Disclaimer',
      selector: '.c-disclaimer',
      style: null,
      blocks: [],
      defaultContent: ['#publishedDate'],
    },
  ],
};

// PARSER REGISTRY — cards must run before product-filters so it can read the <select> options
const parsers = {
  'hero': heroParser,
  'cards': cardsParser,
  'product-filters': productFiltersParser,
  'columns': columnsParser,
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform (initial cleanup: cookie banners, overlays, tracking)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template selectors
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

    // 4. Execute afterTransform (remove header/footer/nav, add section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
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
