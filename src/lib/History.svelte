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
            <div class="thumb" style="aspect-ratio: {d.family.aspect}" use:lazy={() => (shown[p.ts] = true)}>
              {#if shown[p.ts]}
                <NoteArt
                  type={d.family.type}
                  design={d.style.design}
                  colorCode={d.style.colorCode}
                  denomination={amount}
                  mintUrl={p.mint}
                  token={SPECIMEN_TOKEN}
                />
              {/if}
            </div>
            <div class="facts">
              <p class="when">{fmtDateTime(p.ts)}</p>
              <p class="what heading">{fmt(p.tokens.length)} × {fmt(amount)} sat</p>
              <p class="detail">
                {fmt(p.tokens.length * amount)} sat · {d.family.name}{d.family.styles.length > 1 ? ` · ${d.style.name}` : ""}
              </p>
              <p class="detail data">{shortMint(p.mint)}</p>
            </div>
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
    padding: 40px var(--gutter) 96px;
    max-width: 1280px;
  }
  .head {
    display: grid;
    grid-template-columns: auto minmax(0, 560px);
    justify-content: space-between;
    align-items: end;
    gap: 24px 48px;
    padding-bottom: 32px;
  }
  h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
  }
  .custody {
    font-size: 15px;
    line-height: 1.55;
    padding: 14px 16px;
    border: 1.5px solid var(--ink);
    border-radius: 8px;
    background: var(--paper);
  }

  .jobs {
    list-style: none;
    display: grid;
    gap: 12px;
  }
  .job {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr) auto;
    gap: 28px;
    align-items: center;
    padding: 12px 0;
  }
  .thumb {
    width: 100%;
    background: var(--liner-deep);
    border-radius: 6px;
    overflow: hidden;
  }
  .facts {
    display: grid;
    gap: 4px;
    min-width: 0;
  }
  .when {
    font-size: 14px;
    color: var(--ink-soft);
  }
  .what {
    font-size: 26px;
  }
  .detail {
    font-size: 14px;
    color: var(--ink-soft);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .detail.data {
    font-size: 12px;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    padding: 64px 0;
    max-width: 52ch;
    font-size: 17px;
    line-height: 1.55;
    color: var(--ink-soft);
  }
  .empty-title {
    font-size: 32px;
    color: var(--ink);
  }
  .empty .btn-go {
    margin-top: 10px;
    text-decoration: none;
  }

  @media (max-width: 760px) {
    .head {
      grid-template-columns: 1fr;
    }
    .job {
      grid-template-columns: 120px minmax(0, 1fr);
      gap: 16px;
    }
    .actions {
      grid-column: 1 / -1;
    }
  }
</style>
