# Superset — terminals with stage lighting

## Overview

A near-black, developer-minded style with the drama of a product stage and the practical detail of working software. White grotesk headlines, gray supporting text and small burnt-orange mono labels keep the spacious composition controlled. Dark interface scenes supply most of the visual substance; warmer documentary photography adds a human register on culture-oriented pages.

### Essentials

- The promise sits between polished rails: a centered two-line Inter headline at 72px/1.1, weight 500 and -0.025em tracking, with fine tapered white light streaks bracketing the lower line.
- The first screen is a stage, not a dashboard: a 65px navigation bar, 160px opening top padding, a small mono announcement, a short support line and a 48px action row precede an almost full-width dark application window whose top appears near the bottom of the first 900px.
- Actions look cut from flat sheet material: primary landing-page buttons have square corners, off-white fill, dark text and 12px 24px padding; companion icon actions are 48px bordered squares. Rounded 8px actions belong to pricing, not the default landing page.
- Color behaves like a pilot light: the page remains overwhelmingly near-black and gray; burnt orange #d25611 appears in 14px uppercase mono eyebrows, a tiny announcement dot, active underlines and hover fills. Atmospheric orange is only a 2–6% wash.
- Product scenes are lit black-on-black: 10px secondary windows and a 14px hero window use 1px translucent edges, dim title bars, deep black shadows and restrained warm radial light. Include a concrete product demonstration; a small, carefully composed working-state mockup is the fallback when finished media is unavailable.
- Long-form persuasion alternates sparse capability stages with denser proof: 500px text measures, 64px split-grid gaps and 128px chapter separation give way to square testimonial cards and almost-square reassurance tiles. Finish with a centered conversion statement and a practical next-step utility panel before the expansive directory footer.

## Colors

### Accent

| Name | Value | Token | Roles | Use |
| --- | --- | --- | --- | --- |
| Burnt orange | `#d25611` | `--color-ember` | accent, link, action | Mono eyebrows, active tab edge, tiny status dot and primary-action hover. |
| Warm orange | `#e8804a` | `--color-ember-light` | accent, link | Orange-link hover and faint radial stage lighting; lighting uses this hue at 2–6% opacity. |

### Neutral

| Name | Value | Token | Roles | Use |
| --- | --- | --- | --- | --- |
| Soft white | `#fafafa` | `--color-foreground` | text, action | Main headings and landing-page action fills. |
| Near-black canvas | `#111111` | `--color-canvas` | background, text | Main background and dark text on light actions. |
| Raised charcoal | `#171717` | `--color-card` | surface | Testimonial cards and dim window bars. |
| Low raised wash | `#181818` | `--color-wash` | surface | Visible soft white at 3% over the canvas for reassurance cards and the utility panel. |
| Muted charcoal | `#262626` | `--color-muted-surface` | surface | Small icon tiles and understated raised elements. |
| Hairline gray | `#292929` | `--color-rule` | border | Visible white at 10% over the near-black canvas; use the alpha recipe on layered elements. |
| Support gray | `#bebebe` | `--color-muted` | text, link | Supporting paragraphs, navigation and directory links. |

### Page-type variants

| Only for | Name | Value | Token | Roles | Use |
| --- | --- | --- | --- | --- | --- |
| culture pages | Aged paper shade | `#e0d2b2` | `--color-paper-shade` | surface | Lower paper tone of the documentary print fan. |
| culture pages | Aged paper highlight | `#f1e9d5` | `--color-paper-light` | surface | Warm upper paper tone of the documentary print fan. |
| culture pages | Brown caption ink | `#3b3226` | `--color-caption-ink` | text | Handwritten print captions. |
| pricing pages | Plan action gray | `#e5e5e5` | `--color-pricing-action` | action | Recommended plan action fill. |

## Typography

- **Inter** — Headlines, body, navigation and action labels. Modern grotesk with a tall x-height, open counters and lightly compressed headline spacing. OpenType features: "cv01", "ss03". Font stack: "Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif.
- **IBM Plex Mono** — Technical eyebrows, announcement text, compact action labels and utility commands. Matter-of-fact monospaced markings, usually regular weight. Font stack: "IBM Plex Mono", "IBM Plex Mono Fallback", ui-monospace, monospace.
- **Caveat** (only for culture-page print captions) — Personal handwritten notes beneath documentary photographs. Loose, narrow handwritten strokes at medium weight. Font stack: "Caveat", "Caveat Fallback", cursive.

