---
name: Cashu Brrr
description: Print your own ecash notes. The app is a kiss-cut sheet of real notes on a sticker liner.
colors:
  liner: "#f2f3ef"
  liner-deep: "#e6e8e1"
  paper: "#ffffff"
  ink: "#141414"
  ink-soft: "#464943"
  ink-faint: "#6a6e66"
  hair: "#c8ccc2"
  liner-repeat: "#c9d2d4"
  cut: "#e5007d"
  cut-ink: "#b4005f"
typography:
  display:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(2.5rem, 4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(2.25rem, 4.4vw, 4rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline-sm:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  figure:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(2.25rem, 3.4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontFeature: "'tnum' 1"
  figure-sm:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.15
    fontFeature: "'tnum' 1"
  step:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "22px"
    fontWeight: 700
    letterSpacing: "-0.01em"
  term:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
  group-title:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 700
  control:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 700
  go-label:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "18px"
    fontWeight: 700
  body:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  body-ui:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 700
  data:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "20px"
    fontWeight: 700
    fontFeature: "'tnum' 1"
  data-lg:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "28px"
    fontWeight: 700
    fontFeature: "'tnum' 1"
  data-sm:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
  micro:
    fontFamily: "TX-02, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
rounded:
  sheet: "2px"
  well: "4px"
  thumb: "6px"
  field: "8px"
  note: "10px"
  qr-label: "12px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4.4vw, 64px)"
  section: "clamp(72px, 10vw, 128px)"
  panel: "28px"
  group: "14px"
  stack: "12px"
components:
  button-go:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.go-label}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-go-disabled:
    backgroundColor: "{colors.hair}"
    textColor: "{colors.ink-soft}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "4px 2px"
  button-quiet-hover:
    textColor: "{colors.cut-ink}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.field}"
    padding: "10px 14px"
  label-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  label-chip-hover:
    backgroundColor: "{colors.liner-deep}"
  label-chip-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  segmented-option-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "7px 18px"
  custody-note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.field}"
    padding: "16px 18px"
  qr-label:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.qr-label}"
    padding: "14px"
    width: "min(100%, 288px)"
  note-pick:
    rounded: "{rounded.well}"
  sponsor-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 24px 14px 14px"
  sponsor-card-hover:
    backgroundColor: "{colors.liner-deep}"
---

# Design System: Cashu Brrr

## Overview

**Creative North Star: "The Kiss-Cut Sheet"**

Every screen is a sheet of stickers on a backing liner. The real note designs are the stickers; the app is the liner they sit on and the sheet you are about to print. The organizer sees the job as the page itself: on the landing, like a product page, the note you are about to print shown large, the eight designs to pick from beneath it, and the amount, count, total, and GO pill beside it; on the print job a live, paper-true preview of the sheet that re-tiles as the job changes.

The chrome is two inks on a pale gloss liner: registration black and CutContour magenta. Full color belongs only to the note artwork, which is fixed and framed by the app, never restyled. Magenta is the signal for what you act on and what you picked: the GO pill's outline, the picked design's outline, the unpaid invoice's QR label. Every word is set in one monospaced face, TX-02, at two weights: Bold for headlines, the wordmark, controls, and money; Regular for copy. The owner pinned the face for the whole app; it reads like the job ticket a print shop's machine types out, not like a terminal costume.

The world is quiet around the notes. There are no slug lines, hairline dividers, crop marks, or die lines on screen; structure comes from space, the header's bottom edge, and the ticket's left edge. Prepress marks appear only where a knife will actually go: on the print sheet and its live preview. Density is loose on the landing and tighter on the print job and history. Motion has one job: the sheet re-tiles when count, series, or paper changes. On the landing the only motion is the stage note fading in when a new design is picked.

**Key Characteristics:**
- Gloss liner ground with a faint, rotated CASHU BRRR repeat printed on it.
- Two-ink chrome (registration black and CutContour magenta); the notes carry all the color.
- Magenta is always a line, never a surface: the GO outline, the picked-design outline, the QR label, focus rings, the current-page underline.
- Metadata is plain sentence-case copy; no uppercase mono slug lines and no hairline rules.
- Cut marks only on the print sheet and its preview, because that is where the cuts are.
- One monospaced face, TX-02, at 400 and 700 only, for every word in the app; hierarchy comes from size and weight.
- Signature interaction: the live sheet re-tiles on count, series, or paper change.

