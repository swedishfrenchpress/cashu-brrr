---
version: 1
slug: "src-lib-main-svelte"
primary_target: "src/lib/Main.svelte"
related_targets: ["src/lib/PrintJob.svelte","src/lib/PrintPage.svelte","src/lib/History.svelte","src/lib/NoteView.svelte"]
---

# Surface brief: Cashu Brrr redesign (landing + print job)

Scope: whole app in one world. Landing (`src/lib/Main.svelte`) is Persuade and sets the world; the print-job screen, history, print sheet, and single-note view are Operate surfaces inside it.

Audience and job: meetup organizers printing 10-100 notes at a laptop, paying from a phone. Action: set amount x count, pay one Lightning invoice, print 6-up sheets, cut, hand out.

Constraints: note artwork untouched; sponsors section kept; no fee; mint preselected (minibits) and changeable; 130x65 mm notes, A4/Letter landscape, 2x3, cut marks; plain copy wherever money moves; anti-goals: crypto-app, bank, toy, SaaS template.

Memorable moment: the sheet you are about to print is the page; hover lifts a note's corner, changing count re-tiles the sheet.

Unresolved: none blocking.

## Direction contract

THESIS: Every print job is a kiss-cut sheet: real note designs die-cut on a liner, laid out live, peeled off to hand out. It refuses the hero-plus-feature-cards landing and the six-screen wizard.

OWN-WORLD: Gloss liner ground (#F2F3EF) with a faint printed CASHU BRRR repeat; registration-black ink; CutContour magenta (#E5007D) die lines as the only signal, one burning focus per screen; crop and registration marks; slug lines in Martian Mono; Archivo Expanded Black display, Archivo for UI. Two-ink chrome: the notes are the only full color.

STORY: The organizer sees the sheet before paying: design, amount x count, total, mint. Plain slug copy says it is real money. They pay one invoice, watch states print in the margin, print sheets with cut marks, and keep the QR backup.

FIRST VIEWPORT: Liner edge to edge, crop marks in the corners, a registration target top center. "Print your own ecash notes." in Expanded Black top left (about 96px), wordmark and tagline right. Below it, a 4x2 sheet of real note designs on magenta die lines, one corner lifting, two callouts annotating a note. Bottom slug: amount field x count field = total, with the GO BRRRR pill (ink fill, magenta die-cut outline) at the right; sheet meta line beneath.

FORM: Kiss-cut sticker sheet, position 4 of 7 on the ordered list. Signature interaction: the peel (corner lift on hover, sheet re-tile on count change, states printed as slug lines). seed:f5d8c60c8fa21831

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
