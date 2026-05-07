/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import hcpBannerParser from './parsers/hcp-banner.js';
import heroParser from './parsers/hero.js';
import stickyNavParser from './parsers/sticky-nav.js';
import columnsOverviewParser from './parsers/columns-overview.js';
import connectBannerParser from './parsers/connect-banner.js';
import formParser from './parsers/form.js';
import tabsResourcesParser from './parsers/tabs-resources.js';
import columnsResourcesParser from './parsers/columns-resources.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

// PARSER REGISTRY
const parsers = {
  'hcp-banner': hcpBannerParser,
  'hero': heroParser,
  'sticky-nav': stickyNavParser,
  'columns-overview': columnsOverviewParser,
  'connect-banner': connectBannerParser,
  'form': formParser,
  'tabs-resources': tabsResourcesParser,
  'columns-resources': columnsResourcesParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'sage-product-page',
  description: 'Stryker Sage product detail pages with hero, overview, contact form, and resources',
  urls: [
    'https://www.stryker.com/us/en/sage/products/sage-air-pump.html',
  ],
  blocks: [
    {
      name: 'hcp-banner',
      instances: ['.g-hcpbanner'],
    },
    {
      name: 'hero',
      instances: ['.c-autocarousel'],
    },
    {
      name: 'sticky-nav',
      instances: ['.c-navigation-bar'],
    },
    {
      name: 'columns-overview',
      instances: ['.cols2 > .colctrl'],
    },
    {
      name: 'connect-banner',
      instances: ['.cols > .colctrl'],
    },
    {
      name: 'form',
      instances: ['.marketoform'],
    },
    {
      name: 'tabs-resources',
      instances: ['.c-tabs'],
    },
    {
      name: 'columns-resources',
      instances: ['.experiencefragment .xf-content-height:has(#sage)'],
    },
  ],
  sections: [
    {
      id: 'section-hcp-banner',
      name: 'HCP Banner',
      selector: '.g-hcpbanner',
      style: '',
      blocks: ['hcp-banner'],
      defaultContent: [],
    },
    {
      id: 'section-hero',
      name: 'Hero',
      selector: '.c-autocarousel',
      style: '',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-sticky-nav',
      name: 'Sticky Nav',
      selector: '.c-navigation-bar',
      style: '',
      blocks: ['sticky-nav'],
      defaultContent: [],
    },
    {
      id: 'section-overview',
      name: 'Overview',
      selector: '.cols2',
      style: '',
      blocks: ['columns-overview'],
      defaultContent: [],
    },
    {
      id: 'section-connect-banner',
      name: 'Connect Banner',
      selector: '.cols > .colctrl',
      style: '',
      blocks: ['connect-banner'],
      defaultContent: [],
    },
    {
      id: 'section-form',
      name: 'Form',
      selector: '.marketoform',
      style: '',
      blocks: ['form'],
      defaultContent: [],
    },
    {
      id: 'section-tabs',
      name: 'Resources Tabs',
      selector: '.c-tabs',
      style: '',
      blocks: ['tabs-resources'],
      defaultContent: [],
    },
    {
      id: 'section-resources-footer',
      name: 'Resources Footer',
      selector: '.experiencefragment .xf-content-height:has(#sage)',
      style: '',
      blocks: ['columns-resources'],
      defaultContent: [],
    },
  ],
};

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
    const { document, url, html, params } = payload;

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

    // 4. Execute afterTransform transformers (section breaks + final cleanup)
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
