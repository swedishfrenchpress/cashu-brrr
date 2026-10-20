<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import AppHeader from "./ui/AppHeader.svelte";
  import Sponsor from "./Sponsor.svelte";
  import { SPONSORS } from "./sponsors";
  import NoteArt from "./NoteArt.svelte";
  import { SUGGESTED_MINTS } from "./job";
  import { fmtNum } from "./format";
  import {
    familyOf,
    NOTES_PER_SHEET,
    styleRef,
    templateRef,
    SPECIMEN_TOKEN,
    type NoteFamily,
    type NoteStyle,
  } from "./templates";
  import {
    selectedTemplate,
    selectedStyle,
    selectedDenomination,
    selectedNumberOfNotes,
    preparedTokens,
  } from "./stores.svelte";

  type Sample = { family: NoteFamily; style: NoteStyle };
  const sample = (type: NoteFamily["type"], match?: (s: NoteStyle) => boolean): Sample => {
    const family = familyOf(type);
    return { family, style: (match && family.styles.find(match)) || family.styles[0] };
  };

  // One sheet of specimens across every series
  const sheet: Sample[] = [
    sample("chaum"),
    sample("comic", (s) => s.design === 7),
    sample("sovereign", (s) => s.design === "Soverign_Note.png"),
    sample("meadows"),
    sample("sovereign", (s) => s.design === "Taj-India-Note.png"),
    sample("custom", (s) => s.id === "orange"),
    sample("sovereign", (s) => s.design === "Nostr-note-1.png"),
    sample("sovereign", (s) => s.design === "Pizza-day-orange.png"),
  ];

  let picked = $state(0);
  let amount = $state("21");
  let count = $state("6");

  const amountValue = $derived(Number.parseInt(amount, 10));
  const countValue = $derived(Number.parseInt(count, 10));
  const valid = $derived(
    amountValue > 0 && countValue > 0 && String(amountValue) === amount.trim() && String(countValue) === count.trim(),
  );
  const total = $derived(valid ? amountValue * countValue : 0);
  const specimenAmount = $derived(amountValue > 0 ? amountValue : 21);
  const sheetCount = $derived(valid ? Math.ceil(countValue / NOTES_PER_SHEET) : 0);

  const nameOf = ({ family, style }: Sample) =>
    family.styles.length > 1 ? `${family.name}, ${style.name}` : family.name;
  const current = $derived(sheet[picked]);

  const fmt = fmtNum;

  function go() {
    if (!valid) return;
    const { family, style } = sheet[picked];
    selectedTemplate.set(templateRef(family));
    selectedStyle.set(styleRef(family, style));
    selectedDenomination.set(amountValue);
    selectedNumberOfNotes.set(countValue);
    preparedTokens.set([]);
    window.location.hash = "print";
  }
</script>

<AppHeader />

