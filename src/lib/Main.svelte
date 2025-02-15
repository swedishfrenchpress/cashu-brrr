<script lang="ts">
  import { Toaster } from "svelte-sonner";
  import Step1 from "./Step1.svelte";
  import Step2 from "./Step2.svelte";
  import Step3 from "./Step3.svelte";
  import Step4 from "./Step4.svelte";
  import { step } from "./stores.svelte";
  import { Bitcoin, Code, Copy, Heart, Zap } from "lucide-svelte";
  import { copyTextToClipboard } from "./utils";
  import DonateCashu from "./DonateCashu.svelte";
  let showDonate = $state(false);
</script>

<Toaster richColors position="top-right" />

<!-- Updated background with more subtle gradient -->
<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
  <div class="mx-auto max-w-4xl">
    <!-- Enhanced Header Section -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-slate-900 mb-3">
        Money printer go brrrrr
      </h1>
      <p class="text-slate-600 text-lg">
        Create and manage your digital cash notes
      </p>
    </div>

    <!-- Main Card with enhanced shadows and borders -->
    <div class="rounded-2xl bg-white shadow-[0_0_50px_0_rgba(0,0,0,0.1)] 
                border border-slate-200/60 backdrop-blur-sm">
      <!-- Progress Steps - Simplified and refined -->
      <div class="px-8 pt-8 pb-6">
        <div class="relative">
          <!-- Progress Bar -->
          <div class="absolute top-[15px] left-0 w-full h-[2px]">
            <!-- Background Line -->
            <div class="absolute w-full h-full bg-slate-200"></div>
            <!-- Active Line -->
            <div 
              class="absolute h-full bg-primary transition-all duration-300"
              style="width: {(($step - 1) / 3) * 100}%"
            ></div>
          </div>

          <!-- Steps -->
          <div class="relative flex justify-between">
            {#each ['Connect', 'Configure', 'Payment', 'Print'] as stepName, index}
              <div class="flex flex-col items-center gap-2">
                <div 
                  class="w-8 h-8 rounded-full border-2 flex items-center justify-center
                         transition-all duration-300 text-sm
                         {index + 1 <= $step ? 
                           'border-primary bg-primary text-white' : 
                           'border-slate-200 bg-white text-slate-400'}"
                >
                  {index + 1}
                </div>
                <span 
                  class="text-sm transition-colors duration-300
                         {index + 1 <= $step ? 'text-primary' : 'text-slate-400'}"
                >
                  {stepName}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Main Content with refined spacing -->
      <div class="px-8 py-10">
        <div class="min-h-[400px] relative">
          {#if $step === 1}
            <Step1 />
          {:else if $step === 2}
            <Step2 />
          {:else if $step === 3}
            <Step3 />
          {:else}
            <Step4 />
          {/if}
        </div>
      </div>

      <!-- Enhanced Footer -->
      <div class="p-8 bg-slate-50/80 border-t border-slate-200/80 
                  rounded-b-2xl backdrop-blur-sm">
        <div class="flex justify-between items-center">
          <div class="text-sm text-slate-600 font-medium">
            Secure, private digital cash notes
          </div>
          <div class="flex gap-4">
            <button 
              class="inline-flex items-center justify-center h-10 px-5 font-medium tracking-wide
                     transition-all duration-200 rounded-lg
                     {showDonate ? 
                       'text-white bg-primary hover:bg-primary/90' : 
                       'text-slate-700 bg-slate-100 hover:bg-slate-200'}
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
              onclick={() => showDonate = !showDonate}
            >
              <Heart class="w-4 h-4 mr-2" />
              {showDonate ? 'Hide' : 'Donate'}
            </button>
            
            <a 
              href="https://github.com/gandlafbtc/cashu-brrr" 
              class="inline-flex items-center justify-center h-10 px-5 font-medium tracking-wide
                     text-slate-700 transition-all duration-200 bg-slate-100 rounded-lg
                     hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code class="w-4 h-4 mr-2" />
              Code
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Donate Section with matching styling -->
    {#if showDonate}
      <div class="mt-6 rounded-2xl bg-white shadow-[0_0_50px_0_rgba(0,0,0,0.1)] 
                  border border-slate-200/60 backdrop-blur-sm p-8
                  transition-all duration-300 ease-in-out">
        <DonateCashu />
      </div>
    {/if}

    <!-- Sponsor Section -->
    <div class="mt-8 text-center">
      <a 
        href="https://geyser.fund/project/brrr/rewards/view/5486"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-3 px-4 py-2 rounded-full 
               bg-white/80 border border-slate-200/60 
               shadow-[0_2px_10px_0_rgba(0,0,0,0.06)]
               hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.1)]
               transition-all duration-300 group"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden">
          <img 
            src="/i.jpeg" 
            alt="Sponsor logo"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900">
          Become a sponsor
        </span>
      </a>
    </div>
  </div>
</div>

<style>
  /* Enhanced focus states */
  :global(.btn:focus-visible) {
    outline: 2px solid theme(colors.primary);
    outline-offset: 2px;
  }
  
  /* Smooth transitions */
  :global(.btn) {
    @apply transition-all duration-300 ease-in-out;
  }
  
  /* Enhanced step styling */
  :global(.step:after) {
    @apply transition-all duration-300 ease-in-out;
  }
  
  :global(.step-primary:after) {
    @apply shadow-md shadow-primary/30;
  }
</style>