| Recipe | Font | Weight | Size | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- | --- |
| display | Inter | 500 | 72px | 1.1 | -0.025em | Two-line centered landing promise. |
| heading-lg | Inter | 500 | 48px | 1.1 | -0.025em | Major proof, reassurance, FAQ and closing statements. |
| heading | Inter | 500 | 30px | 1.2 | -0.025em | Split capability headings and comparison headings. |
| hero-support | Inter | 300 | 20px | 1.4 | normal | Single centered support line below the opening headline. |
| feature-body | Inter | 400 | 18px | 1.625 | normal | Capability paragraphs at a 500px maximum measure. |
| card-title | Inter | 500 | 18px | 28px | normal | Reassurance card titles, plan names and landing-page FAQ questions. |
| body | Inter | 400 | 16px | 1.5 | normal | Default supporting copy and large primary action text. |
| testimonial | Inter | 400 | 15px | 1.625 | normal | Unpolished customer quotation text. |
| eyebrow | IBM Plex Mono | 400 | 14px | 20px | 0.1em, uppercase | Orange technical section markings. |
| small-body | Inter | 400 | 14px | 1.625 | normal | Reassurance explanations and compact FAQ answers. |
| caption | Inter | 400 | 14px | 20px | normal | Directory links, attribution roles and concise supporting labels. |
| label | Inter | 500 | 14px | 20px | normal | Directory headings and pricing controls. |
| command | IBM Plex Mono | 400 | 14px | 20px | normal | A copyable command or equivalent practical next step. |
| nav | Inter | 400 | 13px | 1.5 | 0.01em | Desktop navigation labels. |
| compact-action | IBM Plex Mono | 400 | 12px | 16px | 0.05em, uppercase | Header conversion action and compact culture-page actions. |
| utility-tab | IBM Plex Mono | 400 | 12px | 16px | normal | Utility tabs and announcement labels. |

### Page-type variants

| Only for | Recipe | Font | Weight | Size | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- | --- | --- |
| culture pages | culture-display | Inter | 450 | 56px | 1.06 | -0.035em | Left-aligned editorial opening statement. |
| pricing pages | pricing-title | Inter | 500 | 36px | 40px | -0.025em | Compact editorial opening title. |
| pricing pages | price | Inter | 500 | 36px | 1 | -0.025em | Plan cost or custom-pricing phrase. |
| culture pages | culture-close | Inter | 500 | 36px | 1.1 | -0.025em | Centered invitation at the end of a culture narrative. |
| culture pages | culture-quote | Inter | 400 | 28px | 1.35 | -0.02em | An editorial quotation above portraits. |
| culture pages | culture-stat | Inter | 400 | 26px | 34px | -0.025em | Values and facts in a thin ruled three-column strip. |
| culture pages | culture-heading | Inter | 450 | 24px | 32px | -0.025em | Restrained section headings for people and process information. |
| culture-page print captions | hand-caption | Caveat | 500 | 17px | 1.25 | normal | Short event-and-date notes beneath photographs. |
| pricing pages | pricing-eyebrow | IBM Plex Mono | 400 | 14px | 20px | 0.05em, uppercase | Muted section labels instead of orange capability labels. |
| culture pages | culture-marking | IBM Plex Mono | 400 | 11px | 16px | 0.07em, uppercase | Stat captions, portrait roles and outbound technical links. |

**Notes:**

- Keep large headings at weight 500 rather than bold. The culture variant uses the slightly lighter 450 cut.
- The default headline tracking is -0.025em across 30px, 48px and 72px roles; the culture opening tightens to -0.035em.
- Mono is a hierarchy accent, not the paragraph face. Eyebrows are orange and widely spaced; utility text is smaller and normally tracked.

## Layout

**Density:** Airy at section level, compact within working-product scenes and proof cards.

### Spacing

| Value | Use |
| --- | --- |
| 8px | Title-to-description gaps in compact cards. |
| 12px | Directory link rhythm and compact control padding. |
| 16px | Action-row gaps and testimonial padding. |
| 24px | Feature heading-to-copy gap and reassurance tile padding. |
| 32px | Default desktop content side padding and support-to-action gap. |
| 40px | Closing action-to-utility explanation gap. |
| 64px | Split-feature grid gap and major heading-to-proof separation. |
| 80px | Footer vertical padding and desktop FAQ split gap. |
| 96px | Smaller section-padding variant. |
| 128px | Major section padding and separation between capability chapters. |
| 160px | Desktop landing opening top padding beneath navigation. |

