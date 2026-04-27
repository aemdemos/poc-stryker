/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsParser from './parsers/columns.js';
import embedParser from './parsers/embed.js';
import formParser from './parsers/form.js';

// TRANSFORMER IMPORTS
import strykerCleanupTransformer from './transformers/stryker-cleanup.js';
import strykerSectionsTransformer from './transformers/stryker-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns': columnsParser,
  'embed': embedParser,
  'form': formParser,
};

// PAGE TEMPLATE — 6-section universal skeleton
const PAGE_TEMPLATE = {
  name: 'product-detail',
  description: 'Universal orthopaedic instruments product detail page with 6 sections.',
  blocks: [
    {
      name: 'columns',
      instances: [
        '.c-page-hero-content',
        '#product-detail-container > .row',
        '.cols2_1-3_2-3 .colctrl',
      ],
    },
    {
      name: 'embed',
      instances: ["a[href*='media-assets.stryker.com/is/content/stryker']"],
    },
    {
      name: 'form',
      instances: ['.c-marketo-form'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Product Hero',
      selector: '.pagehero',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-2-description',
      name: 'Product Description',
      selector: '#product-detail-container',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-3-features',
      name: 'Feature Images and Banner',
      selector: '.fullWidthImage',
      style: null,
      blocks: [],
      defaultContent: ['.fullWidthImage .imgBoxId picture', '.c-largeheadline .largeheadline'],
    },
    {
      id: 'section-4-comparison',
      name: 'Feature Comparison',
      selector: ['.cols2_1-3_2-3'],
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-5-contact',
      name: 'Contact Form',
      selector: ['.section-title', '.c-section-title'],
      style: null,
      blocks: ['form'],
      defaultContent: ['.c-section-title h2'],
    },
    {
      id: 'section-6-citations',
      name: 'Citations',
      selector: 'div.c-disclaimer.page-section:not(.container)',
      style: 'c-disclaimer page-section',
      blocks: [],
      defaultContent: [],
    },
    {
      id: 'section-7-regulatory',
      name: 'Regulatory',
      selector: 'div.c-disclaimer:not(.page-section)',
      style: 'c-disclaimer',
      blocks: [],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  strykerCleanupTransformer,
  ...(PAGE_TEMPLATE.sections.length > 1 ? [strykerSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Cleanup (beforeTransform)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find and parse blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 3. Final cleanup + section breaks (afterTransform)
    executeTransformers('afterTransform', main, payload);

    // 4. Built-in importer rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Strip Scene7 sprite images from live DOM (video extraction happens in post-processor)
    main.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('/s7viewers/') || src.includes('/s7sdk/')) img.remove();
    });

    // 6. Sanitized path
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