## Colors

A near-neutral liner and paper, a registration-black ink family, and one CutContour magenta with a darker text-safe partner.

### Primary
- **CutContour Magenta** (`cut`): The signal. The GO pill's 2px outline, the picked landing thumbnail's 2px outline, the unpaid invoice QR label's 2.5px outline, the global `:focus-visible` ring, the current-page underline in the header, text selection, and the caret.
- **Die Ink** (`cut-ink`): Magenta as text. Error copy, the failed status line, and the quiet button's hover. Use it whenever magenta must be read, not just seen.

### Neutral
- **Gloss Liner** (`liner`): The page ground on every screen, the header, the ticket, and the action bar. Also the browser `theme-color`.
- **Liner Shadow** (`liner-deep`): Recessed wells and hover grounds: thumbnail backgrounds, the mint panel, chip and sponsor-card hover, avatar placeholders, the scrollbar track.
- **Sticker Stock** (`paper`): Surfaces that are printed on: fields, chips, the segmented control, the custody note, the QR label, sponsor cards, the sheet preview.
- **Registration Black** (`ink`): All text, the header's bottom edge and the ticket's left edge, 1.5px control strokes, 1px chip strokes, cut marks in the preview, the GO pill fill, pressed chips and segments, keyboard focus on fields and landing thumbnails. Cut marks on the printed sheet use pure `#000`.
- **Soft Ink** (`ink-soft`): Secondary copy, field labels, hints, meta lines, units, status lines.
- **Faint Ink** (`ink-faint`): Placeholders, disabled text, the landing step numbers, the scrollbar thumb.
- **Spent Grey** (`hair`): Disabled states, plus the landing thumbnail's hover outline: the disabled GO pill's fill and outline and the disabled line button's stroke. It is no longer a divider color.
- **Liner Repeat** (`liner-repeat`): The printed brand repeat on the liner, rendered at 22% opacity so it reads as release-paper print, not content.

