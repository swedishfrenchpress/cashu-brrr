<script lang="ts">
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import ChaumNote from "./ChaumNote.svelte";
  import MeadowsNote from "./MeadowsNote.svelte";
  import type { NoteType } from "./templates";

  interface Props {
    type: NoteType;
    design?: number | string;
    colorCode?: string;
    denomination: number;
    mintUrl: string;
    token: string;
    unit?: string;
    isPrint?: boolean;
  }

  let {
    type,
    design,
    colorCode,
    denomination,
    mintUrl,
    token,
    unit = "sat",
    isPrint = false,
  }: Props = $props();
</script>

<!-- The note components carry their own click handlers; the app decides interaction, so the art stays inert. -->
<div class="note-art" inert>
  {#if type === "comic"}
    <ComicNote design={typeof design === "number" ? design : 7} {denomination} {mintUrl} {token} {unit} {isPrint} />
  {:else if type === "sovereign"}
    <SovereignNote
      design={typeof design === "string" ? design : "Soverign_Note.png"}
      {denomination}
      {mintUrl}
      {token}
      {unit}
      {isPrint}
    />
  {:else if type === "chaum"}
    <ChaumNote {denomination} {mintUrl} {token} {unit} {isPrint} />
  {:else if type === "meadows"}
    <MeadowsNote {denomination} {mintUrl} {token} {unit} {isPrint} />
  {:else}
    <CustomNote
      {denomination}
      {mintUrl}
      {token}
      {unit}
      colorCode={colorCode ?? "#E4690A"}
      cornerBrandLogoURL=""
      brandLogoURL=""
    />
  {/if}
</div>

<style>
  .note-art {
    position: relative;
    width: 100%;
    min-width: 0;
    line-height: 0;
  }
  /* The note components draw each QR on a hidden canvas first; keep it out of layout */
  .note-art :global(.invisible) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  .note-art :global(svg) {
    display: block;
    width: 100%;
    height: auto;
  }
</style>
