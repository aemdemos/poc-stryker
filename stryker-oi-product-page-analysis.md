# Stryker Orthopaedic Instruments - Product Page Structure Analysis

## 1. Product Directory Overview

**Source URL:** `https://www.stryker.com/us/en/orthopaedic-instruments.html`
(Note: `/products/` path returns 404; products are listed on the division landing page)

### All Product URLs Found

| # | Product | URL | Status |
|---|---------|-----|--------|
| 1 | System 9 Power Tools | `/us/en/orthopaedic-instruments/products/System-9-Power-Tools.html` | Active |
| 2 | Steri-Shield 8 | `/us/en/orthopaedic-instruments/products/steri-shield-8.html` | Active |
| 3 | NPseal | `/us/en/orthopaedic-instruments/products/npseal.html` | Active |
| 4 | CD NXT Power Tool | `/us/en/orthopaedic-instruments/products/cd-nxt.html` | Redirects to SmartPump |
| 5 | TPX Electric Power Tool | `/us/en/orthopaedic-instruments/products/tpx.html` | Redirects to BioPrep |
| 6 | F1 Cordless Power Tool | `/us/en/orthopaedic-instruments/products/stryker-f1-system-cordless-small-bone-power-tool-system.html` | Active |
| 7 | Ortho Q Guidance System | `/us/en/orthopaedic-instruments/products/ortho-q-guidance-system.html` | Active |
| 8 | Zip Skin Closure | `/us/en/orthopaedic-instruments/products/zip-skin-closure.html` | Active |
| 9 | InterPulse Lavage | `/us/en/orthopaedic-instruments/products/interpulse-pulsed-lavage-system.html` | Redirects to BioPrep |
| 10 | Revolution Cement Mixer | `/us/en/orthopaedic-instruments/products/revolution-cement-mixer-system.html` | Redirects to BioPrep |
| 11 | SmartPump Tourniquet | `/us/en/orthopaedic-instruments/products/smartpump-tourniquet.html` | Active (excluded from deep analysis) |
| 12 | BioPrep Bone Prep | `/us/en/orthopaedic-instruments/products/bioprep-bone-preparation-system.html` | Active (excluded from deep analysis) |

**Sub-product pages (Ortho Q family):**
- Ortho Guidance Express Knee: `/us/en/orthopaedic-instruments/products/ortho-q-guidance-system/ortho-guidance-express-knee.html`
- Ortho Guidance Precision Knee: `/us/en/orthopaedic-instruments/products/ortho-q-guidance-system/ortho-guidance-precision-knee.html`
- Ortho Guidance Versatile Hip: `/us/en/orthopaedic-instruments/products/ortho-q-guidance-system/ortho-guidance-versatile-hip.html`

---

## 2. Template Classification

Three distinct page templates were identified:

### Template A: "Modern Marketing" (Rich/Long-form)
**Pages:** System 9, Steri-Shield 8, NPseal

These are heavily designed, marketing-forward pages with extensive custom layouts, multiple media types, and rich interactive elements. They deviate significantly from each other in structure.

### Template B: "Standard Product" (Intermediate)
**Pages:** F1 System, Ortho Q, Zip Skin Closure, SmartPump Tourniquet, Express Knee (sub-product)

These follow a more consistent AEM component-based layout with a hero, body content area, sidebar, and contact form.

### Template C: "Legacy/Minimal"
**Pages:** BioPrep (also the redirect target for TPX, InterPulse, Revolution Cement Mixer)

Extremely simple pages with just a hero, a single content block, a sidebar, and footer. No contact form, no media, no feature sections.

---

## 3. Per-Page Detailed Analysis

