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

  // tools/importer/import-feature-story-products.js
  var import_feature_story_products_exports = {};
  __export(import_feature_story_products_exports, {
    default: () => import_feature_story_products_default
  });

  // tools/importer/transformers/feature-story-products.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === "beforeTransform") {
      [
        "header#header",
        "footer#footer",
        "#cookie-alert",
        ".g-megamenu",
        ".c-back-to-top",
        'input[type="hidden"]',
        "input:not([type])",
        "#aem-specific-data > .container-fluid > .main > div:first-child",
        ".c-event-location-properties",
        "#businessUnitTag",
        "#hiddenPublishedDate",
        "noscript",
        "script",
        "style"
      ].forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });
    }
    if (hookName === "afterTransform") {
      let cleanSrc = function(src) {
        return src && src.includes("/is/image/") ? src.split("?")[0] : src;
      }, createSectionMetadata = function() {
        const table = document.createElement("table");
        const hr = document.createElement("tr");
        const hc = document.createElement("th");
        hc.setAttribute("colspan", "2");
        hc.textContent = "Section Metadata";
        hr.append(hc);
        table.append(hr);
        const r = document.createElement("tr");
        const k = document.createElement("td");
        k.textContent = "style";
        const v = document.createElement("td");
        v.textContent = "press";
        r.append(k, v);
        table.append(r);
        return table;
      }, createBlockTable = function(name, rows) {
        const table = document.createElement("table");
        const hr = document.createElement("tr");
        const hc = document.createElement("th");
        hc.setAttribute("colspan", String(rows[0] ? rows[0].length : 1));
        hc.textContent = name;
        hr.append(hc);
        table.append(hr);
        rows.forEach((cells) => {
          const tr = document.createElement("tr");
          cells.forEach((c) => {
            const td = document.createElement("td");
            if (typeof c === "string") td.textContent = c;
            else if (c instanceof Node) td.append(c);
            tr.append(td);
          });
          table.append(tr);
        });
        return table;
      }, appendRte = function(rte, target) {
        [...rte.children].forEach((child) => {
          if (child.classList && (child.classList.contains("left-to-right") || child.classList.contains("right-to-left"))) {
            [...child.children].forEach((ic) => {
              if (ic.textContent.trim()) target.append(ic.cloneNode(true));
            });
          } else if (child.textContent.trim()) {
            target.append(child.cloneNode(true));
          }
        });
      };
      const dateEl = document.querySelector("div.c-publish-date h5");
      const disclaimers = document.querySelectorAll("div.c-disclaimer");
      const publishedDate = document.querySelector("#publishedDate");
      const main = document.createElement("main");
      if (dateEl) {
        const h5 = document.createElement("h5");
        h5.textContent = dateEl.textContent.trim();
        main.append(h5);
      }
      const h1El = document.querySelector("h1") || document.querySelector(".c-largeheadline");
      const carouselSlide = document.querySelector('[role="listbox"] [role="option"]');
      const heroImg = carouselSlide ? carouselSlide.querySelector("img") : null;
      const heroCell = document.createElement("td");
      if (heroImg) {
        const img = document.createElement("img");
        img.src = cleanSrc(heroImg.getAttribute("src") || "");
        img.alt = heroImg.alt || "";
        const p = document.createElement("p");
        p.append(img);
        heroCell.append(p);
      }
      if (h1El) {
        const h1 = document.createElement("h1");
        h1.textContent = h1El.textContent.trim();
        heroCell.append(h1);
      }
      const heroTable = document.createElement("table");
      const heroHead = document.createElement("tr");
      const heroHeadCell = document.createElement("th");
      heroHeadCell.textContent = "Hero";
      heroHead.append(heroHeadCell);
      heroTable.append(heroHead);
      const heroRow = document.createElement("tr");
      heroRow.append(heroCell);
      heroTable.append(heroRow);
      main.append(heroTable);
      main.append(createSectionMetadata());
      main.append(document.createElement("hr"));
      const grids = document.querySelectorAll(".aem-Grid");
      let contentGrid = null;
      grids.forEach((g) => {
        if (g.querySelector(".c-rich-text-editor") && g.children.length > 5) {
          contentGrid = g;
        }
      });
      if (contentGrid) {
        const children = [...contentGrid.children];
        let i = 0;
        while (i < children.length) {
          const child = children[i];
          const cls = typeof child.className === "string" ? child.className : "";
          const colMatch = cls.match(/aem-GridColumn--default--(\d+)/);
          const colSize = colMatch ? parseInt(colMatch[1], 10) : 12;
          const isImg = cls.includes("standaloneimage");
          const rte = child.querySelector(".c-rich-text-editor");
          const img = child.querySelector("img");
          const h4 = child.querySelector("h4");
          if (colSize === 2 && h4) {
            i++;
            continue;
          }
          if (rte && rte.textContent.trim().startsWith("References")) {
            i++;
            continue;
          }
          if (colSize === 1 && isImg && i + 1 < children.length) {
            const nextChild = children[i + 1];
            const nextCls = typeof nextChild.className === "string" ? nextChild.className : "";
            const nextColMatch = nextCls.match(/aem-GridColumn--default--(\d+)/);
            const nextColSize = nextColMatch ? parseInt(nextColMatch[1], 10) : 12;
            const nextRte = nextChild.querySelector(".c-rich-text-editor");
            if (nextColSize === 11 && nextRte) {
              const iconCell = document.createElement("td");
              if (img) {
                const ie = document.createElement("img");
                ie.src = cleanSrc(img.getAttribute("src") || "");
                ie.alt = img.alt || "";
                iconCell.append(ie);
              }
              const txtCell = document.createElement("td");
              appendRte(nextRte, txtCell);
              main.append(createBlockTable("Columns", [[iconCell, txtCell]]));
              i += 2;
              continue;
            }
          }
          if (rte && rte.textContent.trim().length > 0) {
            const text = rte.textContent.trim();
            const parentBg = child.querySelector('.bg-dark-blue, .bg-blue, [class*="bg-"]');
            const hasHighlight = !!rte.querySelector('.highlight, .gold, [class*="gold"]');
            const looksLikeQuote = parentBg || hasHighlight || text.startsWith('"') && text.length < 500 && text.includes("footsteps");
            if (looksLikeQuote) {
              const quoteDiv = document.createElement("div");
              appendRte(rte, quoteDiv);
              main.append(createBlockTable("Quote", [[quoteDiv]]));
            } else {
              appendRte(rte, main);
            }
            i++;
            continue;
          }
          i++;
        }
      } else {
        const allRtes = [...document.querySelectorAll(".c-rich-text-editor")].filter((r) => r.textContent.trim().length > 0);
        allRtes.forEach((rte) => {
          if (!rte.textContent.trim().startsWith("References")) {
            appendRte(rte, main);
          }
        });
      }
      main.append(createSectionMetadata());
      main.append(document.createElement("hr"));
      const h4Elements = [...document.querySelectorAll("h4")].filter(
        (h) => !h.closest("#onetrust-consent-sdk")
      );
      const productH4s = h4Elements.filter(
        (h) => h.closest(".c-standalone-image") || h.classList.contains("title")
      );
      if (productH4s.length > 0) {
        const cardRows = [];
        productH4s.forEach((h4) => {
          const imgContainer = h4.closest(".c-standalone-image") || h4.closest(".standaloneimage") || h4.closest("div");
          const img = imgContainer ? imgContainer.querySelector("img") : null;
          const link = h4.querySelector("a");
          const descP = imgContainer ? imgContainer.querySelector("p:not(.title)") : null;
          const cell = document.createElement("div");
          if (img) {
            const pi = document.createElement("p");
            const ie = document.createElement("img");
            ie.src = cleanSrc(img.getAttribute("src") || "");
            ie.alt = img.alt || "";
            pi.append(ie);
            cell.append(pi);
          }
          const h3 = document.createElement("h3");
          if (link) {
            const a = document.createElement("a");
            a.href = link.href;
            a.textContent = h4.textContent.trim();
            h3.append(a);
          } else {
            h3.textContent = h4.textContent.trim();
          }
          cell.append(h3);
          if (descP && descP.textContent.trim()) {
            const pd = document.createElement("p");
            pd.textContent = descP.textContent.trim();
            cell.append(pd);
          }
          cardRows.push([cell]);
        });
        if (cardRows.length > 0) {
          main.append(createBlockTable("Cards", cardRows));
        }
      }
      main.append(createSectionMetadata());
      main.append(document.createElement("hr"));
      const refsRte = [...document.querySelectorAll(".c-rich-text-editor")].find((r) => r.textContent.trim().startsWith("References"));
      if (refsRte) {
        appendRte(refsRte, main);
      }
      disclaimers.forEach((d) => {
        const t = d.textContent.trim();
        if (!t) return;
        const rh = d.querySelector("p");
        const rl = d.querySelector("ul, ol");
        if (rh && rl) {
          main.append(rh.cloneNode(true));
          main.append(rl.cloneNode(true));
        } else {
          const p = document.createElement("p");
          p.textContent = t;
          main.append(p);
        }
      });
      if (publishedDate && publishedDate.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = publishedDate.textContent.trim();
        main.append(p);
      }
      main.append(createSectionMetadata());
      main.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("/is/image/")) img.src = src.split("?")[0];
      });
      const body = document.querySelector("body");
      body.innerHTML = "";
      body.append(main);
    }
  }

  // tools/importer/import-feature-story-products.js
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    name: "feature-story-products",
    description: "Feature story with carousel hero, long-form narrative, stat images, pull quotes, product cards grid, and references. Template 3.",
    urls: [],
    blocks: []
  };
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
  var import_feature_story_products_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      const newMain = document.querySelector("main") || document.body;
      WebImporter.rules.createMetadata(newMain, document);
      WebImporter.rules.transformBackgroundImages(newMain, document);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: newMain,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name
        }
      }];
    }
  };
  return __toCommonJS(import_feature_story_products_exports);
})();
