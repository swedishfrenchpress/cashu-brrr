<script lang="ts">
  import { selectedTemplate, selectedStyle, selectedDenomination, selectedNumberOfNotes, mint, prints, preparedTokens } from "./stores.svelte";
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import { onMount } from "svelte";
  import { getAmountForTokenSet } from "./utils";

  // Get values from stores
  let numberOfNotes = $derived($selectedNumberOfNotes);
  let denomination = $derived($selectedDenomination);
  
  // Get the most recent print job data
  let currentPrint = $derived($prints[$prints.length - 1]);
  let currentTokens = $derived(currentPrint?.tokens || []);
  let currentDenomination = $derived(currentPrint ? getAmountForTokenSet(currentPrint.tokens[0]?.proofs || []) : denomination);
  let currentNumberOfNotes = $derived(currentPrint?.tokens?.length || numberOfNotes);
  let currentMintUrl = $derived(currentPrint?.mint || ($mint?.url || 'Unknown'));
  let currentTemplate = $derived(currentPrint?.template || $selectedTemplate);
  let currentStyle = $derived(currentPrint?.style || $selectedStyle);

  // Auto-print when component loads
  onMount(() => {
    console.log('PrintPage loaded with data:', {
      currentPrint,
      currentTokens: currentTokens.length,
      currentTemplate,
      currentStyle,
      currentDenomination,
      currentNumberOfNotes,
      currentMintUrl
    });
    
    setTimeout(() => {
      window.print();
    }, 1000);
  });
</script>

<!-- Print-only styles -->
<style>
  @media print {
    body {
      margin: 0;
      padding: 0;
      background: white;
    }
    .note-container {
      margin: 2px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      page-break-inside: avoid;
    }
    .note-container:last-child {
      page-break-after: avoid;
    }
    /* Ensure notes are properly sized for printing */
    .note-container svg {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
  }
  
  /* Screen styles */
  body {
    font-family: 'Cabinet Grotesk', Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: white;
  }
  
  .note-container {
    margin: 2px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Ensure notes are properly sized for screen preview */
  .note-container svg {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
  
  .print-header {
    text-align: center;
    margin-bottom: 10px;
    color: #4E4318;
  }
  
  .print-header h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
  
  .print-header p {
    font-size: 16px;
    margin: 10px 0 0 0;
    opacity: 0.7;
  }
</style>

<!-- Print page content -->
<div class="print-page">
  <!-- Header for print page -->
  <div class="print-header">
    <h1>Ecash Notes</h1>
    <p>{currentNumberOfNotes} notes × {currentDenomination} sats = {currentNumberOfNotes * currentDenomination} sats total</p>
    <p>Mint: {currentMintUrl}</p>
  </div>

  <!-- Individual notes for printing -->
  {#each Array.from({ length: currentNumberOfNotes }, (_, i) => i) as noteIndex}
    <div class="note-container">
      <div class="scale-[0.8] transform">
        {#if currentTokens[noteIndex]}
          <!-- Try to determine template type from available data -->
          {#if currentTemplate?.type === 'comic' || currentStyle?.type === 'comic'}
            <ComicNote
              design={currentStyle?.design || 7}
              denomination={currentDenomination}
              mintUrl={currentMintUrl}
              token={getEncodedTokenV4(currentTokens[noteIndex])}
              unit="sat"
            />
          {:else if currentTemplate?.type === 'custom' || currentStyle?.type === 'custom'}
            <CustomNote
              denomination={currentDenomination}
              mintUrl={currentMintUrl}
              token={getEncodedTokenV4(currentTokens[noteIndex])}
              colorCode={currentStyle?.colorCode || '#E4690A'}
              cornerBrandLogoURL=""
              brandLogoURL=""
              unit="sat"
            />
          {:else}
            <!-- Default to CustomNote if we can't determine the type -->
            <CustomNote
              denomination={currentDenomination}
              mintUrl={currentMintUrl}
              token={getEncodedTokenV4(currentTokens[noteIndex])}
              colorCode="#E4690A"
              cornerBrandLogoURL=""
              brandLogoURL=""
              unit="sat"
            />
          {/if}
        {:else}
          <div class="w-64 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
            <span class="text-gray-500 font-semibold">Loading token...</span>
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
