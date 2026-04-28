/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import strykerCleanupTransformer from './transformers/stryker-cleanup.js';
import strykerSectionsTransformer from './transformers/stryker-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'training-article',
  description: 'Training and education article page for Sage FocusRN pressure injury content',
  urls: [
    'https://www.stryker.com/us/en/training-and-education/medical-and-surgical-equipment--/sage/focusrn/pressure-injuries.html',
  ],
  blocks: [
    {
      name: 'columns',
      instances: [
        '.cols2 > .colctrl',
        '.cols2_1-3_2-3 > .colctrl',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Back Link and Logo',
      selector: '.experienceFragment > .xf-content-height > .aem-Grid > .text.parbase, .experienceFragment > .xf-content-height > .aem-Grid > .standaloneimage',
      style: null,
      blocks: [],
      defaultContent: [
        '.experienceFragment .text.parbase .c-rich-text-editor .left-to-right',
        '.experienceFragment .standaloneimage .c-standalone-image',
      ],
    },
    {
      id: 'section-2',
      name: 'Hero',
      selector: '.cols2',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Educational Courses',
      selector: ['#ebgoqkbe', '.section-title:has(#ebgoqkbe)'],
      style: null,
      blocks: ['columns'],
      defaultContent: ['#ebgoqkbe .component-subheading'],
    },
    {
      id: 'section-4',
      name: 'White Papers',
      selector: ['#aaptuzcm', '.section-title:has(#aaptuzcm)'],
      style: null,
      blocks: ['columns'],
      defaultContent: ['#aaptuzcm .component-subheading'],
    },
    {
      id: 'section-5',
      name: 'Implementation Tools',
      selector: ['#gjbrbovd', '.section-title:has(#gjbrbovd)'],
      style: null,
      blocks: ['columns'],
      defaultContent: ['#gjbrbovd .component-subheading'],
    },
    {
      id: 'section-6',
      name: 'Posters',
      selector: ['#qakslgbx', '.section-title:has(#qakslgbx)'],
      style: null,
      blocks: ['columns'],
      defaultContent: ['#qakslgbx .component-subheading'],
    },
    {
      id: 'section-7',
      name: 'Case Studies',
      selector: ['#igbwiggw', '.section-title:has(#igbwiggw)'],
      style: null,
      blocks: ['columns'],
      defaultContent: ['#igbwiggw .component-subheading'],
    },
    {
      id: 'section-8',
      name: 'Disclaimer',
      selector: '.c-disclaimer',
      style: null,
      blocks: [],
      defaultContent: ['.c-disclaimer'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  strykerCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [strykerSectionsTransformer] : []),
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
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    // Removed adjustImageUrls — keep absolute CDN URLs so DA can access them

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