### Containers and grids

- **main container**: max width 1280px · side padding 32px. Centered wrapper with 1216px usable content at desktop.
- **capability split**: 2 columns · gap 64px. Equal-width text and media columns; alternate the media side across chapters and vertically center both.
- **paragraph measure**: max width 500px. Keep feature prose narrower than its 576px column.
- **proof columns**: 3 columns · gap 16px. Variable-height testimonial columns, not a forced equal-height card row.
- **reassurance grid**: 3 columns · gap 24px. Equal-width bordered supporting tiles.
- **FAQ split**: 2 columns · gap 80px. A left heading beside a wider right question list, in a 1:1.5 ratio.
- **pricing container** (only for pricing pages): max width 1152px · side padding 24px. 1104px usable width for plan cards and comparison table.
- **pricing introduction** (only for pricing pages): max width 768px · side padding 24px. A narrow centered container whose text itself is left aligned.
- **culture opening** (only for culture pages): 2 columns · gap 128px. A 2:3 heading-and-manifesto split.

## Corner radius

| Only for | Element | Radius |
| --- | --- | --- |
|  | landing actions | 0px |
|  | reassurance tiles and utility panels | 2px |
|  | secondary product windows | 10px |
|  | hero product window | 14px |
| pricing pages | plan cards | 10px |
| pricing pages | plan actions and billing switch | 8px |
| culture pages | portrait photographs | 10px |

## Surfaces and depth

### Shadows

| Name | Value | Use |
| --- | --- | --- |
| hero window | `0px 1px 1px rgba(0,0,0,0.4), 0px 16px 40px -12px rgba(0,0,0,0.6), 0px 32px 90px -24px rgba(0,0,0,0.75)` | Deep separation for the large black-on-black opening object. |
| feature window | `0px 1px 1px rgba(0,0,0,0.4), 0px 24px 70px -16px rgba(0,0,0,0.75)` | Secondary product windows only. |

### Surfaces

#### Canvas · level 0

**Use:** Continuous page backing.

**CSS:** `background: #111111; color: #fafafa`

**Observed:** Sections mostly share one uninterrupted dark field.

**Transfer:** Create chapter changes with space, not alternating color bands.

#### Warm stage · level 0

**Use:** Subtle illumination behind product objects.

**CSS:** `background: radial-gradient(55% 45% at 50% 40%, rgba(232,128,74,0.05), rgba(0,0,0,0) 75%)`

**Observed:** A 576px-wide field supports a smaller dark object; the opening uses a broader 2–6% wash.

**Transfer:** Keep the light barely perceptible, with no hard colored edge.

#### Product window · level 2

**Use:** Small capability demonstrations.

**CSS:** `background: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; box-shadow: 0px 1px 1px rgba(0,0,0,0.4), 0px 24px 70px -16px rgba(0,0,0,0.75); overflow: hidden`

**Observed:** A dim title bar and faint inset highlights make the object read as a physical window rather than a flat image.

**Transfer:** Show one workflow state clearly, surrounded by dark negative space.

#### Low wash panel · level 1

**Use:** Reassurance tiles and practical utility panels.

**CSS:** `background: rgba(250,250,250,0.03); border: 1px solid rgba(250,250,250,0.1); border-radius: 2px`

**Observed:** Almost square corners and faint fill distinguish informational panels from product windows.

**Transfer:** Use this material for supporting explanations, not every section.

#### Plan surface · level 1

**Only for:** pricing pages

**Use:** Plan choices.

**CSS:** `background: rgba(23,23,23,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px`

**Observed:** The recommended plan changes to a 20% charcoal wash with a 30% soft-white border, not a colored gradient.

**Transfer:** Emphasize one tier through edge contrast and its light action.

## Components

### Navigation

**Use:** Persistent global orientation.

**CSS:** `position: sticky; top: 0px; height: 65px; background: rgba(17,17,17,0.8); border-bottom: 1px solid rgba(255,255,255,0.035); backdrop-filter: blur(8px); z-index: 50`

**Text style:** `nav` — Inter 400 · 13px/1.5 · tracking 0.01em

**Observed:** Compact wordmark on the left; desktop links, repository count and a small mono conversion action cluster on the right. Header side gutters are 24px.

**Transfer:** Use a compact own-brand mark, short navigation labels and one high-contrast action.

