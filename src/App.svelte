<script lang="ts">
  import { getDecodedToken } from "@cashu/cashu-ts";
  import Main from "./lib/Main.svelte";
  import PrintJob from "./lib/PrintJob.svelte";
  import History from "./lib/History.svelte";
  import PrintPage from "./lib/PrintPage.svelte";
  import NoteView from "./lib/NoteView.svelte";
  import LinerPrint from "./lib/ui/LinerPrint.svelte";
  import { getAmountForTokenSet } from "./lib/utils";
  import { encodeToken } from "./lib/job";

  // ?print=true is the print tab; everything else routes on the hash
  const isPrintMode = window.location.search.includes("print=true");

  let currentHash = $state(window.location.hash);
  $effect(() => {
    const onHashChange = () => {
      currentHash = window.location.hash;
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });

  const route = $derived(currentHash === "#print" ? "print" : currentHash === "#history" ? "history" : "other");

  // A shared note link: #<token>/<template>
  const urlParams = $derived(currentHash.slice(1).split("/"));
  const token = $derived.by(() => {
    if (route !== "other" || !urlParams[0]) return undefined;
    try {
      return getDecodedToken(urlParams[0]);
    } catch {
      return undefined;
    }
  });
  const template = $derived.by(() => {
    const design = Number.parseInt(urlParams[1] ?? "");
    return Number.isNaN(design) ? 5 : design;
  });
</script>

{#if isPrintMode}
  <PrintPage />
{:else}
  <LinerPrint />
  <div class="app">
    {#if route === "print"}
      <PrintJob />
    {:else if route === "history"}
      <History />
    {:else if token}
      <NoteView
        denomination={getAmountForTokenSet(token.proofs)}
        mintUrl={token.mint}
        token={encodeToken(token)}
        unit={token.unit ?? "sat"}
        {template}
      />
    {:else}
      <Main />
    {/if}
  </div>
{/if}

<style>
  .app {
    position: relative;
    z-index: 1;
  }
</style>