<main>
  <!-- First viewport: the note you're printing, and the job beside it -->
  <section class="hero">
    <div class="hero-head">
      <h1 class="display">Print your own ecash notes.</h1>
      <p class="lede">No central banks if everyone is a central bank.</p>
    </div>

    <div class="showcase">
      <div class="feature">
        {#key picked}
          <div class="feature-note" style="--aspect: {current.family.aspect}" in:fade={{ duration: 180 }}>
            <NoteArt
              type={current.family.type}
              design={current.style.design}
              colorCode={current.style.colorCode}
              denomination={specimenAmount}
              mintUrl={SUGGESTED_MINTS[0]}
              token={SPECIMEN_TOKEN}
            />
          </div>
        {/key}
      </div>

      <div class="swatches" role="group" aria-label="Pick a design">
        {#each sheet as s, i}
          <button class="swatch" aria-pressed={picked === i} aria-label={nameOf(s)} onclick={() => (picked = i)}>
            <NoteArt
              type={s.family.type}
              design={s.style.design}
              colorCode={s.style.colorCode}
              denomination={specimenAmount}
              mintUrl={SUGGESTED_MINTS[0]}
              token={SPECIMEN_TOKEN}
            />
          </button>
        {/each}
      </div>
      <p class="caption">{nameOf(current)}</p>
    </div>

    <form class="buy" onsubmit={(e) => { e.preventDefault(); go(); }}>
      <div class="fields">
        <label>
          <span class="field-label">Amount per note</span>
          <span class="field">
            <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" bind:value={amount} aria-describedby="hero-total" aria-invalid={!(amountValue > 0)} />
            <span class="unit">sat</span>
          </span>
        </label>
        <span class="times" aria-hidden="true">&times;</span>
        <label>
          <span class="field-label">Notes</span>
          <span class="field">
            <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" bind:value={count} aria-describedby="hero-total" aria-invalid={!(countValue > 0)} />
            <span class="unit">notes</span>
          </span>
        </label>
      </div>
      {#if valid}
        <p class="hint">{fmt(countValue)} {countValue === 1 ? "note fills" : "notes fill"} {sheetCount} {sheetCount === 1 ? "sheet" : "sheets"}.</p>
      {:else}
        <p class="hint error">Enter whole numbers, 1 or more.</p>
      {/if}

      <div class="checkout">
        <p class="total" id="hero-total" aria-live="polite">
          <span class="field-label">Total</span>
          <span class="total-value">{valid ? `${fmt(total)} sat` : "–"}</span>
        </p>
        <button class="btn-go go" type="submit" disabled={!valid}>
          GO BRRRR <ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </form>
  </section>

  <!-- What a note is -->
  <section class="anatomy">
    <h2 class="heading section-title">What you're handing out</h2>
    <dl class="notes-on-notes">
      <div>
        <dt>The QR is the money.</dt>
        <dd>A Cashu wallet scans it and claims the sats. Whoever scans first gets them; after that the note is spent and can't be reused.</dd>
      </div>
      <div>
        <dt>The amount is fixed at print.</dt>
        <dd>Every note on a sheet carries the same amount, paid for up front with one Lightning invoice.</dd>
      </div>
      <div>
        <dt>Lose it and it's gone.</dt>
        <dd>Like cash. Nobody can recover a note that was never scanned, and only the person holding it can claim it.</dd>
      </div>
      <div>
        <dt>The mint holds the sats.</dt>
        <dd>Each note is issued by the Cashu mint you pick, which keeps the sats until the note is claimed.</dd>
      </div>
    </dl>
  </section>

  <!-- How a sheet gets made -->
  <section class="howto">
    <h2 class="heading section-title howto-title">From invoice to scissors</h2>
    <ol class="steps" role="list">
      <li>
        <span class="step-n" aria-hidden="true">1</span>
        <div>
          <h3 class="step-title">Pick a design.</h3>
          <p class="step-note">Five series, from the Chaum Note to Bitpopart, Sovereign, and Mr. Meadows.</p>
        </div>
      </li>
      <li>
        <span class="step-n" aria-hidden="true">2</span>
        <div>
          <h3 class="step-title">Set amount &times; count.</h3>
          <p class="step-note">Any amount in sats. Six notes fit on one A4 or Letter sheet, each about the size of a €10 note.</p>
        </div>
      </li>
      <li>
        <span class="step-n" aria-hidden="true">3</span>
        <div>
          <h3 class="step-title">Pay one invoice.</h3>
          <p class="step-note">Scan the Lightning invoice with your phone. No account, no sign-up.</p>
        </div>
      </li>
      <li>
        <span class="step-n" aria-hidden="true">4</span>
        <div>
          <h3 class="step-title">Print, cut, hand out.</h3>
          <p class="step-note">Cut along the marks. Keep the QR backup until every note is in someone's hand.</p>
        </div>
      </li>
    </ol>
    <div class="again">
      <p class="again-line">Your sheet's waiting.</p>
      <button class="btn-go" onclick={go} disabled={!valid}>
        GO BRRRR <ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  </section>

  {#if SPONSORS.length > 0}
    <section class="sponsors">
      <h2 class="heading section-title">Sponsors</h2>
      <ul class="sponsor-row">
        {#each SPONSORS as sponsor}
          <li><Sponsor {sponsor} /></li>
        {/each}
      </ul>
    </section>
  {/if}

  <footer class="foot">
    <p class="foot-mark">CASHU BRRR</p>
    <p class="foot-links">
      <a href="https://cashu.space" target="_blank" rel="noopener noreferrer">Cashu</a>
      <a href="https://github.com/gandlafbtc/cashu-brrr" target="_blank" rel="noopener noreferrer">Source</a>
    </p>
  </footer>
</main>

<style>
  main {
    position: relative;
  }

  /* ---------------- first viewport ---------------- */
  /* Product-page split: the note on the left, everything about the job on the right */
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(320px, 5fr);
    grid-template-areas:
      "show head"
      "show buy";
    grid-template-rows: auto 1fr;
    column-gap: clamp(40px, 5vw, 88px);
    padding: clamp(40px, 7vh, 80px) var(--gutter) 0;
  }
  .hero-head {
    grid-area: head;
  }
  h1 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    line-height: 0.95;
    max-width: 9em;
  }
  .lede {
    margin-top: 16px;
    font-size: 17px;
    line-height: 1.5;
    color: var(--ink-soft);
    max-width: 30ch;
    text-wrap: pretty;
  }

  .showcase {
    grid-area: show;
    min-width: 0;
    container-type: inline-size;
  }
  /* A fixed stage at the narrowest note's shape: every note spans its full width and switching never moves the page */
  .feature {
    aspect-ratio: 534 / 279;
    container-type: size;
    display: grid;
    /* Top-aligned, so the note's top edge always meets the headline's */
    place-items: start center;
  }
  .feature > * {
    grid-area: 1 / 1;
  }
  .feature-note {
    width: min(100cqw, 100cqh * var(--aspect));
    border-radius: var(--radius-note);
    overflow: hidden;
  }

  .swatches {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 12px;
    align-items: center;
    margin-top: 28px;
  }
  @container (max-width: 600px) {
    .swatches {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px 12px;
    }
  }
  .swatch {
    display: block;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: 3px;
    transition: outline-color 160ms var(--ease-out);
  }
  .swatch:hover {
    outline-color: var(--hair);
  }
  .swatch[aria-pressed="true"] {
    outline-color: var(--cut);
  }
  .swatch:focus-visible {
    outline-color: var(--ink);
  }
  .caption {
    margin-top: 16px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.45;
  }

  .buy {
    grid-area: buy;
    align-self: start;
    margin-top: clamp(32px, 5vh, 48px);
  }
  .fields {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: end;
    column-gap: 14px;
  }
  .buy .field {
    padding: 12px 16px;
  }
  .buy .field input {
    font-size: 28px;
  }
  .buy .field .unit {
    font-size: 14px;
  }
  .times {
    font-weight: 700;
    font-size: 24px;
    padding-bottom: 17px;
  }
  .hint {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.45;
    color: var(--ink-soft);
  }
  .hint.error {
    color: var(--cut-ink);
  }
  .checkout {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px 24px;
    margin-top: 36px;
  }
  .total .field-label {
    margin-bottom: 4px;
  }
  .total-value {
    display: block;
    font-weight: 700;
    font-size: clamp(2.25rem, 3.4vw, 3rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .go {
    font-size: clamp(18px, 1.6vw, 22px);
    padding: 18px 32px;
  }

  /* ---------------- below the fold ---------------- */
  .anatomy,
  .howto,
  .sponsors {
    position: relative;
    padding: clamp(72px, 10vw, 128px) var(--gutter) 0;
  }
  .section-title {
    font-size: clamp(2.25rem, 4.4vw, 4rem);
    letter-spacing: -0.035em;
    margin-bottom: clamp(32px, 4vw, 56px);
  }

  .notes-on-notes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 48px clamp(32px, 6vw, 112px);
  }
  .notes-on-notes dt {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 22px;
    line-height: 1.2;
  }
  .notes-on-notes dd {
    margin-top: 8px;
    font-size: 17px;
    line-height: 1.55;
    color: var(--ink-soft);
    max-width: 52ch;
    text-wrap: pretty;
  }

  /* Heading and the closing action anchor the left; the numbered steps read down the right */
  .howto {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    grid-template-areas:
      "title steps"
      "again steps";
    grid-template-rows: auto 1fr;
    column-gap: clamp(32px, 6vw, 112px);
  }
  .howto-title {
    grid-area: title;
    line-height: 1.05;
    max-width: 9em;
  }
  .steps {
    grid-area: steps;
    list-style: none;
    display: grid;
    gap: 40px;
    padding-top: 6px;
  }
  .steps li {
    display: grid;
    grid-template-columns: 2.5ch minmax(0, 1fr);
    column-gap: 20px;
    align-items: baseline;
  }
  .step-n {
    font-weight: 700;
    font-size: 24px;
    line-height: 1.25;
    color: var(--ink-faint);
    font-variant-numeric: tabular-nums;
  }
  .step-title {
    font-weight: 700;
    font-size: 24px;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  .step-note {
    margin-top: 6px;
    font-size: 17px;
    line-height: 1.6;
    color: var(--ink-soft);
    max-width: 42ch;
    text-wrap: pretty;
  }
  .again {
    grid-area: again;
    align-self: start;
    display: grid;
    justify-items: start;
    gap: 16px;
  }
  .again-line {
    font-size: 17px;
    line-height: 1.6;
    color: var(--ink-soft);
  }

  .sponsor-row {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin: clamp(96px, 12vw, 160px) var(--gutter) 0;
    padding: 0 0 40px;
  }
  .foot-mark {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.01em;
  }
  .foot-links {
    display: flex;
    gap: 20px;
    font-weight: 700;
    font-size: 14px;
  }
  .foot-links a {
    color: var(--ink);
  }

  /* ---------------- narrow screens ---------------- */
  @media (max-width: 900px) {
    .hero {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "head"
        "show"
        "buy";
      grid-template-rows: auto;
    }
    .showcase {
      margin-top: 32px;
    }
    .buy {
      max-width: 560px;
      margin-top: 36px;
    }
  }
  @media (max-width: 760px) {
    .hero {
      padding-top: 28px;
    }
    .lede {
      display: none;
    }
    .showcase {
      margin-top: 24px;
    }
    /* One full-bleed strip that scrolls sideways; the padding keeps the picked outline unclipped */
    .swatches {
      display: flex;
      gap: 12px;
      margin: 14px calc(-1 * var(--gutter)) 0;
      padding: 6px var(--gutter);
      overflow-x: auto;
      scroll-snap-type: x proximity;
      scroll-padding-inline: var(--gutter);
      scrollbar-width: none;
    }
    .swatches::-webkit-scrollbar {
      display: none;
    }
    .swatch {
      flex: 0 0 84px;
      scroll-snap-align: start;
    }
    .caption {
      margin-top: 8px;
    }
    .buy .field input {
      font-size: 22px;
    }
    .checkout {
      margin-top: 24px;
      align-items: center;
      gap: 16px;
    }
    .total-value {
      font-size: 34px;
    }
    .go {
      padding: 16px 22px;
    }
    .notes-on-notes {
      grid-template-columns: minmax(0, 1fr);
      gap: 32px;
    }
    .howto {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "title"
        "steps"
        "again";
      grid-template-rows: auto;
    }
    .steps {
      gap: 32px;
    }
    .steps li {
      column-gap: 14px;
    }
    .step-n,
    .step-title {
      font-size: 20px;
    }
    .again {
      margin-top: 48px;
      justify-items: stretch;
    }

  }
</style>
