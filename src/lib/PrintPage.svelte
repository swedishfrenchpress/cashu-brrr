<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { Token } from "@cashu/cashu-ts";
  import { Printer } from "lucide-svelte";
  import NoteArt from "./NoteArt.svelte";
  import { encodeToken, shortMint } from "./job";
  import { fmtDate, fmtNum } from "./format";
  import { PAPER, chunk, resolveDesign, sheetLayout, type PaperSize, type StyleRef, type TemplateRef } from "./templates";
  import { paperSize, preparedTokens, prints, selectedStyle, selectedTemplate, mint } from "./stores.svelte";
  import { getAmountForTokenSet } from "./utils";

  type PrintData = {
    tokens: Token[];
    template?: TemplateRef | null;
    style?: StyleRef | null;
    mintUrl?: string;
    paper?: PaperSize;
    timestamp: number;
  };

  // The job comes from the tab that opened this one; fall back to the latest print in this browser
  const readPrintData = (): PrintData | null => {
    try {
      const stored = localStorage.getItem("currentPrintData");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < 5 * 60 * 1000) return parsed;
      localStorage.removeItem("currentPrintData");
    } catch (error) {
      console.error("Error reading print data:", error);
    }
    return null;
  };

  const data = readPrintData();
  const latest = $prints[$prints.length - 1];
  const tokens: Token[] = data?.tokens ?? ($preparedTokens.length > 0 ? $preparedTokens : latest?.tokens ?? []);
  const design = resolveDesign(
    data?.template ?? ($preparedTokens.length > 0 ? $selectedTemplate : latest?.template ?? $selectedTemplate),
    data?.style ?? ($preparedTokens.length > 0 ? $selectedStyle : latest?.style ?? $selectedStyle),
  );
  const paper: PaperSize = data?.paper ?? $paperSize;
  const mintUrl = data?.mintUrl ?? tokens[0]?.mint ?? latest?.mint ?? $mint?.url ?? "";
  const amount = getAmountForTokenSet(tokens[0]?.proofs ?? []);
  const layout = sheetLayout(design.family, paper);
  const sheets = chunk(tokens.map(encodeToken));
  const printedOn = fmtDate(Date.now());
  const fmt = fmtNum;

  // Split the tag so the Svelte preprocessor does not read it as this component's style block
  const pageRule = `<${"style"}>@page { size: ${PAPER[paper].css}; margin: 0; }</${"style"}>`;

  onMount(async () => {
    await tick();
    await document.fonts.ready;
    // The note components draw their QR codes after mounting; give them a beat, then wait for every image
    await new Promise((r) => setTimeout(r, 400));
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".sheets img"));
    await Promise.all(
      images.map((img) => (img.complete ? null : new Promise((r) => img.addEventListener("load", r, { once: true })))),
    );
    setTimeout(() => window.print(), 300);
  });
</script>

<svelte:head>
  {@html pageRule}
</svelte:head>

<div class="print-page">
  <header class="toolbar">
    <div>
      <p class="title heading">
        {fmt(tokens.length)} notes · {sheets.length} {sheets.length === 1 ? "sheet" : "sheets"}
      </p>
      <p class="tip">
        Print on {PAPER[paper].label}, landscape, at 100% scale ("Actual size") with margins set to none, so every note
        comes out at {Math.round(layout.cell.w)} × {Math.round(layout.cell.h)} mm. Cut along the marks.
      </p>
    </div>
    <button class="btn-go" onclick={() => window.print()}>
      <Printer size={20} strokeWidth={2.5} aria-hidden="true" /> Print
    </button>
  </header>

  {#if tokens.length === 0}
    <p class="tip empty">There's no print job here. Open the print sheet from a finished job or from History.</p>
  {/if}

  <div class="sheets">
    {#each sheets as sheet, si}
      <section class="sheet" style="width: {layout.page.w}mm; height: {layout.page.h}mm;" aria-label="Sheet {si + 1}">
        {#each layout.marks as m}
          <span
            class="mark"
            style="left: {m.x1}mm; top: {m.y1}mm; width: {m.x1 === m.x2 ? '0.25mm' : `${m.x2 - m.x1}mm`}; height: {m.y1 === m.y2
              ? '0.25mm'
              : `${m.y2 - m.y1}mm`};"
          ></span>
        {/each}

        <div
          class="grid"
          style="left: {layout.x0}mm; top: {layout.y0}mm; width: {layout.gridW}mm; height: {layout.gridH}mm;
            grid-template-columns: repeat({layout.cols}, {layout.cell.w}mm); grid-template-rows: repeat({layout.rows}, {layout.cell.h}mm);"
        >
          {#each sheet as token}
            <div class="cell">
              <NoteArt
                type={design.family.type}
                design={design.style.design}
                colorCode={design.style.colorCode}
                denomination={amount}
                {mintUrl}
                {token}
                isPrint
              />
            </div>
          {/each}
        </div>

        <p class="sheet-slug" style="left: 3mm; top: {layout.y0}mm; height: {layout.gridH}mm;">
          Cashu Brrr · Sheet {si + 1} of {sheets.length} · {sheet.length} × {fmt(amount)} sat · {shortMint(mintUrl)} · {printedOn}
        </p>
      </section>
    {/each}
  </div>
</div>

<style>
  .print-page {
    min-height: 100svh;
    padding: 32px var(--gutter) 64px;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    max-width: 297mm;
    margin: 0 auto 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--ink);
  }
  .title {
    font-size: 28px;
  }
  .tip {
    margin-top: 8px;
    font-size: 15px;
    line-height: 1.5;
    color: var(--ink-soft);
    max-width: 68ch;
  }
  .empty {
    max-width: 297mm;
    margin: 0 auto;
  }

  .sheets {
    display: grid;
    justify-content: center;
    gap: 28px;
    overflow-x: auto;
  }
  .sheet {
    position: relative;
    background: #fff;
    overflow: hidden;
    box-shadow:
      0 1px 2px rgba(20, 20, 20, 0.08),
      0 18px 40px -18px rgba(20, 20, 20, 0.28);
  }
  .mark {
    position: absolute;
    background: #000;
  }
  .grid {
    position: absolute;
    display: grid;
  }
  .cell {
    overflow: hidden;
  }
  .cell :global(.note-art),
  .cell :global(.note-container) {
    border-radius: 0;
  }
  .sheet-slug {
    position: absolute;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    text-align: center;
    font-family: var(--font-mono);
    font-size: 6pt;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #444;
    white-space: nowrap;
    overflow: hidden;
  }

  @media print {
    :global(html),
    :global(body) {
      background: #fff !important;
      margin: 0;
      padding: 0;
    }
    .print-page {
      padding: 0;
      min-height: 0;
    }
    .toolbar,
    .empty {
      display: none;
    }
    .sheets {
      display: block;
      overflow: visible;
    }
    .sheet {
      box-shadow: none;
      break-after: page;
      page-break-after: always;
    }
    .sheet:last-child {
      break-after: auto;
      page-break-after: auto;
    }
  }
</style>
