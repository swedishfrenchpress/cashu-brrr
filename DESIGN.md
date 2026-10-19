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
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 4rem)"
    fontWeight: 850
    lineHeight: 1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 118"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 850
    lineHeight: 1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 118"
  figure:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 900
    lineHeight: 1.25
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 125"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  body-ui:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 650
  slug:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.06em"
  data:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "20px"
    fontWeight: 600
    fontFeature: "'tnum' 1"
rounded:
  sheet: "2px"
  thumb: "6px"
  field: "8px"
  note: "10px"
  qr-label: "12px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4.4vw, 64px)"
  section: "clamp(72px, 10vw, 128px)"
  panel: "28px"
  group: "18px"
  stack: "12px"
  die-offset: "6px"
components:
  button-go:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.figure}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-go-disabled:
    backgroundColor: "{colors.hair}"
    textColor: "{colors.ink-soft}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
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
  peel-note:
    rounded: "{rounded.note}"
---

# Design System: Cashu Brrr

## Overview

**Creative North Star: "The Kiss-Cut Sheet"**

Every screen is a sheet of die-cut stickers on a backing liner. The real note designs are the stickers; everything else is prepress: registration-black ink, hairline rules, crop and registration marks, slug lines of job metadata in a monospace, and CutContour magenta die lines that show where the knife will go. The organizer sees the sheet they are about to print as the page itself, with amount, count, total, and mint set into the bottom slug.

The chrome is two inks on a pale gloss liner: black and magenta. Full color belongs only to the note artwork, which is fixed and is framed by the app, never restyled. Magenta is the one signal. Faint die lines sit around every cut edge at rest; one element per screen burns (a thicker, fully saturated die line) to mark the focus. Display type is Archivo pushed to its widest and heaviest, so headlines and money figures read like the title stamped on a print job.

Density is loose on Persuade surfaces (the landing sheet fills the first viewport) and tighter on Operate surfaces (print job, history), which are made of 1px ink rules, a sticky job ticket, and a pinned action bar. Motion has one job, the peel: a note's corner lifts off the liner on hover, and the sheet re-tiles when the count changes.

**Key Characteristics:**
- Gloss liner ground with a faint, rotated CASHU BRRR repeat printed on it.
- Two-ink chrome (registration black and CutContour magenta); the notes carry all the color.
- Magenta is always a line, never a surface: die lines, focus rings, the current-page underline.
- Crop marks, a registration target, and slug lines frame each full-page surface.
- Archivo Expanded Black for display and money; Martian Mono for slugs, data, and figures in fields.
- Signature interaction: the peel (corner lift, re-tile, job states printed as slug lines).

## Colors

A near-neutral liner and paper, a registration-black ink family, and one CutContour magenta with a darker text-safe partner.

### Primary
- **CutContour Magenta** (`cut`): The die line. Resting die lines around notes and sheet cells at 55-75% alpha (`rgba(229, 0, 125, 0.55)` around notes and history thumbs, `0.75` on sheet cells); the burning focus at full strength (2.5px); the GO pill's outline; the global `:focus-visible` ring; the current-page underline in the header; text selection; the caret.
- **Die Ink** (`cut-ink`): Magenta as text. Error copy, failed job-log lines, and the quiet button's hover. Use it whenever magenta must be read, not just seen.

### Neutral
- **Gloss Liner** (`liner`): The page ground on every screen, the header, the ticket, and the action bar. Also the browser `theme-color`.
- **Liner Shadow** (`liner-deep`): Recessed wells: thumbnail backgrounds, the mint panel, chip hover, the scrollbar track.
- **Sticker Stock** (`paper`): Surfaces that are "printed on": fields, chips, the custody note, the QR label, the sheet preview.
- **Registration Black** (`ink`): All text, 1px structural rules, 1.5px control strokes, crop marks, the GO pill fill, pressed chips. Printed marks on the real sheet use pure `#000`.
- **Soft Ink** (`ink-soft`): Secondary copy, field labels, slug lines, units.
- **Faint Ink** (`ink-faint`): Placeholders, disabled text, the scrollbar thumb.
- **Hairline** (`hair`): Inner dividers inside the ticket and history list, and disabled fills and strokes.
- **Liner Repeat** (`liner-repeat`): The printed brand repeat on the liner, rendered at 22% opacity so it reads as release-paper print, not content.

