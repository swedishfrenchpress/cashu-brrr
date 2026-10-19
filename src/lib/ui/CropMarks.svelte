<script lang="ts">
  interface Props {
    /** distance of the marks from the container edge, in px */
    inset?: number;
    /** draw a registration target at the top centre */
    registration?: boolean;
  }
  let { inset = 24, registration = false }: Props = $props();
</script>

<div class="marks" style="--inset: {inset}px" aria-hidden="true">
  <span class="mark tl"></span>
  <span class="mark tr"></span>
  <span class="mark bl"></span>
  <span class="mark br"></span>
  {#if registration}
    <span class="reg"></span>
  {/if}
</div>

<style>
  .marks {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .mark {
    position: absolute;
    width: 22px;
    height: 22px;
    border: 0 solid var(--ink);
  }
  .tl {
    left: var(--inset);
    top: var(--inset);
    border-right-width: 1px;
    border-bottom-width: 1px;
  }
  .tr {
    right: var(--inset);
    top: var(--inset);
    border-left-width: 1px;
    border-bottom-width: 1px;
  }
  .bl {
    left: var(--inset);
    bottom: var(--inset);
    border-right-width: 1px;
    border-top-width: 1px;
  }
  .br {
    right: var(--inset);
    bottom: var(--inset);
    border-left-width: 1px;
    border-top-width: 1px;
  }
  .reg {
    position: absolute;
    top: calc(var(--inset) + 2px);
    left: 50%;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    border: 1px solid var(--ink);
    border-radius: 50%;
  }
  .reg::before,
  .reg::after {
    content: "";
    position: absolute;
    background: var(--ink);
  }
  .reg::before {
    left: 50%;
    top: -6px;
    bottom: -6px;
    width: 1px;
    margin-left: -0.5px;
  }
  .reg::after {
    top: 50%;
    left: -6px;
    right: -6px;
    height: 1px;
    margin-top: -0.5px;
  }
</style>
