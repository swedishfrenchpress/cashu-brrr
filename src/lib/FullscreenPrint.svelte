<script lang="ts">
  import HistoryTab from "./HistoryTab.svelte";
  import NoteTemplateSelector from "./NoteTemplateSelector.svelte";
  import MintConnection from "./MintConnection.svelte";
  import NoteCustomizer from "./NoteCustomizer.svelte";
  import ChooseAmounts from "./ChooseAmounts.svelte";
  import PaymentStep from "./PaymentStep.svelte";
  import PrintScreen from "./PrintScreen.svelte";
  import { step, selectedTemplate } from "./stores.svelte";
  import { onMount } from "svelte";

  let activeTab = $state<'print' | 'history'>('print');

  onMount(() => {
    // Listen for the custom event to switch to print tab
    const handleSwitchToPrintTab = () => {
      activeTab = 'print';
    };
    
    window.addEventListener('switchToPrintTab', handleSwitchToPrintTab);
    
    // Cleanup event listener on component destroy
    return () => {
      window.removeEventListener('switchToPrintTab', handleSwitchToPrintTab);
    };
  });

  function goHome() {
    window.location.hash = '';
  }
</script>

<div class="min-h-screen w-full bg-gradient-to-br from-yellow-50 to-orange-50">
  <!-- Header -->
  <div class="w-full bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="w-24"></div> <!-- Spacer for centering -->
      
      <button 
        onclick={goHome}
        class="text-2xl font-bold text-gray-900 font-ojuju hover:text-orange-600 transition-colors cursor-pointer"
      >
        Cashu Brrr
      </button>
      
      <div class="w-24"></div> <!-- Spacer for centering -->
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-6 py-8">
    <!-- Start Over Button -->
    <div class="flex justify-center mb-6">
      <button
        class="px-6 py-2 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
        style="background-color: transparent; color: #CD8A18; border: 2px solid #CD8A18;"
        onclick={() => {
          step.set(1);
          activeTab = 'print';
        }}
      >
        Start Over
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden print-steps">
        <button
          class="px-8 py-4 text-xl font-bold transition-all duration-200 {activeTab === 'print' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-black hover:bg-gray-200'}"
          onclick={() => activeTab = 'print'}
        >
          Print
        </button>
        <button
          class="px-8 py-4 text-xl font-bold transition-all duration-200 {activeTab === 'history' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-black hover:bg-gray-200'}"
          onclick={() => activeTab = 'history'}
        >
          History
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="w-full">
      {#if activeTab === 'print'}
        <div class="bg-white rounded-lg shadow-lg min-h-[700px] print-steps">
          {#if $step === 1}
            <NoteTemplateSelector />
          {:else if $step === 2}
            <NoteCustomizer />
          {:else if $step === 3}
            <MintConnection />
          {:else if $step === 4}
            <ChooseAmounts />
          {:else if $step === 5}
            <PaymentStep />
          {:else if $step === 6}
            <PrintScreen />
          {:else}
            <NoteTemplateSelector />
          {/if}
        </div>
      {:else}
        <div class="bg-white rounded-lg shadow-lg min-h-[700px] print-steps">
          <HistoryTab />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .print-steps {
    font-family: 'Cabinet Grotesk', sans-serif;
  }
</style>
