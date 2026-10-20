<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import QRCode from "qrcode";
  import type { MintQuoteResponse, Token } from "@cashu/cashu-ts";
  import { Check, ChevronLeft, ChevronRight, Copy, Download, LoaderCircle, Printer, Wallet } from "lucide-svelte";
  import AppHeader from "./ui/AppHeader.svelte";
  import SheetPreview from "./ui/SheetPreview.svelte";
  import NoteArt from "./NoteArt.svelte";
  import { lazy } from "./ui/lazy";
  import {
    FAMILIES,
    NOTES_PER_SHEET,
    PAPER,
    cellSize,
    chunk,
    defaultStyle,
    resolveDesign,
    styleRef,
    templateRef,
    SPECIMEN_TOKEN,
    type NoteFamily,
    type NoteStyle,
    type PaperSize,
  } from "./templates";
  import {
    SUGGESTED_MINTS,
    connectMint,
    discoverMintsOnNostr,
    downloadQrBackup,
    encodeToken,
    mintNotes,
    quoteIsPaid,
    requestInvoice,
    shortMint,
  } from "./job";
  import {
    discoveredMints,
    mint,
    paperSize,
    preparedTokens,
    prints,
    selectedDenomination,
    selectedNumberOfNotes,
    selectedStyle,
    selectedTemplate,
  } from "./stores.svelte";
  import { copyTextToClipboard, getAmountForTokenSet } from "./utils";
  import { fmtDateTime, fmtDuration, fmtNum } from "./format";

  type Phase = "edit" | "invoice" | "minting" | "ready";
  type Status = { text: string; kind: "info" | "error" };

  const fmt = fmtNum;
  const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

  // ---------- the job ----------
  const fresh = !$selectedTemplate;
  const initial = resolveDesign($selectedTemplate, $selectedStyle);
  let family = $state<NoteFamily>(initial.family);
  let style = $state<NoteStyle>(initial.style);
  let amount = $state(fresh ? "21" : String($selectedDenomination));
  let count = $state(fresh ? "6" : String($selectedNumberOfNotes));

  const amountValue = $derived(Number.parseInt(String(amount), 10));
  const countValue = $derived(Number.parseInt(String(count), 10));
  const amountOk = $derived(Number.isInteger(amountValue) && amountValue > 0 && String(amountValue) === String(amount).trim());
  const countOk = $derived(Number.isInteger(countValue) && countValue > 0 && String(countValue) === String(count).trim());
  const valid = $derived(amountOk && countOk);
  const total = $derived(valid ? amountValue * countValue : 0);

  const initialPhase: Phase = $preparedTokens.length > 0 ? "ready" : "edit";
  let phase = $state<Phase>(initialPhase);
  let tokens = $state.raw<Token[]>($preparedTokens.length > 0 ? $preparedTokens : []);
  let quote = $state<MintQuoteResponse | undefined>();
  let invoiceQR = $state("");
  let mintedAt = $state<number | undefined>();
  let mintError = $state("");
  let paying = $state(false);
  let checking = $state(false);
  let copied = $state(false);

  // A reprint arrives with its tokens; read the job back from them
  const reprintOf = $derived($preparedTokens.length > 0 ? $prints.find((p) => p.tokens === $preparedTokens) : undefined);
  const noteAmount = $derived(tokens.length > 0 ? getAmountForTokenSet(tokens[0].proofs) : amountValue);
  const noteCount = $derived(tokens.length > 0 ? tokens.length : countValue);
  const jobMintUrl = $derived(tokens.length > 0 ? tokens[0].mint : $mint?.url ?? SUGGESTED_MINTS[0]);

  // ---------- status: one plain line under the ticket ----------
  let status = $state<Status | null>(null);
  const note = (text: string, kind: Status["kind"] = "info") => {
    status = { text, kind };
  };

  // ---------- sheet ----------
  const encoded = $derived(tokens.map(encodeToken));
  const sheets = $derived(chunk(encoded));
  const sheetCount = $derived(phase === "ready" ? sheets.length : countOk ? Math.ceil(countValue / NOTES_PER_SHEET) : 1);
  let sheetIndex = $state(0);
  const cell = $derived(cellSize(family));
  const paper = $derived($paperSize);

  // ---------- mint ----------
  let mintState = $state<"idle" | "connecting" | "ok" | "error">($mint ? "ok" : "idle");
  let mintMessage = $state("");
  let mintPanel = $state(false);
  let mintInput = $state("");
  let discovering = $state(false);

  async function useMint(url: string) {
    mintState = "connecting";
    mintMessage = "";
    try {
      const m = await connectMint(url);
      mintState = "ok";
      mintPanel = false;
      mintInput = "";
      status = null;
    } catch (e) {
      mintState = "error";
      mintMessage = errorText(e);
      mintPanel = true;
      note(mintMessage, "error");
    }
  }

  async function findMints() {
    discovering = true;
    try {
      const found = await discoverMintsOnNostr();
      if (found.length === 0) note("No mints announced on Nostr right now. Enter a URL instead.");
    } catch (e) {
      note(`Couldn't search Nostr: ${errorText(e)}`, "error");
    } finally {
      discovering = false;
    }
  }

  /** Scroll a just-opened panel into view inside the ticket */
  const reveal = (node: HTMLElement) => {
    requestAnimationFrame(() => node.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  // ---------- design ----------
  let shownThumbs = $state<Record<string, boolean>>({});
  function pickFamily(f: NoteFamily) {
    if (f.type === family.type) return;
    family = f;
    style = defaultStyle(f);
  }

  // ---------- pay ----------
  let poll: ReturnType<typeof setInterval> | undefined;
  let ticker: ReturnType<typeof setInterval> | undefined;
  let now = $state(Date.now());
  const expiresAt = $derived(quote?.expiry ? quote.expiry * 1000 : undefined);
  const remaining = $derived(expiresAt ? Math.max(0, expiresAt - now) : undefined);
  const countdown = $derived(remaining === undefined ? "" : fmtDuration(remaining));

  const stopWatching = () => {
    clearInterval(poll);
    clearInterval(ticker);
    poll = ticker = undefined;
  };

  async function pay() {
    if (!valid || mintState !== "ok" || paying) return;
    selectedTemplate.set(templateRef(family));
    selectedStyle.set(styleRef(family, style));
    selectedDenomination.set(amountValue);
    selectedNumberOfNotes.set(countValue);
    paying = true;
    try {
      quote = await requestInvoice(total);
      invoiceQR = await QRCode.toDataURL(quote.request, {
        width: 520,
        margin: 1,
        color: { dark: "#141414", light: "#ffffff" },
      });
      phase = "invoice";
      status = null;
      stopWatching();
      poll = setInterval(() => checkPayment(false), 2000);
      ticker = setInterval(() => (now = Date.now()), 1000);
    } catch (e) {
      note(`Couldn't get an invoice from ${shortMint($mint?.url)}: ${errorText(e)}`, "error");
    } finally {
      paying = false;
    }
  }

  async function checkPayment(manual: boolean) {
    if (!quote || phase !== "invoice" || checking) return;
    checking = true;
    try {
      if (await quoteIsPaid(quote)) {
        stopWatching();
        status = null;
        await mintSheet();
      } else if (manual) {
        note("Not paid yet. This page keeps checking every 2 seconds.");
      }
    } catch (e) {
      if (manual) note(`Couldn't check the invoice: ${errorText(e)}`, "error");
    } finally {
      checking = false;
    }
  }

  $effect(() => {
    if (phase === "invoice" && remaining === 0) {
      stopWatching();
      phase = "edit";
      quote = undefined;
      note("The invoice expired before it was paid. Nothing was charged; start again.", "error");
    }
  });

  async function mintSheet() {
    if (!quote) return;
    phase = "minting";
    mintError = "";
    try {
      const job = await mintNotes(quote, amountValue, countValue, templateRef(family), styleRef(family, style));
      tokens = job.tokens;
      mintedAt = job.ts;
      sheetIndex = 0;
      phase = "ready";
      status = null;
    } catch (e) {
      mintError = errorText(e);
    }
  }

  function dropInvoice() {
    stopWatching();
    quote = undefined;
    phase = "edit";
    note("Invoice dropped. Don't pay it.");
  }

  async function copyInvoice() {
    if (!quote) return;
    copied = await copyTextToClipboard(quote.request);
    if (copied) setTimeout(() => (copied = false), 1600);
    else note("Couldn't copy. Select the invoice text and copy it by hand.", "error");
  }

  // ---------- ready ----------
  function printSheets() {
    const printData = {
      tokens,
      denomination: noteAmount,
      numberOfNotes: noteCount,
      template: templateRef(family),
      style: styleRef(family, style),
      mintUrl: jobMintUrl,
      paper,
      timestamp: Date.now(),
    };
    localStorage.setItem("currentPrintData", JSON.stringify(printData));
    window.open(`${window.location.origin}${window.location.pathname}?print=true`, "_blank");
    note("The print sheet opened in a new tab.");
  }

  async function downloadBackup() {
    await downloadQrBackup(tokens, noteAmount);
    note(`QR backup downloaded: ${fmt(encoded.length)} QR codes.`);
  }

  function newJob() {
    stopWatching();
    preparedTokens.set([]);
    tokens = [];
    quote = undefined;
    mintedAt = undefined;
    mintError = "";
    sheetIndex = 0;
    phase = "edit";
    status = null;
    if (!$mint) useMint(SUGGESTED_MINTS[0]);
  }

  // On a phone the ticket sits under the sheet; bring each new phase into view
  let ticketEl = $state<HTMLElement>();
  let lastPhase: Phase = initialPhase;
  $effect(() => {
    if (phase !== lastPhase) {
      lastPhase = phase;
      if (ticketEl && window.matchMedia("(max-width: 900px)").matches) {
        ticketEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  onMount(() => {
    if (phase === "edit" && !$mint) useMint(SUGGESTED_MINTS[0]);
  });
  onDestroy(stopWatching);
</script>

<div class="job">
  <AppHeader current="print" />

  <div class="layout">
    <!-- The sheet -->
    <section class="stage" aria-label="Sheet preview">
      {#if phase === "ready" && sheets.length > 1}
        <div class="stage-head">
          <p class="pager-label">Sheet {sheetIndex + 1} of {sheets.length}</p>
          <div class="pager">
            <button class="btn-quiet" onclick={() => (sheetIndex = Math.max(0, sheetIndex - 1))} disabled={sheetIndex === 0} aria-label="Previous sheet">
              <ChevronLeft size={18} />
            </button>
            <button
              class="btn-quiet"
              onclick={() => (sheetIndex = Math.min(sheets.length - 1, sheetIndex + 1))}
              disabled={sheetIndex >= sheets.length - 1}
              aria-label="Next sheet"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      {/if}

      <div class="stage-sheet">
        {#if phase === "ready"}
          <SheetPreview {family} {style} denomination={noteAmount} mintUrl={jobMintUrl} {paper} tokens={sheets[sheetIndex] ?? []} />
        {:else}
          <SheetPreview {family} {style} denomination={amountOk ? amountValue : 0} mintUrl={jobMintUrl} {paper} specimenCount={countOk ? countValue : 0} />
        {/if}
      </div>

    </section>

    <!-- The ticket -->
    <aside class="ticket" aria-label="Print job" bind:this={ticketEl}>
      <div class="ticket-scroll">
        {#if phase === "edit"}
          <h1 class="heading ticket-title">Print job</h1>

          <section class="group">
            <h2 class="group-title">Design</h2>
            <div class="families" role="group" aria-label="Series">
              {#each FAMILIES as f}
                <button class="label-chip" aria-pressed={f.type === family.type} onclick={() => pickFamily(f)}>
                  <span>{f.name}</span>
                </button>
              {/each}
            </div>
            {#if family.styles.length > 1}
              <div class="styles" role="group" aria-label="{family.name} styles">
                {#each family.styles as s (s.id)}
                  <button
                    class="thumb"
                    aria-pressed={s.id === style.id}
                    onclick={() => (style = s)}
                    use:lazy={() => (shownThumbs[`${family.type}:${s.id}`] = true)}
                  >
                    <span class="thumb-art" style="aspect-ratio: {family.aspect}">
                      {#if shownThumbs[`${family.type}:${s.id}`]}
                        <NoteArt
                          type={family.type}
                          design={s.design}
                          colorCode={s.colorCode}
                          denomination={amountOk ? amountValue : 0}
                          mintUrl={jobMintUrl}
                          token={SPECIMEN_TOKEN}
                        />
                      {/if}
                    </span>
                    <span class="thumb-name">{s.name}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </section>

          <section class="group">
            <h2 class="group-title">Paper</h2>
            <div class="segmented" role="radiogroup" aria-label="Paper size">
              {#each Object.entries(PAPER) as [key, p]}
                <button
                  role="radio"
                  aria-checked={paper === key}
                  onclick={() => paperSize.set(key as PaperSize)}
                >
                  {p.label}
                </button>
              {/each}
            </div>
            <p class="hint">
              Landscape, {NOTES_PER_SHEET} notes per sheet, each {Math.round(cell.w)} × {Math.round(cell.h)} mm, with cut marks.
            </p>
          </section>

          <section class="group">
            <h2 class="group-title">Mint</h2>
            <div class="mint-row">
              {#if mintState === "connecting"}
                <span class="mint-status"><LoaderCircle size={16} class="spin" aria-hidden="true" /> Connecting…</span>
              {:else if mintState === "ok" && $mint}
                <span class="mint-url data">{shortMint($mint.url)}</span>
              {:else}
                <span class="mint-status">No mint connected</span>
              {/if}
              <button class="btn-quiet" onclick={() => (mintPanel = !mintPanel)} aria-expanded={mintPanel}>
                {mintPanel ? "Close" : "Change"}
              </button>
            </div>
            {#if mintState === "error"}
              <p class="error-text">{mintMessage}</p>
            {/if}
            {#if mintPanel}
              <div class="mint-panel" transition:fade={{ duration: 140 }} use:reveal>
                <div class="chips">
                  {#each SUGGESTED_MINTS as url}
                    <button class="label-chip" aria-pressed={$mint?.url === url} onclick={() => useMint(url)}>
                      <span>{shortMint(url)}</span>
                    </button>
                  {/each}
                </div>
                <form class="mint-form" onsubmit={(e) => { e.preventDefault(); if (mintInput.trim()) useMint(mintInput); }}>
                  <label class="field">
                    <span class="sr-only">Mint URL</span>
                    <input type="text" placeholder="mint.example.com" bind:value={mintInput} autocomplete="off" spellcheck="false" />
                  </label>
                  <button class="btn-line" type="submit" disabled={!mintInput.trim() || mintState === "connecting"}>Connect</button>
                </form>
                <button class="btn-quiet" onclick={findMints} disabled={discovering}>
                  {discovering ? "Searching Nostr…" : "Find mints on Nostr"}
                </button>
                {#if $discoveredMints.length > 0}
                  <div class="chips found">
                    {#each $discoveredMints.slice(0, 16) as m}
                      <button class="label-chip" aria-pressed={$mint?.url === m.url} onclick={() => useMint(m.url)} title={m.url}>
                        <span>{shortMint(m.url)}</span>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </section>

          <section class="group">
            <h2 class="group-title">Amount</h2>
            <div class="amounts">
              <label>
                <span class="field-label">Per note</span>
                <span class="field">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" bind:value={amount} aria-invalid={!amountOk} />
                  <span class="unit">sat</span>
                </span>
              </label>
              <label>
                <span class="field-label">Notes</span>
                <span class="field">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" bind:value={count} aria-invalid={!countOk} />
                  <span class="unit">notes</span>
                </span>
              </label>
            </div>
            {#if !amountOk || !countOk}
              <p class="error-text">Enter whole numbers, 1 or more.</p>
            {:else}
              <p class="hint">
                {fmt(countValue)} {countValue === 1 ? "note" : "notes"} fill {sheetCount}
                {sheetCount === 1 ? "sheet" : "sheets"}. Real QR codes are printed after you pay.
              </p>
            {/if}
          </section>
        {:else if phase === "invoice" || phase === "minting"}
          <h1 class="heading ticket-title">Pay {fmt(total)} sat</h1>
          <p class="summary">
            {family.name}{family.styles.length > 1 ? `, ${style.name}` : ""}. {fmt(countValue)} × {fmt(amountValue)} sat from
            <span class="data">{shortMint($mint?.url)}</span>
          </p>

          <div class="invoice">
            <div class="qr-label" class:paid={phase === "minting"}>
              {#if invoiceQR}
                <img src={invoiceQR} alt="Lightning invoice QR code" width="260" height="260" />
              {/if}
            </div>
            {#if phase === "invoice"}
              <p class="waiting">
                <LoaderCircle size={16} class="spin" aria-hidden="true" /> Waiting for payment{countdown ? `, expires in ${countdown}` : ""}
              </p>
              <div class="invoice-actions">
                <button class="btn-line" onclick={copyInvoice}>
                  {#if copied}<Check size={16} aria-hidden="true" /> Copied{:else}<Copy size={16} aria-hidden="true" /> Copy invoice{/if}
                </button>
                {#if quote}
                  <a class="btn-line" href="lightning:{quote.request}"><Wallet size={16} aria-hidden="true" /> Open in wallet</a>
                {/if}
              </div>
              <div class="invoice-quiet">
                <button class="btn-quiet" onclick={() => checkPayment(true)} disabled={checking}>
                  {checking ? "Checking…" : "I've paid, check now"}
                </button>
                <button class="btn-quiet" onclick={dropInvoice}>Change the job</button>
              </div>
            {:else if mintError}
              <p class="error-text">The invoice is paid but the notes weren't minted. Keep this page open and try again.</p>
              <button class="btn-go" onclick={mintSheet}>Try minting again</button>
            {:else}
              <p class="waiting"><LoaderCircle size={16} class="spin" aria-hidden="true" /> Paid. Minting {fmt(countValue)} notes…</p>
            {/if}
          </div>
        {:else}
          <h1 class="heading ticket-title">
            {reprintOf ? "Reprint" : "Brrr."}
            {fmt(noteCount)} notes ready.
          </h1>
          <p class="summary">
            {family.name}{family.styles.length > 1 ? `, ${style.name}` : ""}. {fmt(noteCount)} × {fmt(noteAmount)} sat =
            {fmt(noteCount * noteAmount)} sat from <span class="data">{shortMint(jobMintUrl)}</span>
            {#if reprintOf}<br />Printed first on {fmtDateTime(reprintOf.ts)}.{/if}
          </p>

          <div class="custody">
            <p class="custody-title">These notes are real money.</p>
            <p>
              They're stored only in this browser. Print them now and download the QR backup. If you clear your browser
              data before printing, the notes you haven't printed are gone.
            </p>
          </div>

          <section class="group">
            <h2 class="group-title">Paper</h2>
            <div class="segmented" role="radiogroup" aria-label="Paper size">
              {#each Object.entries(PAPER) as [key, p]}
                <button role="radio" aria-checked={paper === key} onclick={() => paperSize.set(key as PaperSize)}>
                  {p.label}
                </button>
              {/each}
            </div>
            <p class="hint">{sheets.length} {sheets.length === 1 ? "sheet" : "sheets"}, landscape, cut marks included.</p>
          </section>

          <div class="ready-actions">
            <button class="btn-line" onclick={downloadBackup}><Download size={16} aria-hidden="true" /> Download QR backup (.zip)</button>
            <button class="btn-quiet" onclick={newJob}>Start a new job</button>
          </div>
        {/if}

        {#if status}
          <p class="status" class:error={status.kind === "error"} aria-live="polite" in:fade={{ duration: 160 }}>{status.text}</p>
        {/if}
      </div>

      <!-- The one action -->
      {#if phase === "edit"}
        <div class="action">
          <p class="action-total">
            <span class="field-label">Total</span>
            <span class="data">{valid ? `${fmt(total)} sat` : "–"}</span>
          </p>
          <button class="btn-go" onclick={pay} disabled={!valid || mintState !== "ok" || paying}>
            {#if paying}<LoaderCircle size={18} class="spin" aria-hidden="true" /> Getting invoice…{:else if valid}Pay {fmt(total)} sat{:else}Pay{/if}
          </button>
        </div>
      {:else if phase === "ready"}
        <div class="action">
          <p class="action-total">
            <span class="field-label">Sheets</span>
            <span class="data">{sheets.length} × {PAPER[paper].label}</span>
          </p>
          <button class="btn-go" onclick={printSheets}>
            <Printer size={20} strokeWidth={2.5} aria-hidden="true" /> Print {sheets.length === 1 ? "sheet" : `${sheets.length} sheets`}
          </button>
        </div>
      {/if}
    </aside>
  </div>
</div>

<style>
  .job {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
  }
  .layout {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(360px, 30vw, 440px);
  }

  /* ---------- stage ---------- */
  .stage {
    position: relative;
    padding: 28px var(--gutter) 40px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }
  .stage-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    max-width: 1040px;
    width: 100%;
    margin: 0 auto;
  }
  .pager-label {
    font-size: 14px;
    font-weight: 700;
  }
  .pager {
    display: flex;
    gap: 4px;
  }
  .stage-sheet {
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
  }
  /* ---------- ticket ---------- */
  .ticket {
    position: sticky;
    top: 0;
    align-self: start;
    height: calc(100svh - 61px);
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--ink);
    background: var(--liner);
  }
  /* The action follows the last group; it only pins to the bottom once the ticket has to scroll */
  .ticket-scroll {
    flex: 0 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 28px 28px 24px;
    scrollbar-width: thin;
  }
  .ticket-title {
    font-size: 34px;
    margin-bottom: 8px;
  }
  .summary {
    font-size: 15px;
    line-height: 1.5;
    color: var(--ink-soft);
    margin-bottom: 20px;
  }
  .summary .data {
    font-size: 13px;
  }
  .group {
    padding: 14px 0;
  }
  .group:first-of-type {
    margin-top: 12px;
  }
  .group-title {
    font-family: var(--font-ui);
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 12px;
  }
  .families,
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .families .label-chip {
    font-family: var(--font-ui);
    font-weight: 700;
    font-size: 13px;
  }
  .styles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px 12px;
    margin-top: 16px;
    padding: 4px;
  }
  .thumb {
    display: grid;
    gap: 6px;
    text-align: left;
    cursor: pointer;
    border-radius: 6px;
  }
  .thumb-art {
    display: block;
    width: 100%;
    background: var(--liner-deep);
    border-radius: 4px;
    overflow: hidden;
    outline: 2px solid transparent;
    outline-offset: 3px;
    transition: outline-color 160ms var(--ease-out), transform 220ms var(--ease-out);
  }
  .thumb:hover .thumb-art {
    transform: translateY(-1px);
  }
  .thumb[aria-pressed="true"] .thumb-art {
    outline-color: var(--ink);
  }
  .thumb-name {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink-soft);
  }
  .thumb[aria-pressed="true"] .thumb-name {
    color: var(--ink);
  }

  .amounts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .error-text {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.45;
    color: var(--cut-ink);
  }
  .hint {
    margin-top: 10px;
    font-size: 13px;
    color: var(--ink-soft);
  }

  .segmented {
    display: inline-flex;
    border: 1.5px solid var(--ink);
    border-radius: 999px;
    padding: 3px;
    gap: 3px;
    background: var(--paper);
  }
  .segmented button {
    font-family: var(--font-ui);
    font-weight: 700;
    font-size: 14px;
    padding: 7px 18px;
    border-radius: 999px;
    cursor: pointer;
    transition: background-color 160ms var(--ease-out), color 160ms var(--ease-out);
  }
  .segmented button[aria-checked="true"] {
    background: var(--ink);
    color: #fff;
  }

  .mint-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .mint-url {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mint-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
  }
  .mint-panel {
    display: grid;
    gap: 14px;
    justify-items: start;
    margin-top: 14px;
    padding: 16px;
    background: var(--liner-deep);
    border-radius: 8px;
  }
  .mint-form {
    display: flex;
    gap: 10px;
    width: 100%;
  }
  .mint-form .field {
    flex: 1;
    padding: 8px 12px;
  }
  .mint-form .field input {
    font-size: 14px;
    font-weight: 400;
  }
  .found {
    max-height: 160px;
    overflow-y: auto;
  }

  .invoice {
    display: grid;
    justify-items: center;
    gap: 16px;
    padding-top: 8px;
  }
  .qr-label {
    background: var(--paper);
    padding: 14px;
    border-radius: 12px;
    outline: 2.5px solid var(--cut);
    outline-offset: 6px;
    width: min(100%, 288px);
    aspect-ratio: 1;
  }
  .qr-label img {
    width: 100%;
    height: auto;
    display: block;
  }
  .qr-label.paid {
    outline-color: var(--ink);
  }
  .waiting {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 700;
  }
  .invoice-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  .invoice-actions a {
    text-decoration: none;
  }
  .invoice-quiet {
    display: flex;
    gap: 22px;
  }

  .custody {
    font-size: 15px;
    line-height: 1.5;
    color: var(--ink-soft);
    margin-bottom: 8px;
    text-wrap: pretty;
  }
  .custody-title {
    font-family: var(--font-ui);
    font-weight: 700;
    font-size: 17px;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .ready-actions {
    display: grid;
    justify-items: start;
    gap: 14px;
    padding-top: 14px;
  }
  .status {
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.45;
    color: var(--ink-soft);
  }
  .status.error {
    color: var(--cut-ink);
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 28px 22px;
    background: var(--liner);
  }
  .action-total .data {
    display: block;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 24px;
    line-height: 1.15;
  }
  .action .btn-go {
    font-size: 17px;
    padding: 15px 26px;
  }

  :global(.spin) {
    animation: spin 900ms linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* ---------- narrow: the sheet on top, the action pinned ---------- */
  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .stage {
      padding-top: 20px;
    }
    .ticket {
      position: static;
      height: auto;
      border-left: 0;
    }
    .ticket-scroll {
      overflow: visible;
      padding: 24px var(--gutter);
    }
    .action {
      position: sticky;
      bottom: 0;
      z-index: 3;
      padding: 14px var(--gutter) calc(14px + env(safe-area-inset-bottom));
      box-shadow: 0 -10px 24px -14px rgba(20, 20, 20, 0.3);
    }
  }
</style>