### Named Rules
**The Signal Rule.** Magenta outlines only the primary action (the GO pill), the picked design thumbnail on the landing, and the invoice QR label waiting to be paid. Selection inside controls (chips, segments, the print job's style thumbnails, field focus) is ink.

**The Two-Ink Rule.** Chrome uses only black and magenta on liner and paper. Color comes from the note artwork and nowhere else.

**The Line, Not Fill Rule.** Magenta is drawn as a stroke or outline. The only magenta fill in the build is text selection.

## Typography

**Display Font:** TX-02 Bold (with ui-monospace, SF Mono, Menlo, Consolas, monospace)
**Body Font:** TX-02 Regular (same stack)
**Label/Mono Font:** TX-02; the app has no second face. Display, UI, and mono tokens all resolve to the same stack.

TX-02 is by U.S. Graphics, from the Berkeley Mono family, self-hosted as four OpenType files (regular, italic, bold, bold italic; weights 400 and 700 only) from `/fonts/tx-02/`. The italics are loaded but no chrome uses them. Dela Gothic One (the Mr. Meadows amount) and Porter Sans Inline Block (the Sovereign amount) load only for that note artwork and sit outside the app type system; the Chaum and Bitpopart amounts are TX-02 700.

**Character:** A monospace UI is the owner's deliberate choice, not costume. TX-02 Bold at large sizes with slight negative tracking is the stamp on the job; Regular at reading sizes carries the copy plainly. Because every glyph is the same width, numbers already line up; the `data` role adds tabular figures for fields and totals.

### Hierarchy
- **Display** (700, clamp(2.5rem, 4vw, 3.5rem), 0.95, -0.02em): The landing headline only, at the top of the hero's right column. Balanced wrapping, max width 9em.
- **Headline** (700, clamp(2.25rem, 4.4vw, 4rem), 1, -0.035em): Section titles below the fold, "From invoice to scissors" included (line height 1.05, max width 9em). The History page title runs larger (clamp(2.5rem, 5vw, 4.5rem)) at the base -0.015em. Balanced wrapping.
- **Headline Small** (700, clamp(2rem, 5vw, 3.5rem), 1, -0.015em): The single-note amount in the note view.
- **Title** (700, 34px, 1, -0.015em): Ticket titles ("Print job", "Pay N sat", "N notes ready."). Smaller fixed titles exist: 32px for the empty History state, 28px for the print-sheet toolbar, 26px for History rows.
- **Figure** (700, clamp(2.25rem, 3.4vw, 3rem), 1.05, -0.02em, tabular): The landing total in the checkout row; 34px under 760px. **Figure Small** (700, 24px, 1.15, tabular) is the action-bar total and sheet count. The "×" between the landing fields is 700 at 24px.
- **Step** (700, 24px, 1.25, -0.02em): The landing's step titles. The step number beside each is 700 at 24px in Faint Ink, tabular. Both drop to 20px under 760px.
- **Wordmark** (700, 22px, -0.01em): CASHU BRRR in the header on every screen, the landing included, and in the footer. The liner repeat is the same face at 700, 15px, +0.02em tracking on a 52px line.
- **Term** (700, 22px, 1.2): Definition terms on the landing; sponsor names use the same voice at 20px and 1.1. The custody note's title is 700 at 17px.
- **Group Title** (700, 15px): Ticket group headings (Design, Amount, Paper, Mint).
- **Control** (700, 15px): Nav links and line buttons; the segmented control uses 14px. GO pill labels are **Go Label** (700, 18px) by default, clamp(18px, 1.6vw, 22px) in the landing checkout row, 17px in the action bar. Quiet buttons are 700 at 14px.
- **Body** (400, 17px, 1.55): Explanatory prose, 46-56ch. The landing lede is 17px at 1.5, max 30ch, and hides under 760px; step notes run 1.6 at 42ch; the "Your sheet's waiting." closer is plain Body in Soft Ink at 1.6.
- **Body UI** (400, 15px, 1.5): Ticket summaries, the custody note (1.55 in History), the print-sheet instructions (68ch max); the payment-waiting line is 700.
- **Small** (400, 14px, 1.45): Timestamps and meta in History, sponsor tiers, the issuer line, error copy, the status line, the mint status; footer links and the pager label are 700. The landing sheet hint is 14px at 1.45. The showcase caption is the picked design's name alone, 700 at 14px in Registration Black.
- **Label** (700, 13px): Field labels above inputs and totals, and the series chips. Hints under ticket groups use 13px at 400.
- **Data** (700, 20px, tabular): Numbers inside fields. **Data Large** (700, 28px, tabular) is the value in the landing fields, 22px under 760px. The mint URL input runs 400 at 14px.
- **Data Small** (400, 13px): Mint URLs in summaries, the mint row, and the issuer line.
- **Micro** (400, 12px): Mint chips, field units, and History detail lines. Style-thumbnail names in the print job are 700 at 12px.

### Named Rules
**The One Face Rule.** Every word of chrome is TX-02 at 400 or 700. There are no other weights, no width axis, and no second app face; hierarchy is size, weight, and tracking. Note-art faces stay inside their artwork.

**The Licensed File Rule.** TX-02 is commercially licensed (LT-04 Startup). The files in `public/fonts/tx-02/` are gitignored and are never committed, never subset (the font's fsType forbids it), and never replaced with a hosted copy. A build without them falls back to the system monospace and must still read correctly.

**The Plain Copy Rule.** Sheet counts, note sizes, payment state, and job status are written as normal sentence-case copy. Nothing is set as small uppercase tracked slug lines.

## Layout

Full-bleed liner with a fluid side gutter (`gutter`, 16-64px) on every surface. Sections below the fold open with a top padding of `section` (72-128px) and titles sit clamp(32px, 4vw, 56px) above their content. Groups are separated by space, never by lines.

- **Landing:** the shared header bar, then a product-page split (columns 7fr and minmax(320px, 5fr), areas "show head" / "show buy", column gap clamp(40px, 5vw, 88px), top padding clamp(40px, 7vh, 80px)). The first viewport is not held to the screen height and has no bottom-pinned bar. The left column is the showcase: a fixed stage at the narrowest note's shape (534 / 279) holding the picked note at full width, top-aligned so its top edge meets the headline's, so switching designs never moves the page; below it (28px) a row of 8 design thumbnails, 12px apart; then a caption naming the picked design, nothing more. The right column stacks the Display headline, the lede (16px below), the amount × notes fields (clamp(32px, 5vh, 48px) below), a one-line hint ("N notes fill X sheets.", or the error in Die Ink), and the checkout row (36px below): the total beside the GO pill, wrapping when tight. The thumbnails drop to 4 columns when the showcase is narrower than 600px (a container query). Under 900px the split stacks to one column: headline, showcase, then the form at max 560px. Under 760px the lede hides, the thumbnails become one full-bleed strip of 84px thumbnails that scrolls sideways, the field values drop to 22px, and the total to 34px.
- **Below the fold:** "What you're handing out" is a 2-column grid of definitions (gaps 48px × clamp(32px, 6vw, 112px)), one column under 760px. "From invoice to scissors" sets the title with the closing line and GO pill on the left (5fr) and the numbered steps down the right (7fr), 40px apart; under 760px it stacks title, steps, closer, and the closing GO pill goes full width. The footer sits clamp(96px, 12vw, 160px) below the last section.
- **Print job:** two columns, the stage (live sheet preview, max 1040px, with a sheet pager when there is more than one sheet) and a sticky ticket on the right (clamp(360px, 30vw, 440px) wide, a 1px ink left edge, `panel` padding). Ticket groups run Design, Paper, Mint, Amount, so the fields sit directly above the action bar; they have `group` vertical padding and no dividers. The ticket body takes only the height it needs, so the action bar (total and Pay) follows the last group and pins to the ticket's bottom only when the ticket has to scroll. Under 900px it stacks, sheet on top, and the action bar sticks to the viewport bottom with the safe-area inset.
- **History:** a 1280px max list of jobs, each row a 220px thumbnail, facts, and actions (28px gap), rows 12px apart with no dividers. Rows collapse to 120px thumbnails under 760px, actions wrapping below.
- **Note view:** a single note (max 860px) centered on the liner, with the amount, one line of instruction, the issuer, and one quiet link. No marks.
- **Print sheet:** mm-true. Notes are at most 130 × 65 mm, keep the artwork's proportions, and butt together 2 × 3 on an A4 (297 × 210 mm) or Letter (279.4 × 215.9 mm) landscape page, centered, so one cut separates two notes. Cut marks are 0.25 mm black lines, 1.5 mm off the grid on every cut line and 2-5 mm long. There is no margin slug. The live preview draws the same marks at the same positions in 1px ink.

### Named Rules
**The No-Rule Rule.** The only structural lines are the header's 1px bottom edge and the ticket's 1px left edge. Everything else is separated by space.

## Elevation & Depth

Flat print on a liner. Depth appears in three places only: the paper sheet sits on the liner, the GO pill lifts on hover, and the pinned mobile action bar casts upward over the scrolling ticket. All shadows are soft and ink-tinted (`rgba(20, 20, 20, ...)`); there are no hard offset shadows. Notes on the liner sit flat: they do not lift, peel, or cast.

### Shadow Vocabulary
- **Sheet on liner** (`box-shadow: 0 1px 2px rgba(20,20,20,0.08), 0 18px 40px -18px rgba(20,20,20,0.28)`): The sheet preview and the on-screen print sheets. Removed in print.
- **GO lift** (`box-shadow: 0 10px 22px -8px rgba(20,20,20,0.45)` with `translateY(-2px)`): GO pill hover only; it drops back on press.
- **Pinned bar** (`box-shadow: 0 -10px 24px -14px rgba(20,20,20,0.3)`): The print job's action bar when it sticks to the viewport bottom under 900px.

### Named Rules
**The Physical Depth Rule.** A shadow means paper on paper or something pinned over content. If an element is not a sheet, the GO pill under the pointer, or the pinned action bar, it is flat.

## Shapes

Notes have softly rounded sticker corners (`note`, 10px) on the landing stage and in the note view; the landing's design thumbnails are 4px. Controls you press are full pills (999px): the GO pill, line buttons, chips, the segmented control, and sponsor cards. Things you type into or read are gently rounded rectangles (`field`, 8px): fields, the custody note, the mint panel. Style thumbnails are 6px buttons around a 4px well; History thumbnails are 6px. The QR label is a 12px-rounded paper square. Paper sheets are nearly square-cornered (2px), and cells on a sheet have no radius, because they are cut apart.

Strokes are 1.5px ink on fields, line buttons, the segmented control, and the custody note; 1px ink on chips and sponsor cards. Outlines mark state and stand off the shape: 2px magenta at 5px on the GO pill (3px on focus), 2px magenta at 3px on the picked landing thumbnail (Spent Grey on hover, ink on keyboard focus), 2.5px magenta at 6px on the QR label, 2px ink at 3px on the picked style thumbnail, 2px ink at 2px around a focused field.

### Named Rules
**The Real Cut Rule.** Cut marks appear only where a knife will go: the print sheet and its live preview. No crop marks, registration targets, or die lines frame screens or notes.

## Components

### Buttons
Ink and pill-shaped, with the one magenta outline reserved for the action that moves money or paper.
- **Shape:** full pill (999px).
- **GO pill:** Registration Black fill, white text, Go Label (TX-02 700, 18px), 16px × 32px padding, and a 2px magenta outline offset 5px. The landing checkout row sizes it to clamp(18px, 1.6vw, 22px) with 18px × 32px padding (16px × 22px under 760px); the closing GO pill below the fold keeps the default; the action bar uses 17px with 15px × 26px. Labels say what happens: "GO BRRRR", "Pay 126 sat", "Print 2 sheets".
- **Hover / Focus:** lifts 2px with the GO lift shadow over 220ms; on press it settles back. Focus thickens the outline to 3px. Disabled turns Spent Grey with Soft Ink text and a Spent Grey outline.
- **Line button:** transparent with a 1.5px ink stroke, Control type, 11px × 20px. Hover fills ink with white text; focus is the global magenta ring. Disabled goes Faint Ink with a Spent Grey stroke. Used for secondary actions (Connect, Copy invoice, Open in wallet, Reprint, Download QR backup).
- **Quiet button:** underlined text, TX-02 700 at 14px; hover turns Die Ink; focus is the global magenta ring. Used for tertiary actions and pager arrows.

### Chips
- **Style:** Sticker Stock with a 1px ink stroke, pill shape, TX-02 400 at 12px, 6px × 12px, for mint URLs. The series chips switch to 700 at 13px.
- **State:** hover shows Liner Shadow; pressed (`aria-pressed="true"`) fills ink with white text.
- **Focus:** keyboard focus draws a 2px magenta outline offset 3px, fading in over 160ms. It shows on pressed chips too.

### Segmented Control
- **Style:** a Sticker Stock pill with a 1.5px ink stroke and 3px inner padding; options are TX-02 700 at 14px, 7px × 18px. The checked option fills ink with white text. Focus is the global magenta ring.

### Cards / Containers
- **Custody note:** Sticker Stock, 1.5px ink stroke, 8px radius, 16px × 18px padding, Body UI text, with a 17px 700 title. It states plainly where the notes live and how to back them up. History's version is 14px × 16px at 1.55 line height.
- **Mint panel:** Liner Shadow well, 8px radius, 16px padding, fading in over 140ms.
- **Ticket and action bar:** Gloss Liner; the ticket has a 1px ink left edge; no dividers inside.
- **Sponsor card:** a Sticker Stock pill with a 1px ink stroke, a 56px round avatar, the sponsor name in Term voice at 20px and the tier in Small. Hover shows Liner Shadow.

### Inputs / Fields
- **Style:** Sticker Stock, 1.5px ink stroke, 8px radius, 10px × 14px padding; the value is Data (TX-02 700, 20px, tabular), followed by a 12px unit ("sat", "notes"). The label sits above in the Label style. The landing fields run 12px × 16px with Data Large values and a 14px unit.
- **Focus:** a 2px ink outline offset 2px appears around the field. The caret is magenta.
- **Error:** a 14px message in Die Ink below the fields (on the landing it replaces the sheet hint); the GO pill disables.

### Navigation
- **Style:** the header bar is Gloss Liner with a 1px ink bottom edge, 18px vertical padding, and the gutter at the sides. The wordmark is in Wordmark type. Links are Control type, 28px apart. Footer links are 700 at 14px, 20px apart, beside the footer wordmark.
- **States:** hover draws a 2px ink underline; the current page draws it in magenta. The same bar heads every screen, the landing included; on the landing no link is current.

### Note Pick (signature)
Under the landing stage, a row of eight design thumbnails. Each is a button around inert artwork, clipped to a 4px radius, with a 2px outline at a 3px offset that is transparent at rest, Spent Grey on hover, magenta when picked (`aria-pressed="true"`), and ink on keyboard focus, changing over 160ms. Picking swaps the large stage note, which fades in over 180ms and carries no outline. Neither the thumbnails nor the stage note lift or move on hover.

### Sheet Preview (signature)
The live sheet: a Sticker Stock page at the real paper's aspect ratio with the sheet-on-liner shadow, 1px ink cut marks at the exact positions of the printed sheet, and a 2 × 3 grid of notes with square cells. When the count, paper, or design changes, the grid slides into its new geometry over 420ms and the notes scale in from 0.94 with a 45ms stagger over 380ms. Empty slots fill with specimens until the job is paid.

### Status Line
One plain sentence of job state under the ticket content, Small type in Soft Ink, fading in over 160ms. A failure turns it Die Ink. Waiting states pair a spinning 16px loader with sentence-case copy.

### QR Label
The Lightning invoice, printed on a 288px max Sticker Stock square with 14px padding and a 12px radius, ringed by a 2.5px magenta outline offset 6px. Once paid the ring turns ink. On the invoice phase there is no action bar, so the label carries the screen's signal.

### Note Artwork
The five note series (Chaum Note, Bitpopart, Sovereign, Mr. Meadows, Custom Note) are fixed artwork rendered through a single inert wrapper. The app frames them (the showcase stage, pick thumbnails, sheet cells, thumbnail wells) and decides all interaction; the artwork is never restyled, recolored, or re-typeset.

## Do's and Don'ts

### Do:
- **Do** reserve magenta outlines for the GO pill (2px, offset 5px), the picked landing thumbnail (2px, offset 3px), and the unpaid invoice QR label (2.5px, offset 6px).
- **Do** set every word in TX-02: 700 for headlines, the wordmark, controls, labels, and money; 400 for copy and mint URLs.
- **Do** keep the TX-02 files out of git, unsubset, and self-hosted; check that a build without them still reads in the system monospace.
- **Do** write sheet counts, note sizes, payment state, and status as plain sentence-case copy.
- **Do** separate groups, rows, and sections with space; keep the header's bottom edge and the ticket's left edge as the only rules.
- **Do** draw cut marks on the print sheet and its live preview, at the printed positions.
- **Do** keep selection inside controls in ink: pressed chips, checked segments, the print job's picked style thumbnails, focused fields.
- **Do** write button labels as the action and amount ("Pay 126 sat", "Print 2 sheets").

### Don't:
- **Don't** fill buttons, panels, or backgrounds with magenta; magenta is a line, with text selection as the only fill.
- **Don't** add color to chrome; the notes are the only full color on any screen.
- **Don't** set small uppercase tracked slug lines, use weights other than 400 and 700, or bring in a second app face.
- **Don't** commit, subset, or swap in a hosted copy of TX-02.
- **Don't** draw hairline dividers between sections, rows, groups, or the action bar.
- **Don't** put crop marks, registration targets, die lines, or annotation callouts on screens or around notes; marks belong to the print sheet.
- **Don't** lift, peel, or animate notes on hover; a picked design is marked by its thumbnail's outline alone.
- **Don't** use hard offset shadows or shadows on flat chrome.
- **Don't** restyle, crop, recolor, or re-typeset the note artwork.
