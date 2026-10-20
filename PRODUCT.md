# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Bitcoin meetup organizers and educators printing batches of ecash notes (roughly 10–100) to hand out at meetups, conferences, and workshops, onboarding newcomers to ecash. They work at a laptop next to a printer and pay the Lightning invoice from a phone wallet.

The people who receive the notes are often newcomers who have never held ecash; they meet the product only through the printed note and its QR.

## Product Purpose

Cashu Brrr turns sats into physical Cashu ecash banknotes. The user picks an artist-made note design, connects a Cashu mint, sets an amount per note and a count, pays one Lightning invoice, and gets a printable sheet where every note carries its own bearer-token QR. Whoever scans a note first claims it; once claimed it cannot be reused.

Success: an organizer goes from landing page to a printed, cuttable stack of valid notes in one sitting, never unsure which step they are on, what they are paying, or whether their unprinted notes are safe.

## Positioning

"There are no central banks if everyone is a central bank." A money printer for ecash: anyone can mint and print their own bearer notes against any Cashu mint they choose, in collectible artist-made designs, with no account and no backend. The app runs entirely in the browser; the mint is the only third party.

## Operating Context

- Flow: landing → choose template → choose style/color (skipped for Chaum and Mr. Meadows) → connect mint → amount per note × number of notes → pay Lightning invoice → print screen. A History tab lists past prints for reprinting.
- Setting: laptop + home/office printer; the phone only scans the invoice QR. Mobile must be usable but is not the primary device.
- Printing: "Print" opens a new tab (`?print=true`) that auto-invokes the browser print dialog; "Download only QRs" saves a ZIP of per-note QR SVGs. Notes are then cut by hand and handed out.
- Mints: two suggestions (mint.minibits.cash/Bitcoin, mint.lnvoltz.com), manual URL entry, or discovery over Nostr (NIP-87 kind 38000, `k=38172`) via relay.damus.io and relay.primal.net.
- A single note can be viewed via link: `#<encodedToken>/<templateNumber>`.

## Capabilities and Constraints

- All existing functionality is preserved through the redesign: five template families (Custom with 6 colors; Bitpopart/comic designs 3–25; Sovereign with 10 artworks; Chaum; Mr. Meadows), mint connect/disconnect/discover, sat unit, denomination split from the mint's keyset amounts, invoice QR + copy + 2-second auto-poll + manual check, minting, print tab, QR ZIP, history with reprint, single-note link view.
- Platform fee: removed. Users pay exactly notes × denomination; the hardcoded 2-sat fee and the leftover "donation" token it produced go away. Older history entries may still carry a `donation` field and must still render.
- Note artwork is fixed: it is artists' work and is not redrawn. QR and amount placement on notes, print sizing, and sheet layout (notes per page, cut guides) may be reworked.
- Printed note size: 130×65 mm (2:1, roughly a €10 note and the height of a US dollar). Sheets print landscape on A4 or Letter, 6 notes per sheet (2×3), with cut marks.
- Mint: a suggested mint (mint.minibits.cash/Bitcoin) is preselected for every new job and shown plainly, with a one-click change to another suggestion, Nostr discovery, or a URL.
- Bearer-token custody: minted tokens live only in this browser's localStorage (`prints`, `proofs`, `currentPrintData`). The product must say plainly that history holds real money, that clearing browser data loses unprinted notes, and keep a backup path (the QR ZIP) one step from payment.
- Code may diverge freely from upstream gandlafbtc/cashu-brrr: styling layer, component structure, and dependencies (DaisyUI, Tailwind version) are open. Svelte 5 + Vite + Vercel is the current base.
- Terminology: ecash note, mint, sats, denomination, token, Lightning invoice, print (one batch), reprint.

## Brand Commitments

- Name: Cashu Brrr ("Brrr" for short). Tagline in use: "Print your own ecash notes."
- Voice: the money-printer meme stays as the brand ("GO BRRRR!", "brrr"), tightened. Humor lives at the edges (landing, primary CTA, success moments); copy is plain and trustworthy wherever money moves (mint, amounts, payment, custody warnings, history).
- Sponsors section is binding: cards with name, avatar, tier, amount, and link, sourced from `src/lib/sponsors.ts`.
- Typeface: a wood-type poster pairing chosen by the owner to feel like paper print. Ultra (a fat slab) sets the big printed moments: the headline, section and page titles, totals, the GO pill, and the wordmark. Libre Franklin (from the 1902 American Franklin Gothic) sets everything else. Both are SIL Open Font License faces, self-hosted through Fontsource. TX-02 was tried and dropped; its licensed files must never be committed (`public/fonts/tx-02/` stays gitignored).
- Ornament is out: no corner peel, crop or registration marks on screens, callouts, die lines around notes, uppercase mono slug lines, or hairline rules. The print sheet keeps its functional cut marks.
- Not binding, replaceable in the redesign: the printer hero image, the FAQ wording (its facts stay true), the green CASHU BRRR wordmark, the current palette and typefaces.

## Evidence on Hand

- Note artwork: `public/Chaum-note.jpg`, `public/Ecash_Note_template.svg` (Bitpopart Cosmic Note), `public/Soverign_Note.png`, `public/Leafy-Nature-Note.png`, `public/Nostr-note-1.png`, `public/Nostr-note-2.png`, `public/Nostr-Note-3.png`, `public/Pizza-day-orange.png`, `public/Pizzaday-green.png`, `public/Satoshi-nirvana.png`, `public/Taj-India-Note.png`, `public/Your-honor.png`, `public/mr-meadows-note.svg`; comic designs inline in `src/lib/ComicNote.svelte`.
- Social image: `public/og-image.jpg` (2400×1260).
- Sponsors: two SILVER sponsors (Marius; ⚡ats 'N' Fact⚡), 100K sats each.
- FAQ facts: what a note is, what happens if it is lost (unrecoverable, like cash), how to print.
- Absent, never to be fabricated: testimonials, usage or print counts, press, partner logos, legal/privacy copy.

## Product Principles

1. Clarity where money moves; the meme lives at the edges.
2. The notes are the hero: the app frames the artwork and never competes with it.
3. Built for the batch: printing 50 notes is as easy to set up, review, print, and cut as printing one.
4. Bearer means bearer: never let the user forget unprinted notes are real money held only in this browser.
5. Laptop at the printer, phone in hand: desktop-first, with the invoice always scannable.