### Primary button

**Use:** Main landing-page conversion.

**CSS:** `background: #fafafa; color: #111111; border-radius: 0px; padding: 12px 24px; height: 48px; display: flex; align-items: center; gap: 8px`

**Text style:** `body` — Inter 400 · 16px/1.5

**Observed:** Text precedes a small download glyph. Header variant uses a 32px height, 8px 16px padding and compact-action typography.

**States:** Declared: hover background-color #d25611; color #fff.

**Transfer:** Name the concrete action and platform when relevant.

### Directory link

**Use:** Footer navigation and low-emphasis text actions.

**CSS:** `display: inline-flex; align-items: center; gap: 4px; color: #bebebe`

**Text style:** `caption` — Inter 400 · 14px/20px

**Observed:** Text is unboxed; links form vertical lists beneath brighter medium-weight category headings.

**States:** Declared: hover color #fafafa.

### Testimonial card

**Use:** A dense wall of personal proof.

**CSS:** `background: #171717; border: 1px solid rgba(255,255,255,0.1); border-radius: 0px; padding: 16px`

**Text style:** `testimonial` — Inter 400 · 15px/1.625

**Observed:** Small circular avatar, name and muted role lead; quotation follows after 12px. Card heights follow content in three masonry-style columns.

**States:** Declared: hover border-color uses muted foreground at 50% opacity.

**Transfer:** Use attributable quotations with their natural sentence rhythm.

### Reassurance tile

**Use:** Three concise reasons to trust the product.

**CSS:** `background: rgba(250,250,250,0.03); border: 1px solid rgba(250,250,250,0.1); border-radius: 2px; padding: 24px`

**Text style:** `card-title` — Inter 500 · 18px/28px

**Observed:** A 40px icon square leads the title and a small-body explanation. The title has an 8px gap before copy.

**Transfer:** Each tile should resolve a distinct buyer concern.

### FAQ row

**Use:** Expandable objection handling.

**CSS:** `border-bottom: 1px solid rgba(255,255,255,0.1); padding: 24px 0px`

**Text style:** `card-title` — Inter 500 · 18px/28px

**Observed:** A question at left and small plus at right. The answer appears below in muted 16px/26px text; the landing list is wider than its heading column. Pricing and culture variants use 20px vertical trigger padding, 16px medium questions and 14px/1.625 answers.

**Transfer:** Keep closed rows visually light; use real disclosure controls.

### Utility panel

**Use:** A practical alternative next step near conversion.

**CSS:** `max-width: 576px; background: rgba(250,250,250,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; text-align: left`

**Text style:** `command` — IBM Plex Mono 400 · 14px/20px

**Observed:** A 33px tab header holds compact mono options and a copy glyph. The selected tab has a 1px orange underline; a command row beneath uses 14px 16px padding.

**Transfer:** Always pair the closing promise with a concrete utility: an install command, quick-start snippet or copyable integration instruction.

### Directory footer

**Use:** The shared substantial page ending.

**CSS:** `background: #111111; border-top: 1px solid rgba(255,255,255,0.1)`

**Text style:** `caption` — Inter 400 · 14px/20px

**Observed:** Inside the main container, 80px vertical padding surrounds a broad brand block and four narrow directory columns with 64px horizontal gaps. Brand block stacks a compact angular wordmark, social icons, circular trust seal, copyright and language control. Categories use label typography and a 16px gap to link lists; links have 12px list gaps.

**Transfer:** Retain the asymmetry and deep directory structure. Use a truthful trust marker or own-brand emblem in the seal position.

### Plan card

**Only for:** pricing pages

**Use:** Comparable purchase choices.

**CSS:** `display: flex; flex-direction: column; gap: 24px; padding: 32px; background: rgba(23,23,23,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px`

**Text style:** `card-title` — Inter 500 · 18px/28px

**Observed:** Three equal-height cards with 32px grid gaps. Content order is tier, audience, price, billing note, full-width action, small helper, divider and check list. Recommended tier receives a small light Popular tag, brighter border and light action.

**Transfer:** Use the same baseline and content order for every tier.

### Plan action

**Only for:** pricing pages

**Use:** Recommended plan conversion.

**CSS:** `height: 40px; padding: 0px 24px; border-radius: 8px; background: #e5e5e5; color: #171717; display: flex; align-items: center; justify-content: center`

**Text style:** `label` — Inter 500 · 14px/20px