### Named Rules
**The One Burn Rule.** Each screen has one burning die line: the picked note, the GO pill, or the invoice QR label. Everything else stays at resting alpha or in ink.

**The Two-Ink Rule.** Chrome uses only black and magenta on liner and paper. Color comes from the note artwork and nowhere else.

**The Line, Not Fill Rule.** Magenta is drawn as a stroke or outline. The only magenta fills in the build are text selection and the 8px error mark in the job log.

## Typography

**Display Font:** Archivo Variable (width axis), with Archivo, system-ui
**Body Font:** Archivo Variable at normal width
**Label/Mono Font:** Martian Mono 400 and 600

Fonts are self-hosted through fontsource (Archivo Variable `wdth`, Martian Mono latin 400/600). Dela Gothic One and Porter Sans Inline Block are loaded only for the Mr. Meadows and Sovereign note artwork and are not system type.

**Character:** Archivo at 118-125% width and 850-900 weight is the stamp on the job: wide, black, a little loud. Martian Mono is the prepress slug: small, uppercase, tracked, factual.

### Hierarchy
- **Display** (900, 125% width, clamp(3rem, 6.4vw, 6rem), 0.9): The landing headline only. Balanced wrapping, max width about 11.5em.
- **Headline** (850, 118% width, clamp(2.25rem, 4.4vw, 4rem), 1): Section titles below the fold and page titles (History uses clamp(2.5rem, 5vw, 4.5rem)).
- **Title** (850, 118% width, 34px, 1): Ticket titles ("Print job", "Pay N sat"); 26px for history rows, 32px for empty states, 22px for definition terms.
- **Figure** (900, 125% width, 34px, 1.25, tabular): Money totals and sheet counts in the landing slug (34px) and the action bar (24px).
- **Body** (400, 17px, 1.55): Explanatory prose, 46-56ch.
- **Body UI** (400, 15px, 1.5): Ticket summaries and the custody note.
- **Label** (650, 13px): Field labels above inputs and totals, in Soft Ink.
- **Slug** (Martian Mono 400, 11px, 0.06em, uppercase): Sheet meta, job log lines, captions, footers, and callouts (600 weight). On the printed sheet the slug runs vertically in the margin at 6pt.
- **Data** (Martian Mono 600, 20px, tabular): Numbers inside fields; at 12-13px for mint URLs, timestamps, and step numbers.

### Named Rules
**The Expanded Black Rule.** Headlines, the wordmark, button labels on the GO pill, and money totals are Archivo at 118-125% width. Never set display text at normal width.

**The Slug Rule.** Slug lines carry real job metadata (sheet N of M, paper, cell size, mint, time) and sit in margins, below sheets, or in the footer. They are never decorative and never sit above a heading as a label.

## Layout

Full-bleed liner with a fluid side gutter (`gutter`, 16-64px) on every surface. Sections below the fold open with a top padding of `section` (72-128px).

- **Landing:** the first viewport is the sheet. Display headline top left, wordmark, tagline, and nav top right, a 4-column grid of picked-able notes (gap 22-34px), then the job slug: a 1px ink rule, amount field × notes field = total, the GO pill on the right, and a slug line of sheet meta beneath. Collapses to 3 columns (6 notes) under 1100px and 2 columns (4 notes) under 760px, where the fields become a 3-column grid and the GO pill goes full width.
- **Print job:** a two-column layout, the stage (live sheet preview, max 1040px, with stage slug, foot slug, and job log) and a sticky ticket on the right (clamp(360px, 30vw, 440px), 1px ink left rule, 28px padding, groups divided by Hairline). The action bar pins to the bottom of the ticket. Under 900px it stacks, sheet on top, and the action bar sticks to the viewport bottom with the safe-area inset.
- **History:** a 1280px max list of jobs, each row a 220px thumbnail, facts, and actions, divided by Hairline. Rows collapse to 120px thumbnails under 760px.
- **Note view:** a single note (max 860px) centered on the liner with crop marks, the amount, and one quiet link.
- **Print sheet:** mm-true. Notes are at most 130 × 65 mm, keep the artwork's proportions, and butt together 2 × 3 on an A4 (297 × 210 mm) or Letter (279.4 × 215.9 mm) landscape page, centered, so one cut separates two notes. Cut marks sit 1.5 mm off the grid on every cut line, 2-5 mm long; the side margin carries the vertical sheet slug at 3 mm from the edge.

