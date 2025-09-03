<script lang="ts">
    import { getDecodedToken, getEncodedTokenV4 } from "@cashu/cashu-ts";
  import "./app.css";
    import ComicNote from "./lib/ComicNote.svelte";
    import SovereignNote from "./lib/SovereignNote.svelte";
    import ChaumNote from "./lib/ChaumNote.svelte";

  import Main from "./lib/Main.svelte";
  import PrintPage from "./lib/PrintPage.svelte";
  import FullscreenPrint from "./lib/FullscreenPrint.svelte";
    import { getAmountForTokenSet } from "./lib/utils";
  
  // Check if we're in print mode
  const isPrintMode = $derived(window.location.search.includes('print=true'));
  
  // Check if we're in fullscreen print mode
  let currentHash = $state(window.location.hash);
  const isFullscreenPrintMode = $derived(currentHash === '#print');
  
  // Debug logging
  console.log('Current hash:', currentHash);
  console.log('isFullscreenPrintMode:', isFullscreenPrintMode);
  
  // Listen for hash changes
  $effect(() => {
    const handleHashChange = () => {
      currentHash = window.location.hash;
      console.log('Hash changed to:', currentHash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });
  
  // Only process token URLs if we're not in fullscreen print mode
  const urlParams = $derived(isFullscreenPrintMode ? [] : currentHash.slice(1).split('/'));
  const token = $derived.by(()=>{
    if (isFullscreenPrintMode) return undefined;
    const tokenString = urlParams[0];
    try {
      return getDecodedToken(tokenString??"")
    } catch (error) {
      return undefined
    } })
  const template = $derived.by(()=>{
    if (isFullscreenPrintMode) return 5;
    const param = urlParams[1];
    if (!param) return 5;
    const design = Number.parseInt(param)
    const d = isNaN(design) ? 5 : design
    return d
  })
  
</script>


{#if isPrintMode}
  <PrintPage />
{:else if isFullscreenPrintMode}
  <FullscreenPrint />
{:else if token}
<div>
{#if template === 6}
  <SovereignNote
    denomination={getAmountForTokenSet(token.proofs)}
    mintUrl={token.mint}
    token={getEncodedTokenV4(token)}
    unit={token.unit??"sat"}
  />
{:else if template === 7}
  <ChaumNote
    denomination={getAmountForTokenSet(token.proofs)}
    mintUrl={token.mint}
    token={getEncodedTokenV4(token)}
    unit={token.unit??"sat"}
  />
{:else}
  <ComicNote
    design={template}
    denomination={getAmountForTokenSet(token.proofs)}
    mintUrl={token.mint}
    token={getEncodedTokenV4(token)}
    unit={token.unit??"sat"}
    isPrint={false}
  />
{/if}
</div>
{:else}
  
<Main></Main>
{/if}
