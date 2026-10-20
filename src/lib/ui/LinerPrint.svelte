<script lang="ts">
  // The backing liner's own print: a faint brand repeat, the way a sticker sheet's release paper is printed.
  const lines = Array.from({ length: 28 });
  const run = "CASHU BRRR\u2003\u2003".repeat(14);
</script>

<div class="liner-print" aria-hidden="true">
  <div class="repeat">
    {#each lines as _, i}
      <p style="margin-left: {(i % 2) * -6}em">{run}</p>
    {/each}
  </div>
</div>

<style>
  .liner-print {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }
  .repeat {
    position: absolute;
    left: -30vw;
    top: -40vh;
    width: 180vw;
    transform: rotate(-12deg);
    transform-origin: center;
  }
  p {
    font-family: var(--font-ui);
    font-weight: 700;
    font-size: 15px;
    line-height: 52px;
    letter-spacing: 0.02em;
    white-space: nowrap;
    color: var(--repeat);
    opacity: 0.22;
  }
</style>