Rules are structural: 1px ink for section and bar edges, 1px Hairline for dividers inside a panel.

## Elevation & Depth

Mostly flat print on a liner. Depth appears in three physical places only: the paper sheet sits on the liner, the peeled corner casts a shadow onto the note, and the GO pill lifts on hover. All shadows are soft and ink-tinted (`rgba(20, 20, 20, ...)`); there are no hard offset shadows.

### Shadow Vocabulary
- **Sheet on liner** (`box-shadow: 0 1px 2px rgba(20,20,20,0.08), 0 18px 40px -18px rgba(20,20,20,0.28)`): The sheet preview and the on-screen print sheets. Removed in print.
- **Peel flap** (`filter: drop-shadow(-3px -4px 5px rgba(20,20,20,0.26))`, mirrored per corner): The folded-back sticker corner throwing its shadow inward.
- **GO lift** (`box-shadow: 0 10px 22px -8px rgba(20,20,20,0.45)` with `translateY(-2px)`): GO pill hover only; it drops back on press.
- **Knockout ring** (`box-shadow: 0 0 0 2-3px` Sticker Stock): Separates annotation dots and lettered keys from the note art beneath.

### Named Rules
**The Physical Depth Rule.** A shadow means paper lifting off paper. If an element is not a sheet, a peeled corner, or the pressed-for-action pill, it is flat.

## Shapes

Notes have softly rounded sticker corners (`note`, 10px) with a die line outset 6px from the edge. Controls that you press are full pills (999px): the GO pill, line buttons, chips, and the segmented control. Things you type into or read are gently rounded rectangles (`field`, 8px): fields, the custody note, the mint panel. The QR label is a 12px-rounded paper square. Paper sheets are nearly square-cornered (2px), and cells on a sheet have no radius, because they are cut apart.

Strokes are 1.5px ink on controls, 1px ink on chips and rules, and 1-2.5px magenta on die lines. Crop marks are 22px L-shapes of 1px ink, inset 24px from the container; the registration target is an 18px ring with crosshairs extending 6px beyond it.

## Components

### Buttons
Ink and pill-shaped, with one magenta die line reserved for the action that moves money or paper.
- **Shape:** full pill (999px).
- **GO pill:** Registration Black fill, white text, Archivo 900 at 125% width, 18px, 16px × 32px padding, and a 2px magenta outline offset 5px, so the button reads as a die-cut sticker. The landing hero sizes it up to clamp(20px, 1.9vw, 26px) with 18px × 36px padding; the action bar uses 17px with 15px × 26px padding. Labels say what happens: "GO BRRRR", "Pay 126 sat", "Print 2 sheets".
- **Hover / Focus:** lifts 2px with the GO lift shadow over 220ms; on press it settles back. Focus thickens the outline to 3px. Disabled turns Hairline with Soft Ink text and a Hairline outline.
- **Line button:** transparent with a 1.5px ink stroke, Archivo 750 at 112%, 15px, 11px × 20px. Hover fills ink with white text. Used for secondary actions (Connect, Copy invoice, Open in wallet, Reprint, Download QR backup).
- **Quiet button:** underlined text, Archivo 650 at 105%, 14px; hover turns Die Ink. Used for tertiary actions and pager arrows.

### Chips
- **Style:** Sticker Stock with a 1px ink stroke, pill shape, Martian Mono 12px, 6px × 12px. The note-series chips switch to Archivo 650 at 13px.
- **State:** hover shows Liner Shadow; pressed (`aria-pressed="true"`) fills ink with white text. Selection is ink, not magenta, so it does not compete with the burning focus.

### Cards / Containers
- **Custody note:** Sticker Stock, 1.5px ink stroke, 8px radius, 16px × 18px padding, 15px body text, with a 17px title. It states plainly where the notes live and how to back them up.
- **Mint panel:** Liner Shadow well, 8px radius, 16px padding.
- **Ticket and action bar:** Gloss Liner with 1px ink edges; no shadow.

