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

  // tools/importer/import-hub-page.js
  var import_hub_page_exports = {};
  __export(import_hub_page_exports, {
    default: () => import_hub_page_default
  });

  // tools/importer/parsers/embed.js
  function parse(element, { document: document2 }) {
    if (element.closest(".colctrl")) return;
    const dm = element.querySelector("[data-asset-path]") || element.querySelector("[data-asset-name]");
    if (!dm) return;
    const assetType = dm.getAttribute("data-asset-type") || "";
    let url;
    if (assetType === "spinset") {
      const imageServer = dm.getAttribute("data-imageserver") || "https://media-assets.stryker.com/is/image/";
      const assetPath = dm.getAttribute("data-asset-path");
      if (!assetPath) return;
      url = imageServer + assetPath;
    } else {
      const server = dm.getAttribute("data-videoserver") || "https://media-assets.stryker.com/is/content/";
      const assetName = dm.getAttribute("data-asset-name");
      if (!assetName) return;
      const baseName = assetName.replace(/\.[^.]+$/, "");
      url = `${server}stryker/${baseName}`;
    }
    const link = document2.createElement("a");
    link.href = url;
    link.textContent = url;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "embed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parseCustomizableItems(element, document2) {
    const items = element.querySelectorAll(".item");
    if (!items.length) return null;
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".img-cont img");
      const titleLink = item.querySelector(".desc-container h3 a");
      const description = item.querySelector(".desc-container p");
      const actionLink = item.querySelector(".desc-container a.action-link");
      const imageCell = [];
      if (img) imageCell.push(img);
      const textCell = [];
      if (titleLink) {
        const h3 = document2.createElement("h3");
        const a = document2.createElement("a");
        a.href = titleLink.href;
        a.textContent = titleLink.textContent.trim();
        h3.appendChild(a);
        textCell.push(h3);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
      if (actionLink) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = actionLink.href;
        a.textContent = actionLink.textContent.trim();
        p.appendChild(a);
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    return cells;
  }
  function parseBuildingBlocks(element, document2) {
    const blocks = element.querySelectorAll(".buildingblock");
    if (blocks.length < 2) return null;
    const cells = [];
    blocks.forEach((block) => {
      const imgLink = block.querySelector(".standaloneimage a");
      const img = block.querySelector(".standaloneimage img");
      const richTexts = block.querySelectorAll('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');
      const imageCell = [];
      if (imgLink && img) {
        const link = document2.createElement("a");
        link.href = imgLink.href;
        link.appendChild(img.cloneNode(true));
        imageCell.push(link);
      } else if (img) {
        imageCell.push(img);
      }
      const textCell = [];
      richTexts.forEach((rt) => {
        const elements = rt.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > ul, :scope > ol");
        elements.forEach((el) => textCell.push(el));
      });
      if (imageCell.length || textCell.length) {
        cells.push([imageCell, textCell]);
      }
    });
    return cells.length >= 2 ? cells : null;
  }
  function parseLatestNews(element, document2) {
    const items = element.querySelectorAll(".item");
    if (!items.length) return null;
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(":scope > img");
      const h3 = item.querySelector("h3");
      const desc = item.querySelector(".description");
      const link = item.querySelector("a.news-link");
      const imageCell = [];
      if (img) imageCell.push(img);
      const textCell = [];
      if (h3 && link) {
        const heading = document2.createElement("h3");
        const a = document2.createElement("a");
        a.href = link.href;
        a.textContent = h3.textContent.trim();
        heading.appendChild(a);
        textCell.push(heading);
      } else if (h3) {
        const heading = document2.createElement("h3");
        heading.textContent = h3.textContent.trim();
        textCell.push(heading);
      }
      if (desc && desc.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (link) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        p.appendChild(a);
        textCell.push(p);
      }
      if (imageCell.length || textCell.length) {
        cells.push([imageCell, textCell]);
      }
    });
    return cells;
  }
  function parse2(element, { document: document2 }) {
    const isLatestNews = !!element.querySelector(".c-latestnews, .latestnews-container");
    const cells = isLatestNews ? parseLatestNews(element, document2) : parseCustomizableItems(element, document2) || parseBuildingBlocks(element, document2);
    if (!cells || !cells.length) return;
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards", cells });
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
      element.querySelectorAll(".carouselslidegroup p[id]").forEach((p) => p.remove());
      element.querySelectorAll(".colctrl").forEach((col) => {
        var _a;
        const row = col.querySelector(":scope > .row");
        if (row && row.textContent.trim() === "" && !row.querySelector("img, video, a")) {
          (_a = col.closest(".cols, .cols2, .cols3, .cols4")) == null ? void 0 : _a.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      element.querySelectorAll('img[src*="?$"]').forEach((img) => {
        img.src = img.src.replace(/\?\$[^$]*\$$/, "");
      });
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

  // tools/importer/transformers/product-page-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const doc = element.ownerDocument || document;
    const markers = [];
    const sectionTitles = element.querySelectorAll(".section-title");
    sectionTitles.forEach((st) => markers.push(st));
    const disclaimer = element.querySelector(".c-disclaimer");
    if (disclaimer) markers.push(disclaimer);
    markers.forEach((marker) => {
      const hr = doc.createElement("hr");
      marker.before(hr);
    });
  }

  // tools/importer/import-hub-page.js
  var parsers = {
    embed: parse,
    cards: parse2
  };
  var PAGE_TEMPLATE = {
    name: "hub-page",
    urls: [
      "https://www.stryker.com/us/en/training-and-education.html"
    ],
    blocks: [
      { name: "embed", instances: [".standalonevideo .c-standalone-video"] },
      { name: "cards", instances: [".experienceFragment:has(.buildingblock)"] }
    ],
    sections: [
      { id: "section-1", name: "Hero and Intro", selector: ".carouselslidegroup", style: null, blocks: ["embed"], defaultContent: [".largeheadline", ".c-rich-text-editor"] },
      { id: "section-2", name: "Nurses and Physician Assistants", selector: ".section-title:nth-of-type(1)", style: null, blocks: ["cards"], defaultContent: [] },
      { id: "section-3", name: "Emergency Care", selector: ".section-title:nth-of-type(2)", style: null, blocks: ["cards"], defaultContent: [] },
      { id: "section-4", name: "Surgeons Residents Fellows", selector: ".section-title:nth-of-type(3)", style: null, blocks: ["cards"], defaultContent: [] },
      { id: "section-5", name: "General Public", selector: ".section-title:nth-of-type(4)", style: null, blocks: ["cards"], defaultContent: [] },
      { id: "section-6", name: "Training Calendar", selector: ".section-title:nth-of-type(5)", style: null, blocks: [], defaultContent: [".largeheadline", ".c-rich-text-editor"] }
    ]
  };
  var transformers = [
    transform,
    transform2
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
    const seenAssets = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((element) => {
          const dm = element.querySelector("[data-asset-name]");
          if (dm) {
            const assetName = dm.getAttribute("data-asset-name");
            if (seenAssets.has(assetName)) return;
            seenAssets.add(assetName);
          }
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
  var import_hub_page_default = {
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
  return __toCommonJS(import_hub_page_exports);
})();
