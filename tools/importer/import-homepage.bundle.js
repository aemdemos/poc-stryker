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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/columns.js
  function extractComponentContent(component, document) {
    const items = [];
    const cls = component.className || "";
    if (cls.includes("standaloneimage")) {
      const imgLink = component.querySelector("a");
      const img = component.querySelector("img");
      if (imgLink && img) {
        const link = document.createElement("a");
        link.href = imgLink.href;
        link.appendChild(img.cloneNode(true));
        items.push(link);
      } else if (img) {
        items.push(img);
      }
    } else if (cls.includes("largeheadline")) {
      const lines = component.querySelectorAll(".line");
      let headingText = "";
      lines.forEach((line) => {
        const t = line.textContent.trim();
        if (t) headingText += (headingText ? " " : "") + t;
      });
      if (!headingText) headingText = component.textContent.trim();
      if (headingText) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = headingText;
        p.appendChild(strong);
        items.push(p);
      }
    } else if (cls.includes("text") && cls.includes("parbase") || component.querySelector(".c-rich-text-editor")) {
      const richTextAreas = component.querySelectorAll('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');
      richTextAreas.forEach((area) => {
        const contentElements = area.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > ul, :scope > ol");
        contentElements.forEach((el) => items.push(el));
      });
    } else if (cls.includes("curatedcta")) {
      const cta = component.querySelector("a.btn");
      if (cta) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.href = cta.href;
        link.textContent = cta.textContent.trim();
        p.appendChild(link);
        items.push(p);
      }
    } else if (cls.includes("standalonevideo")) {
      const dm = component.querySelector("[data-asset-name]");
      if (dm) {
        const server = dm.getAttribute("data-videoserver") || "https://media-assets.stryker.com/is/content/";
        const assetName = dm.getAttribute("data-asset-name");
        if (assetName) {
          const baseName = assetName.replace(/\.[^.]+$/, "");
          const videoUrl = `${server}stryker/${baseName}`;
          const link = document.createElement("a");
          link.href = videoUrl;
          link.textContent = videoUrl;
          items.push(link);
        }
      }
    }
    return items;
  }
  function extractColumnContent(col, document) {
    const cell = [];
    const innerRow = col.querySelector(":scope > .row");
    if (!innerRow) return cell;
    const components = innerRow.querySelectorAll(":scope > div");
    components.forEach((component) => {
      const items = extractComponentContent(component, document);
      items.forEach((item) => cell.push(item));
    });
    return cell;
  }
  function isImageOnlyCell(cell) {
    return cell.length === 1 && (cell[0].tagName === "IMG" || cell[0].tagName === "A");
  }
  function isTextOnlyCell(cell) {
    return cell.length > 0 && cell.every((el) => {
      var _a;
      return !["IMG", "A"].includes(el.tagName) || ((_a = el.querySelector) == null ? void 0 : _a.call(el, "img")) === null;
    });
  }
  function parseTextColumnsEF(element, document) {
    const grid = element.querySelector(".aem-Grid");
    if (!grid) return null;
    const textBlocks = grid.querySelectorAll(":scope > .text.parbase");
    if (textBlocks.length < 2) return null;
    const contentRow = [];
    textBlocks.forEach((tb) => {
      const cell = [];
      const richTexts = tb.querySelectorAll('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');
      richTexts.forEach((rt) => {
        const elements = rt.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > ul, :scope > ol");
        elements.forEach((el) => cell.push(el));
      });
      contentRow.push(cell);
    });
    return contentRow;
  }
  function parseImageGalleryEF(element, document) {
    const bb = element.querySelector(".buildingblock");
    if (!bb) return null;
    const grid = bb.querySelector(".xf-master-building-block, .aem-Grid");
    if (!grid) return null;
    const images = grid.querySelectorAll(":scope > .standaloneimage");
    if (images.length < 2) return null;
    const beforeElements = [];
    const afterElements = [];
    const imageRow = [];
    let pastImages = false;
    [...grid.children].forEach((child) => {
      const cls = child.className || "";
      if (cls.includes("standaloneimage")) {
        const img = child.querySelector("img");
        if (img) imageRow.push([img]);
        pastImages = true;
      } else if (!pastImages) {
        const items = extractComponentContent(child, document);
        items.forEach((item) => beforeElements.push(item));
      } else {
        const items = extractComponentContent(child, document);
        items.forEach((item) => afterElements.push(item));
      }
    });
    if (imageRow.length < 2) return null;
    return { beforeElements, imageRow, afterElements };
  }
  function parse(element, { document }) {
    if (!element.isConnected) return;
    if (element.classList.contains("experienceFragment")) {
      const gallery = parseImageGalleryEF(element, document);
      if (gallery && gallery.imageRow.length >= 2) {
        const container = document.createElement("div");
        gallery.beforeElements.forEach((el) => container.appendChild(el));
        const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [gallery.imageRow] });
        container.appendChild(block2);
        gallery.afterElements.forEach((el) => container.appendChild(el));
        element.replaceWith(container);
        return;
      }
      const contentRow2 = parseTextColumnsEF(element, document);
      if (contentRow2 && contentRow2.length >= 2) {
        const cells2 = [contentRow2];
        const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: cells2 });
        element.replaceWith(block2);
      }
      return;
    }
    const row = element.querySelector(":scope > .row");
    if (!row) return;
    const columns = row.querySelectorAll(':scope > [class*="col-"]');
    if (columns.length < 2) return;
    const rawCells = [];
    columns.forEach((col) => {
      rawCells.push(extractColumnContent(col, document));
    });
    let contentRow;
    if (rawCells.length >= 4 && rawCells.length % 2 === 0 && rawCells.every((c, i) => i % 2 === 0 ? isImageOnlyCell(c) : isTextOnlyCell(c))) {
      contentRow = [];
      for (let i = 0; i < rawCells.length; i += 2) {
        contentRow.push([...rawCells[i], ...rawCells[i + 1]]);
      }
    } else {
      contentRow = rawCells;
    }
    const cells = [contentRow];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function parse2(element, { document }) {
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
    const link = document.createElement("a");
    link.href = url;
    link.textContent = url;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parseCustomizableItems(element, document) {
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
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = titleLink.href;
        a.textContent = titleLink.textContent.trim();
        h3.appendChild(a);
        textCell.push(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
      if (actionLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = actionLink.href;
        a.textContent = actionLink.textContent.trim();
        p.appendChild(a);
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    return cells;
  }
  function parseBuildingBlocks(element, document) {
    const blocks = element.querySelectorAll(".buildingblock");
    if (blocks.length < 2) return null;
    const cells = [];
    blocks.forEach((block) => {
      const imgLink = block.querySelector(".standaloneimage a");
      const img = block.querySelector(".standaloneimage img");
      const richTexts = block.querySelectorAll('.c-rich-text-editor .left-to-right, .c-rich-text-editor [class*="left-to-right"]');
      const imageCell = [];
      if (imgLink && img) {
        const link = document.createElement("a");
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
  function parseLatestNews(element, document) {
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
        const heading = document.createElement("h3");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = h3.textContent.trim();
        heading.appendChild(a);
        textCell.push(heading);
      } else if (h3) {
        const heading = document.createElement("h3");
        heading.textContent = h3.textContent.trim();
        textCell.push(heading);
      }
      if (desc && desc.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
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
  function parse3(element, { document }) {
    const isLatestNews = !!element.querySelector(".c-latestnews, .latestnews-container");
    const cells = isLatestNews ? parseLatestNews(element, document) : parseCustomizableItems(element, document) || parseBuildingBlocks(element, document);
    if (!cells || !cells.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
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

  // tools/importer/import-homepage.js
  var parsers = {
    columns: parse,
    embed: parse2,
    cards: parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.stryker.com/us/en/index.html"
    ],
    blocks: [
      { name: "embed", instances: [".standalonevideo .c-standalone-video"] },
      { name: "columns", instances: [".cols2 > .colctrl", ".cols4 > .colctrl", ".experienceFragment"] },
      { name: "cards", instances: [".experienceFragment:has(.buildingblock)", ".customizable .c-customizeable", ".latestnews"] }
    ],
    sections: []
  };
  var transformers = [
    transform
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
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seenAssets = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "").replace(/\/index$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