### Inputs / Fields
- **Style:** Sticker Stock, 1.5px ink stroke, 8px radius, 10px × 14px padding; the value is Martian Mono 600 at 20px with tabular figures, followed by a 12px mono unit ("sat", "notes"). The label sits above in the Label style.
- **Focus:** a 2px ink outline offset 2px appears around the field (ink, not magenta). The caret is magenta.
- **Error:** a 14px message in Die Ink below the fields; the GO pill disables.

### Navigation
- **Style:** the header bar is Gloss Liner with a 1px ink bottom rule and 18px vertical padding. The wordmark is Archivo 900 at 125% (22px in the bar, 28px on the landing, 20px on mobile). Links are Archivo 750 at 112%, 15px, 28px apart.
- **States:** hover draws a 2px ink underline; the current page draws it in magenta.

### Peel Note (signature)
A wrapper cut around any note artwork. At rest the note has a 10px radius and a 1px magenta die line (55% alpha) offset 6px. On hover (only on things you can pick) the chosen corner peels to 52px over 420ms on `ease-peel` and the note lifts 2px. Picked, the die line burns at 2.5px full magenta and the corner rests peeled at 60px (70px on hover). Under 760px the peel is 30/34/38px. The peeled corner is the sticker's white back, a gradient from `#ffffff` 30% to `#dcded8`, laid over the note with the peel-flap shadow. Each series peels the corner clear of its QR and amount: Chaum top-left, Bitpopart bottom-right, Sovereign and Custom top-right, Mr. Meadows bottom-left. The peel is driven by the registered `--peel` length property so it can transition.

### Sheet Preview (signature)
The live sheet: a Sticker Stock page at the real paper's aspect ratio with the sheet-on-liner shadow, ink cut marks at the exact positions of the printed sheet, and a 2 × 3 grid of notes. Every cell carries a 1px magenta die line (75% alpha) that is hidden in print. When the count, paper, or design changes, the grid slides into its new geometry over 420ms and the notes scale in from 0.94 with a 45ms stagger over 380ms. Empty slots fill with specimens until the job is paid.

### Job Log
An ordered list under a 1px ink rule. Each line is a slug with a mono timestamp (`19:15:53`) and the state in plain words, faded in over 160ms. Successful lines turn ink; failed lines turn Die Ink with an 8px magenta square before them.

### QR Label
The Lightning invoice, printed on a 288px max Sticker Stock square with 14px padding and a 12px radius, ringed by a 2.5px burning magenta die line offset 6px. Once paid the ring turns ink. On the invoice phase there is no action bar, so the label is the screen's single burn.

### Note Artwork
The five note series (Chaum Note, Bitpopart, Sovereign, Mr. Meadows, Custom Note) are fixed artwork rendered through a single inert wrapper. The app frames them (peel, die line, sheet cell, thumbnail well) and decides all interaction; the artwork is never restyled, recolored, or re-typeset.

## Do's and Don'ts

### Do:
- **Do** keep one burning magenta die line per screen (2.5px, full `cut`) and leave every other die line at 55-75% alpha.
- **Do** set headlines, the wordmark, GO pill labels, and money totals in Archivo at 118-125% width and 850-900 weight.
- **Do** use Martian Mono slug lines (11px, uppercase, 0.06em) for real job metadata, placed in margins, under sheets, and in footers.
- **Do** frame full-page surfaces with crop marks (22px, 1px ink, inset 24px) and, on the landing and note view, a registration target top center.
- **Do** use 1px ink rules for structure and 1px Hairline for dividers inside panels.
- **Do** show die lines on screen and hide them in print; printed sheets carry only pure black cut marks and the vertical slug.
- **Do** put the peel on anything you can pick, lifting the corner its series names.
- **Do** write button labels as the action and amount ("Pay 126 sat", "Print 2 sheets").

### Don't:
- **Don't** fill buttons, panels, or backgrounds with magenta; magenta is a line, with text selection and the job-log error mark as the only fills.
- **Don't** add color to chrome; the notes are the only full color on any screen.
- **Don't** mark control selection (chips, thumbnails, segmented options, field focus) in magenta; selection in controls is ink, and only a picked note on the sheet burns.
- **Don't** use slug lines as labels above headings.
- **Don't** use hard offset shadows or shadows on flat chrome; depth is only the sheet, the peeled corner, and the GO pill's lift.
- **Don't** restyle, crop, recolor, or re-typeset the note artwork.
- **Don't** print die lines.
