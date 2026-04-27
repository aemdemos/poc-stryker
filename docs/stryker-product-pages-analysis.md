# Stryker Orthopaedic Instruments — Product Pages DOM & Design Analysis

**Date:** 2026-04-22
**Scope:** All 15 product page URLs under `/us/en/orthopaedic-instruments/products/`
**Purpose:** Inform universal import template and block development strategy

---

## Redirect Status

All 15 URLs loaded without redirecting during this crawl session. Note: JS-based page rotation has been observed in prior sessions — disable JavaScript when scraping to avoid it.

---

## Three Page Architecture Tiers

| Tier | Pages | Defining Trait |
|---|---|---|
| **Minimal Classic** | BioPrep, InterPulse, Revolution | `.pagehero` + 1 text block + sidebar. No form, no video, no feature sections. |
| **Standard Classic** | F1, Zip, SmartPump | `.pagehero` + description + sidebar + moderate content + contact form. |
| **Modern Rich** | System 9, Steri-Shield 8, NPseal, CD NXT, TPX, Ortho Q, Express Knee, Precision Knee, Versatile Hip | No `.pagehero`. Uses carousel/custom heroes, full-bleed panels, large headlines, rich media. |

---

## What ALL Pages Share (Universal)

- `data-template="product-detail"` on `<body>`
- `#product-detail-container` exists (even if empty on modern pages)
- `.c-disclaimer` (references/regulatory) — 2-3 instances per page
- `.c-cross-promotional / .c-tiles` — 2 instances per page (related products area, often empty)
- `.c-rich-text-editor` — at least 1 instance on every page
- Marketo form `mktoForm_3022` on 13/15 pages (Steri-Shield uses `mktoForm_3421`; BioPrep has none)
- Same header, footer, cookie banner, HCP disclaimer bar

---

## DOM Structure Matrix

| Container | Sys9 | SS8 | NP | F1 | OQ | Zip | SP | Bio | CD | TPX | IP | Rev | EK | PK | VH |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `.pagehero` | - | - | - | **Y** | - | **Y** | **Y** | **Y** | - | - | **Y** | **Y** | - | - | - |
| `.c-page-short-desc` | - | - | - | **Y** | - | - | **Y** | **Y** | - | **Y** | **Y** | **Y** | - | - | - |
| `.c-tagcrumb` | - | - | - | - | - | **Y** | **Y** | **Y** | - | **Y** | **Y** | **Y** | **Y** | - | - |
| `.fullWidthImage` | - | - | - | - | - | - | **Y** | - | - | - | - | - | - | - | - |
| `.largeheadline` | 69 | 15 | - | - | 3 | 9 | 3 | - | 6 | 9 | - | - | 6 | 6 | - |
| `.cols2` | 9 | 1 | 2 | 2 | 4 | 2 | - | - | 4 | 3 | - | - | 3 | 3 | 4 |
| `.cols2_1-3_2-3` | 1 | 2 | - | - | 1 | - | 2 | - | - | 3 | - | - | - | - | - |
| `.cols2_2-3_1-3` | - | - | - | 1 | 1 | 1 | 2 | - | - | 3 | 1 | 1 | 3 | 3 | 3 |
| `.cols3` | 2 | 5 | 1 | - | - | - | 1 | - | - | 1 | - | - | 2 | 2 | 1 |
| `.fullbleedpanel` | 4 | 2 | 4 | - | 4 | - | - | - | 2 | - | - | - | 6 | 6 | 4 |
| `.customizable` | - | - | 2 | 2 | 2 | 1 | 1 | 1 | 1 | - | 1 | 1 | 2 | 2 | 2 |
| `.c-marketo-form` | **Y** | **Y** | **Y** | **Y** | **Y** | **Y** | **Y** | - | **Y** | **Y** | **Y** | **Y** | **Y** | **Y** | **Y** |
| `.standaloneimage` | 20 | 10 | 18 | 4 | 12 | 4 | 4 | - | 12 | 24 | - | - | 10 | 10 | 10 |
| `.c-rich-text-editor` | 26 | 13 | 24 | 3 | 8 | 6 | 4 | 1 | 12 | 13 | 1 | 1 | 15 | 13 | 10 |
| Scene7 video | 43 | 6 | - | - | - | 6 | - | - | 13 | 12 | - | - | - | - | - |

**Key:** Sys9=System 9, SS8=Steri-Shield 8, NP=NPseal, F1=Stryker F1, OQ=Ortho Q, Zip=Zip, SP=SmartPump, Bio=BioPrep, CD=CD NXT, TPX=TPX, IP=InterPulse, Rev=Revolution, EK=Express Knee, PK=Precision Knee, VH=Versatile Hip

---

## Hero Section — 3 Distinct Patterns