**Observed:** Only the recommended tier uses the solid light fill. Other tier actions use a 4.5% white fill and 15% white border.

**States:** Declared: hover background-color mixes the light fill at 90% with transparent; focus-visible border-color lab(48.496% 0 0).

### Billing option

**Only for:** pricing pages

**Use:** Switch plan billing periods.

**CSS:** `padding: 6px 16px; border-radius: 6px; color: #bebebe; display: flex; align-items: center`

**Text style:** `label` — Inter 500 · 14px/20px

**Observed:** Options sit inside an 8px-radius, 42px-tall dark bordered capsule with 4px padding. Selected option becomes light with dark text; a tiny contrasting savings tag nests within it.

**States:** Declared: hover color #fafafa.

## Imagery and graphics

### Rail-lit promise

**Use:** Signature headline treatment in the main landing opening.

**Observed:** Thin silver-white tapered rails extend beyond the second headline line at its upper and lower edges. Faint technical particles sit behind the headline and a broad warm light pool sits below it; the text remains solid white.

**Transfer:** Preserve the rails and dim atmosphere with different copy. Match the soft glow; exact particle positions are not essential.

**Build:** Place 1px horizontal linear gradients from transparent through rgba(250,250,250,0.8) to transparent behind the upper and lower edges of the lower line. Extend each about 48px past the text and add a restrained 2px blur duplicate. Under the text, use a broad radial gradient of rgba(232,128,74,0.06), then rgba(232,128,74,0.02) at 55%, transparent at 78%. Scatter sparse 8–10px mono characters at roughly 2% white opacity behind the stage.

### Dark working interface

**Use:** Hero object and smaller capability demonstrations.

**Observed:** The hero shows a nearly edge-to-edge desktop workspace, with tab bar, sidebar, terminal and review pane. Smaller chapters isolate terminal, diff and file-menu fragments in 320–528px windows on a 576px stage. Tiny green and red workflow details remain inside the interface; marketing typography stays neutral.

**Transfer:** Use your own real workflow in a legible dark interface. Minimum acceptable version is a compact HTML mockup with a title bar, two or three meaningful states and one actual task, rather than an abstract empty rectangle.

**Build:** Use Product window material, dim charcoal title bars and 1px white-at-6% dividers. Add three small colored system dots only when using desktop window conventions. Keep mockup text subordinate to the surrounding marketing headline.

### Three-device stage

**Only for:** mobile product demonstrations

**Use:** A dedicated cross-device capability stage.

**Observed:** Three black phones stand in a shallow fan: the central front-facing device is about 285px by 602px, with narrower side devices turned inward. Dark metal rims, 44px outer corners, edge highlights and grounded black shadows keep them almost merged with the canvas.

**Transfer:** Show distinct useful states across the devices. For a product without a phone experience, use the dark working-interface treatment instead.

**Build:** Use a front-facing rounded dark device and two slightly smaller perspective-rotated companions. Layer 5px dark bezels, fine neutral rim gradients, inset highlights and 0px 30px 80px -20px rgba(0,0,0,0.8) shadows. Do not brighten the screen backing beyond the dark interface palette.

### Documentary print fan

**Only for:** culture pages

**Use:** Human warmth below an editorial introduction.

**Observed:** Overlapping aged instant-photo prints fan across most of the content width. Candid office, event and everyday team moments retain warm natural color. A near-upright central print sits in front; outer prints tilt outward and lower. Narrow uneven cream borders become deep bottom margins carrying handwritten date captions.

**Transfer:** Use authentic moments from the new organization rather than staged stock portraits. A smaller fan of genuine photographs is preferable to fabricated event imagery.

**Build:** Make roughly 230–270px-wide paper figures with about 10–13px top and side margins and a broad caption footer. Use a 160deg gradient from #f1e9d5 to #e0d2b2, a very faint brown SVG fractal-noise overlay at baseFrequency 0.85 with 3 octaves, and corner radial stains in rgba(120,90,40,0.15–0.2). Apply slightly irregular polygon edges, inset 0px 0px 14px rgba(110,80,35,0.28) and layered drop shadows. Fan the outer prints to about 18deg, lower them and stack toward the upright center; set captions in hand-caption.

### Monochrome portrait row

**Only for:** culture pages

**Use:** People proof beneath a large quotation.

**Observed:** Four square 286px portraits with 10px corners, grayscale treatment and 24px gutters. Names, small uppercase mono roles and short factual biographies sit directly below, without enclosing cards.

