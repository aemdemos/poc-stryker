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

  // tools/importer/import-procedure-landing.js
  var import_procedure_landing_exports = {};
  __export(import_procedure_landing_exports, {
    default: () => import_procedure_landing_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const cells = [];
    const isCarouselHero = !!element.querySelector(".experienceFragment-ef");
    const heroImage = isCarouselHero ? element.querySelector(".experienceFragment-ef .c-standalone-image img") : element.querySelector(".c-standalone-image img");
    if (heroImage) {
      cells.push([heroImage]);
    }
    const wrapper = document.createElement("div");
    if (isCarouselHero) {
      const wordmark = element.querySelector(".overlayparsys .cta-img img") || element.querySelector(".curatedcta .cta-img img");
      if (wordmark) {
        const p = document.createElement("p");
        const img = document.createElement("img");
        img.src = wordmark.src;
        img.alt = wordmark.alt || "DART";
        p.appendChild(img);
        wrapper.appendChild(p);
      }
      const heading = element.querySelector(".overlayparsys .largeheadline h1") || element.querySelector(".largeheadline h1") || element.querySelector("h1");
      if (heading) {
        const h = document.createElement("h1");
        h.textContent = heading.textContent.trim().replace(/\s+/g, " ");
        wrapper.appendChild(h);
      }
      const subtitle = element.querySelector(".overlayparsys .largeheadline span.line2") || element.querySelector(".largeheadline span.line2") || element.querySelector("span.line2");
      if (subtitle && subtitle.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = subtitle.textContent.trim();
        wrapper.appendChild(p);
      }
      if (wrapper.children.length === 0) {
        const lineContainer = element.querySelector(".largeheadline span.line1");
        if (lineContainer) {
          const innerSpans = lineContainer.querySelectorAll(":scope > span > span");
          innerSpans.forEach((span) => {
            const text = span.textContent.trim().replace(/\s+/g, " ");
            if (text) {
              const para = document.createElement("p");
              if (span.classList.contains("futura-bold")) {
                const strong = document.createElement("strong");
                strong.textContent = text;
                para.appendChild(strong);
              } else {
                const em = document.createElement("em");
                em.textContent = text;
                para.appendChild(em);
              }
              wrapper.appendChild(para);
            }
          });
        }
      }
    } else {
      let paragraphs = element.querySelectorAll(".c-rich-text-editor p");
      if (paragraphs.length === 0) {
        paragraphs = element.querySelectorAll(".text p");
      }
      if (paragraphs.length === 0) {
        paragraphs = element.querySelectorAll("p");
      }
      paragraphs.forEach((p) => {
        const text = p.textContent.trim().replace(/\s+/g, " ");
        if (text) {
          const para = document.createElement("p");
          if (wrapper.children.length === 0) {
            const strong = document.createElement("strong");
            strong.textContent = text;
            para.appendChild(strong);
          } else {
            para.textContent = text;
          }
          wrapper.appendChild(para);
        }
      });
      const ctaLink = element.querySelector(".c-curatedcta a[href]") || element.querySelector("a.btn[href]") || element.querySelector(".cta-container a[href]");
      if (ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(link);
        wrapper.appendChild(p);
      }
    }
    if (wrapper.children.length > 0) {
      cells.push([wrapper]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/section-nav.js
  function parse2(element, { document }) {
    const navAnchors = element.querySelectorAll("nav.container a.anchor, .nav-wrap a.anchor, .bar-nav a.anchor");
    const cells = [];
    navAnchors.forEach((anchor) => {
      const emElement = anchor.querySelector("span > em, em");
      const labelText = emElement ? emElement.textContent.trim() : anchor.textContent.trim();
      if (!labelText) return;
      const sectionId = labelText.toLowerCase().replace(/[™®©]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      const link = document.createElement("a");
      link.href = `#${sectionId}`;
      link.textContent = labelText;
      cells.push([link]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "section-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    let columns = [];
    const colctrl = element.querySelector(":scope > .colctrl, :scope .colctrl");
    if (colctrl) {
      const topRow = colctrl.querySelector(":scope > .row");
      if (topRow) {
        const colDivs = topRow.querySelectorAll(':scope > [class*="col-sm-"]');
        colDivs.forEach((col) => {
          columns.push(col);
        });
      }
    }
    if (columns.length === 0) {
      const grid = element.querySelector(":scope .aem-Grid--12, :scope.aem-Grid--12");
      if (grid) {
        const gridChildren = grid.querySelectorAll(':scope > .text, :scope > .standaloneimage, :scope > .buildingblock, :scope > [class*="aem-GridColumn"]');
        if (gridChildren.length >= 2) {
          const midpoint = Math.ceil(gridChildren.length / 2);
          const col1Container = document.createElement("div");
          const col2Container = document.createElement("div");
          gridChildren.forEach((child, index) => {
            if (index < midpoint) {
              col1Container.appendChild(child.cloneNode(true));
            } else {
              col2Container.appendChild(child.cloneNode(true));
            }
          });
          columns = [col1Container, col2Container];
        }
      }
    }
    if (columns.length === 0) {
      const directDivs = element.querySelectorAll(":scope > div, :scope > .text, :scope > .standaloneimage");
      if (directDivs.length >= 2) {
        columns = [directDivs[0], directDivs[1]];
      }
    }
    if (columns.length < 2) {
      columns = [element, document.createElement("div")];
    }
    function extractColumnContent(col) {
      const content = [];
      const images = col.querySelectorAll(".c-standalone-image img, .c-standalone-image-content img, img.img-responsive, img");
      images.forEach((img) => {
        if (img.src || img.getAttribute("src")) {
          content.push(img);
        }
      });
      const headings = col.querySelectorAll(".c-largeheadline h2, .c-largeheadline h3, .c-rich-text-editor h2, .c-rich-text-editor h3, h2, h3");
      headings.forEach((heading) => {
        content.push(heading);
      });
      const richTexts = col.querySelectorAll(".c-rich-text-editor");
      richTexts.forEach((rt) => {
        const paragraphs = rt.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) {
            content.push(p);
          }
        });
      });
      if (richTexts.length === 0) {
        const paragraphs = col.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (p.textContent.trim() && !content.includes(p)) {
            content.push(p);
          }
        });
      }
      const ctas = col.querySelectorAll(".c-curatedcta a, a.btn, a.cta, a.button");
      ctas.forEach((cta) => {
        content.push(cta);
      });
      if (content.length === 0) {
        const allContent = col.querySelectorAll("img, h1, h2, h3, h4, p, a, ul, ol, li");
        allContent.forEach((el) => {
          if (el.textContent.trim() || el.tagName === "IMG") {
            content.push(el);
          }
        });
      }
      return content;
    }
    const col1Content = extractColumnContent(columns[0]);
    const col2Content = extractColumnContent(columns[1]);
    if (col1Content.length === 0 && col2Content.length === 0) {
      element.remove();
      return;
    }
    const cells = [
      [col1Content, col2Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table.js
  function parse4(element, { document }) {
    const rows = element.querySelectorAll(":scope tbody tr, :scope tr");
    const cells = [];
    rows.forEach((row) => {
      const tds = row.querySelectorAll(":scope > td, :scope > th");
      const rowCells = [];
      tds.forEach((td) => {
        const cellContent = document.createDocumentFragment();
        Array.from(td.childNodes).forEach((node) => {
          cellContent.appendChild(node.cloneNode(true));
        });
        const wrapper = document.createElement("div");
        wrapper.appendChild(cellContent);
        rowCells.push(wrapper);
      });
      if (rowCells.length > 0) {
        cells.push(rowCells);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "table", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse5(element, { document }) {
    const cells = [];
    let cardItems = [];
    if (element.classList.contains("cols3")) {
      cardItems = [...element.querySelectorAll('[class*="col-md-4"], [class*="col-sm-6"]')];
      const seen = /* @__PURE__ */ new Set();
      cardItems = cardItems.filter((el) => {
        if (seen.has(el)) return false;
        seen.add(el);
        return true;
      });
    } else if (element.classList.contains("buildingblock")) {
      cardItems = [element];
    } else {
      cardItems = [...element.querySelectorAll(".buildingblock")];
      if (cardItems.length === 0) cardItems = [element];
    }
    cardItems.forEach((card) => {
      const img = card.querySelector(".c-standalone-image img, .standaloneimage img, img");
      const bodyDiv = document.createElement("div");
      const richText = card.querySelector(".c-rich-text-editor");
      if (richText) {
        const paragraphs = [...richText.querySelectorAll("p")];
        paragraphs.forEach((p) => {
          const titleSpan = p.querySelector(".fontsize-1-5em, .fontsize-1-25em");
          if (titleSpan) {
            const titleP = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = titleSpan.textContent.trim();
            titleP.appendChild(strong);
            bodyDiv.appendChild(titleP);
          } else {
            const link = p.querySelector("a[href]");
            if (link) {
              const linkP = document.createElement("p");
              const a = document.createElement("a");
              a.href = link.href;
              a.textContent = link.textContent.trim();
              linkP.appendChild(a);
              bodyDiv.appendChild(linkP);
            } else {
              const text = p.textContent.trim();
              if (text) {
                const descP = document.createElement("p");
                descP.textContent = text;
                bodyDiv.appendChild(descP);
              }
            }
          }
        });
      }
      const ctaLink = card.querySelector(".c-curatedcta a, .curatedcta a");
      if (ctaLink && !bodyDiv.querySelector("a")) {
        const linkP = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        linkP.appendChild(a);
        bodyDiv.appendChild(linkP);
      }
      if (img || bodyDiv.children.length > 0) {
        const imgCell = document.createElement("div");
        if (img) {
          const picture = document.createElement("picture");
          const imgEl = document.createElement("img");
          imgEl.src = img.src;
          imgEl.alt = img.alt || "";
          picture.appendChild(imgEl);
          imgCell.appendChild(picture);
        }
        cells.push([imgCell, bodyDiv]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/stryker-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#cookie-alert",
        ".c-cookie-alert",
        "#c-country-switch-modal",
        ".g-hcpbanner",
        ".marketoform",
        ".c-marketo-form",
        ".mktoForm",
        ".s7dm-dynamic-media",
        ".standalonevideo",
        ".c-standalone-video",
        ".s7socialshare",
        ".s7socialsharepanel",
        ".slider-nav",
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        "#ot-sdk-btn-floating",
        ".onetrust-pc-dark-filter",
        ".ot-floating-button"
      ]);
      const inputs = element.querySelectorAll("input:not([type])");
      inputs.forEach((input) => input.remove());
      WebImporter.DOMUtils.remove(element, [
        "p#localNav",
        "p#localNavBgColor",
        "p#localNavTextColor",
        "p#trans",
        "p#firstItem",
        "p#hcpcheckbox",
        "p#hcptextcolor",
        "p#hcpTag",
        "p#ef-mobile"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        ".g-header",
        ".g-megamenu",
        "footer",
        ".g-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".c-back-to-top"
      ]);
      const trackingImgs = element.querySelectorAll('img[src*="cookielaw"], img[src*="telemetry"]');
      trackingImgs.forEach((img) => img.remove());
      const hiddenSpans = element.querySelectorAll("span.hidden");
      hiddenSpans.forEach((span) => span.remove());
      const emptySlickLists = element.querySelectorAll(".slick-list:empty");
      emptySlickLists.forEach((el) => el.remove());
      WebImporter.DOMUtils.remove(element, ["link"]);
    }
  }

  // tools/importer/transformers/stryker-sections.js
  function slugify(text) {
    return text.toLowerCase().replace(/[™®©]/g, "").replace(/&nbsp;/g, " ").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  function sectionMetadataHtml(dataId) {
    return '<table><tr><th colspan="2">Section Metadata</th></tr><tr><td>data-id</td><td>' + dataId + "</td></tr></table>";
  }
  function extractHeadingFromChunk(chunk) {
    const headingMatch = chunk.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/i);
    if (headingMatch) {
      const text = headingMatch[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
      if (text) return text;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const document = element.ownerDocument;
    const body = document.body;
    const html = body.innerHTML;
    const splits = [];
    const heroPos = html.indexOf('class="carouselslidegroup');
    if (heroPos !== -1) {
      const tagOpen = html.lastIndexOf("<", heroPos);
      splits.push({ pos: tagOpen !== -1 ? tagOpen : heroPos, dataId: "hero" });
    }
    const navPos = html.indexOf('class="c-navigation-bar"');
    if (navPos !== -1) {
      const tagOpen = html.lastIndexOf("<", navPos);
      splits.push({ pos: tagOpen !== -1 ? tagOpen : navPos, dataId: "section-nav" });
    }
    const sectionTitleStr = 'class="section-title"';
    let searchFrom = 0;
    const sectionTitlePositions = [];
    while (searchFrom < html.length) {
      const pos = html.indexOf(sectionTitleStr, searchFrom);
      if (pos === -1) break;
      const tagOpen = html.lastIndexOf("<", pos);
      if (tagOpen !== -1) {
        sectionTitlePositions.push(tagOpen);
      }
      searchFrom = pos + sectionTitleStr.length;
    }
    sectionTitlePositions.forEach((pos, idx) => {
      const nextPos = idx < sectionTitlePositions.length - 1 ? sectionTitlePositions[idx + 1] : Math.min(pos + 5e3, html.length);
      const chunk = html.substring(pos, nextPos);
      const headingText = extractHeadingFromChunk(chunk);
      const dataId = headingText ? slugify(headingText) : "section-" + (idx + 1);
      splits.push({ pos, dataId });
    });
    const sepStr = 'class="sectionseparator"';
    const firstSep = html.indexOf(sepStr);
    if (firstSep !== -1) {
      const secondSep = html.indexOf(sepStr, firstSep + sepStr.length);
      if (secondSep !== -1) {
        const tagOpen = html.lastIndexOf("<", secondSep);
        splits.push({ pos: tagOpen !== -1 ? tagOpen : secondSep, dataId: "asc-promotion" });
      }
    }
    const disclaimerStr = 'class="c-disclaimer';
    let dPos = html.indexOf(disclaimerStr);
    while (dPos !== -1) {
      const chunk = html.substring(dPos, Math.min(dPos + 3e3, html.length));
      if (chunk.includes("<ol") || chunk.includes("<ol>")) {
        const tagOpen = html.lastIndexOf("<", dPos);
        splits.push({ pos: tagOpen !== -1 ? tagOpen : dPos, dataId: "references" });
        break;
      }
      dPos = html.indexOf(disclaimerStr, dPos + 1);
    }
    if (splits.length < 2) return;
    splits.sort((a, b) => a.pos - b.pos);
    const unique = [splits[0]];
    for (let i = 1; i < splits.length; i += 1) {
      if (splits[i].pos > unique[unique.length - 1].pos) {
        unique.push(splits[i]);
      }
    }
    const parts = [];
    for (let i = 0; i < unique.length; i += 1) {
      const start = unique[i].pos;
      const end = i < unique.length - 1 ? unique[i + 1].pos : html.length;
      if (i > 0) {
        parts.push("<hr>");
      }
      parts.push("<div>");
      parts.push(html.substring(start, end));
      parts.push(sectionMetadataHtml(unique[i].dataId));
      parts.push("</div>");
    }
    body.innerHTML = parts.join("");
  }

  // tools/importer/import-procedure-landing.js
  var parsers = {
    "hero": parse,
    "section-nav": parse2,
    "columns": parse3,
    "table": parse4,
    "cards": parse5
  };
  var PAGE_TEMPLATE = {
    name: "procedure-landing",
    description: "Procedure/product landing page with hero, sticky section navigation, and multiple content sections covering procedural overview, videos, education, implants, robotics, instrumentation, and patient positioning",
    urls: [
      "https://www.stryker.com/us/en/joint-replacement/procedures/dart-direct-anterior-reconstructive-technology.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: [
          ".carouselslidegroup .autoplay-slide",
          ".experienceFragment:last-of-type"
        ]
      },
      {
        name: "section-nav",
        instances: [".c-navigation-bar"]
      },
      {
        name: "columns",
        instances: [".cols2_1-3_2-3", ".cols2"]
      },
      {
        name: "table",
        instances: [".cols2_1-3_2-3 .c-table table"]
      },
      {
        name: "cards",
        instances: [
          ".cols3",
          ".experienceFragment .aem-Grid--12 > .buildingblock"
        ]
      }
    ],
    sections: [
      { id: "hero", name: "Hero Banner", selector: ".carouselslidegroup", style: null, blocks: ["hero"], defaultContent: [] },
      { id: "section-nav", name: "Section Navigation", selector: ".c-navigation-bar", style: null, blocks: ["section-nav"], defaultContent: [] },
      { id: "procedural-overview", name: "Procedural Overview", selector: ".c-section-title#imtcpdak", style: null, blocks: ["columns", "table"], defaultContent: [".c-section-title#imtcpdak ~ .largeheadline h2", ".c-section-title#imtcpdak ~ .text .c-rich-text-editor", ".cols2_2-3_1-3 .c-largeheadline h3", ".cols2_2-3_1-3 .c-standalone-image a", ".cols2_2-3_1-3 .c-curatedcta a"] },
      { id: "videos", name: "Videos", selector: ".c-section-title#videos", style: null, blocks: ["cards"], defaultContent: [".c-section-title#videos ~ .largeheadline h2"] },
      { id: "medical-education", name: "Medical Education", selector: ".c-section-title#medical-education", style: null, blocks: ["columns"], defaultContent: [".c-section-title#medical-education ~ .largeheadline h2", ".c-section-title#medical-education ~ .cols .c-rich-text-editor"] },
      { id: "implants", name: "Implants", selector: ".c-section-title#rirwcxek", style: null, blocks: ["cards"], defaultContent: [".c-section-title#rirwcxek ~ .largeheadline h2", ".c-section-title#rirwcxek ~ .experienceFragment .c-rich-text-editor:first-of-type"] },
      { id: "mako-smartrobotics", name: "Mako SmartRobotics", selector: ".c-section-title#feffidvj", style: null, blocks: ["columns"], defaultContent: [".c-section-title#feffidvj ~ .largeheadline h2"] },
      { id: "instrumentation", name: "Instrumentation", selector: ".c-section-title#fcvigcqi", style: null, blocks: ["columns"], defaultContent: [".c-section-title#fcvigcqi ~ .largeheadline h2"] },
      { id: "patient-positioning-equipment", name: "Patient Positioning Equipment", selector: ".c-section-title#zamxgyls", style: null, blocks: ["columns"], defaultContent: [".c-section-title#zamxgyls ~ .largeheadline h2"] },
      { id: "asc-promotion", name: "ASC Promotion", selector: [".c-section-title#zamxgyls ~ .sectionseparator ~ .largeheadline", ".experienceFragment:last-of-type"], style: null, blocks: ["hero"], defaultContent: [] },
      { id: "references", name: "References", selector: ".c-rich-text-editor:has(ol)", style: null, blocks: [], defaultContent: [".c-rich-text-editor:has(ol)"] }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_procedure_landing_default = {
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
  return __toCommonJS(import_procedure_landing_exports);
})();
