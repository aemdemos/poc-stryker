# Import Script Known Limitations

## Images from Scene7 (`media-assets.stryker.com`)

**Problem:** Some images on Stryker pages are served exclusively from Scene7 (`media-assets.stryker.com/is/image/stryker/...`). DA cannot fetch images from this domain, so they appear as broken images in the published EDS page.

**Which images are affected:**
- Images that only exist on Scene7 with NO `/content/dam/` equivalent
- Examples: "Did you know?" healthcare worker photo, card icons (Patient Transfer, Repositioning, Lifting)

**Which images work fine:**
- Hero images (served from `www.stryker.com/content/dam/...`)
- PDF thumbnails in Tabs (served from `www.stryker.com/content/dam/...`)
- Any image with a `/content/dam/` URL on the source page

**How to identify affected images after import:**
Check the published `.md` endpoint (e.g. `https://<branch>--<repo>--<owner>.aem.page/<path>.md`). Images showing `about:error` instead of a `media_` URL are broken.

**Manual fix:**
1. Download the image from the Scene7 URL (e.g. `https://media-assets.stryker.com/is/image/stryker/ow-my-back?fmt=jpg`)
2. Upload the image file directly to the same DA folder as the page document
3. Insert/replace the broken image reference in the DA document with the uploaded file

**Automated workaround (for icons/small images):**
For small decorative icons, the importer uses the `:iconname:` pattern with SVG files committed to `/icons/`. This works for social icons and card icons but is not appropriate for large content images.

**Post-import helper script:**
Run `node tools/importer/download-scene7-images.js <path-to-plain-html>` to download affected images locally. The downloaded files can then be manually uploaded to DA.

## Videos

**Problem:** Scene7 videos use adaptive streaming (AVS format) that requires the Scene7 VideoViewer player. EDS cannot embed these as native `<video>` elements.

**Where videos appear:**
- Inside Columns blocks (e.g. product overview video)
- Inside Tabs blocks (e.g. training videos)

**Current behavior:** Videos are rendered as clickable links to the Scene7 VideoViewer URL. Users can click to open the video in a new tab.

**Limitation:** EDS blocks cannot be nested. A `video` block cannot be placed inside a `columns` or `tabs` block. Videos in these positions remain as links.

## Form Block

**Implementation:** The project uses a custom `contact-form` block (not the built-in `form` block) that renders input fields from a table structure in the content. The form does not submit data — it's a visual representation only.

**State dropdown options:** Encoded in the content as `select|Option1,Option2,...` format in a single cell.
