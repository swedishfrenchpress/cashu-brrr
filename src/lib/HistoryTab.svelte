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

<div class="w-full p-6">
  <h2 class="text-2xl font-bold mb-6">Print History</h2>
  
  {#if $prints.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500 text-lg">No previous prints found</p>
      <p class="text-gray-400">Your print history will appear here after you create your first print.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each $prints as print}
        <div class="bg-white rounded-lg shadow-md p-4 border">
          <div class="flex justify-between items-start mb-3">
            <span class="text-sm text-gray-500">
              {new Date(print.ts).toLocaleDateString()}
            </span>
            <button
              class="btn btn-sm btn-primary"
              onclick={() => reprint(print)}
            >
              Reprint
            </button>
          </div>
          
          <NotesCalc
            selectedDenomination={getAmountForTokenSet(print.tokens[0].proofs)}
            selectedNumberOfNotes={print.tokens.length}
            unit={print.tokens[0].unit}
            isDonate={!!print.donation}
            donationAmount={getAmountForTokenSet(print.donation?.proofs ?? [])}
          />
          
          <div class="mt-3 pt-3 border-t">
            <p class="text-xs text-gray-600 break-all">
              Mint: {print.mint}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
