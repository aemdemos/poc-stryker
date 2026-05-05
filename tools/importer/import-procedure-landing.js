/* eslint-disable */
/* global WebImporter */

import heroParser from './parsers/hero.js';
import sectionNavParser from './parsers/section-nav.js';
import columnsParser from './parsers/columns.js';
import tableParser from './parsers/table.js';
import cardsParser from './parsers/cards.js';

import strykerCleanup from './transformers/stryker-cleanup.js';
import strykerSections from './transformers/stryker-sections.js';

const parsers = {
  'hero': heroParser,
  'section-nav': sectionNavParser,
  'columns': columnsParser,
  'table': tableParser,
  'cards': cardsParser,
};

const PAGE_TEMPLATE = {
  name: 'procedure-landing',
  description: 'Procedure/product landing page with hero, sticky section navigation, and multiple content sections covering procedural overview, videos, education, implants, robotics, instrumentation, and patient positioning',
  urls: [
    'https://www.stryker.com/us/en/joint-replacement/procedures/dart-direct-anterior-reconstructive-technology.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: [
        '.carouselslidegroup .autoplay-slide',
        '.experienceFragment:last-of-type',
      ],
    },
    {
      name: 'section-nav',
      instances: ['.c-navigation-bar'],
    },
    {
      name: 'columns',
      instances: ['.cols2_1-3_2-3', '.cols2'],
    },
    {
      name: 'table',
      instances: ['.cols2_1-3_2-3 .c-table table'],
    },
    {
      name: 'cards',
      instances: [
        '.cols3',
        '.experienceFragment .aem-Grid--12 > .buildingblock',
      ],
    },
  ],
  sections: [
    { id: 'hero', name: 'Hero Banner', selector: '.carouselslidegroup', style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'section-nav', name: 'Section Navigation', selector: '.c-navigation-bar', style: null, blocks: ['section-nav'], defaultContent: [] },
    { id: 'procedural-overview', name: 'Procedural Overview', selector: '.c-section-title#imtcpdak', style: null, blocks: ['columns', 'table'], defaultContent: ['.c-section-title#imtcpdak ~ .largeheadline h2', '.c-section-title#imtcpdak ~ .text .c-rich-text-editor', '.cols2_2-3_1-3 .c-largeheadline h3', '.cols2_2-3_1-3 .c-standalone-image a', '.cols2_2-3_1-3 .c-curatedcta a'] },
    { id: 'videos', name: 'Videos', selector: '.c-section-title#videos', style: null, blocks: ['cards'], defaultContent: ['.c-section-title#videos ~ .largeheadline h2'] },
    { id: 'medical-education', name: 'Medical Education', selector: '.c-section-title#medical-education', style: null, blocks: ['columns'], defaultContent: ['.c-section-title#medical-education ~ .largeheadline h2', '.c-section-title#medical-education ~ .cols .c-rich-text-editor'] },
    { id: 'implants', name: 'Implants', selector: '.c-section-title#rirwcxek', style: null, blocks: ['cards'], defaultContent: ['.c-section-title#rirwcxek ~ .largeheadline h2', '.c-section-title#rirwcxek ~ .experienceFragment .c-rich-text-editor:first-of-type'] },
    { id: 'mako-smartrobotics', name: 'Mako SmartRobotics', selector: '.c-section-title#feffidvj', style: null, blocks: ['columns'], defaultContent: ['.c-section-title#feffidvj ~ .largeheadline h2'] },
    { id: 'instrumentation', name: 'Instrumentation', selector: '.c-section-title#fcvigcqi', style: null, blocks: ['columns'], defaultContent: ['.c-section-title#fcvigcqi ~ .largeheadline h2'] },
    { id: 'patient-positioning-equipment', name: 'Patient Positioning Equipment', selector: '.c-section-title#zamxgyls', style: null, blocks: ['columns'], defaultContent: ['.c-section-title#zamxgyls ~ .largeheadline h2'] },
    { id: 'asc-promotion', name: 'ASC Promotion', selector: ['.c-section-title#zamxgyls ~ .sectionseparator ~ .largeheadline', '.experienceFragment:last-of-type'], style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'references', name: 'References', selector: '.c-rich-text-editor:has(ol)', style: null, blocks: [], defaultContent: ['.c-rich-text-editor:has(ol)'] },
  ],
};

const transformers = [
  strykerCleanup,
  strykerSections,
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
