<script lang="ts">
  import { prints, step, selectedTemplate, selectedStyle, selectedDenomination, selectedNumberOfNotes, mint, preparedTokens } from "./stores.svelte";
  import { getAmountForTokenSet } from "./utils";
  import NotesCalc from "./comp/NotesCalc.svelte";

  function reprint(print: any) {
    // Restore the print job settings from the selected print
    const denomination = getAmountForTokenSet(print.tokens[0].proofs);
    const numberOfNotes = print.tokens.length;
    const mintUrl = print.mint;
    
    // Set the stores back to the values from this print job
    selectedDenomination.set(denomination);
    selectedNumberOfNotes.set(numberOfNotes);
    preparedTokens.set(print.tokens);
    
    // Restore the actual template and style from the stored print data
    if (print.template) {
      selectedTemplate.set(print.template);
    } else {
      // Fallback to comic template if no template stored
      selectedTemplate.set({
        id: 'comic',
        name: 'Comic Note',
        type: 'comic'
      });
    }
    
    if (print.style) {
      selectedStyle.set(print.style);
    } else {
      // Fallback to default comic style if no style stored
      selectedStyle.set({
        id: 'comic',
        name: 'Comic Note',
        type: 'comic',
        design: 7
      });
    }
    
    // Navigate to the print tab and set step to print screen
    step.set(6);
    
    // Dispatch a custom event to notify the parent component to switch tabs
    const event = new CustomEvent('switchToPrintTab');
    window.dispatchEvent(event);
  }
</script>

<div class="w-full h-full flex flex-col p-8" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); min-height: 600px;">
  <!-- Header -->
  <div class="text-left mb-8">
    <h2 class="text-3xl font-bold mb-2" style="color: #4E4318;">Print History</h2>
  </div>
  
  {#if $prints.length === 0}
    <div class="flex-1 flex flex-col items-center justify-center text-center">
      <div class="mb-6">
        <!-- Empty state icon -->
        <svg class="w-16 h-16 mx-auto mb-4" style="color: #CD8A18;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <p class="text-lg font-medium mb-2" style="color: #4E4318;">No previous prints found</p>
      <p class="text-sm" style="color: #736F6F;">Your print history will appear here after you create your first print.</p>
    </div>
  {:else}
    <!-- Print History Grid -->
    <div class="flex-1 overflow-y-auto pr-4" style="scrollbar-width: thin; scrollbar-color: #CD8A18 #F0E0B0;">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $prints as print}
          <div class="bg-white rounded-xl p-6 transition-all duration-200 hover:shadow-lg" style="border: 1px solid rgba(228, 105, 10, 0.2); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);">
            <!-- Header with date and reprint button -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <!-- Calendar icon -->
                  <svg class="w-4 h-4" style="color: #CD8A18;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-sm font-medium" style="color: #4E4318;">
                    {new Date(print.ts).toLocaleDateString()}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Clock icon -->
                  <svg class="w-3 h-3" style="color: #CD8A18;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-xs" style="color: #736F6F;">
                    {new Date(print.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <button
                onclick={() => reprint(print)}
                class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                style="background-color: #E4690A; color: white; border: 2px solid #CD8A18;"
              >
                Reprint
              </button>
            </div>
            
            <!-- Print job details -->
            <div class="mb-4">
              <NotesCalc
                selectedDenomination={getAmountForTokenSet(print.tokens[0].proofs)}
                selectedNumberOfNotes={print.tokens.length}
                unit={print.tokens[0].unit}
                isDonate={!!print.donation}
                donationAmount={getAmountForTokenSet(print.donation?.proofs ?? [])}
              />
            </div>
            
            <!-- Template info -->
            {#if print.template}
              <div class="mb-4 p-3 rounded-lg" style="background-color: #FFF9EF; border: 1px solid #EFAF42;">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4" style="color: #CD8A18;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                  </svg>
                  <span class="text-xs font-medium" style="color: #4E4318;">Template</span>
                </div>
                <span class="text-sm" style="color: #736F6F;">
                  {print.template.name}
                </span>
              </div>
            {/if}
            
            <!-- Mint info -->
            <div class="pt-3 border-t" style="border-color: rgba(228, 105, 10, 0.2);">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-4 h-4" style="color: #CD8A18;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <span class="text-xs font-medium" style="color: #4E4318;">Mint</span>
              </div>
              <p class="text-xs break-all" style="color: #736F6F;">
                {print.mint}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