### Page 1: System 9 Power Tools (Template A - Modern Marketing)
**URL:** `System-9-Power-Tools.html`

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | "Information for healthcare professionals" bar below nav |
| Hero Carousel | Image carousel (listbox) with 2 slides; product name + tagline overlay |
| Intro Text + Video | Product name, description paragraph, embedded video player (Scene7) |
| Feature Block: Wireless Charger | Headline + paragraph + paired video |
| Feature Blocks (paired video+text) | 6 feature blocks, each with: short headline, sub-headline, description, auto-playing video. Topics: charge through case, battery indicators, twist-lock, ergonomic contours, IPX9 coating, safety pockets |
| Separator (HR) | Visual divider |
| Stats/Infographic | "Battery visibility, amplified" with two annotated images (indicator lights upon connection / during use) |
| More Feature Blocks (video+text) | Additional feature blocks with paired video content |
| Legacy/Trust Section | "It takes time to build trust" - stats counters (8 generations, 10K hours listening, 80K hours prototyping) |
| Timeline Image | Evolution timeline image |
| Product Family Showcase | "A system built for the whole hospital" - full family image + individual product cards (SABO Saw, Cordless Driver) with images and descriptions |
| Accessories Callout | "200+ cutting accessories" banner text |
| Tailored Solutions Cards | 3 cards: SEM, ProCare, Flex Financial - each with icon image, headline, description, "Learn More" link |
| CTA Banner | Product name + "Request your demo today" |
| Contact Form | "Contact us" heading + subheading + full form (first name, last name, hospital, specialty, email, phone, country, city, state, zip, category dropdown, message, privacy checkbox, marketing opt-in, reCAPTCHA, submit) |
| Social Links | Twitter and LinkedIn links |
| Document ID | OI-S9-SYK-2236250_REV-0 |
| Footer | Standard Stryker footer |

**Unique elements:** Hero carousel with multiple slides, auto-playing videos (6+), stats counters, evolution timeline, product family showcase grid, tailored solutions cards, social media links section, demo request CTA banner.

---

### Page 2: Steri-Shield 8 (Template A - Modern Marketing)
**URL:** `steri-shield-8.html`

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same as System 9 |
| Hero Banner | Single hero image with "Made for you" H1 + "Steri-Shield 8" subtitle |
| Intro + Video | "The next evolution of PPE is here" headline + description with superscript references + embedded video player |
| Image Carousel | "The lightest Stryker helmet made for you" - carousel (listbox) with product image |
| Numbered Feature Grid (1-3) | Three feature items: "Your hairstyle", "Your head size", "Your efficiency" - each with number, title, description |
| Numbered Feature Grid (4-6) | Three more: "Your vision", "Your temperature", "Your performance" |
| Footnotes | Superscript reference footnotes |
| Separator (HR) | Visual divider |
| Second Carousel | "Designed for you Steri-Shield 8 toga" carousel |
| Toga Feature Grid (1-3) | "Integrated", "Ventilated", "Expanded" |
| Toga Feature Grid (4-5) | "Efficient", "Protected" |
| Contact Form | Different form layout: image on left (toga-side-profile), form on right. Different fields: First Name, Last Name, Email, City, State, Zip, Phone, Hospital, Message, Privacy, marketing opt-in |
| Document ID | OI-GSNPS-SYK-1629566_REV-0 |
| Footer | Standard |

**Unique elements:** Numbered feature grid pattern (6 items for helmet, 5 for toga), two separate product sections (helmet + toga), different contact form layout with side image, different form field set (no country, no category dropdown).

---

### Page 3: NPseal (Template A - Modern Marketing)
**URL:** `npseal.html`

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same |
| Hero (split layout) | Left: product name with stylized text (NP/seal split), "Negative pressure wound therapy" tagline, description, "Learn more" anchor link. Right: product photo |
| Statistics Bar | "The power of NPWT" - three stat blocks: 61% less SSIs, 56% fewer wound complications, 63% fewer reoperations (with superscript citations) |
| Annotated Product Image | Product render with numbered callouts (1-3): hydrophilic foam pad, pinch pump, breathable film. Size availability note + second product image |
| Carousel: How It Works | "Portable healing, powered by a pinch" - carousel with numbered steps (1-3): pinch forces air out, pump regains shape, collapsed state |
| Separator (HR) | Visual divider |
| Icon Feature Row | "Effective care doesn't have to be complicated" - 4 icon+label items: No batteries, No wires, No canisters, No tubes |
| Image + Benefits Block | Photo left + "Peace of mind, built in" text block with 4 descriptive paragraphs |
| How-to Block | "Simple design / Apply, seal, pinch" - text + instructional image |
| Related Products Section | "Meet the rest of the surgical wound care portfolio" - card linking to Zip skin closure with image, title, description, "Learn more" |
| Contact Form | Standard OI contact form (same fields as System 9) |
| Document ID | OI-NPS-SYK-2889500_REV-0 |
| Footer | Standard |

**Unique elements:** Statistics bar with large percentage numbers, annotated product diagram, icon feature row (4 icons), related portfolio products section (not "related products" in the standard sense), instructional/how-to block.

---

