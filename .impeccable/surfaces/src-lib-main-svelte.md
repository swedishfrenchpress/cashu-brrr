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

Memorable moment: the sheet you are about to print is the page; changing count re-tiles the sheet.

User revision (2026-10-19, after first ship): the corner peel, landing/note-view crop and registration marks, hero callouts, magenta die lines on notes, and all small uppercase mono slug lines and hairline rules were removed at the user's request. The liner repeat, magenta GO outline and selected-note outline, and the print sheet's cut marks stay.

Layout revision (2026-10-20): the user called the landing a mess: the amount, count, and total were small, stranded at the bottom, and far from the notes, and the brand block sat oddly top right. The landing now uses the standard header bar and a product-page split: the picked note large on the left with the eight designs as thumbnails beneath, and the headline, amount x notes, total, and GO grouped on the right. The headline dropped to about 56px. The print-job ticket now runs Design, Paper, Mint, Amount, so the fields sit directly above the total and Pay. The liner repeat and the GO ring were offered for removal and kept.

Type revision (2026-10-20): the user felt TX-02 wasn't "paper print" enough. From five rendered directions they picked the wood-type poster: Ultra for the big printed moments, Libre Franklin for the rest.

Unresolved: none blocking.

## Direction contract

THESIS: Every print job is a kiss-cut sheet: real note designs die-cut on a liner, laid out live, peeled off to hand out. It refuses the hero-plus-feature-cards landing and the six-screen wizard.

OWN-WORLD: Gloss liner ground (#F2F3EF) with a faint printed CASHU BRRR repeat; registration-black ink; CutContour magenta (#E5007D) as the only signal: the primary action, the picked note, and the invoice QR; Ultra (fat wood-type slab) for the headline, titles, totals, GO, and wordmark; Libre Franklin for everything else. No slug lines, rules, or ornamental marks. Two-ink chrome: the notes are the only full color.

STORY: The organizer sees the sheet before paying: design, amount x count, total, mint. Plain copy says it is real money. They pay one invoice, see its status in one plain line, print sheets with cut marks, and keep the QR backup.

FIRST VIEWPORT: The standard header bar (wordmark left, Print and History right). Left, the picked note large on a fixed stage with the amount you type printed on it live, and a row of eight design thumbnails beneath (the picked one ringed magenta). Right, "Print your own ecash notes." in Ultra at about 48px, the tagline, amount field x notes field, a sheet-count hint, then the total in large figures beside the GO BRRRR pill (ink fill, magenta outline).

FORM: Kiss-cut sticker sheet, position 4 of 7 on the ordered list. Signature interaction: the live sheet (it re-tiles on count, series, or paper change). seed:f5d8c60c8fa21831

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
