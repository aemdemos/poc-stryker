# Stryker Orthopaedic Instruments — Product Page Migration Guide

**Project:** aemdemos/poc-stryker
**Branch:** tmorris
**Source:** https://www.stryker.com/us/en/orthopaedic-instruments/products/
**Date:** 2026-04-27

---

## Overview

This migration imports product detail pages from Stryker's orthopaedic instruments division into AEM Edge Delivery Services using Document Authoring (DA) with Universal Editor enablement. The import infrastructure converts source HTML into structured EDS content using a universal template that handles three page architecture tiers.

---

## Page Architecture

The source site has 11 active product pages across three tiers:

| Tier | Pages | Characteristics |
|---|---|---|
| **Minimal Classic** | BioPrep, InterPulse, Revolution | `.pagehero` + 1 text block + sidebar. No form, no video. |
| **Standard Classic** | SmartPump, F1, Zip | `.pagehero` + description + sidebar + feature content + contact form. |
| **Modern Rich** | System 9, Steri-Shield 8, NPseal, CD NXT, TPX, Ortho Q, Express Knee, Precision Knee, Versatile Hip | No `.pagehero`. Uses carousel/custom heroes, full-bleed panels, rich media. |

Four additional URLs (CD NXT, TPX, InterPulse, Revolution) redirect to other products and should be handled as 301 redirects.

---

## Template Structure — 7 Sections

The import template defines 7 sections for Standard Classic pages. Sections that don't exist on a given page are gracefully skipped.

| # | Section | Block | Section Metadata Style | Source Selector |
|---|---|---|---|---|
| 1 | **Product Hero** | `columns` (1 row, 2 col) | — | `.pagehero` |
| 2 | **Product Description** | `columns` (1 row, 2 col) | — | `#product-detail-container` |
| 3 | **Feature Images & Banner** | Default content | — | `.fullWidthImage` |
| 4 | **Feature Comparison** | `columns` (2 rows, 2 col) | — | `.cols2_1-3_2-3` |
| 5 | **Contact Form** | `form` | — | `.c-section-title` |
| 6 | **Citations** | Default content | `c-disclaimer page-section` | `div.c-disclaimer.page-section:not(.container)` |
| 7 | **Regulatory** | Default content | `c-disclaimer` | `div.c-disclaimer:not(.page-section)` |

### Section Details

**Section 1 — Hero:** H1 product name (gold) + H2 subtitle + description paragraph in the left column, product image (Dynamic Media) in the right column.

**Section 2 — Description:** H3 product name + detailed paragraph + feature bullet list in the left column, "Related categories" heading + category links in the right column.

**Section 3 — Features:** Full-width product image with callout annotations + headline banner text. Passes through as default content.

**Section 4 — Comparison:** 2-row, 2-column layout. Row 1: product diagram + decorative text | feature descriptions. Row 2: white paper CTA + download link | comparison figure image.

**Section 5 — Contact:** H2 "Contact us" heading + form block referencing Marketo form `/forms/3022`.

**Section 6 — Citations:** Research references and academic citations. Styled with `c-disclaimer page-section` section metadata.

**Section 7 — Regulatory:** Document/revision number + "Last Updated" date. Styled with `c-disclaimer` section metadata.

---

## Import Infrastructure

### Files

```
tools/importer/
├── import-product-detail.js          # Main import script (orchestrator)
├── import-product-detail.bundle.js   # Bundled version (used by bulk import)
├── page-templates.json               # Template definition with selectors
├── download-dm-images.js             # Post-processor: downloads DM images + strips Scene7 artifacts
├── parsers/
│   ├── columns.js                    # Columns parser (hero, description, comparison patterns)
│   ├── embed.js                      # Embed parser (DM video links)
│   └── form.js                       # Form parser (Marketo form references)
├── transformers/
│   ├── stryker-cleanup.js            # Cleanup transformer (removes non-authorable content)
│   └── stryker-sections.js           # Sections transformer (adds hr breaks + section metadata)
├── urls-all-active-products.txt      # All 11 active product URLs
├── urls-smartpump.txt                # SmartPump URL only
├── urls-tier-test.txt                # BioPrep + NPseal + F1 for tier testing
└── reports/                          # Import reports (JSON + Excel)
```

