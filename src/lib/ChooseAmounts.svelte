<script lang="ts">
  import { step, selectedTemplate, selectedStyle, selectedDenomination, selectedNumberOfNotes } from "./stores.svelte";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import ChaumNote from "./ChaumNote.svelte";
  import MeadowsNote from "./MeadowsNote.svelte";
  import SFNote from "./SFNote.svelte";

  let amountPerNote = $state('');
  let numberOfNotes = $state('');

  function goBack() {
    step.set(3); // Go back to mint connection (Step 1)
  }

  function proceedToNext() {
    // Store the selected amounts
    selectedDenomination.set(parseFloat(amountPerNote) || 0);
    selectedNumberOfNotes.set(parseInt(numberOfNotes) || 0);
    
    step.set(5); // Go to payment step
  }

  // Calculate total
  let totalAmount = $derived((parseFloat(amountPerNote) || 0) * (parseInt(numberOfNotes) || 0));
</script>

<div class="w-full h-full flex flex-col p-8 overflow-hidden" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-left mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2" style="color: #4E4318;">Step 2: Choose amounts</h2>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col">
    <!-- Input Fields Section -->
    <div class="mb-8">
      <div class="grid grid-cols-2 gap-6">
        <!-- Amount per note input -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: #4E4318;">Amount per note</label>
          <div class="relative">
            <input
              type="text"
              bind:value={amountPerNote}
              class="w-full px-4 py-3 pr-16 rounded-lg text-lg font-medium"
              style="background-color: #FFF9EF; border: 1px solid #EFAF42; color: #5C4214;"
              placeholder="Enter amount"
            />
            <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium" style="color: #4E4318;">sats</span>
          </div>
        </div>

        <!-- Number of notes input -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: #4E4318;">Number of notes to be printed</label>
          <div class="relative">
            <input
              type="number"
              bind:value={numberOfNotes}
              min="1"
              class="w-full px-4 py-3 pr-16 rounded-lg text-lg font-medium"
              style="background-color: #FFF9EF; border: 1px solid #EFAF42; color: #5C4214;"
              placeholder="Enter number"
            />
            <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium" style="color: #4E4318;">notes</span>
          </div>
        </div>
      </div>

      <!-- Total calculation -->
      {#if amountPerNote && numberOfNotes}
        <div class="mt-6">
          <span class="text-lg font-medium" style="color: #4E4318;">
            Total: {amountPerNote} sats x {numberOfNotes} note = {totalAmount} sats
          </span>
        </div>
      {/if}
    </div>

    <!-- Preview Section -->
    <div class="flex-1">
      <div class="bg-gray-100 rounded-lg p-12" style="background-color: #EFEDEA;">
        <div class="text-sm font-medium mb-4" style="color: #4E4318; margin-top: -8px; margin-left: -8px;">Preview</div>
        <div class="flex justify-center">
          <div class="scale-150 transform">
            {#if $selectedTemplate?.type === 'comic'}
              <ComicNote
                design={typeof $selectedStyle?.design === 'number' ? $selectedStyle.design : 7}
                denomination={parseFloat(amountPerNote) || 0}
                mintUrl="example.mint.com"
                token="example-token"
                unit="sat"
                isPrint={false}
              />
            {:else if $selectedTemplate?.type === 'custom'}
              <CustomNote
                denomination={parseFloat(amountPerNote) || 0}
                mintUrl="example.mint.com"
                token="example-token"
                colorCode={$selectedStyle?.colorCode || '#E4690A'}
                cornerBrandLogoURL=""
                brandLogoURL=""
                unit="sat"
              />
            {:else if $selectedTemplate?.type === 'sovereign'}
              <SovereignNote
                denomination={parseFloat(amountPerNote) || 0}
                mintUrl="example.mint.com"
                token="example-token"
                unit="sat"
                design={typeof $selectedStyle?.design === 'string' ? $selectedStyle.design : 'Soverign_Note.png'}
              />
            {:else if $selectedTemplate?.type === 'chaum'}
              <ChaumNote
                denomination={parseFloat(amountPerNote) || 0}
                mintUrl="example.mint.com"
                token="example-token"
                unit="sat"
              />
            {:else if $selectedTemplate?.type === 'meadows'}
              <MeadowsNote
                denomination={parseFloat(amountPerNote) || 0}
                mintUrl="example.mint.com"
                token="example-token"
                unit="sat"
              />
            {:else if $selectedTemplate?.type === 'sf'}
              <SFNote
                denomination={parseFloat(amountPerNote) || 0}
                mintUrl="example.mint.com"
                token="example-token"
                unit="sat"
              />
            {:else}
              <div class="w-64 h-40 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                <span class="text-amber-600 font-semibold">No template selected</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

           <!-- Progress Indicator -->
         <div class="flex justify-center mb-8 mt-12">
           <div class="flex items-center">
             <!-- Step 1: Connect Mint (Completed) -->
             <div class="flex items-center">
               <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style="background: linear-gradient(135deg, #2B9707, #1F7A05);">
                 <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                 </svg>
               </div>
               <div class="w-12 h-0.5 ml-2" style="background: linear-gradient(to right, #2B9707, #E4690A);"></div>
             </div>
             
             <!-- Step 2: Choose Amounts (Active/Current) -->
             <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-md" style="background: linear-gradient(135deg, #E4690A, #CD8A18); border: 2px solid #A94705;">
               <span class="text-white font-bold text-sm">2</span>
             </div>
             <div class="w-12 h-0.5 ml-2" style="background: linear-gradient(to right, #E4690A, #F0E0B0);"></div>
             
             <!-- Step 3: Payment (Inactive) -->
             <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style="background: linear-gradient(135deg, #F0E0B0, #E5D5A0);">
               <span class="text-gray-500 font-bold text-sm">3</span>
             </div>
           </div>
         </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center mt-8 px-6 pb-6">
    <button 
      class="btn px-6 py-2 transition-all duration-200 hover:scale-105"
      style="color: #CD8A18; background: transparent; border: none;"
      onclick={goBack}
    >
      ← Back
    </button>
    
               <button 
             class="btn px-6 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
             style="background-color: #E4690A; color: white; border: 2px solid #A94705;"
             onclick={proceedToNext}
             disabled={!amountPerNote || !numberOfNotes}
           >
             Next →
           </button>
  </div>
</div>