| Pattern | Pages | How It Works |
|---|---|---|
| **Classic `.pagehero`** | F1, Zip, SmartPump, BioPrep, InterPulse, Revolution | Standard H1 + optional H2 + paragraph + product image in `.c-page-hero-content` |
| **Carousel hero** | System 9, Steri-Shield 8, CD NXT | Multi-slide carousel (`[data-widget="c-carousel"]` or listbox) with images + styled text overlay |
| **Custom full-bleed** | NPseal, Ortho Q, TPX, Express Knee, Precision Knee, Versatile Hip | No hero class. Product name in styled spans + image in `.cols2` or custom layout. Ortho Q sub-pages use double-H1 pattern (empty H1 + real H1). |

---

## Content Richness Comparison

| Page | Rich Text Editors | Standalone Images | Video/Scene7 | Total Images |
|---|---|---|---|---|
| **System 9** | 26 | 20 | 8 videos (43 viewers) | 20+ |
| **Steri-Shield 8** | 13 | 10 | 1 video (6 viewers) | 10+ |
| **NPseal** | 24 | 18 | None | 18 |
| **CD NXT** | 12 | 12 | 2 videos (13 viewers) | 14 |
| **TPX** | 13 | 24 | 2 videos (12 viewers) | 21 |
| **Express Knee** | 15 | 10 | None | 16 |
| **Precision Knee** | 13 | 10 | None | 16 |
| **Versatile Hip** | 10 | 10 | None | 16 |
| **Ortho Q** | 8 | 12 | None | 17 |
| **Zip** | 6 | 4 | 1 video (6 viewers) | 11 |
| **SmartPump** | 4 | 4 | 1 (interactivemedia) | 12 |
| **F1** | 3 | 4 | None | 13 |
| **BioPrep** | 1 | 0 | None | 9 |
| **InterPulse** | 1 | 0 | None | 9 |
| **Revolution** | 1 | 0 | None | 9 |

---

## Key Findings for Template Planning

1. **The hero is the most variable element** — 3 completely different patterns. The current template handles 2 of 3 (classic `.pagehero` + `.cols2` custom). Carousel heroes (System 9, Steri-Shield, CD NXT) are not yet covered.

2. **`.largeheadline` usage varies wildly** — System 9 has 69 instances, most standard pages have 0-3. Used as section titles and feature callouts on rich pages.

3. **Scene7 video is only on 5 pages** — System 9 (heavy), Steri-Shield, Zip, CD NXT, TPX. Not a universal requirement.

4. **Ortho Q sub-pages share identical structure** — Express Knee, Precision Knee, and Versatile Hip are nearly identical in DOM structure (same containers, same counts).

5. **Form is universal except BioPrep** — 14/15 pages use `mktoForm_3022`. Steri-Shield uses a different form (`mktoForm_3421`).

6. **The `.cols2_1-3_2-3` pattern** (cuff comparison parser) only exists on 5 pages — System 9, Steri-Shield 8, Ortho Q, SmartPump, TPX. Not universal but common enough to justify the parser.

7. **Content volume spans 100x** — BioPrep has 1 rich text editor and 0 standalone images. System 9 has 26 rich text editors and 20 standalone images. The template must gracefully handle this entire range.

---

## Full Product URL Sitemap

### Active Product Pages (8)
```
https://www.stryker.com/us/en/orthopaedic-instruments/products/System-9-Power-Tools.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/steri-shield-8.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/npseal.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/stryker-f1-system-cordless-small-bone-power-tool-system.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/ortho-q-guidance-system.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/zip-skin-closure.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/smartpump-tourniquet.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/bioprep-bone-preparation-system.html
```

### Redirect Pages (4)
```
https://www.stryker.com/us/en/orthopaedic-instruments/products/cd-nxt.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/tpx.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/interpulse-pulsed-lavage-system.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/revolution-cement-mixer-system.html
```

### Sub-Product Pages — Ortho Q Family (3)
```
https://www.stryker.com/us/en/orthopaedic-instruments/products/ortho-q-guidance-system/ortho-guidance-express-knee.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/ortho-q-guidance-system/ortho-guidance-precision-knee.html
https://www.stryker.com/us/en/orthopaedic-instruments/products/ortho-q-guidance-system/ortho-guidance-versatile-hip.html
```

---

## Current Import Template Coverage

| Tier | Covered? | Notes |
|---|---|---|
| Minimal Classic (BioPrep, InterPulse, Revolution) | **Yes** | Hero columns + default content. No form on BioPrep handled gracefully. |
| Standard Classic (F1, Zip, SmartPump) | **Yes** | Hero columns + cuff comparison columns + form + disclaimers. |
| Modern Rich — `.cols2` hero (NPseal, Ortho Q, TPX, EK, PK, VH) | **Partial** | Hero columns works. Rich body content passes through as default content. |
| Modern Rich — Carousel hero (System 9, Steri-Shield 8, CD NXT) | **Not yet** | Carousel hero pattern not handled by current columns parser. |
