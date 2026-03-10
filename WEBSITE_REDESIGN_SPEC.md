# Vector Scope AI Website Redesign — Esri Product Startup Layout

Implement the exact layout and copy below so the site reads as a **focused product startup building on Esri**, not a contractor resume. Deploy before submitting to the Esri Startup Program.

---

## Design System

**Files to update:** `tailwind.config.js`, `css/index.css`, `index.html` (body background).

| Token | Value | Usage |
|-------|--------|--------|
| Primary | `#1A73E8` | Esri blue — primary buttons, key links, accents |
| Secondary | `#34A853` | Green accent — secondary highlights |
| Background | `#F8F9FA` | Light gray — page/section backgrounds |
| Text | `#202124` | Near black — body and headings |

**Typography:**
- **Font:** Inter (replace Roboto). Add to `index.html` head: `https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap`
- **Sizes:** H1 = 48px, H2 = 32px, body = 16px
- **Weights:** Headings = Inter Bold (700), body = Inter Regular (400)

**Tone:** Short sentences. Active voice. No consulting language. No "cloud native" buzzwords. Focus on agency pain points (staff can't edit maps, data trapped in proprietary formats).

---

## Content to Remove (Must NOT Include)

- Contractor clients (CDC, DHS, FEMA as "our clients")
- "Full-stack GIS development"
- Long technical descriptions (Bedrock, SageMaker, LangChain, FISMA paragraphs)
- GitHub links
- R/Python mentions
- Sections: "AI-Powered Services" (four service cards), "AI Case Studies" (swiper carousel), "Why These Projects Succeeded", "Your AI Expert Who Understands Government" (long consultant bio)
- Swiper JS and carousel markup
- Secondary CTA "Discuss Your AI Project" / "Explore AI Services" — replace with product CTAs only

---

## Section-by-Section Implementation

### 1. Hero (above the fold)

- **Background:** Full-width; use clean Esri map screenshot or abstract geospatial visualization (placeholder image until asset exists: e.g. `assets/images/hero-map.jpg`).
- **Content:**
  - Logo + nav (see Nav below).
  - **Headline:** "VECTOR SCOPE AI" (all caps, H1 48px).
  - **Subhead:** "Collaborative Map Updates for Agencies & Organizations".
  - **Body:** "Non-technical staff and partners update official geospatial data through simple Esri web apps. We handle validation, versioning, and deliver clean GeoParquet files for analytics and archiving."
  - **Two buttons side-by-side:**
    - Primary: "See GlobalSkiAtlas Demo" → `https://globalskiatlas.com`
    - Secondary: "Contact for Pilot" → `#contact`
- **Layout:** Centered content over full-width background; no side-by-side hero image (current pic01.jpg layout removed).

### 2. Nav

- **Links:** "Product" (`#product`), "How It Works" (`#how-it-works`), "Demo" (Global Ski Atlas), "Contact" (`#contact`).
- **CTA in nav:** Single "Contact for Pilot" or "Start Pilot" → `#contact`.
- **Style:** Transparent over hero; solid background on scroll. Text `#202124`. Primary button `#1A73E8`.

### 3. Product Section — ATLASUPDATE PLATFORM

- **ID:** `id="product"`.
- **Heading (H2):** "ATLASUPDATE PLATFORM".
- **Subtext:** "Agencies get authoritative map data updated by real people, delivered as modern GeoParquet files."
- **Layout:** Two columns.
  - **Left:** Three placeholder areas for screenshots/diagrams (can use placeholders or simple bordered boxes with labels):
    1. Web editing interface
    2. Approval workflow dashboard
    3. GeoParquet file download
  - **Right:** Bullet list (checkmarks):
    - Staff & volunteers edit via Esri web apps (no GIS skills needed)
    - Built-in quality checks & approval workflows
    - Every change saved as versioned GeoParquet files
    - Works with your existing ArcGIS Online/Enterprise
    - No database lock-in, instant analytics compatibility

### 4. How It Works (3-step flow)

- **ID:** `id="how-it-works"`.
- **Heading (H2):** "FROM ESRI EDITS TO GEOPARQUET IN MINUTES".
- **Three steps,** each: image placeholder + title + one short line.
  1. **Staff & Partners Edit** — "Via guided Esri web apps and forms" (screenshot of editing app).
  2. **Approval Workflow** — "Review changes, run QC, approve updates" (screenshot of dashboard).
  3. **GeoParquet Snapshots** — "Versioned files for analytics, sharing, archiving" (GeoParquet file icon or screenshot).
- **Layout:** Three equal columns (stack on mobile).

### 5. Technology (credibility)

- **Heading (H2):** "BUILT ON ESRI + MODERN DATA STANDARDS".
- **Four logos in a row (equal weight):** ArcGIS Online/Enterprise | Experience Builder | GeoParquet | AWS.
- **Subtext:** "Esri web apps meet open-standard GeoParquet storage. Your data stays portable, scalable, and analytics-ready."
- **Assets:** Placeholder boxes or text labels until logo assets are added (e.g. `assets/images/tech/arcgis.svg`, `geo-parquet.svg`, `aws.svg`).

### 6. Showcase — Global Ski Atlas

- **Heading (H2):** "GLOBAL SKI ATLAS".
- **Subhead:** "Our first vertical: ski resorts & communities."
- **Content:** One card/block:
  - Screenshot of live ski map (reuse or link to existing `pic01cs.jpg` / globalskiatlas.com).
  - Bullets: 50+ resorts with live conditions, runs, lifts; Resorts update via web editor (no GIS needed); Volunteers contribute photos & trail reports; Public atlas powered by ArcGIS Online.
  - **Button:** "Live demo" → globalskiatlas.com.
- **No** second case study (Conversational Census) on this page; single showcase only.

### 7. Target Customers — Who We Serve

- **Heading (H2):** "WHO WE SERVE".
- **Six cards/icons:** Local Government | State Agencies | Non-Profits | Utilities | Health Depts | Tourism Offices.
- **Subtext:** "Boundary updates, infrastructure tracking, service areas, program mapping—any authoritative geospatial data your organization maintains."

### 8. Team (minimal)

- **Heading (H2):** "ABOUT US".
- **Single block:** Jonathan Witcoski, Founder & GIS Architect.
- **Bio (short):** "15+ years federal GIS contracting (CDC, State Dept). Python ETL, AWS serverless, geospatial automation expert. Building tools that make agencies move faster."
- **No** long "consultant differentiator" or client-name drops. Optional: 1–2 advisor logos if available.

### 9. Contact

- **ID:** `id="contact"`.
- **Heading:** "Ready to simplify collaborative map updates?"
- **Form:** Keep existing Formspree form (name, email, message). Single submit button: "Send message" or "Start Pilot".
- **No** "Ready to Deploy AI?" or "Transform your geospatial capabilities with AI".

### 10. Footer CTA

- **Primary line:** "Ready to simplify collaborative map updates?"
- **Single fat button:** "START YOUR PILOT" → `mailto:hello@vectorscopeai.com` or `#contact`.
- **Small text:** "© 2026 Vector Scope AI | Applying to Esri Startup Program".
- **Optional:** Keep minimal footer links (Contact, Company, optional Resources) and social (LinkedIn, X) in a compact row.

---

## Assets and Placeholders

- **Hero background:** Esri map or geospatial visualization (e.g. `assets/images/hero-map.jpg`). If missing, use a solid `#F8F9FA` or subtle gradient plus a placeholder note.
- **Product section:** Three placeholders for "Web editing", "Approval dashboard", "GeoParquet download" (can be gray boxes with text or existing images repurposed).
- **How It Works:** Three placeholders (editing app, dashboard, GeoParquet icon).
- **Technology:** Four logos (ArcGIS, Experience Builder, GeoParquet, AWS). Use text or SVG placeholders until assets exist.
- **Global Ski Atlas:** Existing `pic01cs.jpg` or screenshot from globalskiatlas.com.

---

## Technical Tasks

1. **tailwind.config.js:** Set `primary: "#1A73E8"`, `secondary: "#34A853"`. Add `backgroundColor: { 'page': '#F8F9FA' }` if desired for body.
2. **css/index.css:** Switch font to Inter; set `--btn-bg` to `#1A73E8`; set `--primary-text-color` to `#202124`; update link hover to `#34A853` if desired.
3. **index.html:**
   - Replace Google Fonts link with Inter (400, 700).
   - Set `<body class="... tw-bg-[#F8F9FA]"` (or equivalent).
   - Replace entire main content (all sections) with the new structure above; remove Swiper markup and script.
   - Update meta title/description/OG to product messaging: e.g. "Vector Scope AI – Collaborative Map Updates for Agencies" and "Esri web apps + GeoParquet. Authoritative map data updated by your team."
4. **index.js:** Remove or adjust GSAP targets if class names change (e.g. `.reveal-hero-text`, `.reveal-up`); keep scroll behavior and mobile menu. Remove any Swiper init if Swiper is removed.
5. **Footer:** Single CTA + "© 2026 Vector Scope AI | Applying to Esri Startup Program". Trim "Company"/"Resources" to minimal links (Product, How It Works, Demo, Contact).

---

## Copy-Paste Checklist

- [ ] Hero: "VECTOR SCOPE AI" + "Collaborative Map Updates for Agencies & Organizations" + two CTAs.
- [ ] Product: "ATLASUPDATE PLATFORM" + two-column layout + five checkmarks.
- [ ] How It Works: "FROM ESRI EDITS TO GEOPARQUET IN MINUTES" + 3 steps.
- [ ] Technology: "BUILT ON ESRI + MODERN DATA STANDARDS" + 4 logos + one line.
- [ ] Showcase: "GLOBAL SKI ATLAS" + bullets + Live demo button.
- [ ] Who We Serve: 6 customer types + one sentence.
- [ ] About Us: Jonathan + short bio only.
- [ ] Footer: "START YOUR PILOT" + © 2026 + Esri Startup line.
- [ ] Remove: Services cards, Case study carousel, "Why These Projects Succeeded", long "Your AI Expert" section, consulting/contractor copy, GitHub/R/Python.

---

## Summary

One-page rebuild of `index.html` with new sections, design tokens (Esri blue/green, Inter, #F8F9FA/#202124), and `css/index.css` + `tailwind.config.js` updates. No new backend; Formspree contact kept. Asset placeholders used where images/logos are not yet available. Result: product-startup look aligned with Esri Startup Program application.