**Transfer:** Use close, natural portraits with varied real backgrounds and comparable framing; apply grayscale consistently.

### Icons

**Observed:** Utility icons are mostly 16px stroke SVGs with 2px rounded strokes; smaller chevrons are 12px. Platform and social symbols use 16–20px solid silhouettes. Reassurance icons use 20px, 1.5px strokes inside 40px squares.

**Transfer:** Use a consistent simple line set for utilities, filled recognizable marks for platforms, and muted gray by default. Keep icons subordinate to text.

## Section recipes

How recurring sections are built.

### First screen: Rail-lit product opening

**Observed:** A 65px sticky Navigation tops a continuous Canvas. The content begins with 160px of top padding, a centered 30px mono announcement chip and then a two-line display headline occupying roughly half the viewport width. The lower line is framed by Rail-lit promise artwork. A 20px light-weight support sentence sits 24px below the headline; Primary button and two 48px square icon actions follow after 32px. Behind them is a very dim warm pool and sparse technical texture. After another broad empty interval, the 1313px-wide, 14px-radius desktop product object begins around 733px into the page. Within the first 900px the full promise, support and actions are visible, but only the top of the product object; its working detail continues below the fold.

**Transfer:** Use a concise two-part promise and a concrete product scene; create a dark HTML workflow mockup if finished media is unavailable. Keep the rails and breathing room even when the object changes. Pricing opens instead with a narrow left-aligned 36px title inside a centered container and no product stage; culture pages open with the 56px split editorial heading and prose above a photographic fan.

**Avoid:** Do not push a complete dashboard above the fold, left-align the default hero, use gradient-filled headline letters or surround the promise with bright neon art.

**Text style:** `display` — Inter 500 · 72px/1.1 · tracking -0.025em

### Alternating capability stage

**Observed:** Within the main container, equal columns have a 64px gap and vertically centered content. One holds an orange eyebrow, a heading and a paragraph capped at 500px; the other contains a Product window on Warm stage. Alternate sides across chapters, separated by 128px rather than divider bands.

**Transfer:** Explain one distinct benefit per stage, with a demonstration that proves that benefit.

**Text style:** `heading` — Inter 500 · 30px/1.2 · tracking -0.025em

### Monochrome logo grid

**Observed:** A small centered trust heading precedes two rows of seven 162px by 96px almost-square logo cells. Cells have a 3% soft-white wash, faint border and 2px corners; logos are white or gray. Pricing compresses the same idea into a single unboxed strip.

**Transfer:** Use verified recognizable proof marks; keep their original proportions but unify their neutral presentation.

### Voices wall

**Observed:** A 48px heading wraps within a 672px measure above three columns of Testimonial card. The heading-to-grid gap is 64px; columns and vertical card spacing are 16px.

**Transfer:** Let varying quotation lengths make the silhouette irregular while keeping a strong column grid.

**Text style:** `heading-lg` — Inter 500 · 48px/1.1 · tracking -0.025em

### Reassurance chapter

**Observed:** Orange eyebrow and a 48px two-line heading sit above a light gray support sentence. A circular technical seal can balance the heading at the far right. Three Reassurance tile components follow with 24px gaps.

**Transfer:** Translate this to privacy, reliability, control or another evidence-backed concern without turning it into a decorative badge wall.

**Text style:** `heading-lg` — Inter 500 · 48px/1.1 · tracking -0.025em

### Split questions

**Observed:** A large heading on the left balances FAQ row on the wider right. Closed questions and plus glyphs are visible; answers appear on expansion. Pricing centers a 720px list below a smaller heading. Culture pairs a 24px heading with a narrower right-side list.

**Transfer:** Use questions that remove genuine uncertainty, keeping the visual weight on the questions rather than large answer blocks.

### Practical closing call

**Observed:** A centered 48px statement, a 32px gap to the action row, then a 40px gap to a short practical-support line and the Utility panel. The chapter has 128px vertical padding and leads into Directory footer.

**Transfer:** End a landing narrative with both a decisive action and a usable next step. Culture uses a 36px invitation, a 16px support gap, a 32px action gap and compact mono actions above the same footer; pricing ends its FAQ directly at the footer.

**Text style:** `heading-lg` — Inter 500 · 48px/1.1 · tracking -0.025em

### Plans and comparison

**Only for:** pricing pages

