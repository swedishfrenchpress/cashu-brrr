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
    
    // Debug token data
    console.log('First token:', currentTokens[0]);
    console.log('Template type:', currentTemplate?.type);
    console.log('Style type:', currentStyle?.type);
    
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
    
    /* Simple flexbox layout for multiple notes per page */
    .notes-container {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 20px !important;
      padding: 20px !important;
      justify-content: center !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    .note-container {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      page-break-inside: avoid !important;
      min-height: 200px !important;
      border: 1px solid #ccc !important; /* Debug border to see containers */
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    .note-container:last-child {
      page-break-after: avoid !important;
    }
    
    /* Ensure notes are visible and properly sized */
    .note-container svg {
      width: 400px !important; /* Slightly smaller than original for better fit */
      height: auto !important;
      max-height: 200px !important;
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    
    /* For CustomNote which has different dimensions */
    .note-container svg[viewBox="0 0 534 279"] {
      width: 500px !important;
      max-height: 250px !important;
    }
    
    /* Ensure all SVG elements are visible */
    .note-container svg * {
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* Ensure note components themselves are visible */
    .note-container > * {
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    
    /* Ensure proper page breaks */
    .page-break {
      page-break-before: always !important;
    }
    
    /* Header styling for print */
    .print-header {
      text-align: center !important;
      margin-bottom: 20px !important;
      color: #4E4318 !important;
      page-break-after: avoid !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  }
  
  /* Screen styles */
  body {
    font-family: 'Cabinet Grotesk', Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: white;
  }
  
  /* Simple flexbox layout for screen preview */
  .notes-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;
  }
  
  .note-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    border: 1px solid #ccc; /* Debug border to see containers */
  }
  
  /* Ensure notes are visible and properly sized on screen */
  .note-container svg {
    width: 400px; /* Slightly smaller than original for better fit */
    height: auto;
    max-height: 200px;
  }
  
  /* For CustomNote which has different dimensions */
  .note-container svg[viewBox="0 0 534 279"] {
    width: 500px;
    max-height: 250px;
  }
  
  .print-header {
    text-align: center;
    margin-bottom: 20px;
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

  <!-- Simple notes layout -->
  <div style="background: white; padding: 20px;">
    <!-- Render notes directly -->
    {#each currentTokens as token, index}
      <div style="margin: 20px 0; text-align: center;">
        {#if currentTemplate?.type === 'comic' || currentStyle?.type === 'comic'}
          <div style="display: inline-block; width: 420px; height: 214px;">
            <ComicNote
              design={currentStyle?.design || 7}
              denomination={currentDenomination}
              mintUrl={currentMintUrl}
              token={getEncodedTokenV4(token)}
              unit="sat"
            />
          </div>
        {:else}
          <div style="display: inline-block; width: 534px; height: 279px;">
            <CustomNote
              denomination={currentDenomination}
              mintUrl={currentMintUrl}
              token={getEncodedTokenV4(token)}
              colorCode={currentStyle?.colorCode || '#E4690A'}
              cornerBrandLogoURL=""
              brandLogoURL=""
              unit="sat"
            />
          </div>
        {/if}
      </div>
      
      <!-- Force page break after every 4th note -->
      {#if (index + 1) % 4 === 0 && index < currentTokens.length - 1}
        <div style="page-break-after: always;"></div>
      {/if}
    {/each}
  </div>
</div>
