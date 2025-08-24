<script lang="ts">
  import { selectedTemplate, selectedStyle, selectedDenomination, selectedNumberOfNotes, mint, prints, preparedTokens } from "./stores.svelte";
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import { onMount } from "svelte";
  import { getAmountForTokenSet } from "./utils";

  // Get values from stores
  let numberOfNotes = $derived($selectedNumberOfNotes);
  let denomination = $derived($selectedDenomination);
  
  // Get print data from localStorage (for new tab) or use preparedTokens (for history reprint) or most recent print job
  let printDataFromStorage = $state<{
    tokens: any[];
    denomination: number;
    numberOfNotes: number;
    template: any;
    style: any;
    mintUrl: string;
    timestamp: number;
  } | null>(null);
  
  // Use localStorage data if available (new tab), otherwise use preparedTokens (history reprint), otherwise use most recent print job
  let currentTokens = $derived(printDataFromStorage?.tokens || ($preparedTokens.length > 0 ? $preparedTokens : ($prints[$prints.length - 1]?.tokens || [])));
  let currentPrint = $derived(printDataFromStorage ? null : ($preparedTokens.length > 0 ? null : $prints[$prints.length - 1]));
  
  // When using localStorage data (new tab), use that data
  // When using preparedTokens (from history), use the store values that were set by reprint function
  // Otherwise, use values from the currentPrint
  let currentDenomination = $derived(printDataFromStorage?.denomination || ($preparedTokens.length > 0 ? denomination : (currentPrint ? getAmountForTokenSet(currentPrint.tokens[0]?.proofs || []) : denomination)));
  let currentNumberOfNotes = $derived(printDataFromStorage?.numberOfNotes || ($preparedTokens.length > 0 ? numberOfNotes : (currentPrint?.tokens?.length || numberOfNotes)));
  let currentMintUrl = $derived(printDataFromStorage?.mintUrl || ($preparedTokens.length > 0 ? ($mint?.url || 'Unknown') : (currentPrint?.mint || ($mint?.url || 'Unknown'))));
  let currentTemplate = $derived(printDataFromStorage?.template || ($preparedTokens.length > 0 ? $selectedTemplate : (currentPrint?.template || $selectedTemplate)));
  let currentStyle = $derived(printDataFromStorage?.style || ($preparedTokens.length > 0 ? $selectedStyle : (currentPrint?.style || $selectedStyle)));

  // Auto-print when component loads
  onMount(() => {
    // Try to get print data from localStorage (for new tab scenario)
    try {
      const storedData = localStorage.getItem('currentPrintData');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        // Check if the data is recent (within last 5 minutes)
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          printDataFromStorage = parsed;
          console.log('Using print data from localStorage:', parsed);
        } else {
          // Data is too old, remove it
          localStorage.removeItem('currentPrintData');
        }
      }
    } catch (error) {
      console.error('Error reading print data from localStorage:', error);
    }
    
    console.log('PrintPage loaded with data:', {
      printDataFromStorage,
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
    
    /* For SovereignNote which is HTML-based, not SVG */
    .note-container .note-container {
      width: 800px !important;
      height: 400px !important;
      max-width: none !important;
      max-height: none !important;
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    
    /* Ensure SovereignNote text elements are properly sized for print */
    .note-container .note-container div[style*="font-size"] {
      font-size: 16px !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* Force font size for SovereignNote denomination text specifically */
    .sovereign-denomination {
      font-size: 24px !important;
      font-weight: bold !important;
      color: #8B4513 !important;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
      font-family: 'Porter Sans Inline Block', sans-serif !important;
      visibility: visible !important;
      opacity: 1 !important;
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
    
    /* Force font size for SovereignNote denomination text in print */
    .sovereign-denomination {
      font-size: 32px !important;
      font-weight: bold !important;
      color: #8B4513 !important;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
      font-family: 'Porter Sans Inline Block', sans-serif !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* Additional targeting for the denomination text class in print */
    .denomination-text {
      font-size: 32px !important;
    }
    
    /* Force font size specifically for Sovereign Note denomination in print context */
    .print-page .denomination-text {
      font-size: 32px !important;
    }
    
    /* Target the specific div that contains the denomination text in print */
    .print-page div[class*="sovereign-denomination"] {
      font-size: 32px !important;
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
              design={typeof currentStyle?.design === 'number' ? currentStyle.design : 7}
              denomination={currentDenomination}
              mintUrl={currentMintUrl}
              token={getEncodedTokenV4(token)}
              unit="sat"
            />
          </div>
        {:else if currentTemplate?.type === 'sovereign' || currentStyle?.type === 'sovereign'}
          <div style="display: inline-block;">
            <SovereignNote
              denomination={currentDenomination}
              mintUrl={currentMintUrl}
              token={getEncodedTokenV4(token)}
              unit="sat"
              isPrint={true}
              design={typeof currentStyle?.design === 'string' ? currentStyle.design : 'Soverign_Note.png'}
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