### Page 4: F1 Cordless Power Tool (Template B - Standard Product)
**URL:** `stryker-f1-system-cordless-small-bone-power-tool-system.html`

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same |
| Hero | H1 "Stryker F1" + H2 "Small Bone Micro Power System" + paragraph description + product image |
| Content Body | H3 "SmartGRIP Technology" + paragraph + bullet list of features |
| Sidebar | "Contact" link + "Related categories" with hierarchical category links (Medical and surgical equipment > Power tools > Small bone power tools) |
| Product Details: Motors | Title + description paragraph + product image |
| Product Details: Attachments | Title + description paragraph + product image |
| Related Products | H2 "Related products" - 2 cards: Resurfacing Tool and Smart Equipment Management, each with thumbnail, title link, "Learn more" link |
| Contact Form | Standard OI contact form |
| References | Footnotes section |
| Document ID | 9100-005-147 Rev. None |
| Footer | Standard |

**Unique elements:** Sidebar with category breadcrumb links, separate Motors and Attachments sub-sections with product images.

---

### Page 5: Ortho Q Guidance System (Template B - Standard Product, extended)
**URL:** `ortho-q-guidance-system.html`

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same |
| Hero (custom) | H1 "Ortho Q Guidance system" (two-line), tagline paragraph, description paragraph + product image |
| Feature Overview + Image | Left: product screenshot image. Right: "Your streamlined TKA/THA guidance solution" + description + "Features and benefits" bulleted list (10 items) |
| Section Header | "See more, now do more" callout text |
| Annotated Diagram | Dual-column: left text list (A-N component labels) + IO-panel detail image + IO-panel spec list + right text list + full diagram image |
| Separator (HR) | Visual divider |
| Camera Section | Left: product image. Right: "4th generation FP8000 camera" + description + "Pushing guidance forward" + 5-item bullet list |
| Personalization Section | Left: "The power to personalize" + description + 8-item bullet list. Right: screenshot image |
| Separator (HR) | Visual divider |
| Related Products | H2 "Related products" - 3 cards: Express Knee, Precision Knee, Versatile Hip software - each with thumbnail, title link, "Learn more" link |
| Contact Form | Standard OI contact form |
| References | Footnotes |
| Document ID | D0000255393 Rev. AA |
| Footer | Standard |

**Unique elements:** No sidebar (unlike F1), annotated hardware diagram with labeled components and IO-panel specs, multiple image+text alternating sections, sub-product related products (software modules).

---

### Page 6: Zip Skin Closure (Template B - Standard Product)
**URL:** `zip-skin-closure.html`

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same |
| Hero | H1 "Zip skin closure" + long description paragraph with multiple superscript citations + product image |
| IFU Link + Sidebar | "See instructions for use" link to ifu.stryker.com + Related categories: Skin closure |
| Stats Bar | Three comparison stats: "4x faster than sutures", "12x stronger than sutures", "2x better cosmetic appearance" - each with superscript citations |
| Separator (HR) | Visual divider |
| Two-column Feature Blocks | Two blocks side by side: 1) Image + "Creates a better experience" + 3 bullet points. 2) Image + "Saves you cost and time" + 3 bullet points |
| Video Player | Embedded Scene7 video |
| Contact Form | Standard OI contact form |
| References | Extensive references section (10 citations) |
| Document ID | D0000022844 Rev AA |
| Footer | Standard |

**Unique elements:** IFU (Instructions for Use) external link, comparison stats bar, extensive references/citations list (10 items), two-column feature blocks with bullet lists.

---

### Page 7: SmartPump Tourniquet (Template B - Standard Product)
**URL:** `smartpump-tourniquet.html` (excluded but captured via redirect)

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same |
| Hero | H1 "SmartPump Tourniquet System" + H2 "Keeping pressure in check" + description + product image |
| Content Body | H3 + description paragraph + 5-item bullet list of features |
| Sidebar | Related categories: Medical and surgical equipment > Orthopaedic disposables |
| Feature Section | Full-width product image + "Reliable performance at the lowest pressure possible" headline |
| Cuff Comparison | Image + "Not all cuffs are created equal" - two sub-sections: "Even pressure distribution" + "Optimizing occlusion" with descriptions and citations |
| White Paper Download | Linked white paper PDF: "Compression performance of the Stryker Color Cuff Tourniquet" with download link |
| Contact Form | Standard OI contact form |
| References | 4 citations |
| Document ID | 9100-004-754 Rev. None |
| Footer | Standard |

**Unique elements:** White paper/PDF download link, cuff comparison section with clinical data.

---