### Parsers

**columns.js** — Handles three column layout patterns:

| Pattern | Trigger | Output |
|---|---|---|
| Hero | Element inside `.pagehero` or `.c-page-hero` | 1 row, 2 col: text \| image |
| Description | Element inside `#product-detail-container` | 1 row, 2 col: description \| categories |
| Feature Comparison | Element inside `.cols2_1-3_2-3` | 2 rows, 2 col: image+text \| features, CTA \| figure |
| Generic fallback | Any other `.colctrl` with 2+ columns | 1 row, N col: content passed through |

**embed.js** — Matches `<a>` links pointing to `media-assets.stryker.com/is/content/stryker/` (DM video URLs created by the cleanup transformer or post-processor). Produces an Embed block.

**form.js** — Extracts the Marketo form ID from `form[id^="mktoForm_"]` and creates a Form block with a reference link to `/forms/{id}`.

### Transformers

**stryker-cleanup.js** — Runs in both `beforeTransform` and `afterTransform` hooks:

| Phase | What It Does |
|---|---|
| beforeTransform | Removes cookie banners, modals, hidden inputs, empty layout containers, Scene7 `.interactivemedia` containers (extracts video URL if present), normalizes DM image URLs (strips Scene7 presets, converts DAM paths, adds alt text), moves `#publishedDate` into regulatory disclaimer container |
| afterTransform | Removes header, footer, nav, HCP banner, back-to-top button, iframes, link tags, noscript elements. Strips tracking/analytics attributes. Removes leaked s7 sprite images. |

**stryker-sections.js** — Runs in `afterTransform` only. Reads `payload.template.sections` and processes in reverse order to avoid DOM position shifts. Inserts `<hr>` before each non-first section and adds Section Metadata blocks for sections with a `style` value.

### Post-Processor

**download-dm-images.js** — Run after each import:

```bash
node tools/importer/download-dm-images.js content/us/en/orthopaedic-instruments/products
```

What it does:
1. Finds all `.plain.html` files in the target directory
2. Extracts Dynamic Media image URLs (`media-assets.stryker.com/is/image/stryker/...`)
3. Downloads each image with a sanitized filename (lowercase, hyphens, no spaces)
4. Replaces DM URLs in the HTML with local filenames (no `./` prefix — DA-compatible)
5. Extracts `-AVS` video poster patterns and replaces with Embed block HTML
6. Strips remaining Scene7 video player artifacts (sprite images, player text, blob: links, audio track labels)

---

## Dynamic Media Image Handling

Images from Stryker's Dynamic Media instance (`media-assets.stryker.com`) are handled as follows:

1. **Scene7 presets stripped** — URL parameters like `?$preset_400_235$` and `?$max_width_720$` are removed
2. **DAM paths converted** — `/content/dam/stryker/.../filename.jpg` paths are converted to DM URLs
3. **Alt text generated** — Images without alt text get a fallback derived from the asset name
4. **Images downloaded locally** — The post-processor downloads each DM image and saves it alongside the `.plain.html` file with a sanitized filename
5. **Filenames sanitized** — Lowercase, hyphens instead of spaces, no URL encoding (e.g., `stryker-npseal-photos-1t2a8275-d6ec4f10.jpg`)

**Both the `.plain.html` and all sibling `.jpg` files must be pushed to DA** for images to render in the editor.

---

## Dynamic Media Video Handling

Scene7 videos are identified by the `-AVS` suffix in their poster image URLs. The extraction happens in the post-processor because the Scene7 JS viewer adds the poster image to the DOM after the import script's transform runs.

**Flow:**
1. Source page has Scene7 VideoViewer which renders an `-AVS` poster image inside a `blob:` anchor
2. The import script strips s7 sprite images from the live DOM
3. The post-processor regex-matches the `-AVS` poster pattern in the serialized HTML
4. Extracts the asset name and creates an Embed block with the DM video content URL (`/is/content/stryker/{asset}`)
5. The `blocks/embed/embed.js` block has a DM video handler that renders a native HTML5 `<video>` element