**Observed:** A muted mono eyebrow and 36px title open within a 768px container with 80px top and 48px bottom padding. Billing option controls precede three Plan card components within the 1152px wrapper. Below a restrained proof strip, a 30px centered comparison heading leads a 1104px table: broad feature-name column, three aligned tier columns, 53px rows, subtle bottom rules and dark tinted category bands.

**Transfer:** Keep purchase decisions comparable. Follow the cards with detailed limits and then concise objections, rather than increasing decorative intensity.

**Text style:** `pricing-title` — Inter 500 · 36px/40px · tracking -0.025em

### Facts and numbered process

**Only for:** culture pages

**Observed:** A three-column fact strip uses 26px values above 11px uppercase mono labels, with 24px vertical padding and top/bottom hairlines. Process chapters use three or four equal columns, thin top and internal left rules, 24px padding, tiny orange ordinal numbers and muted duration labels. Section headings are only 24px.

**Transfer:** Use for operational facts and a transparent process, not oversized vanity metrics.

**Text style:** `culture-stat` — Inter 400 · 26px/34px · tracking -0.025em

### People editorial chapter

**Only for:** culture pages

**Observed:** A 28px/1.35 quotation in an 864px measure sits above a small mono attribution. After 48px comes the Monochrome portrait row, followed by short bios and a simple team link.

**Transfer:** Give human proof editorial gravity without making a second monumental hero.

**Text style:** `culture-quote` — Inter 400 · 28px/1.35 · tracking -0.02em

## Page flow

**Storyline:** promise → concrete working proof → distinct capability or decision chapters → trust → objections → practical conversion or direct directory ending

### Explain and convert a technical product

1. **promise** — Rail-lit centered opening and a large dark product scene.
2. **product demonstration** — Three-device stage showing work across contexts.
3. **social proof** — Monochrome logo cells.
4. **capability chapters** — Alternating copy and isolated working windows.
5. **peer proof** — Masonry-style voices wall.
6. **reassurance** — Control-oriented heading and three restrained tiles.
7. **objection handling** — Large split FAQ.
8. **closing call** — Centered conversion statement, practical utility panel and directory footer.

**Transfer:** Adapt the depth to the product; preserve concrete proof, atmospheric staging and the practical close without requiring the same topic sequence.

### Help buyers compare and choose

1. **orientation** — Compact editorial title and plain upgrade explanation.
2. **pricing** — Billing switch and three directly comparable tiers.
3. **social proof** — Small monochrome logo strip.
4. **detailed comparison** — Ruled feature table with tinted category headings.
5. **objection handling** — Narrow FAQ.
6. **directory ending** — Shared full-width directory footer without an extra conversion hero.

**Transfer:** Keep this variant more compact and transactional than a landing narrative.

### Make an organization and its working practices tangible

1. **mission** — Split headline and candid introductory prose.
2. **human proof** — Warm documentary photo fan.
3. **opportunity** — Openings introduction and concise fact strip.
4. **working practices** — Numbered columns and practical outbound links.
5. **people proof** — Editorial quote and monochrome portrait row.
6. **process transparency** — Four-stage numbered process.
7. **objection handling** — Compact split questions.
8. **closing call** — Centered invitation, two compact actions and shared directory footer.

**Transfer:** Use documentary warmth and operational specifics for people-oriented pages while retaining the black canvas and technical markings.

## Writing

Direct, technical and assured without corporate grandiosity. Product copy describes useful behavior; people copy is more candid, opinionated and warm.

**Do not copy:** Do not reuse Superset names, wordmarks, interface assets, customer marks, named integrations, quotations, compliance claims, team biographies, pricing or adoption numbers without rights and independent truth. Source examples illustrate syntax, not reusable claims.

- **Addressing the reader:** Speak to the reader as you and your. Use we for the organization and the product name when explaining what the product actually does.
- **Rhythm:** Short benefit headlines, often two clauses separated by a period. Support copy supplies one concrete explanation in one to three sentences; technical lists use familiar nouns instead of marketing abstractions.