### Page 8: BioPrep Bone Preparation (Template C - Legacy/Minimal)
**URL:** `bioprep-bone-preparation-system.html` (excluded but captured via redirect)

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same |
| Hero | H1 "BioPrep" + H2 "Bone Preparation System" + tagline + product image |
| Content Body | H3 "BioPrep Bone Preparation Kit" + description paragraph + 5-item bullet list |
| Sidebar | "Contact" link + Related categories: Medical and surgical equipment > Orthopaedic disposables > Cement mixing |
| Document ID | 9100-004-753 Rev. None |
| Footer | Standard |

**NO contact form, NO feature sections, NO media, NO related products.**

---

### Page 9: Ortho Guidance Express Knee Software (Template B Sub-product)
**URL:** `ortho-q-guidance-system/ortho-guidance-express-knee.html`

| Section | Description |
|---------|-------------|
| HCP Disclaimer Bar | Same |
| Hero | H1 "Ortho Guidance express knee software" + tagline + description with citation + product image |
| Features + Image | Left: description + "Features and benefits" (9-item list). Right: anatomy image |
| Separator (HR) | |
| Image + Benefits | Image + "Less invasive: Helps minimize risk" + 4-item bullet list |
| Image + Workflow | "Smart, streamlined workflow" + 6-item bullet list + 3 screenshots with captions |
| Image + Precision | "Precision per patient" + 6-item bullet list with citations |
| Stats Section | "Proven benefits of surgical guidance" - 3 large stat blocks with citations |
| Related Products | 3 cards: Ortho Q system, Precision Knee, Versatile Hip |
| Associated Services | Text block: Flex Financial + ProCare descriptions |
| Contact Form | Standard OI contact form |
| References | 5 citations |
| Document ID | D0000255391 Rev. AA |
| Footer | Standard |

**Unique elements:** Associated services text block (Flex Financial + ProCare), screenshot trio with captions, stats section with clinical evidence.

---

## 4. Comparison Matrix

### Section/Block Presence Across Pages

| Section/Block | System 9 | Steri-Shield 8 | NPseal | F1 | Ortho Q | Zip | Express Knee |
|---|---|---|---|---|---|---|---|
| **Global Header** | Y | Y | Y | Y | Y | Y | Y |
| **Alert/Announcement Bar** | Y | Y | Y | Y | Y | Y | Y |
| **HCP Disclaimer Bar** | Y | Y | Y | Y | Y | Y | Y |
| **Hero Banner** | Y (carousel) | Y (single) | Y (split) | Y (standard) | Y (custom) | Y (standard) | Y (standard) |
| **Intro/Overview Text** | Y | Y | Y | Y (in body) | Y | Y (in hero) | Y |
| **Video Player(s)** | Y (7+) | Y (1) | - | - | - | Y (1) | - |
| **Feature Blocks (text+media)** | Y (6+) | Y (numbered grid) | Y (multiple) | Y (2) | Y (3+) | Y (2-col) | Y (3+) |
| **Statistics/Numbers Bar** | Y (counters) | - | Y (percentages) | - | - | Y (comparisons) | Y (clinical) |
| **Annotated Product Diagram** | Y (indicators) | - | Y (numbered) | - | Y (labeled A-N) | - | - |
| **Icon Feature Row** | - | - | Y (4 icons) | - | - | - | - |
| **Separator (HR)** | Y | Y | Y | - | Y | Y | Y |
| **Image Carousel/Listbox** | Y (hero) | Y (2 carousels) | Y (how-to) | - | - | - | - |
| **Product Family/Variants** | Y (SABO, Driver) | Y (helmet, toga) | - | Y (motors, attach.) | - | - | - |
| **Tailored Solutions/Services** | Y (3 cards) | - | - | - | - | - | Y (text) |
| **Related Products Cards** | - | - | Y (1 card) | Y (2 cards) | Y (3 cards) | - | Y (3 cards) |
| **Sidebar (categories)** | - | - | - | Y | - | Y | - |
| **IFU/Download Link** | - | - | - | - | - | Y | - |
| **White Paper Download** | - | - | - | - | - | - | - |
| **CTA Banner** | Y ("Request demo") | - | - | - | - | - | - |
| **Contact Form** | Y | Y (variant) | Y | Y | Y | Y | Y |
| **Social Media Links** | Y (Twitter, LinkedIn) | - | - | - | - | - | - |
| **References/Footnotes** | - | Y (inline) | Y (inline) | Y | Y | Y (10 items) | Y (5 items) |
| **Document ID** | Y | Y | Y | Y | Y | Y | Y |
| **Footer** | Y | Y | Y | Y | Y | Y | Y |

