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

  // tools/importer/import-portfolio-category.js
  var import_portfolio_category_exports = {};
  __export(import_portfolio_category_exports, {
    default: () => import_portfolio_category_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const title = element.querySelector("h1, .title");
    const subtitle = element.querySelector("h2, .subhead");
    const description = element.querySelector("p.content, .c-page-hero-content > div > div > p");
    const heroImg = element.querySelector("picture img, img.img-responsive");
    if (heroImg) {
      const src = heroImg.getAttribute("src") || "";
      if (src.startsWith("./images/") || src.startsWith("/images/")) {
        const originalSrc = heroImg.getAttribute("data-original-src") || heroImg.getAttribute("data-src");
        if (originalSrc) {
          heroImg.setAttribute("src", originalSrc);
        }
      }
    }
    const cells = [];
    if (heroImg) {
      cells.push([heroImg]);
    }
    const contentContainer = document.createElement("div");
    if (title) contentContainer.append(title);
    if (subtitle) contentContainer.append(subtitle);
    if (description) contentContainer.append(description);
    cells.push([contentContainer]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const isHighLevelCta = !!element.closest(".c-high-level-cta") || !!element.querySelector(".c-high-level-cta-container");
    const isProductGrid = !!element.closest(".c-filtered-content-type-grid") || !!element.querySelector(".product-item");
    if (isHighLevelCta) {
      const ctaItems = element.querySelectorAll(".c-high-level-cta-container");
      ctaItems.forEach((item) => {
        const link = item.querySelector("a.c-high-level-cta-link, a[href]");
        const label = item.querySelector(".c-high-level-cta-label, a.c-high-level-cta-label");
        const href = link ? link.getAttribute("href") : "";
        const labelText = label ? label.textContent.trim() : "";
        let img = item.querySelector("img");
        if (!img && link) {
          const style = link.getAttribute("style") || "";
          const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/i);
          if (bgMatch) {
            let imgUrl = bgMatch[1].replace(/\\2f/gi, "/").replace(/\\27/gi, "'").replace(/\\22/gi, '"');
            img = document.createElement("img");
            img.setAttribute("src", imgUrl);
            img.setAttribute("alt", labelText);
          }
        }
        const textCell = document.createElement("div");
        if (labelText) {
          const heading = document.createElement("h4");
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = labelText;
          heading.append(a);
          textCell.append(heading);
        }
        if (img) {
          cells.push([img, textCell]);
        } else {
          cells.push([textCell]);
        }
      });
    } else if (isProductGrid) {
      const tagLabelMap = /* @__PURE__ */ new Map();
      const filterLabels = /* @__PURE__ */ new Map();
      const gridRoot = element.closest(".c-filtered-content-type-grid") || element.parentElement;
      if (gridRoot) {
        gridRoot.querySelectorAll(".filters-container select").forEach((sel) => {
          var _a, _b, _c;
          const filterName = sel.id || ((_c = (_b = (_a = sel.closest('[class*="col-"]')) == null ? void 0 : _a.querySelector(".filter-name")) == null ? void 0 : _b.textContent) == null ? void 0 : _c.trim()) || "";
          [...sel.options].forEach((opt) => {
            if (opt.value && opt.value !== "all") {
              tagLabelMap.set(opt.value, opt.textContent.trim());
              filterLabels.set(opt.value, filterName);
            }
          });
        });
      }
      const productItems = element.querySelectorAll(".product-item");
      productItems.forEach((item) => {
        const link = item.querySelector(":scope > a[href]");
        const img = item.querySelector(".img-container img, img.img-responsive");
        const nameEl = item.querySelector("h4.component-subheading, h4");
        const href = link ? link.getAttribute("href") : "";
        const productName = nameEl ? nameEl.textContent.trim() : "";
        const imgAlt = img ? img.getAttribute("alt") || productName : productName;
        if (img) {
          const src = img.getAttribute("src") || "";
          if (src.startsWith("./images/") || src.startsWith("/images/")) {
            const originalSrc = img.getAttribute("data-original-src") || img.getAttribute("data-src");
            if (originalSrc) {
              img.setAttribute("src", originalSrc);
            }
          }
          if (!img.getAttribute("alt")) {
            img.setAttribute("alt", imgAlt);
          }
        }
        const textCell = document.createElement("div");
        if (productName) {
          const heading = document.createElement("h4");
          if (href) {
            const a = document.createElement("a");
            a.setAttribute("href", href);
            a.textContent = productName;
            heading.append(a);
          } else {
            heading.textContent = productName;
          }
          textCell.append(heading);
        }
        const flagEl = item.querySelector(".display-product-flag");
        if (flagEl && flagEl.textContent.trim()) {
          const flagP = document.createElement("p");
          flagP.textContent = flagEl.textContent.trim();
          textCell.append(flagP);
        }
        const rawTags = item.getAttribute("data-tags") || "";
        if (rawTags && tagLabelMap.size > 0) {
          const tagPaths = rawTags.split(",").map((t) => t.trim());
          const grouped = /* @__PURE__ */ new Map();
          tagPaths.forEach((tp) => {
            const label = tagLabelMap.get(tp);
            const filterName = filterLabels.get(tp);
            if (label && filterName) {
              if (!grouped.has(filterName)) grouped.set(filterName, []);
              grouped.get(filterName).push(label);
            }
          });
          if (grouped.size > 0) {
            const anchor = textCell.querySelector("a[href]");
            if (anchor) {
              const tagObj = {};
              grouped.forEach((values, fName) => {
                tagObj[fName] = values;
              });
              anchor.setAttribute("href", `${anchor.getAttribute("href")}#tags=${encodeURIComponent(JSON.stringify(tagObj))}`);
            }
          }
        }
        if (img) {
          cells.push([img, textCell]);
        } else {
          cells.push([textCell]);
        }
      });
    }
    if (cells.length > 0) {
      const variantName = isHighLevelCta ? "Cards (highlight)" : "Cards (product)";
      const block = WebImporter.Blocks.createBlock(document, { name: variantName, cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const allText = element.textContent.trim();
    if (!allText) {
      element.remove();
      return;
    }
    const cells = [];
    const rows = element.querySelectorAll(":scope .row");
    let contentRow = null;
    for (const row of rows) {
      const cols = row.querySelectorAll(':scope > [class*="col-"]');
      if (cols.length >= 2) {
        contentRow = row;
        break;
      }
    }
    if (!contentRow) {
      element.remove();
      return;
    }
    const columns = contentRow.querySelectorAll(':scope > [class*="col-"]');
    const rowCells = [];
    columns.forEach((col) => {
      const cellContent = document.createElement("div");
      const title = col.querySelector(".feature-content-context-title h3, h3");
      if (title && title.textContent.trim()) {
        cellContent.append(title);
      }
      const desc = col.querySelector(".m-c-subheading-description");
      if (desc) {
        const h4 = desc.querySelector("h4");
        const h5 = desc.querySelector("h5");
        if (h4 && h4.textContent.trim()) cellContent.append(h4);
        if (h5 && h5.textContent.trim()) cellContent.append(h5);
      }
      const featureItems = col.querySelectorAll(".feature-content-context-item");
      featureItems.forEach((item) => {
        const img = item.querySelector("img, a > img");
        const link = item.querySelector("a[href]");
        const heading = item.querySelector("h4");
        const subheading = item.querySelector("h5");
        const itemLink = item.querySelector(".feature-content-context-item-lnk a");
        if (img) cellContent.append(img);
        if (heading && heading.textContent.trim()) cellContent.append(heading);
        if (subheading && subheading.textContent.trim()) cellContent.append(subheading);
        if (itemLink && itemLink.textContent.trim()) cellContent.append(itemLink);
      });
      if (cellContent.textContent.trim() || cellContent.querySelector("img")) {
        rowCells.push(cellContent);
      }
    });
    if (rowCells.length > 0) {
      cells.push(rowCells);
      const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
      element.replaceWith(block);
    } else {
      element.remove();
    }
  }

  // tools/importer/parsers/product-filters.js
  function parse4(element, { document }) {
    const selects = element.querySelectorAll("select");
    if (selects.length === 0) return;
    const cells = [];
    selects.forEach((select) => {
      var _a, _b, _c;
      const label = select.id || ((_c = (_b = (_a = select.closest('[class*="col-"]')) == null ? void 0 : _a.querySelector(".filter-name")) == null ? void 0 : _b.textContent) == null ? void 0 : _c.trim()) || "Filter";
      const options = [...select.options].filter((o) => o.value !== "all" && o.textContent.trim().toLowerCase() !== "show all").map((o) => o.textContent.trim()).filter(Boolean);
      if (options.length > 0) {
        const labelCell = document.createElement("div");
        labelCell.textContent = "Filter";
        const labelVal = document.createElement("div");
        labelVal.textContent = label;
        cells.push([labelCell, labelVal]);
        const optCell = document.createElement("div");
        optCell.textContent = "Options";
        const optVal = document.createElement("div");
        optVal.textContent = options.join(", ");
        cells.push([optCell, optVal]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "Product Filters",
        cells
      });
      element.replaceWith(block);
    } else {
      element.remove();
    }
  }

  // tools/importer/transformers/stryker-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#cookie-alert",
        ".c-cookie-alert",
        "#c-country-switch-modal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "input#indexUrl",
        "input#hdnRunMode",
        "input#hdnShowAlert",
        "input#hdnAlertTitle",
        "input#hdnAlertMsg",
        "input#hdnAlertContBtnText",
        "input#hdnAlertCancelBtnText",
        "input#hdnDisplayHcpConfirmation",
        "input#hdnShowFooter",
        "input#businessUnitTag",
        "input#hiddenPublishedDate"
      ]);
      const trackingImgs = element.querySelectorAll('img[src*="telemetry.stryker.com"]');
      trackingImgs.forEach((img) => img.remove());
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "header.g-header",
        "footer#footer",
        "footer.footer",
        ".g-megamenu",
        ".g-hcpbanner"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".c-back-to-top",
        ".no-results",
        ".button-container",
        ".filter-content"
      ]);
      element.querySelectorAll(".section-title").forEach((el) => {
        if (!el.closest(".c-filtered-content-type-grid")) {
          el.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [
        '[class*="breadcrumb"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/stryker-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload || {};
      const sections = template && template.sections;
      if (!sections || sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sectionData = [];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-portfolio-category.js
  var PAGE_TEMPLATE = {
    name: "portfolio-category",
    description: "Portfolio product category page showcasing a product line with hero, product features, related products, and resources",
    urls: [
      "https://www.stryker.com/us/en/portfolios/medical-surgical-equipment/bedframes.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: [
          ".c-page-hero-content"
        ]
      },
      {
        name: "cards",
        instances: [
          ".c-high-level-cta .cta-container",
          ".c-filtered-content-type-grid .products-container"
        ]
      },
      {
        name: "product-filters",
        instances: [
          ".c-filtered-content-type-grid .filters-container"
        ]
      },
      {
        name: "columns",
        instances: [
          ".c-feature-content-context .feature-content-context-content"
        ]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Page Hero",
        selector: ".c-page-hero",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-category-ctas",
        name: "Category Navigation Cards",
        selector: ".c-high-level-cta",
        style: null,
        blocks: ["cards"],
        defaultContent: []
      },
      {
        id: "section-product-grid",
        name: "Product Grid",
        selector: ".c-filtered-content-type-grid",
        style: null,
        blocks: ["product-filters", "cards"],
        defaultContent: []
      },
      {
        id: "section-featured-content",
        name: "Featured Content",
        selector: ".c-feature-content-context",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-disclaimer",
        name: "Disclaimer",
        selector: ".c-disclaimer",
        style: null,
        blocks: [],
        defaultContent: ["#publishedDate"]
      }
    ]
  };
  var parsers = {
    "hero": parse,
    "cards": parse2,
    "product-filters": parse4,
    "columns": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
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
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_portfolio_category_default = {
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
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
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
  return __toCommonJS(import_portfolio_category_exports);
})();
