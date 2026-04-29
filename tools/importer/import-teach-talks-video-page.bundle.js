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

  // tools/importer/import-teach-talks-video-page.js
  var import_teach_talks_video_page_exports = {};
  __export(import_teach_talks_video_page_exports, {
    default: () => import_teach_talks_video_page_default
  });

  // tools/importer/parsers/columns.js
  function parse(element, { document: document2 }) {
    const row = element.querySelector(".colctrl > .row");
    if (!row) return;
    const columns = [...row.children].filter((el) => el.classList.contains("col-xs-12"));
    const col1Content = [];
    const iframe = element.querySelector('iframe[src*="youtube"]');
    if (iframe) {
      const src = iframe.getAttribute("src");
      const videoIdMatch = src.match(/embed\/([^?]+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        const link = document2.createElement("a");
        link.href = `https://www.youtube.com/watch?v=${videoId}`;
        link.textContent = iframe.getAttribute("title") || `YouTube Video ${videoId}`;
        col1Content.push(link);
      }
    }
    const col2Content = [];
    if (columns.length >= 2) {
      const textContainer = columns[1].querySelector(".c-rich-text-editor .left-to-right, .c-rich-text-editor > div");
      if (textContainer) {
        [...textContainer.children].forEach((child) => {
          col2Content.push(child);
        });
      }
    }
    const cells = [
      [col1Content.length ? col1Content : "", col2Content.length ? col2Content : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document: document2 }) {
    const row = element.querySelector(".colctrl > .row");
    if (!row) return;
    const cols = [...row.children].filter((el) => el.classList.contains("col-xs-12"));
    const cells = [];
    for (let i = 0; i < cols.length; i += 2) {
      const videoCol = cols[i];
      const textCol = cols[i + 1];
      const hasVideo = videoCol && videoCol.querySelector('iframe[src*="youtube"]');
      const hasText = textCol && textCol.querySelector(".c-rich-text-editor");
      if (!hasVideo && !hasText) continue;
      const cardContent = [];
      if (hasVideo) {
        const iframe = videoCol.querySelector('iframe[src*="youtube"]');
        const src = iframe.getAttribute("src");
        const videoIdMatch = src.match(/embed\/([^?]+)/);
        if (videoIdMatch) {
          const videoId = videoIdMatch[1];
          const link = document2.createElement("a");
          link.href = `https://www.youtube.com/watch?v=${videoId}`;
          link.textContent = iframe.getAttribute("title") || `YouTube Video ${videoId}`;
          cardContent.push(link);
        }
      }
      if (hasText) {
        const titleP = textCol.querySelector(".c-rich-text-editor p");
        if (titleP) {
          const p = document2.createElement("p");
          p.innerHTML = titleP.innerHTML;
          cardContent.push(p);
        }
        const textBlocks = textCol.querySelectorAll(".c-rich-text-editor");
        if (textBlocks.length > 1) {
          const linkEl = textBlocks[1].querySelector("a");
          if (linkEl) {
            const link = document2.createElement("a");
            link.href = linkEl.getAttribute("href");
            link.textContent = linkEl.textContent.trim();
            cardContent.push(link);
          }
        }
      }
      if (cardContent.length > 0) {
        cells.push([cardContent]);
      }
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/stryker-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      const doc = element.ownerDocument || document;
      const dimBoxes = element.querySelectorAll(".dimensional-box");
      dimBoxes.forEach((container) => {
        const boldSpan = container.querySelector("span.futura-bold");
        const serifSpan = container.querySelector("span.urw-egyptienne");
        if (!boldSpan && !serifSpan) return;
        const p = doc.createElement("p");
        if (boldSpan) {
          const strong = doc.createElement("strong");
          strong.textContent = boldSpan.textContent.replace(/\s+/g, " ").trim();
          p.appendChild(strong);
        }
        if (serifSpan) {
          p.appendChild(doc.createTextNode(` ${serifSpan.textContent.trim()}`));
        }
        const origP = container.querySelector("p");
        if (origP) {
          origP.replaceWith(p);
        }
      });
      const largeHeadlines = element.querySelectorAll("div.largeheadline span.fontsize-3-5-vw");
      largeHeadlines.forEach((container) => {
        const boldSpan = container.querySelector("span.futura-bold");
        if (!boldSpan) return;
        const text = boldSpan.textContent.replace(/\s+/g, " ").trim();
        if (!text) return;
        const h1 = doc.createElement("h1");
        const em = doc.createElement("em");
        em.textContent = text;
        h1.appendChild(em);
        const wrapper = container.closest("div.c-largeheadline") || container.closest("div.largeheadline");
        if (wrapper) {
          wrapper.replaceWith(h1);
        }
      });
      const goldenGradients = element.querySelectorAll(".bg-golden-gradient");
      goldenGradients.forEach((container) => {
        const bigSpan = container.querySelector("span.fontsize-1-75em");
        if (!bigSpan) return;
        const h2 = doc.createElement("h2");
        const boldSpan = bigSpan.querySelector("span.futura-bold");
        if (boldSpan) {
          const boldText = boldSpan.textContent.replace(/\s+/g, " ").trim();
          if (boldText.length > 2) {
            const em = doc.createElement("em");
            em.textContent = boldText.substring(0, 2);
            h2.appendChild(em);
            const strong = doc.createElement("strong");
            strong.textContent = boldText.substring(2);
            h2.appendChild(strong);
          } else {
            const em = doc.createElement("em");
            em.textContent = boldText;
            h2.appendChild(em);
          }
        }
        const remainingSpans = bigSpan.querySelectorAll("span.urw-egyptienne");
        remainingSpans.forEach((s) => {
          h2.appendChild(doc.createTextNode(` ${s.textContent.trim()}`));
        });
        const p = container.querySelector("p");
        if (p) {
          p.replaceWith(h2);
        }
      });
      WebImporter.DOMUtils.remove(element, [
        "#cookie-alert",
        "#onetrust-consent-sdk",
        "#CybotCookiebotDialog"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#c-country-switch-modal",
        ".modal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'input[type="hidden"]',
        "input#hdnRunMode",
        "input#indexUrl",
        "input#hdnShowAlert",
        "input#hdnAlertTitle",
        "input#hdnAlertMsg",
        "input#hdnAlertContBtnText",
        "input#hdnAlertCancelBtnText",
        "input#hdnDisplayHcpConfirmation",
        "input#hdnShowFooter",
        "input#businessUnitTag",
        "input#hiddenPublishedDate",
        "input#header-search"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "header.g-header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer#footer",
        "footer.footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".g-hcpbanner"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".localpagenavigation"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".c-back-to-top"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".overlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "span.hidden"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        'a[href*="demdex.net"]'
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-content-type");
        el.removeAttribute("data-business-unit-list");
      });
    }
  }

  // tools/importer/transformers/stryker-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document: document2 } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      template.sections.forEach((section, index) => {
        if (index === 0) return;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (sectionEl) {
          const hr = document2.createElement("hr");
          sectionEl.before(hr);
        }
      });
      template.sections.forEach((section) => {
        if (!section.style) return;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        const sectionMetadata = WebImporter.Blocks.createBlock(document2, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        let insertBefore = null;
        let sibling = sectionEl.nextElementSibling;
        while (sibling) {
          if (sibling.tagName === "HR") {
            insertBefore = sibling;
            break;
          }
          sibling = sibling.nextElementSibling;
        }
        if (insertBefore) {
          insertBefore.before(sectionMetadata);
        } else {
          sectionEl.parentElement.appendChild(sectionMetadata);
        }
      });
    }
  }

  // tools/importer/import-teach-talks-video-page.js
  var parsers = {
    "columns": parse,
    "cards": parse2
  };
  var PAGE_TEMPLATE = {
    name: "teach-talks-video-page",
    description: "TEACH TALKS video page featuring educational surgical procedure videos with speaker information",
    urls: [
      "https://www.stryker.com/us/en/training-and-education/orthopaedics/trauma-extremities/teach/TEACH-TALKS-home-page/Reverse-Shoulder-Replacements-2020.html"
    ],
    blocks: [
      {
        name: "columns",
        instances: ["div.cols2_2-3_1-3"]
      },
      {
        name: "cards",
        instances: ["div.cols4"]
      }
    ],
    sections: [
      {
        id: "section-1-teach-banner",
        name: "TEACH Talks Banner",
        selector: "div.standaloneimage",
        style: null,
        blocks: [],
        defaultContent: ["div.standaloneimage .c-standalone-image-content"]
      },
      {
        id: "section-2-course-intro",
        name: "Course Introduction",
        selector: ["div.text.parbase:has(.dimensional-box)", "div.largeheadline:has(.fontsize-3-5-vw)", "div.cols2_2-3_1-3"],
        style: null,
        blocks: ["columns"],
        defaultContent: [".dimensional-box", ".largeheadline .fontsize-3-5-vw"]
      },
      {
        id: "section-3-course-overview",
        name: "Course Overview - Chapters",
        selector: ["div.text.parbase:has(.bg-golden-gradient)", "div.cols4"],
        style: "golden",
        blocks: ["cards"],
        defaultContent: [".bg-golden-gradient"]
      },
      {
        id: "section-4-disclaimer",
        name: "Footer Disclaimer",
        selector: ".c-disclaimer",
        style: null,
        blocks: [],
        defaultContent: ["#publishedDate"]
      }
    ]
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_teach_talks_video_page_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
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
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll("a").forEach((a) => {
        const href = a.href || a.getAttribute("href") || "";
        if (href.indexOf("demdex") !== -1) {
          const p = a.closest("p");
          if (p) p.remove();
          else a.remove();
        }
      });
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
  return __toCommonJS(import_teach_talks_video_page_exports);
})();
