/* eslint-disable */
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

  // tools/importer/import-sage-product-page.js
  var import_sage_product_page_exports = {};
  __export(import_sage_product_page_exports, {
    default: () => import_sage_product_page_default
  });

  // tools/importer/parsers/hcp-banner.js
  function parse(element, { document }) {
    const h3 = element.querySelector("h3");
    const text = h3 ? h3.textContent.trim() : "Information for healthcare professionals";
    const contentCell = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = text;
    contentCell.appendChild(p);
    const cells = [
      ["HCP Banner"],
      [contentCell]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/hero.js
  function resolveImageUrl(img, document) {
    const src = img ? img.src : "";
    if (!src) return src;
    if (src.includes("/content/dam/")) return src;
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && ogImage.content) {
      return ogImage.content;
    }
    if (src.includes("media-assets.stryker.com/is/image/")) {
      return src.split("?")[0];
    }
    return src;
  }
  function parse2(element, { document }) {
    const img = element.querySelector(".c-standalone-image img");
    const overlay = element.querySelector(".overlayparsys");
    const h1 = overlay ? overlay.querySelector("h1") : element.querySelector("h1");
    const h2 = overlay ? overlay.querySelector("h2") : element.querySelector("h2");
    const desc = overlay ? overlay.querySelector("p") : null;
    const cta = overlay ? overlay.querySelector(".curatedcta a, a.btn") : element.querySelector("a.btn");
    const contentCell = document.createElement("div");
    if (h1) contentCell.appendChild(h1.cloneNode(true));
    if (h2) contentCell.appendChild(h2.cloneNode(true));
    if (desc) contentCell.appendChild(desc.cloneNode(true));
    if (cta) contentCell.appendChild(cta.cloneNode(true));
    const cells = [["Hero"]];
    if (img) {
      const imgClone = document.createElement("img");
      imgClone.src = resolveImageUrl(img, document);
      imgClone.alt = img.alt || "";
      cells.push([imgClone, contentCell]);
    } else {
      cells.push([contentCell]);
    }
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/sticky-nav.js
  function parse3(element, { document }) {
    const anchors = element.querySelectorAll("a.anchor[data-linking]");
    const items = [];
    anchors.forEach((anchor) => {
      const text = anchor.textContent.trim();
      const linking = anchor.getAttribute("data-linking");
      if (text && !anchor.classList.contains("mobile-only-nav")) {
        items.push({ text, linking });
      }
    });
    if (items.length === 0) return;
    const contentCell = document.createElement("div");
    items.forEach((item) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = `#${item.linking}`;
      a.textContent = item.text;
      p.appendChild(a);
      contentCell.appendChild(p);
    });
    const cells = [
      ["Sticky Nav"],
      [contentCell]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/columns-overview.js
  function parse4(element, { document }) {
    const columns = element.querySelectorAll('.row > [class*="col-"]');
    if (columns.length < 2) return;
    const leftCol = columns[0];
    const rightCol = columns[1];
    const leftContent = document.createElement("div");
    const leftRte = leftCol.querySelector(".c-rich-text-editor div[style]");
    if (leftRte) {
      Array.from(leftRte.children).forEach((child) => {
        leftContent.appendChild(child.cloneNode(true));
      });
    }
    const rightContent = document.createElement("div");
    const rightRte = rightCol.querySelector(".c-rich-text-editor div[style]");
    if (rightRte) {
      Array.from(rightRte.children).forEach((child) => {
        rightContent.appendChild(child.cloneNode(true));
      });
    }
    const cells = [
      ["Columns"],
      [leftContent, rightContent]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/connect-banner.js
  function parse5(element, { document }) {
    const rte = element.querySelector(".has-background");
    if (!rte) return;
    const contentCell = document.createElement("div");
    Array.from(rte.children).forEach((child) => {
      contentCell.appendChild(child.cloneNode(true));
    });
    let style = "";
    if (rte.classList.contains("bg-gold")) style = "gold";
    else if (rte.classList.contains("bg-black")) style = "dark";
    const blockName = style ? `Banner (${style})` : "Banner";
    const cells = [
      [blockName],
      [contentCell]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/form.js
  function parse6(element, { document, url, params }) {
    const originalURL = params && params.originalURL || url || "https://www.stryker.com/us/en/sage/products/sage-air-pump.html";
    const pageUrl = new URL(originalURL);
    const pagePath = pageUrl.pathname.replace(/\.html$/, "").replace(/\/$/, "");
    const formJsonPath = `${pagePath}-form.json`;
    const formContainer = element.querySelector("[data-marketo-form-id]");
    const baseUrl = formContainer ? formContainer.getAttribute("data-marketo-base-url") : "//lp.stryker.com";
    const munchkinId = formContainer ? formContainer.getAttribute("data-marketo-munchkin-id") : "338-WAP-571";
    const formId = formContainer ? formContainer.getAttribute("data-marketo-form-id") : "2327";
    const submitUrl = `https:${baseUrl}/form/${munchkinId}/${formId}`;
    const formLink = document.createElement("a");
    formLink.href = formJsonPath;
    formLink.textContent = formJsonPath;
    const submitLink = document.createElement("a");
    submitLink.href = submitUrl;
    submitLink.textContent = submitUrl;
    const contentCell = document.createElement("div");
    const p1 = document.createElement("p");
    p1.appendChild(formLink);
    contentCell.appendChild(p1);
    const p2 = document.createElement("p");
    p2.appendChild(submitLink);
    contentCell.appendChild(p2);
    const cells = [
      ["Form"],
      [contentCell]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/tabs-resources.js
  function parse7(element, { document }) {
    const tabLinks = element.querySelectorAll(".tab-link");
    const tabContents = element.querySelectorAll(".tab-content");
    if (tabLinks.length === 0) return;
    const cells = [["Tabs"]];
    tabLinks.forEach((link, index) => {
      const label = link.textContent.trim();
      const content = tabContents[index];
      const contentCell = document.createElement("div");
      if (content) {
        const resources = content.querySelectorAll(".c-resourcesanddownload .item, .resourcesanddownload .item");
        resources.forEach((item) => {
          const itemLink = item.querySelector("a[href]");
          const title = item.querySelector("h5, .title");
          const img = item.querySelector("img");
          if (itemLink && title) {
            if (img) {
              const imgEl = document.createElement("img");
              imgEl.src = img.src;
              imgEl.alt = img.alt || title.textContent.trim();
              contentCell.appendChild(imgEl);
            }
            const p = document.createElement("p");
            const a = document.createElement("a");
            a.href = itemLink.href;
            a.textContent = title.textContent.trim();
            p.appendChild(a);
            contentCell.appendChild(p);
          }
        });
        const videos = content.querySelectorAll(".standalonevideo");
        videos.forEach((video) => {
          const videoTitle = video.querySelector("h3, .desc-content h3");
          const videoAsset = video.querySelector("[data-asset-path]");
          if (videoAsset) {
            const assetName = videoAsset.getAttribute("data-asset-name") || "";
            const videoServer = videoAsset.getAttribute("data-videoserver") || "https://media-assets.stryker.com/is/content/";
            const assetPath = videoAsset.getAttribute("data-asset-path") || "";
            if (videoTitle) {
              const h = document.createElement("h3");
              h.textContent = videoTitle.textContent.trim();
              contentCell.appendChild(h);
            }
            if (assetPath) {
              const videoUrl = `${videoServer}${assetPath}`;
              const videoLinkP = document.createElement("p");
              const videoLink = document.createElement("a");
              videoLink.href = videoUrl;
              videoLink.textContent = videoUrl;
              videoLinkP.appendChild(videoLink);
              const videoCells = [
                ["Video"],
                [videoLinkP]
              ];
              const videoTable = WebImporter.DOMUtils.createTable(videoCells, document);
              contentCell.appendChild(videoTable);
            }
          }
        });
      }
      if (contentCell.children.length > 0) {
        cells.push([label, contentCell]);
      } else {
        cells.push([label, ""]);
      }
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/columns-resources.js
  function parse8(element, { document }) {
    const sectionTitle = element.querySelector("#sage h2, .c-section-title h2");
    const buildingBlocks = element.querySelectorAll(".buildingblock .c-rich-text-editor div[style]");
    if (buildingBlocks.length < 3) return;
    if (sectionTitle) {
      const h2 = document.createElement("h2");
      h2.textContent = sectionTitle.textContent.trim();
      element.parentNode.insertBefore(h2, element);
    }
    const columnCells = [];
    const startIdx = buildingBlocks.length - 3;
    for (let i = startIdx; i < buildingBlocks.length; i++) {
      const block = buildingBlocks[i];
      const colContent = document.createElement("div");
      Array.from(block.children).forEach((child) => {
        colContent.appendChild(child.cloneNode(true));
      });
      columnCells.push(colContent);
    }
    const cells = [
      ["Columns"],
      columnCells
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/cleanup.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === "beforeTransform") {
      const selectorsToRemove = [
        "footer",
        ".breadcrumb",
        "#product-detail-container",
        ".c-tiles",
        ".c-cross-promotional",
        "script",
        "style",
        'link[rel="stylesheet"]',
        "noscript",
        "iframe",
        '[style*="display:none"]',
        "#localNav",
        "#localNavBgColor",
        "#trans",
        "#localNavTextColor",
        "#firstItem",
        "#hcpcheckbox",
        "#hcptextcolor",
        "#hcpTag",
        ".slider-nav",
        ".slick-dots",
        ".global-header",
        ".g-megamenu",
        ".g-footer"
      ];
      selectorsToRemove.forEach((selector) => {
        element.querySelectorAll(selector).forEach((el) => el.remove());
      });
      const hcpBanner = element.querySelector(".g-hcpbanner");
      if (hcpBanner && hcpBanner.closest("header")) {
        const header = hcpBanner.closest("header");
        header.parentNode.insertBefore(hcpBanner, header);
      }
      element.querySelectorAll("header").forEach((el) => el.remove());
      element.querySelectorAll("nav").forEach((nav) => {
        const parent = nav.parentNode;
        if (parent && (parent.closest(".c-navigation-bar") || parent.closest(".c-tabs"))) return;
        if (nav.closest(".c-navigation-bar") || nav.closest(".c-tabs")) return;
        nav.remove();
      });
      element.querySelectorAll('[class*="cookie"], [class*="consent"], [id*="onetrust"]').forEach((el) => el.remove());
      const body = document.body;
      if (body) {
        body.style.removeProperty("overflow");
      }
    }
    if (hookName === "afterTransform") {
      element.querySelectorAll('[aria-hidden="true"]').forEach((el) => {
        if (!el.closest("table")) el.remove();
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = img.src || img.getAttribute("src") || "";
        if (src.includes("media-assets.stryker.com/is/image/stryker/")) {
          const match = src.match(/\/is\/image\/stryker\/([^?]+)/);
          if (match) {
            const assetName = match[1];
            img.src = `https://www.stryker.com/content/dam/stryker/sage/images/${assetName}.png`;
          }
        }
      });
      element.querySelectorAll("div:empty").forEach((el) => {
        if (!el.closest("table")) el.remove();
      });
    }
  }

  // tools/importer/transformers/sections.js
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document } = payload;
    const main = element;
    const tables = main.querySelectorAll(":scope > div > table, :scope table");
    const blockTables = [];
    const walk = (node) => {
      if (node.tagName === "TABLE") {
        blockTables.push(node);
        return;
      }
      if (node.children) {
        Array.from(node.children).forEach(walk);
      }
    };
    Array.from(main.children).forEach((child) => {
      if (child.tagName === "TABLE") {
        blockTables.push(child);
      } else {
        child.querySelectorAll("table").forEach((t) => blockTables.push(t));
      }
    });
    let first = true;
    blockTables.forEach((table) => {
      const firstCell = table.querySelector("tr td, tr th");
      if (firstCell && firstCell.textContent.trim().toLowerCase() === "metadata") return;
      if (first) {
        first = false;
        return;
      }
      const hr = document.createElement("hr");
      table.parentNode.insertBefore(hr, table);
    });
  }

  // tools/importer/import-sage-product-page.js
  var parsers = {
    "hcp-banner": parse,
    "hero": parse2,
    "sticky-nav": parse3,
    "columns-overview": parse4,
    "connect-banner": parse5,
    "form": parse6,
    "tabs-resources": parse7,
    "columns-resources": parse8
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "sage-product-page",
    description: "Stryker Sage product detail pages with hero, overview, contact form, and resources",
    urls: [
      "https://www.stryker.com/us/en/sage/products/sage-air-pump.html"
    ],
    blocks: [
      {
        name: "hcp-banner",
        instances: [".g-hcpbanner"]
      },
      {
        name: "hero",
        instances: [".c-autocarousel"]
      },
      {
        name: "sticky-nav",
        instances: [".c-navigation-bar"]
      },
      {
        name: "columns-overview",
        instances: [".cols2 > .colctrl"]
      },
      {
        name: "connect-banner",
        instances: [".cols > .colctrl"]
      },
      {
        name: "form",
        instances: [".marketoform"]
      },
      {
        name: "tabs-resources",
        instances: [".c-tabs"]
      },
      {
        name: "columns-resources",
        instances: [".experiencefragment .xf-content-height:has(#sage)"]
      }
    ],
    sections: [
      {
        id: "section-hcp-banner",
        name: "HCP Banner",
        selector: ".g-hcpbanner",
        style: "",
        blocks: ["hcp-banner"],
        defaultContent: []
      },
      {
        id: "section-hero",
        name: "Hero",
        selector: ".c-autocarousel",
        style: "",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-sticky-nav",
        name: "Sticky Nav",
        selector: ".c-navigation-bar",
        style: "",
        blocks: ["sticky-nav"],
        defaultContent: []
      },
      {
        id: "section-overview",
        name: "Overview",
        selector: ".cols2",
        style: "",
        blocks: ["columns-overview"],
        defaultContent: []
      },
      {
        id: "section-connect-banner",
        name: "Connect Banner",
        selector: ".cols > .colctrl",
        style: "",
        blocks: ["connect-banner"],
        defaultContent: []
      },
      {
        id: "section-form",
        name: "Form",
        selector: ".marketoform",
        style: "",
        blocks: ["form"],
        defaultContent: []
      },
      {
        id: "section-tabs",
        name: "Resources Tabs",
        selector: ".c-tabs",
        style: "",
        blocks: ["tabs-resources"],
        defaultContent: []
      },
      {
        id: "section-resources-footer",
        name: "Resources Footer",
        selector: ".experiencefragment .xf-content-height:has(#sage)",
        style: "",
        blocks: ["columns-resources"],
        defaultContent: []
      }
    ]
  };
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
  var import_sage_product_page_default = {
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
  return __toCommonJS(import_sage_product_page_exports);
})();