---

## 5. Common Template (Present on ALL or Nearly ALL pages)

These sections/blocks form the **universal skeleton** that every product page template must support:

### Always Present (100%)
1. **Global Header** - Stryker logo, main navigation, country selector, search
2. **Alert/Announcement Bar** - Dismissible banner at top (currently: "Network Disruption" notice)
3. **HCP Disclaimer Bar** - "Information for healthcare professionals" text bar
4. **Hero Section** - Product name (H1), subtitle/tagline (H2), description paragraph, hero image
5. **Document/Regulatory ID** - e.g., "OI-S9-SYK-2236250_REV-0" or "9100-004-753 Rev. None"
6. **Last Updated Date** - e.g., "Last Updated October/2025"
7. **Global Footer** - Copyright, legal links, social media icons, trademarks, UDI, product experience, ethics hotline

### Nearly Always Present (85%+)
8. **Contact Form** - Present on all pages except BioPrep (legacy). Two variants exist:
   - **Standard OI Form**: first name, last name, hospital, specialty, email, phone, country, city, state, zip, category dropdown, message, privacy checkbox, marketing opt-in, reCAPTCHA, submit
   - **Steri-Shield Variant**: first name, last name, email, city, state, zip, phone, hospital, message (with side image) - different field ordering and no category dropdown
9. **Feature Content Blocks** - Text + image/media paired blocks (present on all except BioPrep)

---

## 6. Variable Sections (Present on Some Pages)

### Frequently Used (50-70% of pages)
- **Statistics/Numbers Bar** - Large numbers with descriptions (System 9, NPseal, Zip, Express Knee)
- **Related Products Cards** - Card grid with thumbnail, title, "Learn more" link (NPseal, F1, Ortho Q, Express Knee)
- **Separator (HR)** - Horizontal rule dividers between sections (most modern pages)
- **References/Footnotes Section** - Clinical citations at bottom (F1, Ortho Q, Zip, Express Knee, SmartPump)
- **Video Player** - Scene7 embedded video (System 9, Steri-Shield, Zip)

### Occasionally Used (20-40% of pages)
- **Sidebar with Category Links** - "Related categories" hierarchical links (F1, Zip, SmartPump, BioPrep)
- **Image Carousel/Listbox** - Multi-slide image galleries (System 9, Steri-Shield 8, NPseal)
- **Annotated Product Diagram** - Labeled product images with callouts (System 9, NPseal, Ortho Q)
- **Product Family/Variants Grid** - Sub-product showcases within a page (System 9, Steri-Shield 8, F1)
- **Tailored Solutions/Services Section** - Cards or text blocks for SEM, ProCare, Flex Financial (System 9, Express Knee)
- **CTA Banner** - Call-to-action banner with product name + action text (System 9 only)
- **Social Media Links Section** - Division-specific social media links (System 9 only)

### Rare (< 20%)
- **Icon Feature Row** - Small icons with labels in a row (NPseal only)
- **IFU/Instructions for Use Link** - External link to ifu.stryker.com (Zip only)
- **White Paper/PDF Download** - Linked downloadable document (SmartPump only)
- **Numbered Feature Grid** - Numbered items in a grid layout (Steri-Shield 8 only)
- **Associated Services Text Block** - Plain text descriptions of services (Express Knee only)

---

## 7. Key Structural Variations

### Hero Section Variants
| Variant | Used On | Description |
|---------|---------|-------------|
| **Carousel Hero** | System 9 | Multi-slide carousel with image + text overlay + navigation dots |
| **Single Image Hero** | Steri-Shield 8 | Full-width background image + H1 + subtitle |
| **Split Hero** | NPseal | 50/50 layout: text block left, product photo right, with anchor link |
| **Standard Hero** | F1, Zip, SmartPump, BioPrep, Express Knee | Product name (H1) + subtitle (H2) + paragraph + right-aligned product image |
| **Custom Hero** | Ortho Q | Multi-heading hero with two H1s, empty first H1, tagline + description |

### Content Layout Patterns
| Pattern | Used On | Description |
|---------|---------|-------------|
| **Two-column (sidebar)** | F1, Zip, SmartPump, BioPrep | Main content + right sidebar with category links |
| **Full-width sections** | System 9, Steri-Shield, NPseal, Ortho Q | Alternating full-width content blocks |
| **Mixed** | Express Knee | Full-width with alternating image/text sides |

