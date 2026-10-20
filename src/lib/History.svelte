<script lang="ts">
  import { Download, Printer } from "lucide-svelte";
  import AppHeader from "./ui/AppHeader.svelte";
  import NoteArt from "./NoteArt.svelte";
  import { lazy } from "./ui/lazy";
  import { downloadQrBackup, shortMint } from "./job";
  import { resolveDesign, styleRef, templateRef, SPECIMEN_TOKEN } from "./templates";
  import {
    prints,
    preparedTokens,
    selectedDenomination,
    selectedNumberOfNotes,
    selectedStyle,
    selectedTemplate,
    type Print,
  } from "./stores.svelte";
  import { getAmountForTokenSet } from "./utils";
  import { fmtDateTime, fmtNum } from "./format";

  const fmt = fmtNum;
  const newestFirst = $derived([...$prints].sort((a, b) => b.ts - a.ts));
  let shown = $state<Record<number, boolean>>({});

  const perNote = (p: Print) => getAmountForTokenSet(p.tokens[0]?.proofs ?? []);

  function reprint(p: Print) {
    const { family, style } = resolveDesign(p.template, p.style);
    selectedTemplate.set(templateRef(family));
    selectedStyle.set(styleRef(family, style));
    selectedDenomination.set(perNote(p));
    selectedNumberOfNotes.set(p.tokens.length);
    preparedTokens.set(p.tokens);
    window.location.hash = "print";
  }

  const backup = (p: Print) => downloadQrBackup(p.tokens, perNote(p));
</script>

<div class="page">
  <AppHeader current="history" />

  <main class="history">
    <div class="head">
      <h1 class="heading">History</h1>
      {#if newestFirst.length > 0}
        <p class="custody">
          Every job below holds real, possibly unclaimed notes, stored only in this browser. Clearing your browser data
          deletes them for good. Download a QR backup of any job you haven't finished handing out.
        </p>
      {/if}
    </div>

    {#if newestFirst.length === 0}
      <div class="empty">
        <p class="empty-title heading">Nothing printed yet.</p>
        <p>Jobs you pay for show up here, so you can reprint a sheet or back up its QR codes.</p>
        <a class="btn-go" href="#print">Start a job</a>
      </div>
    {:else}
      <ol class="jobs">
        {#each newestFirst as p (p.ts)}
          {@const d = resolveDesign(p.template, p.style)}
          {@const amount = perNote(p)}
          <li class="job">
            <div class="thumb" use:lazy={() => (shown[p.ts] = true)}>
              {#if shown[p.ts]}
                <div class="thumb-note">
                  <NoteArt
                    type={d.family.type}
                    design={d.style.design}
                    colorCode={d.style.colorCode}
                    denomination={amount}
                    mintUrl={p.mint}
                    token={SPECIMEN_TOKEN}
                  />
                </div>
              {/if}
            </div>
            <div class="what">
              <p class="count heading">{fmt(p.tokens.length)} × {fmt(amount)} sat</p>
              <p class="design">{d.family.name}{d.family.styles.length > 1 ? `, ${d.style.name}` : ""}</p>
            </div>
            <div class="printed">
              <p class="when">{fmtDateTime(p.ts)}</p>
              <p class="mint data">{shortMint(p.mint)}</p>
            </div>
            <p class="total">{fmt(p.tokens.length * amount)} sat</p>
            <div class="actions">
              <button class="btn-line" onclick={() => reprint(p)}><Printer size={16} aria-hidden="true" /> Reprint</button>
              <button class="btn-quiet" onclick={() => backup(p)}><Download size={15} aria-hidden="true" /> QR backup</button>
            </div>
          </li>
        {/each}
      </ol>
    {/if}
  </main>
</div>

<style>
  .history {
    padding: clamp(32px, 5vw, 56px) var(--gutter) 96px;
  }
  .head {
    display: grid;
    gap: 14px;
    margin-bottom: clamp(32px, 4vw, 48px);
  }
  h1 {
    font-size: clamp(2.25rem, 3.4vw, 3rem);
  }
  .custody {
    max-width: 62ch;
    font-size: 17px;
    line-height: 1.55;
    color: var(--ink-soft);
    text-wrap: pretty;
  }

  /* A ledger: rows share the list's columns (subgrid), so jobs scan down and actions sit at the right edge */
  .jobs {
    list-style: none;
    display: grid;
    grid-template-columns: 176px minmax(0, 1.3fr) minmax(0, 1fr) auto auto;
    column-gap: 32px;
    row-gap: 28px;
  }
  .job {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-areas: "thumb what printed total actions";
    align-items: center;
  }
  /* A fixed well at the narrowest note's shape, so every row is the same height */
  .thumb {
    grid-area: thumb;
    aspect-ratio: 534 / 279;
    display: grid;
    align-items: center;
  }
  .thumb-note {
    border-radius: 6px;
    overflow: hidden;
  }
  .what,
  .printed {
    display: grid;
    gap: 6px;
    min-width: 0;
  }
  .what {
    grid-area: what;
  }
  .printed {
    grid-area: printed;
  }
  .count {
    font-size: 24px;
    line-height: 1.15;
  }
  .design {
    font-size: 14px;
    color: var(--ink-soft);
  }
  .when {
    font-size: 15px;
  }
  .mint {
    font-size: 13px;
    color: var(--ink-soft);
  }
  .design,
  .when,
  .mint {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .total {
    grid-area: total;
    justify-self: end;
    font-weight: 700;
    font-size: 20px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .actions {
    grid-area: actions;
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    padding: 32px 0 64px;
    max-width: 52ch;
    font-size: 17px;
    line-height: 1.55;
    color: var(--ink-soft);
  }
  .empty-title {
    font-size: 34px;
    color: var(--ink);
  }
  .empty .btn-go {
    margin-top: 10px;
    text-decoration: none;
  }

  /* Mid widths: when and where fold under the job */
  @media (max-width: 1180px) {
    .jobs {
      grid-template-columns: 160px minmax(0, 1fr) auto auto;
    }
    .job {
      grid-template-areas:
        "thumb what total actions"
        "thumb printed total actions";
      row-gap: 10px;
    }
    .what {
      align-self: end;
    }
    .printed {
      align-self: start;
      gap: 2px;
    }
  }
  @media (max-width: 760px) {
    .jobs {
      grid-template-columns: 112px minmax(0, 1fr);
      column-gap: 16px;
      row-gap: 36px;
    }
    .job {
      grid-template-areas:
        "thumb what"
        "thumb total"
        "printed printed"
        "actions actions";
      row-gap: 6px;
    }
    .thumb {
      align-self: start;
    }
    .count {
      font-size: 20px;
    }
    .total {
      justify-self: start;
      align-self: start;
      font-size: 15px;
    }
    .printed {
      margin-top: 8px;
    }
    .actions {
      margin-top: 8px;
    }
  }
</style>
