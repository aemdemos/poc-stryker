/* eslint-disable */
/* global WebImporter */

import embedParser from './parsers/embed.js';
import cardsParser from './parsers/cards.js';

import strykerCleanupTransformer from './transformers/stryker-cleanup.js';
import productPageSectionsTransformer from './transformers/product-page-sections.js';

const parsers = {
  embed: embedParser,
  cards: cardsParser,
};

const PAGE_TEMPLATE = {
  name: 'hub-page',
  urls: [
    'https://www.stryker.com/us/en/training-and-education.html',
  ],
  blocks: [
    { name: 'embed', instances: ['.standalonevideo .c-standalone-video'] },
    { name: 'cards', instances: ['.experienceFragment:has(.buildingblock)'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero and Intro', selector: '.carouselslidegroup', style: null, blocks: ['embed'], defaultContent: ['.largeheadline', '.c-rich-text-editor'] },
    { id: 'section-2', name: 'Nurses and Physician Assistants', selector: '.section-title:nth-of-type(1)', style: null, blocks: ['cards'], defaultContent: [] },
    { id: 'section-3', name: 'Emergency Care', selector: '.section-title:nth-of-type(2)', style: null, blocks: ['cards'], defaultContent: [] },
    { id: 'section-4', name: 'Surgeons Residents Fellows', selector: '.section-title:nth-of-type(3)', style: null, blocks: ['cards'], defaultContent: [] },
    { id: 'section-5', name: 'General Public', selector: '.section-title:nth-of-type(4)', style: null, blocks: ['cards'], defaultContent: [] },
    { id: 'section-6', name: 'Training Calendar', selector: '.section-title:nth-of-type(5)', style: null, blocks: [], defaultContent: ['.largeheadline', '.c-rich-text-editor'] },
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
  const seenAssets = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        // Deduplicate by data-asset-name (carousel slides duplicate videos)
        const dm = element.querySelector('[data-asset-name]');
        if (dm) {
          const assetName = dm.getAttribute('data-asset-name');
          if (seenAssets.has(assetName)) return;
          seenAssets.add(assetName);
        }
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
    // Removed adjustImageUrls — keep absolute CDN URLs so DA can access them

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