### Contact Form Variants
| Variant | Used On | Fields |
|---------|---------|--------|
| **Standard OI** | System 9, NPseal, F1, Ortho Q, Zip, SmartPump, Express Knee | 11 fields + category dropdown + message + privacy + opt-in |
| **Steri-Shield Custom** | Steri-Shield 8 | 9 fields (no country, no category dropdown) + side image |
| **Contact Link Only** | BioPrep | Just a "Contact" link to division page |

---

## 8. Image/Media Patterns

### Image Types Observed
- **Hero images**: Large product photos or lifestyle images (every page)
- **Product renders**: Clean product shots on transparent/white backgrounds (NPseal, F1, Steri-Shield)
- **Annotated diagrams**: Product images with numbered/labeled callouts (NPseal, Ortho Q)
- **Feature thumbnails**: Smaller images paired with text blocks (all except BioPrep)
- **Icon/illustration images**: Small icons for feature rows (NPseal)
- **Timeline/infographic images**: Custom graphics (System 9 evolution timeline)
- **Screenshot images**: Software interface screenshots (Ortho Q, Express Knee)
- **Card thumbnails**: Small square images in product cards (F1, Ortho Q, NPseal related products)

### Video Patterns
- **Scene7 Video Viewer**: Adobe Dynamic Media (Scene7) embedded player used on System 9 (7+ videos), Steri-Shield (1 video), Zip (1 video)
- **Auto-playing short videos**: Loop videos for feature demonstrations (System 9 - 3-7 second clips)
- **Standard playback videos**: Play-on-click promotional/instructional videos (Steri-Shield, Zip)

### Media Hosting
- All images served from `/content/dam/stryker/` paths
- Videos use Scene7/Adobe Dynamic Media viewer component

---

## 9. Pages That Significantly Deviate from the Common Pattern

### System 9 Power Tools - MOST COMPLEX
The richest page by far. Unique features not seen elsewhere:
- 7+ embedded auto-playing videos
- Stats counters with animated numbers
- Product evolution timeline
- Full product family showcase with individual product cards
- Tailored solutions card grid
- Demo request CTA banner
- Social media section
- Represents the "flagship product" treatment

### Steri-Shield 8 - UNIQUE LAYOUT
Only page with:
- Numbered feature grid layout (6 + 5 items)
- Two distinct product sections within one page (helmet + toga)
- Contact form with side image and different field set
- Multiple carousels for different product variants

### BioPrep - LEGACY OUTLIER
Dramatically simpler than all other pages:
- No contact form embedded (just a "Contact" link)
- No feature sections, videos, stats, or related products
- Single content block with bullet list
- "Last Updated January/2020" - oldest page
- Multiple redirected products (TPX, InterPulse, Revolution Cement Mixer) all land here
- Likely a candidate for retirement or consolidation

---

## 10. Recommendations for Universal Template

### Required Blocks for the EDS Template

1. **Hero Block** - Must support 4+ variants: carousel, single image, split layout, standard
2. **Text+Media Block** - Flexible block for pairing text with images or videos; support left/right/full layouts
3. **Statistics Block** - Large numbers with descriptions and optional superscript citations
4. **Feature Grid Block** - Numbered or unnumbered items in 2-3 column grid
5. **Video Block** - Scene7/Dynamic Media video embed support
6. **Product Cards Block** - Grid of product cards with thumbnail, title, description, link
7. **Contact Form Block** - Two variants: standard (11 fields + dropdown) and compact (with side image)
8. **Icon Row Block** - Small icons with labels in horizontal layout
9. **Annotated Image Block** - Product image with numbered/labeled callouts
10. **Separator Block** - Simple horizontal rule divider
11. **References Block** - Ordered list of footnotes/citations
12. **Sidebar Block** - Category hierarchy links (for standard product layout)
13. **CTA Banner Block** - Full-width call-to-action with headline and subheadline
14. **Download/Link Block** - For white papers, IFU links, PDF downloads

### Section Structure
```
[Alert Bar]
[Global Header/Nav]
[HCP Disclaimer]
[Hero Section - multiple variants]
[Content Sections - repeatable, flexible order]
  - Text+Media blocks
  - Feature grids
  - Statistics bars
  - Video embeds
  - Annotated diagrams
  - Product family showcases
  - Related products
  - Services/solutions cards
[Contact Form]
[References/Footnotes]
[Document ID + Last Updated]
[Global Footer]
```