**DM video URL pattern:** `https://media-assets.stryker.com/is/content/stryker/{AssetName}` (serves MP4 directly)

---

## Block Changes

### blocks/embed/embed.js

Added a Dynamic Media video handler to the `EMBEDS_CONFIG` array. When the embed URL contains `media-assets.stryker.com/is/content`, it renders a native `<video>` element with MP4 source instead of the default iframe fallback.

### blocks/columns/columns.css

Added a product hero styling rule: first-section columns get a bottom border separator (`1px solid var(--color-border)`) matching the source page's gold divider.

---

## Style Changes (styles/styles.css)

Updated the global design tokens to match Stryker's brand:

| Token | Value | Purpose |
|---|---|---|
| `--color-gold` | `#ffb500` | H1 headings, brand accent |
| `--color-teal` | `#4c7d7a` | Links, buttons, CTAs |
| `--color-teal-dark` | `#426d6b` | Button hover/borders |
| `--color-footer-gray` | `#545857` | Footer, dark sections |
| `--color-border` | `#b2b4ae` | Dividers, hero border |
| `--color-light-gray` | `#edeeec` | Gray section background |
| `--button-radius` | `0` | Square corners (Stryker style) |

**Typography:** Body uses serif (`HumanistSlab712W01` / Cambria fallback), headings use sans-serif (`Futura LT W01` / Arial fallback), subheadings use serif (`URWEgyptienneW01-Light` / Rockwell fallback). H1 rendered in gold.

**Buttons:** Teal background, square corners, uppercase, Futura font.

**Section styles available:** `light`, `dark`, `golden-gradient`, `gray-gradient`, `border-gold`, `centered`, `gray`, `c-disclaimer page-section`, `c-disclaimer`.

---

## How to Run an Import

### Import a single page

```bash
# 1. Create URL file
echo "https://www.stryker.com/us/en/orthopaedic-instruments/products/smartpump-tourniquet.html" > /tmp/url.txt

# 2. Run import
node /path/to/excat-content-import/scripts/run-bulk-import.js \
  --import-script tools/importer/import-product-detail.bundle.js \
  --urls /tmp/url.txt

# 3. Download DM images
node tools/importer/download-dm-images.js content/us/en/orthopaedic-instruments/products
```

### Import all active products

```bash
node /path/to/excat-content-import/scripts/run-bulk-import.js \
  --import-script tools/importer/import-product-detail.bundle.js \
  --urls tools/importer/urls-all-active-products.txt

node tools/importer/download-dm-images.js content/us/en/orthopaedic-instruments/products
```

### After making changes to parsers/transformers/import script

```bash
# Re-bundle before importing
/path/to/excat-content-import/scripts/aem-import-bundle.sh \
  --importjs tools/importer/import-product-detail.js
```

---

## Test Results

| Page | Tier | Columns | Embed | Form | Sec-Meta | Images |
|---|---|---|---|---|---|---|
| SmartPump | Standard | 3 | 0 | 1 | 2 | 5 |
| BioPrep | Minimal | 2 | 0 | 0 | 1 | 1 |
| F1 | Standard | 2 | 0 | 1 | 2 | 6 |
| Zip | Standard | 2 | 1 | 1 | 2 | 4 |

---

## Known Limitations

1. **Modern Rich pages** (System 9, NPseal, etc.) have their rich content passed through as default content — no structured blocks for carousels, stats bars, or full-bleed panels.
2. **Scene7 video poster images** with `-AVS` suffix return 403 when downloaded — the post-processor creates Embed blocks from the URL pattern instead.
3. **Steri-Shield 8** uses a different Marketo form (`mktoForm_3421` vs `3022`) — not matched by the current form parser.
4. **Local preview** (`aem up`) can't render external DM image URLs — images show as broken locally but work in DA and preview/live environments.
5. **Carousel heroes** (System 9, Steri-Shield 8, CD NXT) are not parsed into blocks — content passes through as default.

---

## Reference Documents

- `docs/stryker-product-pages-analysis.md` — Full DOM structure matrix and comparison across all 15 URLs
- `stryker-oi-product-page-analysis.md` — Detailed per-page structural analysis from initial crawl