| Role | Pattern | Typical length | Examples of the pattern |
| --- | --- | --- | --- |
| Hero promise | Two short imperatives that move from openness to coordination. | 6–10 words across two lines | “Bring Any Agent Orchestrate Them All” |
| Capability heading | Action plus benefit, or two contrasting clauses. | 4–8 words | “Switch agents. Keep your workflow”<br>“Changes are isolated” |
| Support | Concrete action first; explain what remains under the reader's control. | 20–45 words | “Each agent runs in its own isolated Git worktree. No overwriting each other's files. Review and merge work when you're ready.” |
| Primary action | Name the actual action and destination or platform. | 2–4 words | “Download for macOS”<br>“See open roles ↑” |
| Pricing introduction | Plain reassurance followed by the condition for moving up. | Two short sentences | “Start free. Upgrade when your team outgrows it.” |
| People copy | Specific observable practice instead of a generic value. | One or two short sentences | “You can see how we work before you talk to us.” |

**Words and phrasing to use:** run; build; review; your; local; control; start; keep; work; one workspace

**Avoid:** revolutionary; unlock limitless potential; synergy; magical; enterprise-grade as an unsupported adjective

**Rules:**

- Make capability statements falsifiable: describe an action, its setting and its consequence.
- Keep eyebrow labels as compact noun phrases; let the heading state the benefit.
- Use technical nouns when they clarify behavior, not merely to signal sophistication.
- Reserve exuberance and informal punctuation for genuine quoted voices; surrounding product prose stays controlled.

## Do's and Don'ts

### Do

- Set the main landing display in Inter 72px/1.1 at weight 500 and -0.025em tracking.
- Preserve 128px chapter spacing around the sparse feature stages.
- Use 14px uppercase IBM Plex Mono with 0.1em tracking for orange section labels.
- Keep feature prose within 500px and pair it with a specific dark product state.
- Give informational tiles 2px corners while product windows use 10px or 14px corners.
- Keep the default landing action square and 48px tall; distinguish the compact 32px header action.
- Use 1px translucent hairlines to separate near-black layers.
- Carry the practical closing utility and broad asymmetric footer into new landing narratives.

### Don't

- Do not turn the #d25611 accent into full-width orange section backgrounds.
- Do not replace weight-500 display typography with weight-700 startup headlines.
- Do not use pill-shaped landing CTAs; 8px rounded conversion controls are scoped to pricing.
- Do not give testimonials the deep floating shadows used for product windows.
- Do not force all quotes into equal-height cards; preserve their natural heights with 16px gutters.
- Do not distribute 18px feature copy across the full 1216px content width.
- Do not apply the handwritten caption face to ordinary interface labels or marketing headings.
- Do not enlarge culture statistics into giant display numerals; their emphasis is 26px regular text with small mono captions.

## Motion and responsive

### Motion

**Observed:**

- Headline rise is declared at 0.7s cubic-bezier(0.22,1,0.36,1), once, with both fill modes.
- Most color and border interactions declare .15s cubic-bezier(.4,0,.2,1); the navigation background uses 0.2s with the same easing.
- Transform transitions on some surfaces declare 0.3s cubic-bezier(0,0,.2,1).

**Transfer:**

- Use the headline rise to reinforce the rail-framed entrance; let settled text remain fully readable.
- Keep button feedback mainly a color change, not a large moving glow.

**Unknown:**

- Full rail, particle and device-animation choreography and runtime triggers are not established.

### Responsive

**Observed:**

- CSS breakpoints are declared at 640px, 768px, 1024px, 1280px, 1440px and 1536px.
- Capability grids use a single column before the 1024px two-column layout. Main gutters change from 24px to 32px at 640px.
- The main opening headline declares min(36px,8.6vw) at its smallest size, then 48px, 60px and 72px across larger breakpoints.
- The culture photo fan declares a horizontal snapping strip before its overlapping desktop arrangement.

**Transfer:**

- On narrow screens retain the rail-lit centered promise and let the product window scroll horizontally rather than crushing dense interface content.
- Stack capability text and demonstration in reading order; preserve the dark staging and a clear chapter gap.
- Turn the culture photo fan into browsable individual prints rather than shrinking the whole collage.

**Unknown:**

- Narrow-screen rendered layouts, exact rail scaling and mobile navigation interaction were not visually verified.

## How to use this guide

1. Start from the Essentials and the first-screen recipe; where the guide offers variants, use the default named for a new marketing page.
2. Plan the page before building: map your content onto the section recipes and page flow, then check the plan against the Do's and Don'ts.
3. Build with the tokens and component specs; recreate signature graphics with their build recipes instead of generic decoration, and use the named font substitutes if a font is unavailable.
4. Render the page at desktop and mobile widths, compare it with the Essentials and the Don'ts, and fix the differences before you finish.
