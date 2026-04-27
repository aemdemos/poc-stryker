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

  // tools/importer/import-product-detail.js
  var import_product_detail_exports = {};
  __export(import_product_detail_exports, {
    default: () => import_product_detail_default
  });

  // tools/importer/parsers/columns.js
  function parse(element, { document }) {
    const cols = element.querySelectorAll(':scope > [class*="col-"], :scope > .row > [class*="col-"]');
    if (cols.length < 2) return;
    const isHero = !!element.closest(".pagehero, .c-page-hero");
    const isDescription = !!element.closest("#product-detail-container");
    const isFeatureComparison = !!element.closest(".cols2_1-3_2-3");
    let cells;
    if (isHero) {
      const leftCol = cols[0];
      const rightCol = cols[1];
      const leftContent = [];
      const h1 = leftCol.querySelector("h1");
      const h2 = leftCol.querySelector("h2");
      const desc = leftCol.querySelector("p.content, p:not(:empty)");
      if (h1) leftContent.push(h1);
      if (h2) leftContent.push(h2);
      if (desc) leftContent.push(desc);
      const rightContent = [];
      const img = rightCol.querySelector("picture, img");
      if (img) rightContent.push(img);
      cells = [[leftContent, rightContent]];
    } else if (isDescription) {
      const leftCol = cols[0];
      const rightCol = cols[1];
      const leftContent = [];
      const heading = leftCol.querySelector("h3, .c-page-short-description h3");
      if (heading) leftContent.push(heading);
      const descDiv = leftCol.querySelector(".c-page-short-description-content");
      if (descDiv) {
        descDiv.querySelectorAll(":scope > p, :scope > ul").forEach((el) => {
          if (el.textContent.trim() || el.querySelector("img")) leftContent.push(el);
        });
      } else {
        leftCol.querySelectorAll("p, ul").forEach((el) => {
          if (el.textContent.trim()) leftContent.push(el);
        });
      }
      const rightContent = [];
      const tagcrumb = rightCol.querySelector(".c-tagcrumb");
      if (tagcrumb) {
        const catTitle = tagcrumb.querySelector("h4");
        if (catTitle) rightContent.push(catTitle);
        tagcrumb.querySelectorAll(".c-tagcrumb-item a").forEach((a) => {
          const p = document.createElement("p");
          p.appendChild(a.cloneNode(true));
          rightContent.push(p);
        });
      }
      const contactBtn = rightCol.querySelector(".c-contact-button a");
      if (contactBtn) rightContent.push(contactBtn);
      if (leftContent.length === 0 && rightContent.length === 0) return;
      cells = [[leftContent, rightContent]];
    } else if (isFeatureComparison) {
      const leftCol = cols[0];
      const rightCol = cols[1];
      const row1Left = [];
      const leftImg = leftCol.querySelector(".standaloneimage img, .c-standalone-image img");
      if (leftImg) row1Left.push(leftImg);
      leftCol.querySelectorAll(".c-rich-text-editor p").forEach((p) => {
        if (p.textContent.trim()) row1Left.push(p);
      });
      const row1Right = [];
      rightCol.querySelectorAll(".text.parbase .c-rich-text-editor").forEach((rt) => {
        rt.querySelectorAll("p").forEach((p) => {
          if (p.textContent.trim()) row1Right.push(p);
        });
      });
      const row2Left = [];
      const ctaTitle = rightCol.querySelector(".c-curatedcta .cta-title, .c-curatedcta h4");
      const ctaLink = rightCol.querySelector(".c-curatedcta a.btn, .c-curatedcta a.btn-teal");
      if (ctaTitle) row2Left.push(ctaTitle);
      if (ctaLink) row2Left.push(ctaLink);
      const row2Right = [];
      const figureImg = rightCol.querySelector(".standaloneimage img, .c-standalone-image img");
      if (figureImg) row2Right.push(figureImg);
      cells = [
        [row1Left, row1Right],
        [row2Left, row2Right]
      ];
    } else {
      const row = [];
      cols.forEach((col) => {
        const content = [];
        col.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol, img, a.btn, a.action-link").forEach((el) => {
          if (el.tagName === "P" && !el.textContent.trim() && !el.querySelector("img")) return;
          content.push(el);
        });
        row.push(content);
      });
      if (row.every((col) => col.length === 0)) return;
      cells = [row];
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function parse2(element, { document }) {
    const href = element.getAttribute("href") || "";
    if (!href.includes("media-assets.stryker.com/is/content/stryker/")) return;
    const link = document.createElement("a");
    link.href = href;
    link.textContent = href;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse3(element, { document }) {
    const form = element.querySelector('form[id^="mktoForm_"]');
    const formId = form ? form.id.replace("mktoForm_", "") : "contact";
    const formLink = document.createElement("a");
    formLink.href = `/forms/${formId}`;
    formLink.textContent = `/forms/${formId}`;
    const cells = [[formLink]];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/stryker-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#cookie-alert",
        ".c-cookie-alert",
        "#onetrust-consent-sdk",
        '[class*="onetrust"]',
        "#c-country-switch-modal",
        ".modal.fade",
        ".overlay.hidden-md"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'input[type="hidden"]',
        "input:not([type])",
        "#hdnDisplayHcpConfirmation",
        "#hdnShowAlert",
        "#hdnAlertTitle",
        "#hdnAlertMsg",
        "#hdnAlertContBtnText",
        "#hdnAlertCancelBtnText",
        "#hdnRunMode",
        "#indexUrl",
        "#hdnShowFooter",
        "#hiddenPublishedDate",
        "#businessUnitTag"
      ]);
      element.querySelectorAll('[class^="cols"], [class*=" cols"], .fullbleedpanel').forEach((container) => {
        const hasContent = container.querySelector("p, h1, h2, h3, h4, h5, h6, img, a, ul, ol, form, video");
        if (!hasContent) container.remove();
      });
      element.querySelectorAll(".customizable, .resourcesanddownload").forEach((div) => {
        if (!div.textContent.trim()) div.remove();
      });
      element.querySelectorAll(".c-cross-promotional").forEach((promo) => {
        if (!promo.textContent.trim()) {
          const tilesContainer = promo.closest(".c-tiles");
          if (tilesContainer) tilesContainer.remove();
        }
      });
      const prodDetail = element.querySelector("#product-detail-container");
      if (prodDetail && !prodDetail.querySelector("p, h1, h2, h3, h4, h5, h6, img, a, ul, ol, form")) {
        prodDetail.remove();
      }
      const { document } = payload;
      element.querySelectorAll(".interactivemedia").forEach((media) => {
        const posterImg = media.querySelector('img[src*="-AVS"]');
        if (posterImg) {
          const posterSrc = posterImg.getAttribute("src") || "";
          const match = posterSrc.match(/\/is\/image\/stryker\/([^?]+)-AVS/);
          if (match) {
            const assetName = decodeURIComponent(match[1]);
            const videoUrl = `https://media-assets.stryker.com/is/content/stryker/${encodeURIComponent(assetName)}`;
            const link = document.createElement("a");
            link.href = videoUrl;
            link.textContent = videoUrl;
            media.replaceWith(link);
          } else {
            media.remove();
          }
        } else {
          media.remove();
        }
      });
      element.querySelectorAll("img").forEach((img) => {
        const posterSrc = img.getAttribute("src") || "";
        if (!posterSrc.includes("-AVS")) return;
        const match = posterSrc.match(/\/is\/image\/stryker\/([^?]+)-AVS/);
        if (match) {
          const assetName = decodeURIComponent(match[1]);
          const videoUrl = `https://media-assets.stryker.com/is/content/stryker/${encodeURIComponent(assetName)}`;
          const link = document.createElement("a");
          link.href = videoUrl;
          link.textContent = videoUrl;
          const parent = img.closest("p") || img.closest("div") || img;
          parent.replaceWith(link);
        } else {
          img.remove();
        }
      });
      element.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("/s7viewers/") || src.includes("/s7sdk/")) {
          img.remove();
        }
      });
      const DM_BASE = "https://media-assets.stryker.com/is/image/stryker/";
      const DAM_PREFIX = "/content/dam/stryker/";
      element.querySelectorAll("img[src]").forEach((img) => {
        let src = img.getAttribute("src");
        if (src.includes(DAM_PREFIX)) {
          const damPath = src.includes("://") ? new URL(src).pathname : src;
          const segments = damPath.replace(DAM_PREFIX, "").split("/");
          const filename = segments[segments.length - 1].replace(/\.[^.]+$/, "");
          src = DM_BASE + filename;
        }
        if (src.includes("media-assets.stryker.com/is/image/stryker/")) {
          src = src.split("?")[0];
          img.setAttribute("src", src);
          if (!img.getAttribute("alt")) {
            const assetName = src.split("/").pop().replace(/[-_]/g, " ");
            img.setAttribute("alt", assetName);
          }
        }
      });
      const ogImage = element.ownerDocument.querySelector('meta[property="og:image"]');
      if (ogImage) {
        let content = ogImage.getAttribute("content") || "";
        if (content.includes(DAM_PREFIX)) {
          const damPath = content.includes("://") ? new URL(content).pathname : content;
          const segments = damPath.replace(DAM_PREFIX, "").split("/");
          const filename = segments[segments.length - 1].replace(/\.[^.]+$/, "");
          ogImage.setAttribute("content", DM_BASE + filename);
        }
        if (content.includes("media-assets.stryker.com/is/image/stryker/")) {
          ogImage.setAttribute("content", content.split("?")[0]);
        }
      }
      element.querySelectorAll("source[srcset]").forEach((source) => {
        let srcset = source.getAttribute("srcset");
        if (srcset.includes("media-assets.stryker.com/is/image/stryker/")) {
          srcset = srcset.split("?")[0];
          source.setAttribute("srcset", srcset);
        }
      });
      const publishedDate = element.querySelector("#publishedDate");
      const regulatoryDisclaimer = element.querySelector("div.c-disclaimer:not(.page-section)");
      if (publishedDate && regulatoryDisclaimer) {
        regulatoryDisclaimer.appendChild(publishedDate);
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "header",
        ".g-header",
        ".g-megamenu",
        "footer#footer",
        "footer",
        ".g-footer",
        ".g-hcpbanner",
        ".c-back-to-top"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-trackable");
        el.removeAttribute("data-aem-asset-id");
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-component");
        el.removeAttribute("data-namespace");
      });
      element.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("/s7viewers/") || src.includes("/s7sdk/") || src.includes("-AVS")) {
          img.closest("p") ? img.closest("p").remove() : img.remove();
        }
      });
    }
  }

  // tools/importer/transformers/stryker-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-product-detail.js
  var parsers = {
    "columns": parse,
    "embed": parse2,
    "form": parse3
  };
  var PAGE_TEMPLATE = {
    name: "product-detail",
    description: "Universal orthopaedic instruments product detail page with 6 sections.",
    blocks: [
      {
        name: "columns",
        instances: [
          ".c-page-hero-content",
          "#product-detail-container > .row",
          ".cols2_1-3_2-3 .colctrl"
        ]
      },
      {
        name: "embed",
        instances: ["a[href*='media-assets.stryker.com/is/content/stryker']"]
      },
      {
        name: "form",
        instances: [".c-marketo-form"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Product Hero",
        selector: ".pagehero",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-2-description",
        name: "Product Description",
        selector: "#product-detail-container",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3-features",
        name: "Feature Images and Banner",
        selector: ".fullWidthImage",
        style: null,
        blocks: [],
        defaultContent: [".fullWidthImage .imgBoxId picture", ".c-largeheadline .largeheadline"]
      },
      {
        id: "section-4-comparison",
        name: "Feature Comparison",
        selector: [".cols2_1-3_2-3"],
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-5-contact",
        name: "Contact Form",
        selector: [".section-title", ".c-section-title"],
        style: null,
        blocks: ["form"],
        defaultContent: [".c-section-title h2"]
      },
      {
        id: "section-6-citations",
        name: "Citations",
        selector: "div.c-disclaimer.page-section:not(.container)",
        style: "c-disclaimer page-section",
        blocks: [],
        defaultContent: []
      },
      {
        id: "section-7-regulatory",
        name: "Regulatory",
        selector: "div.c-disclaimer:not(.page-section)",
        style: "c-disclaimer",
        blocks: [],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
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
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_product_detail_default = {
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
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("/s7viewers/") || src.includes("/s7sdk/")) img.remove();
      });
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
  return __toCommonJS(import_product_detail_exports);
})();
