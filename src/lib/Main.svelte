<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import Sponsor from "./Sponsor.svelte";
  import { SPONSORS } from "./sponsors";
  import NoteArt from "./NoteArt.svelte";
  import { SUGGESTED_MINTS } from "./job";
  import { fmtNum } from "./format";
  import {
    familyOf,
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

<main>
  <!-- First viewport: the specimen sheet -->
  <section class="hero">
    <header class="hero-head">
      <h1 class="display">Print your own ecash notes.</h1>
      <div class="brand">
        <p class="wordmark">CASHU BRRR</p>
        <p class="tagline">No central banks if everyone is a central bank.</p>
        <nav aria-label="Main" class="brand-nav">
          <a href="#print">Print</a>
          <a href="#history">History</a>
        </nav>
      </div>
    </header>

    <div class="sheet" role="group" aria-label="Pick a design">
      {#each sheet as s, i}
        <div class="cell">
          <button
            class="pick"
            aria-pressed={picked === i}
            aria-label="{s.family.name}: {s.style.name}"
            onclick={() => (picked = i)}
          >
            <NoteArt
              type={s.family.type}
              design={s.style.design}
              colorCode={s.style.colorCode}
              denomination={specimenAmount}
              mintUrl={SUGGESTED_MINTS[0]}
              token={SPECIMEN_TOKEN}
            />
          </button>
        </div>
      {/each}
    </div>

    <form class="job-bar" onsubmit={(e) => { e.preventDefault(); go(); }}>
      <div class="fields">
        <label class="slot">
          <span class="field-label">Amount per note</span>
          <span class="field">
            <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" bind:value={amount} aria-describedby="hero-total" />
            <span class="unit">sat</span>
          </span>
        </label>
        <span class="times" aria-hidden="true">&times;</span>
        <label class="slot">
          <span class="field-label">Notes</span>
          <span class="field">
            <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" bind:value={count} aria-describedby="hero-total" />
            <span class="unit">notes</span>
          </span>
        </label>
        <p class="total" id="hero-total" aria-live="polite">
          <span class="field-label">Total</span>
          <span class="total-value">{valid ? `${fmt(total)} sat` : "–"}</span>
        </p>
      </div>
      <button class="btn-go go" type="submit" disabled={!valid}>
        GO BRRRR <ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </form>
  </section>

  <!-- What a note is -->
  <section class="anatomy">
    <h2 class="heading section-title">What you're handing out</h2>
    <div class="anatomy-grid">
      <div class="specimen">
        <NoteArt type="chaum" denomination={specimenAmount} mintUrl={SUGGESTED_MINTS[0]} token={SPECIMEN_TOKEN} />
      </div>
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
    </div>
  </section>

  <!-- How a sheet gets made -->
  <section class="howto">
    <h2 class="heading section-title">From invoice to scissors</h2>
    <ol class="steps">
      <li>
        <span class="step-title heading">Pick a design.</span>
        <span class="step-note">Five series, from the Chaum Note to Bitpopart, Sovereign, and Mr. Meadows.</span>
      </li>
      <li>
        <span class="step-title heading">Set amount &times; count.</span>
        <span class="step-note">Any amount in sats. Six notes fit on one A4 or Letter sheet, each about the size of a €10 note.</span>
      </li>
      <li>
        <span class="step-title heading">Pay one invoice.</span>
        <span class="step-note">Scan the Lightning invoice with your phone. No account, no sign-up.</span>
      </li>
      <li>
        <span class="step-title heading">Print, cut, hand out.</span>
        <span class="step-note">Cut along the marks. Keep the QR backup until every note is in someone's hand.</span>
      </li>
    </ol>
    <div class="again">
      <p class="again-line heading">Your sheet's waiting.</p>
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
  .hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    gap: clamp(24px, 3.4vh, 40px);
    padding: clamp(56px, 7vh, 72px) var(--gutter) 40px;
  }
  .hero-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 32px;
  }
  h1 {
    font-size: clamp(3rem, 6.4vw, 6rem);
    max-width: 11.5em;
  }
  .brand {
    text-align: right;
    flex: none;
  }
  .wordmark {
    font-family: var(--font-display);
    font-stretch: 125%;
    font-weight: 900;
    font-size: 28px;
    letter-spacing: -0.01em;
    line-height: 1;
  }
  .tagline {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ink-soft);
    max-width: 22ch;
    margin-left: auto;
  }
  .brand-nav {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 14px;
  }
  .brand-nav a {
    font-family: var(--font-display);
    font-stretch: 112%;
    font-weight: 750;
    font-size: 15px;
    color: var(--ink);
  }

  .sheet {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(22px, 2.6vw, 34px) clamp(22px, 2.4vw, 34px);
    padding-top: 26px;
  }
  .cell {
    position: relative;
  }
  .pick {
    display: block;
    width: 100%;
    border-radius: var(--radius-note);
    overflow: hidden;
    cursor: pointer;
    outline: 2.5px solid transparent;
    outline-offset: 5px;
    transition: outline-color 160ms var(--ease-out);
  }
  .pick[aria-pressed="true"] {
    outline-color: var(--cut);
  }
  .pick:focus-visible {
    outline-color: var(--ink);
  }

  .job-bar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 28px;
    margin-top: auto;
  }
  .fields {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    flex-wrap: wrap;
  }
  .slot {
    width: 180px;
  }
  .times {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 26px;
    padding-bottom: 10px;
  }
  .total {
    padding-left: 10px;
  }
  .total-value {
    display: block;
    font-family: var(--font-display);
    font-stretch: 125%;
    font-weight: 900;
    font-size: 34px;
    line-height: 1.25;
    font-variant-numeric: tabular-nums;
  }
  .go {
    font-size: clamp(20px, 1.9vw, 26px);
    padding: 18px 36px;
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
    margin-bottom: clamp(32px, 4vw, 56px);
  }

  .anatomy-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    gap: clamp(32px, 5vw, 80px);
    align-items: start;
  }
  .specimen {
    border-radius: var(--radius-note);
    overflow: hidden;
  }
  .notes-on-notes {
    display: grid;
    gap: 32px;
  }
  .notes-on-notes dt {
    font-family: var(--font-display);
    font-stretch: 112%;
    font-weight: 800;
    font-size: 22px;
    line-height: 1.2;
  }
  .notes-on-notes dd {
    margin-top: 8px;
    font-size: 17px;
    line-height: 1.55;
    color: var(--ink-soft);
    max-width: 52ch;
  }

  .steps {
    list-style: none;
    display: grid;
    gap: 36px;
  }
  .steps li {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 24px;
    align-items: baseline;
  }
  .step-title {
    font-size: clamp(1.75rem, 3.2vw, 3rem);
  }
  .step-note {
    font-size: 17px;
    line-height: 1.55;
    color: var(--ink-soft);
    max-width: 46ch;
  }
  .again {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 64px 0 0;
  }
  .again-line {
    font-size: clamp(1.5rem, 2.6vw, 2.25rem);
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
    font-stretch: 125%;
    font-weight: 900;
    font-size: 18px;
    letter-spacing: -0.01em;
  }
  .foot-links {
    display: flex;
    gap: 20px;
    font-weight: 650;
    font-size: 14px;
  }
  .foot-links a {
    color: var(--ink);
  }

  /* ---------------- narrow screens ---------------- */
  @media (max-width: 1100px) {
    .sheet {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .cell:nth-child(n + 7) {
      display: none;
    }
    .job-bar {
      flex-direction: column;
      align-items: stretch;
    }
  }
  @media (max-width: 760px) {
    .hero {
      min-height: 0;
      padding-top: 56px;
      padding-bottom: 60px;
    }
    .hero-head {
      flex-direction: column-reverse;
      align-items: flex-start;
      gap: 20px;
    }
    .brand {
      text-align: left;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      gap: 8px 16px;
    }
    .wordmark {
      font-size: 20px;
    }
    .tagline {
      display: none;
    }
    .brand-nav {
      margin-top: 0;
    }
    .sheet {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px 20px;
      padding-top: 8px;
    }
    .cell:nth-child(n + 5) {
      display: none;
    }
    .fields {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 10px;
    }
    .slot {
      width: auto;
    }
    .total {
      grid-column: 1 / -1;
      padding-left: 0;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .go {
      width: 100%;
    }
    .anatomy-grid {
      grid-template-columns: 1fr;
    }
    .steps li {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }
    .again {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
