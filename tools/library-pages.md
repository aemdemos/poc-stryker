## Set up your block library

- First paste this list in the import tool https://da.live/apps/import
- Then edit the list so it has your `main--your-org--yourproject.aem.page/...` URL on it (instead of the `ise-boilerplate` examples below). For this repo, preview is typically `https://main--poc-stryker--aemdemos.aem.page/` (use your branch name as the first segment when testing a branch preview). Paste into bulk preview: https://da.live/apps/bulk
- Then you have to "Add sheet" called "library" when you click on the gear icon of your root repo folder in da.live. Create columns called "title" and "path". NOTE: You might not have access to create this sheet, so let Charity or Dave know if you don't have this sheet already.
- Enter "Blocks" for the title column, and "https://content.da.live/your-org/your-project/docs/library/blocks.json" for the path column value.
- Now update the links listed in the blocks.json sheet to match your-org/your-project.
- And finally, in your ExMod aemcoder settings, you will want to add the URL to your blocks so that the agent will refer to your blocks instead of the limited OOTB list https://main--your-org/your-project/docs/library/blocks.json.




https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks.json

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/accordion

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/breadcrumbs

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/cards

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/card-carousel

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/carousel

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/columns

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/embed

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/form

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/fragment

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/hero

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/modal

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/quote

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/search

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/section-metadata

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/table

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/metadata

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/tabs

https://main--ise-boilerplate--aemdemos.aem.page/docs/library/blocks/video

---

## Helix import — Stryker MedSurg capability hubs (this repo)

Use **`tools/library-pages.md`** as the source-of-truth URL list for local reimport (`npm run import:stryker-capability`) and as the paste list for **Document Authoring** import.

### Paste into https://da.live/apps/import (one URL per line)

```
https://www.stryker.com/us/en/portfolios/medical-surgical-equipment/bedframes.html
https://www.stryker.com/us/en/portfolios/medical-surgical-equipment/emergency-data-solutions.html
```

### Transformation file URL (Helix / DA import)

Point the importer at the checked-in transform (replace `main` with your branch if needed):

`https://raw.githubusercontent.com/aemdemos/poc-stryker/main/tools/importer/stryker-capability-portfolio-hub.import.js`

For **Helix Importer Workbench** locally, serve the repo and use something like: `http://localhost:3001/tools/importer/stryker-capability-portfolio-hub.import.js` (see `tools/importer/helix-importer-ui/import.html`).

### Reimport locally (drafts + markdown on disk)

From the repo root:

```bash
npm run import:stryker-capability
```

That reads the Stryker URLs above from this file, runs `stryker-capability-portfolio-hub.import.js`, and refreshes `drafts/us/en/portfolios/medical-surgical-equipment/*.md` and `*.html`. Optional copies for GitHub browsing: `docs/import-previews/*.md` (re-copy after import if you want them in sync).
