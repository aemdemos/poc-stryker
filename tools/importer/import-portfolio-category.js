/* eslint-disable */
/* global WebImporter */

import parser from './parsers/portfolio-category.js';
import transformer from './transformers/portfolio-category.js';

const PAGE_TEMPLATE = {
  name: 'portfolio-category',
  description: 'Portfolio product category page showcasing a product line with hero, product features, related products, and resources',
  urls: [
    'https://www.stryker.com/us/en/portfolios/medical-surgical-equipment/bedframes.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.c-page-hero-content'],
    },
    {
      name: 'product-filters',
      instances: ['.c-filtered-content-type-grid'],
    },
    {
      name: 'cards',
      instances: [
        '.c-high-level-cta .cta-container',
        '.c-filtered-content-type-grid .products-container',
      ],
    },
    {
      name: 'columns',
      instances: ['.c-feature-content-context .feature-content-context-content'],
    },
  ],
  sections: [
    { id: 'section-hero', name: 'Page Hero', selector: '.c-page-hero', style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'section-category-ctas', name: 'Category Navigation Cards', selector: '.c-high-level-cta', style: null, blocks: ['cards'], defaultContent: [] },
    { id: 'section-product-grid', name: 'Product Grid', selector: '.c-filtered-content-type-grid', style: null, blocks: ['product-filters', 'cards'], defaultContent: [] },
    { id: 'section-featured-content', name: 'Featured Content', selector: '.c-feature-content-context', style: null, blocks: ['columns'], defaultContent: [] },
    { id: 'section-disclaimer', name: 'Disclaimer', selector: '.c-disclaimer', style: null, blocks: [], defaultContent: ['#publishedDate'] },
  ],
};

function executeTransformer(hookName, element, payload) {
  try {
    transformer(hookName, element, { ...payload, template: PAGE_TEMPLATE });
  } catch (e) {
    console.error(`Transformer failed at ${hookName}:`, e);
  }
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
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

    executeTransformer('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      try {
        parser(block.name, block.element, { document, url, params });
      } catch (e) {
        console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
      }
    });

    executeTransformer('afterTransform', main, payload);

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
