<script lang="ts">
  import PrintTab from "./PrintTab.svelte";
  import HistoryTab from "./HistoryTab.svelte";
  import NoteTemplateSelector from "./NoteTemplateSelector.svelte";
  import PostItCard from "./PostItCard.svelte";
  import { step } from "./stores.svelte";

  let activeTab = $state<'print' | 'history'>('print');
</script>

<div class="min-h-screen w-full px-32" style="background-color: #FDEB91;">
  <div class="w-full py-8 mb-6">
    <p class="text-center font-sedgwick text-green-800 text-3xl mb-2">
      Brrr is a tool.to.println(“Ecash”)
    </p>
    <!-- Headline -->
    <h1 class="text-center font-ojuju font-bold text-9xl text-gray-900 z-30 relative">
      Print your own Ecash notes
    </h1>

    <!-- Add margin-top to push the printer/notes down -->
    <div class="flex justify-center w-full mt-32">
      <div class="relative" style="width: 36rem; height: 600px;">
        <!-- Left notes (move further left with negative left values) -->
        <img src="/Ecash_Note_template.svg" class="absolute left-[-6rem] top-24 w-40 rotate-[-15deg]" />
        <img src="/Ecash_Note_template.svg" class="absolute left-[-8rem] top-48 w-40 rotate-[10deg]" />
        <img src="/Ecash_Note_template.svg" class="absolute left-[-5rem] top-80 w-40 rotate-[-8deg]" />
        <img src="/Ecash_Note_template.svg" class="absolute left-0 top-96 w-40 rotate-[5deg]" />

        <!-- Printer -->
        <img src="/printer.png" class="absolute left-1/2 top-1/2 z-20 w-[36rem] -translate-x-1/2 -translate-y-1/2" />

        <!-- Right notes (move further right with negative right values) -->
        <img src="/Ecash_Note_template.svg" class="absolute right-[-6rem] top-24 w-40 rotate-[12deg]" />
        <img src="/Ecash_Note_template.svg" class="absolute right-[-8rem] top-48 w-40 rotate-[-10deg]" />
        <img src="/Ecash_Note_template.svg" class="absolute right-[-5rem] top-80 w-40 rotate-[7deg]" />
        <img src="/Ecash_Note_template.svg" class="absolute right-0 top-96 w-40 rotate-[-6deg]" />
      </div>
    </div>
    <h2 class="text-center font-manrope font-bold text-4xl text-gray-900 mt-12 mb-4">
      FAQs
    </h2>
    <div class="flex flex-col md:flex-row justify-center items-center gap-8 mt-8">
      <PostItCard title="What is an ecash note?" body="A bitcoin ecash note is a printable slip with a QR code that holds a claimable amount of bitcoin-backed ecash. You can hand it to someone like cash, and they can scan it to redeem the funds. Once claimed, the note is no longer valid and can’t be reused." rotation="rotate-[15deg]" />
      <PostItCard title="What happens if I lose it?" body="If the QR code on the note is never scanned and claimed, the ecash stays unredeemed. Only the person holding the physical note can access the funds, so treat it like real cash — if it’s lost, it can’t be recovered.." rotation="-rotate-[15deg]" />
      <PostItCard title="How do I print?" body="Just choose a design, select how many notes you want to print and for what amounts, then pay using lightning or ecash. The app will generate a printable sheet you can cut and hand out." rotation="rotate-[15deg]" />
    </div>
  </div>

  <!-- Tabbed Navigation -->
  <div class="w-full max-w-4xl mx-auto">
    <!-- Tab Headers -->
    <div class="flex bg-white rounded-t-lg overflow-hidden shadow-sm">
      <button
        class="flex-1 py-4 px-6 text-lg font-semibold transition-all duration-200 {activeTab === 'print' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
        onclick={() => activeTab = 'print'}
      >
        Print
      </button>
      <button
        class="flex-1 py-4 px-6 text-lg font-semibold transition-all duration-200 {activeTab === 'history' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
        onclick={() => activeTab = 'history'}
      >
        History
      </button>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-b-lg shadow-lg min-h-[500px]">
      {#if activeTab === 'print'}
        {#if $step === 1}
          <NoteTemplateSelector />
        {:else}
          <PrintTab />
        {/if}
      {:else}
        <HistoryTab />
      {/if}
    </div>
  </div>
  
  <!-- Bottom spacing -->
  <div class="h-16"></div>
</div>