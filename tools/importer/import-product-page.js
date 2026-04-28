/* eslint-disable */
/* global WebImporter */

import columnsParser from './parsers/columns.js';
import embedParser from './parsers/embed.js';
import cardsParser from './parsers/cards.js';
import formParser from './parsers/form.js';

import strykerCleanupTransformer from './transformers/stryker-cleanup.js';
import productPageSectionsTransformer from './transformers/product-page-sections.js';

const parsers = {
  columns: columnsParser,
  embed: embedParser,
  cards: cardsParser,
  form: formParser,
};

const PAGE_TEMPLATE = {
  name: 'product-page',
  urls: [
    'https://www.stryker.com/us/en/portfolios/medical-surgical-equipment/integration-and-connectivity/or-integration/rise.html',
  ],
  blocks: [
    { name: 'embed', instances: ['.standalonevideo .c-standalone-video', '.mixedmediagallery'] },
    { name: 'columns', instances: ['.cols2 > .colctrl', '.cols2_1-3_2-3 > .colctrl', '.cols3 > .colctrl', '.cols4 > .colctrl'] },
    { name: 'cards', instances: ['.customizable .c-customizeable'] },
    { name: 'form', instances: ['.marketoform'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero Video', selector: '.experienceFragment-ef', style: null, blocks: ['embed'], defaultContent: [] },
    { id: 'section-2', name: 'Product Introduction', selector: '.cols2_1-3_2-3', style: null, blocks: ['columns'], defaultContent: ['.largeheadline', '.c-rich-text-editor'] },
    { id: 'section-3', name: 'Your OR Your Way', selector: ['#your-or-your-way', '.section-title:has(#your-or-your-way)'], style: null, blocks: ['embed', 'columns'], defaultContent: ['.largeheadline', '.c-rich-text-editor'] },
    { id: 'section-4', name: 'Connectivity', selector: ['#connectivity', '.section-title:has(#connectivity)'], style: null, blocks: ['embed', 'columns'], defaultContent: ['.c-rich-text-editor'] },
    { id: 'section-5', name: 'Visualization', selector: ['#visualization', '.section-title:has(#visualization)'], style: null, blocks: ['embed', 'columns'], defaultContent: ['.c-rich-text-editor'] },
    { id: 'section-6', name: 'Related Products', selector: ['#related-products', '.section-title:has(#related-products)'], style: null, blocks: ['cards'], defaultContent: ['.largeheadline'] },
    { id: 'section-7', name: 'Contact Us', selector: ['#contact-us', '.section-title:has(#contact-us)'], style: null, blocks: [], defaultContent: ['.c-disclaimer'] },
  ],
};

const transformers = [
  strykerCleanupTransformer,
  productPageSectionsTransformer,
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
      const elements = document.querySelectorAll(selector);
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
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
