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

  // tools/importer/import-feature-article-editorial.js
  var import_feature_article_editorial_exports = {};
  __export(import_feature_article_editorial_exports, {
    default: () => import_feature_article_editorial_default
  });

  // tools/importer/transformers/feature-article-editorial.js
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
      }, createQuoteBlock = function(text) {
        const qTable = document.createElement("table");
        const qHead = document.createElement("tr");
        const qTh = document.createElement("th");
        qTh.textContent = "Quote";
        qHead.append(qTh);
        qTable.append(qHead);
        const qRow = document.createElement("tr");
        const qTd = document.createElement("td");
        const qP = document.createElement("p");
        qP.textContent = text;
        const qP2 = document.createElement("p");
        qP2.textContent = " ";
        qTd.append(qP, qP2);
        qRow.append(qTd);
        qTable.append(qRow);
        return qTable;
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
      const heroTable = document.createElement("table");
      const heroHead = document.createElement("tr");
      const heroTh = document.createElement("th");
      heroTh.textContent = "Hero";
      heroHead.append(heroTh);
      heroTable.append(heroHead);
      const heroRow = document.createElement("tr");
      const heroTd = document.createElement("td");
      if (heroImg) {
        const p = document.createElement("p");
        const img = document.createElement("img");
        img.src = cleanSrc(heroImg.getAttribute("src") || "");
        img.alt = heroImg.alt || "";
        p.append(img);
        heroTd.append(p);
      }
      if (h1El) {
        const h1 = document.createElement("h1");
        h1.textContent = h1El.textContent.trim();
        heroTd.append(h1);
      }
      heroRow.append(heroTd);
      heroTable.append(heroRow);
      main.append(heroTable);
      main.append(createSectionMetadata());
      main.append(document.createElement("hr"));
      const contentElements = document.querySelectorAll(
        ".c-rich-text-editor, .c-standalone-image, .standaloneimage, .largeheadline.has-background"
      );
      const seenImgSrcs = /* @__PURE__ */ new Set();
      contentElements.forEach((el) => {
        const cls = typeof el.className === "string" ? el.className : "";
        const text = el.textContent.trim();
        const isImage = cls.includes("c-standalone-image") || cls.includes("standaloneimage");
        if (!text && !isImage) return;
        if (el.closest("#onetrust-consent-sdk")) return;
        if (text && text.startsWith("References")) return;
        if (cls.includes("largeheadline") && cls.includes("has-background")) {
          if (el.closest("[role=\u201Dlistbox\u201D]")) return;
          if (el.closest(".c-autocarousel")) return;
          if (h1El && text === h1El.textContent.trim()) return;
          if (text.length > 10) {
            main.append(createQuoteBlock(text));
          }
        } else if (cls.includes("c-standalone-image") || cls.includes("standaloneimage")) {
          if (el.closest('[role="listbox"]')) return;
          if (el.closest(".c-autocarousel")) return;
          const img = el.querySelector("img");
          if (img) {
            const src = img.getAttribute("src") || "";
            if (!src || src.includes("globe_icon")) return;
            const cleanedSrc = cleanSrc(src);
            if (seenImgSrcs.has(cleanedSrc)) return;
            seenImgSrcs.add(cleanedSrc);
            const p = document.createElement("p");
            const ie = document.createElement("img");
            ie.src = cleanedSrc;
            ie.alt = img.alt || "";
            p.append(ie);
            main.append(p);
          }
        } else if (cls.includes("c-rich-text-editor")) {
          const dimBox = el.querySelector(".dimensional-box");
          if (dimBox && dimBox.textContent.trim().length > 10) {
            [...el.children].forEach((child) => {
              const childCls = typeof child.className === "string" ? child.className : "";
              if (childCls.includes("dimensional-box")) {
                main.append(createQuoteBlock(child.textContent.trim()));
              } else if (child.textContent.trim()) {
                if (childCls.includes("left-to-right") || childCls.includes("right-to-left")) {
                  [...child.children].forEach((ic) => {
                    if (ic.textContent.trim()) main.append(ic.cloneNode(true));
                  });
                } else {
                  main.append(child.cloneNode(true));
                }
              }
            });
          } else {
            appendRte(el, main);
          }
        }
      });
      main.append(createSectionMetadata());
      main.append(document.createElement("hr"));
      const listboxes = document.querySelectorAll('[role="listbox"]');
      const heroCarouselLb = carouselSlide ? carouselSlide.closest('[role="listbox"]') : null;
      let ctaBuilt = false;
      listboxes.forEach((lb) => {
        if (ctaBuilt) return;
        if (lb === heroCarouselLb) return;
        const lbImgs = lb.querySelectorAll("img");
        const lbLinks = lb.querySelectorAll("a");
        if (lbImgs.length === 0 && lbLinks.length === 0) return;
        const ctaHeroTable = document.createElement("table");
        const ctaHead = document.createElement("tr");
        const ctaTh = document.createElement("th");
        ctaTh.textContent = "Hero";
        ctaHead.append(ctaTh);
        ctaHeroTable.append(ctaHead);
        const ctaRow = document.createElement("tr");
        const ctaTd = document.createElement("td");
        if (lbImgs.length > 0) {
          const pi = document.createElement("p");
          const ie = document.createElement("img");
          ie.src = cleanSrc(lbImgs[0].getAttribute("src") || "");
          ie.alt = lbImgs[0].alt || "";
          pi.append(ie);
          ctaTd.append(pi);
        }
        const ctaLink = [...lbLinks].find((a) => a.textContent.trim().length > 2);
        if (ctaLink) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = ctaLink.href;
          a.textContent = ctaLink.textContent.trim();
          p.append(a);
          ctaTd.append(p);
        }
        ctaRow.append(ctaTd);
        ctaHeroTable.append(ctaRow);
        main.append(ctaHeroTable);
        ctaBuilt = true;
      });
      if (!ctaBuilt) {
        document.querySelectorAll(".c-curatedcta a").forEach((a) => {
          const text = a.textContent.trim();
          if (text) {
            const p = document.createElement("p");
            const link = document.createElement("a");
            link.href = a.href;
            link.textContent = text;
            p.append(link);
            main.append(p);
          }
        });
      }
      main.append(createSectionMetadata());
      main.append(document.createElement("hr"));
      const relatedH2 = [...document.querySelectorAll("h2")].find(
        (h) => h.textContent.trim().includes("Related")
      );
      if (relatedH2) {
        const h2 = document.createElement("h2");
        h2.textContent = relatedH2.textContent.trim();
        main.append(h2);
        const relatedContainer = relatedH2.parentElement;
        const h3Cards = relatedContainer ? [...relatedContainer.querySelectorAll("h3")].filter(
          (h) => !h.closest("#onetrust-consent-sdk")
        ) : [];
        if (h3Cards.length > 0) {
          const cardsTable = document.createElement("table");
          const cardsHead = document.createElement("tr");
          const cardsTh = document.createElement("th");
          cardsTh.textContent = "Cards";
          cardsHead.append(cardsTh);
          cardsTable.append(cardsHead);
          h3Cards.forEach((h3) => {
            var _a;
            const wrapper = ((_a = h3.closest("div")) == null ? void 0 : _a.parentElement) || h3.parentElement;
            const img = wrapper.querySelector("img");
            const link = h3.querySelector("a");
            const learnMore = [...wrapper.querySelectorAll("a")].find(
              (a) => a.textContent.trim().includes("Learn more") || a.textContent.trim().includes("READ MORE")
            );
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            if (img) {
              const pi = document.createElement("p");
              const ie = document.createElement("img");
              ie.src = cleanSrc(img.getAttribute("src") || "");
              ie.alt = img.alt || "";
              pi.append(ie);
              td.append(pi);
            }
            const h3El = document.createElement("h3");
            if (link) {
              const a = document.createElement("a");
              a.href = link.href;
              a.textContent = h3.textContent.trim();
              h3El.append(a);
            } else {
              h3El.textContent = h3.textContent.trim();
            }
            td.append(h3El);
            if (learnMore) {
              const pl = document.createElement("p");
              const al = document.createElement("a");
              al.href = learnMore.href;
              al.textContent = learnMore.textContent.trim();
              pl.append(al);
              td.append(pl);
            }
            tr.append(td);
            cardsTable.append(tr);
          });
          main.append(cardsTable);
        }
      }
      main.append(createSectionMetadata());
      main.append(document.createElement("hr"));
      const refsRte = [...document.querySelectorAll(".c-rich-text-editor")].find((r) => r.textContent.trim().startsWith("References"));
      if (refsRte) appendRte(refsRte, main);
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

  // tools/importer/import-feature-article-editorial.js
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    name: "feature-article-editorial",
    description: "Editorial feature article with carousel hero, body text, quote, CTA banner, related news cards. Template 2D-v2.",
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
  var import_feature_article_editorial_default = {
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
  return __toCommonJS(import_feature_article_editorial_exports);
})();
