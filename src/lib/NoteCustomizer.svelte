<script lang="ts">
  import { step, selectedTemplate, mint } from "./stores.svelte";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import { toast } from "svelte-sonner";

  let amountPerNote = $state(10);
  let numberOfNotes = $state(1);
  let totalAmount = $derived(amountPerNote * numberOfNotes);

  function goBack() {
    step.set(2);
  }

  function proceedToNext() {
    if (amountPerNote <= 0) {
      toast.error("Amount per note must be greater than 0");
      return;
    }
    if (numberOfNotes <= 0) {
      toast.error("Number of notes must be greater than 0");
      return;
    }
    if (numberOfNotes > 100) {
      toast.error("Maximum 100 notes allowed");
      return;
    }
    step.set(3);
  }

  function handleAmountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (!isNaN(value) && value >= 0) {
      amountPerNote = value;
    } else if (target.value === '') {
      amountPerNote = 0;
    }
  }

  function handleNotesChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (!isNaN(value) && value >= 0) {
      numberOfNotes = value;
    }
  }
</script>

<div class="w-full h-full flex flex-col p-8 overflow-hidden" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-center mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2" style="color: #4E4318;">Step 2: Choose amounts</h2>
  </div>

    <!-- Main Content -->
  <div class="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
    <div class="p-6 mb-6">
      <!-- Input Fields Section -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Amount per Note -->
        <div class="relative">
          <label for="amountPerNote" class="block text-sm font-medium mb-2" style="color: #4E4318;">
            Amount per note
          </label>
          <input
            id="amountPerNote"
            type="text"
            value={amountPerNote}
            oninput={handleAmountChange}
            class="w-full px-4 py-3 pr-12 rounded-lg transition-colors text-left"
            style="background-color: #FFF9EF; border: 1px solid #EFAF42; color: #5C4214;"
            placeholder="Enter amount"
          />
          <span class="absolute right-3 bottom-2 text-sm" style="color: #5C4214;">sats</span>
        </div>

        <!-- Number of Notes -->
        <div class="relative">
          <label for="numberOfNotes" class="block text-sm font-medium mb-2" style="color: #4E4318;">
            Number of notes to be printed
          </label>
          <input
            id="numberOfNotes"
            type="number"
            min="1"
            max="100"
            value={numberOfNotes}
            oninput={handleNotesChange}
            class="w-full px-4 py-3 pr-12 rounded-lg transition-colors text-left"
            style="background-color: #FFF9EF; border: 1px solid #EFAF42; color: #5C4214;"
            placeholder="Enter number of notes"
          />
          <span class="absolute right-3 bottom-2 text-sm" style="color: #5C4214;">notes</span>
        </div>
      </div>

      <!-- Total Calculation -->
      <div class="mb-8">
        <p class="text-lg" style="color: #4E4318;">
          Total: {amountPerNote} sats x {numberOfNotes} note{numberOfNotes !== 1 ? 's' : ''} = {totalAmount} sats
        </p>
      </div>

      <!-- Note Preview Section -->
      <div class="flex flex-col items-center w-full">
        <div class="relative bg-gray-200 rounded-lg p-8 w-full" style="background-color: #EFEDEA;">
          <span class="absolute top-4 left-4 text-sm font-medium" style="color: #4E4318;">Preview</span>
          <div class="scale-105 transform mt-6 grid place-items-center w-full">
              {#if $selectedTemplate}
                {#if $selectedTemplate.type === 'comic' && $selectedTemplate.design}
                  <ComicNote
                    design={$selectedTemplate.design}
                    denomination={amountPerNote}
                    mintUrl={$mint?.url || "example.mint.com"}
                    token="example-token"
                    unit="sat"
                  />
                {:else if $selectedTemplate.type === 'custom'}
                  <CustomNote
                    denomination={amountPerNote}
                    mintUrl={$mint?.url || "example.mint.com"}
                    token="example-token"
                    colorCode="#E4690A"
                    cornerBrandLogoURL=""
                    brandLogoURL=""
                    unit="sat"
                  />
                {/if}
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
  <div class="flex justify-center mb-6">
    <div class="flex items-center gap-4">
      <!-- Step 1: Connect Mint (Completed) -->
      <div class="w-6 h-6 rounded-full" style="background-color: #2B9707;"></div>
      
      <!-- Connector Line -->
      <div class="w-8 h-0.5" style="background-color: #FFD700;"></div>
      
      <!-- Step 2: Customize (Active/Current) -->
      <div class="w-6 h-6 rounded-full flex items-center justify-center" style="background-color: #5C4F21;">
        <div class="w-4 h-4 rounded-full" style="background-color: #8B7B2F;"></div>
      </div>
      
      <!-- Connector Line -->
      <div class="w-8 h-0.5" style="background-color: #FFD700;"></div>
      
      <!-- Step 3: Generate (Inactive) -->
      <div class="w-6 h-6 rounded-full" style="background-color: #F0E0B0;"></div>
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
      style="background-color: {amountPerNote > 0 && numberOfNotes > 0 && numberOfNotes <= 100 ? '#E4690A' : '#9CA3AF'}; color: white; border: 2px solid {amountPerNote > 0 && numberOfNotes > 0 && numberOfNotes <= 100 ? '#A94705' : '#6B7280'};"
      onclick={proceedToNext}
      disabled={amountPerNote <= 0 || numberOfNotes <= 0 || numberOfNotes > 100}
    >
      Next →
    </button>
  </div>
</div>
