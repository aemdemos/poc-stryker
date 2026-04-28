/* eslint-disable */
/* global WebImporter */

import featureArticleEditorialTransformer from './transformers/feature-article-editorial.js';

const transformers = [featureArticleEditorialTransformer];

const PAGE_TEMPLATE = {
  name: 'feature-article-editorial',
  description: 'Editorial feature article with carousel hero, body text, quote, CTA banner, related news cards. Template 2D-v2.',
  urls: [],
  blocks: [],
};

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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    executeTransformers('afterTransform', main, payload);

    const newMain = document.querySelector('main') || document.body;
    WebImporter.rules.createMetadata(newMain, document);
    WebImporter.rules.transformBackgroundImages(newMain, document);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: newMain,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
      },
    }];
  },
};
