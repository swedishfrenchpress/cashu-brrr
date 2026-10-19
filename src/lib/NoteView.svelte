<script lang="ts">
  import NoteArt from "./NoteArt.svelte";
  import { shortMint } from "./job";
  import { familyOf, type NoteFamily, type NoteStyle } from "./templates";
  import { fmtNum } from "./format";

  interface Props {
    denomination: number;
    mintUrl: string;
    token: string;
    unit: string;
    /** the number in the link: 6 Sovereign, 7 Chaum, 8 Mr. Meadows, anything else a Bitpopart design */
    template: number;
  }
  let { denomination, mintUrl, token, unit, template }: Props = $props();

  const resolve = (n: number): { family: NoteFamily; style: NoteStyle } => {
    if (n === 6) return { family: familyOf("sovereign"), style: familyOf("sovereign").styles[0] };
    if (n === 7) return { family: familyOf("chaum"), style: familyOf("chaum").styles[0] };
    if (n === 8) return { family: familyOf("meadows"), style: familyOf("meadows").styles[0] };
    const comic = familyOf("comic");
    return { family: comic, style: comic.styles.find((s) => s.design === n) ?? { id: `comic-${n}`, name: `No. ${n}`, design: n } };
  };
  const design = $derived(resolve(template));
  const fmt = fmtNum;
</script>

<main class="view">
  <div class="note">
    <NoteArt
      type={design.family.type}
      design={design.style.design}
      colorCode={design.style.colorCode}
      {denomination}
      {mintUrl}
      {token}
      {unit}
    />
  </div>
  <div class="facts">
    <p class="amount heading">{fmt(denomination)} {unit}</p>
    <p class="how">
      Scan the QR with a Cashu wallet to claim it. Whoever claims it first gets the sats; after that, this note is spent.
    </p>
    <p class="issuer">Issued by <span class="data">{shortMint(mintUrl)}</span></p>
    <a class="btn-quiet" href="/#">Print your own ecash notes</a>
  </div>
</main>

<style>
  .view {
    position: relative;
    min-height: 100svh;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 40px;
    padding: 72px var(--gutter);
  }
  .note {
    width: min(100%, 860px);
    border-radius: var(--radius-note);
    overflow: hidden;
  }
  .facts {
    display: grid;
    justify-items: center;
    gap: 12px;
    text-align: center;
    max-width: 56ch;
  }
  .amount {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }
  .issuer {
    font-size: 14px;
    color: var(--ink-soft);
  }
  .issuer .data {
    font-size: 13px;
  }
  .how {
    font-size: 17px;
    line-height: 1.55;
    color: var(--ink-soft);
  }
</style>
