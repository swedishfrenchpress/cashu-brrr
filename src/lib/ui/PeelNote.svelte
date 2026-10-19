<script lang="ts">
  import type { Snippet } from "svelte";
  import type { PeelCorner } from "../templates";

  interface Props {
    /** the note this wrapper is cut around */
    children: Snippet;
    /** picked: the die line burns and the corner lifts off the liner */
    picked?: boolean;
    /** let hover lift the corner (only on things you can pick) */
    interactive?: boolean;
    /** the corner that lifts; each series lifts the one clear of its QR and amount */
    corner?: PeelCorner;
  }
  let { children, picked = false, interactive = false, corner = "br" }: Props = $props();
</script>

<div class="peel c-{corner}" class:picked class:interactive>
  <div class="art">
    {@render children()}
  </div>
  <div class="flap-shadow" aria-hidden="true"><div class="flap"></div></div>
</div>

<style>
  .peel {
    --peel: 0px;
    position: relative;
    border-radius: var(--radius-note);
    outline: 1px solid rgba(229, 0, 125, 0.55);
    outline-offset: 6px;
    transition:
      --peel 420ms var(--ease-peel),
      outline-color 200ms var(--ease-out),
      outline-width 200ms var(--ease-out),
      transform 300ms var(--ease-out);
  }
  .art {
    border-radius: var(--radius-note);
    overflow: hidden;
  }
  /* The folded-back corner: the sticker's white back, lying over the note */
  .flap-shadow {
    position: absolute;
    width: var(--peel);
    height: var(--peel);
    pointer-events: none;
  }
  .flap {
    width: 100%;
    height: 100%;
  }

  /* Each corner: cut the art away, lay the flap over the note, throw its shadow inward */
  .c-br .art {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--peel)), calc(100% - var(--peel)) 100%, 0 100%);
  }
  .c-br .flap-shadow {
    right: 0;
    bottom: 0;
    filter: drop-shadow(-3px -4px 5px rgba(20, 20, 20, 0.26));
  }
  .c-br .flap {
    clip-path: polygon(0 0, 100% 0, 0 100%);
    background: linear-gradient(135deg, #ffffff 30%, #dcded8 100%);
  }

  .c-bl .art {
    clip-path: polygon(0 0, 100% 0, 100% 100%, var(--peel) 100%, 0 calc(100% - var(--peel)));
  }
  .c-bl .flap-shadow {
    left: 0;
    bottom: 0;
    filter: drop-shadow(3px -4px 5px rgba(20, 20, 20, 0.26));
  }
  .c-bl .flap {
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    background: linear-gradient(225deg, #ffffff 30%, #dcded8 100%);
  }

  .c-tr .art {
    clip-path: polygon(0 0, calc(100% - var(--peel)) 0, 100% var(--peel), 100% 100%, 0 100%);
  }
  .c-tr .flap-shadow {
    right: 0;
    top: 0;
    filter: drop-shadow(-3px 4px 5px rgba(20, 20, 20, 0.26));
  }
  .c-tr .flap {
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    background: linear-gradient(45deg, #ffffff 30%, #dcded8 100%);
  }

  .c-tl .art {
    clip-path: polygon(var(--peel) 0, 100% 0, 100% 100%, 0 100%, 0 var(--peel));
  }
  .c-tl .flap-shadow {
    left: 0;
    top: 0;
    filter: drop-shadow(3px 4px 5px rgba(20, 20, 20, 0.26));
  }
  .c-tl .flap {
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
    background: linear-gradient(315deg, #ffffff 30%, #dcded8 100%);
  }

  .interactive:hover {
    --peel: 52px;
    transform: translateY(-2px);
  }
  .picked {
    --peel: 60px;
    outline: 2.5px solid var(--cut);
  }
  .picked.interactive:hover {
    --peel: 70px;
  }
  @media (max-width: 760px) {
    .interactive:hover {
      --peel: 30px;
    }
    .picked {
      --peel: 34px;
    }
    .picked.interactive:hover {
      --peel: 38px;
    }
  }
</style>
