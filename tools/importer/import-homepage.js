/* eslint-disable */
/* global WebImporter */

import columnsParser from './parsers/columns.js';
import embedParser from './parsers/embed.js';
import cardsParser from './parsers/cards.js';

import strykerCleanupTransformer from './transformers/stryker-cleanup.js';

const parsers = {
  columns: columnsParser,
  embed: embedParser,
  cards: cardsParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.stryker.com/us/en/index.html',
  ],
  blocks: [
    { name: 'embed', instances: ['.standalonevideo .c-standalone-video'] },
    { name: 'columns', instances: ['.cols2 > .colctrl', '.cols4 > .colctrl', '.experienceFragment'] },
    { name: 'cards', instances: ['.experienceFragment:has(.buildingblock)', '.customizable .c-customizeable', '.latestnews'] },
  ],
  sections: [],
};

const transformers = [
  strykerCleanupTransformer,
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '').replace(/\/index$/, ''),
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
