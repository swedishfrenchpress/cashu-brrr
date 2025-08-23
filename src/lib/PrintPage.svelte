<script lang="ts">
  import { selectedTemplate, selectedStyle, selectedDenomination, selectedNumberOfNotes, mint, prints, preparedTokens } from "./stores.svelte";
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import { onMount } from "svelte";

  // Get values from stores
  let numberOfNotes = $derived($selectedNumberOfNotes);
  let denomination = $derived($selectedDenomination);
  
  // Use preparedTokens for reprint functionality, fallback to most recent print
  let currentTokens = $derived($preparedTokens.length > 0 ? $preparedTokens : ($prints[$prints.length - 1]?.tokens || []));

  // Auto-print when component loads
  onMount(() => {
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
      page-break-after: always;
      margin: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
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
    margin: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
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
    margin-bottom: 40px;
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
    <p>{numberOfNotes} notes × {denomination} sats = {numberOfNotes * denomination} sats total</p>
    <p>Mint: {$mint?.url || 'Unknown'}</p>
  </div>

  <!-- Individual notes for printing -->
  {#each Array.from({ length: numberOfNotes }, (_, i) => i) as noteIndex}
    <div class="note-container">
      <div class="scale-100 transform">
        {#if currentTokens[noteIndex]}
          {#if $selectedTemplate?.type === 'comic'}
            <ComicNote
              design={$selectedStyle?.design || 7}
              denomination={denomination}
              mintUrl={$mint?.url || "example.mint.com"}
              token={getEncodedTokenV4(currentTokens[noteIndex])}
              unit="sat"
            />
          {:else if $selectedTemplate?.type === 'custom'}
            <CustomNote
              denomination={denomination}
              mintUrl={$mint?.url || "example.mint.com"}
              token={getEncodedTokenV4(currentTokens[noteIndex])}
              colorCode={$selectedStyle?.colorCode || '#E4690A'}
              cornerBrandLogoURL=""
              brandLogoURL=""
              unit="sat"
            />
          {:else}
            <div class="w-64 h-40 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
              <span class="text-amber-600 font-semibold">Note {noteIndex + 1}</span>
            </div>
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
