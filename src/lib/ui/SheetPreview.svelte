<script lang="ts">
  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import NoteArt from "../NoteArt.svelte";
  import { sheetLayout, NOTES_PER_SHEET, SPECIMEN_TOKEN, type NoteFamily, type NoteStyle, type PaperSize } from "../templates";

  interface Props {
    family: NoteFamily;
    style: NoteStyle;
    denomination: number;
    mintUrl: string;
    paper: PaperSize;
    /** encoded tokens on this sheet; when empty, specimens fill the slots */
    tokens?: string[];
    specimenCount?: number;
  }

  let { family, style, denomination, mintUrl, paper, tokens = [], specimenCount = NOTES_PER_SHEET }: Props = $props();

  const layout = $derived(sheetLayout(family, paper));
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  const slots = $derived(
    tokens.length > 0
      ? tokens.map((token) => ({ key: token, token }))
      : Array.from({ length: Math.min(Math.max(specimenCount, 0), NOTES_PER_SHEET) }, (_, i) => ({
          key: `${style.id}-${i}`,
          token: SPECIMEN_TOKEN,
        })),
  );
</script>

<div class="paper" style="aspect-ratio: {layout.page.w} / {layout.page.h}">
  {#each layout.marks as m}
    <span
      class="mark"
      aria-hidden="true"
      style="left: {pct(m.x1, layout.page.w)}; top: {pct(m.y1, layout.page.h)}; width: {m.x1 === m.x2
        ? '1px'
        : pct(m.x2 - m.x1, layout.page.w)}; height: {m.y1 === m.y2 ? '1px' : pct(m.y2 - m.y1, layout.page.h)};"
    ></span>
  {/each}

  <div
    class="grid"
    style="left: {pct(layout.x0, layout.page.w)}; top: {pct(layout.y0, layout.page.h)}; width: {pct(
      layout.gridW,
      layout.page.w,
    )}; height: {pct(layout.gridH, layout.page.h)};"
  >
    {#each slots as slot, i (slot.key)}
      <div class="slot" in:scale={{ start: 0.94, opacity: 0, delay: i * 45, duration: 380, easing: cubicOut }}>
        <NoteArt
          type={family.type}
          design={style.design}
          colorCode={style.colorCode}
          {denomination}
          {mintUrl}
          token={slot.token}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .paper {
    position: relative;
    width: 100%;
    background: var(--paper);
    border-radius: 2px;
    box-shadow:
      0 1px 2px rgba(20, 20, 20, 0.08),
      0 18px 40px -18px rgba(20, 20, 20, 0.28);
  }
  .mark {
    position: absolute;
    background: var(--ink);
  }
  .grid {
    position: absolute;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    transition:
      left 420ms var(--ease-out),
      top 420ms var(--ease-out),
      width 420ms var(--ease-out),
      height 420ms var(--ease-out);
  }
  .slot {
    position: relative;
    min-width: 0;
    overflow: hidden;
  }
  .slot :global(.note-art),
  .slot :global(.note-container) {
    border-radius: 0;
  }
</style>
