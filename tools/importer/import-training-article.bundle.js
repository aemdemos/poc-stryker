var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-training-article.js
  var import_training_article_exports = {};
  __export(import_training_article_exports, {
    default: () => import_training_article_default
  });

  // tools/importer/parsers/columns.js
  function extractColumnContent(col, document2) {
    const cell = [];
    const imgLink = col.querySelector(".standaloneimage a");
    const img = col.querySelector(".standaloneimage img");
    if (imgLink && img) {
      const link = document2.createElement("a");
      link.href = imgLink.href;
      link.appendChild(img.cloneNode(true));
      cell.push(link);
    } else if (img) {
      cell.push(img);
    }
    const richTextArea = col.querySelector('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');
    if (richTextArea) {
      const contentElements = richTextArea.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > ul, :scope > ol");
      contentElements.forEach((el) => {
        cell.push(el);
      });
    }
    const cta = col.querySelector(".curatedcta a.btn");
    if (cta) {
      const ctaParagraph = document2.createElement("p");
      const ctaLink = document2.createElement("a");
      ctaLink.href = cta.href;
      ctaLink.textContent = cta.textContent.trim();
      ctaParagraph.appendChild(ctaLink);
      cell.push(ctaParagraph);
    }
    return cell;
  }
  function parse(element, { document: document2 }) {
    const row = element.querySelector(":scope > .row");
    if (!row) return;
    const columns = row.querySelectorAll(':scope > [class*="col-"]');
    if (columns.length < 2) return;
    const contentRow = [];
    columns.forEach((col) => {
      contentRow.push(extractColumnContent(col, document2));
    });
    const cells = [contentRow];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/stryker-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#cookie-alert",
        "#onetrust-consent-sdk",
        "#ot-sdk-btn-floating",
        "#c-country-switch-modal",
        ".overlay.hidden-md.hidden-lg"
      ]);
      const hiddenInputs = element.querySelectorAll(
        'input[id="indexUrl"], input[id^="hdn"], input[id="hiddenPublishedDate"], input[id="businessUnitTag"]'
      );
      hiddenInputs.forEach((input) => input.remove());
      const carouselConfigs = element.querySelectorAll(".carouselslidegroup");
      carouselConfigs.forEach((cfg) => cfg.remove());
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "footer#footer",
        ".jumpbarnav",
        ".c-back-to-top",
        ".localpagenavigation",
        "hr.c-section-separator",
        "noscript",
        "iframe",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/stryker-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const doc = element.ownerDocument || document;
    const markers = [];
    const hero = element.querySelector('.cols2:not([class*="_"])');
    if (hero) markers.push(hero);
    const sectionTitles = element.querySelectorAll(".section-title");
    sectionTitles.forEach((st) => markers.push(st));
    const disclaimer = element.querySelector(".c-disclaimer");
    if (disclaimer) markers.push(disclaimer);
    markers.forEach((marker) => {
      const hr = doc.createElement("hr");
      marker.before(hr);
    });
  }

  // tools/importer/import-training-article.js
  var parsers = {
    "columns": parse
  };
  var PAGE_TEMPLATE = {
    name: "training-article",
    description: "Training and education article page for Sage FocusRN pressure injury content",
    urls: [
      "https://www.stryker.com/us/en/training-and-education/medical-and-surgical-equipment--/sage/focusrn/pressure-injuries.html"
    ],
    blocks: [
      {
        name: "columns",
        instances: [
          ".cols2 > .colctrl",
          ".cols2_1-3_2-3 > .colctrl"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Back Link and Logo",
        selector: ".experienceFragment > .xf-content-height > .aem-Grid > .text.parbase, .experienceFragment > .xf-content-height > .aem-Grid > .standaloneimage",
        style: null,
        blocks: [],
        defaultContent: [
          ".experienceFragment .text.parbase .c-rich-text-editor .left-to-right",
          ".experienceFragment .standaloneimage .c-standalone-image"
        ]
      },
      {
        id: "section-2",
        name: "Hero",
        selector: ".cols2",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Educational Courses",
        selector: ["#ebgoqkbe", ".section-title:has(#ebgoqkbe)"],
        style: null,
        blocks: ["columns"],
        defaultContent: ["#ebgoqkbe .component-subheading"]
      },
      {
        id: "section-4",
        name: "White Papers",
        selector: ["#aaptuzcm", ".section-title:has(#aaptuzcm)"],
        style: null,
        blocks: ["columns"],
        defaultContent: ["#aaptuzcm .component-subheading"]
      },
      {
        id: "section-5",
        name: "Implementation Tools",
        selector: ["#gjbrbovd", ".section-title:has(#gjbrbovd)"],
        style: null,
        blocks: ["columns"],
        defaultContent: ["#gjbrbovd .component-subheading"]
      },
      {
        id: "section-6",
        name: "Posters",
        selector: ["#qakslgbx", ".section-title:has(#qakslgbx)"],
        style: null,
        blocks: ["columns"],
        defaultContent: ["#qakslgbx .component-subheading"]
      },
      {
        id: "section-7",
        name: "Case Studies",
        selector: ["#igbwiggw", ".section-title:has(#igbwiggw)"],
        style: null,
        blocks: ["columns"],
        defaultContent: ["#igbwiggw .component-subheading"]
      },
      {
        id: "section-8",
        name: "Disclaimer",
        selector: ".c-disclaimer",
        style: null,
        blocks: [],
        defaultContent: [".c-disclaimer"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_training_article_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_training_article_exports);
})();
