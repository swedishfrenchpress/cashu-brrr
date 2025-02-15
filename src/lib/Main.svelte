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

<div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 px-4 py-8">
  <div class="mx-auto max-w-4xl">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-neutral mb-2">
        Money printer go brrrrr
      </h1>
      <p class="text-neutral-600">Create and manage your digital cash notes</p>
    </div>

    <!-- Main Card -->
    <div class="rounded-xl bg-base-100 shadow-lg border border-base-200">
      <!-- Progress Steps -->
      <div class="p-6 border-b border-base-200">
        <ul class="steps steps-horizontal w-full">
          <li class="step step-primary" data-content="1">
            <span class="hidden sm:inline ml-2">Connect</span>
          </li>
          <li class="step {$step > 1 ? 'step-primary' : ''}" data-content="2">
            <span class="hidden sm:inline ml-2">Configure</span>
          </li>
          <li class="step {$step > 2 ? 'step-primary' : ''}" data-content="3">
            <span class="hidden sm:inline ml-2">Payment</span>
          </li>
          <li class="step {$step > 3 ? 'step-primary' : ''}" data-content="4">
            <span class="hidden sm:inline ml-2">Print</span>
          </li>
        </ul>
      </div>

      <!-- Main Content -->
      <div class="p-6">
        <div class="min-h-[400px]">
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

      <!-- Footer -->
      <div class="p-6 bg-base-200/50 border-t border-base-200 rounded-b-xl">
        <div class="flex justify-between items-center">
          <div class="text-sm text-neutral-600">
            Secure, private digital cash notes
          </div>
          <div class="flex gap-3">
            <button 
              class="btn btn-sm {showDonate ? 'btn-primary' : 'btn-outline'} gap-2" 
              on:click={() => showDonate = !showDonate}
            >
              <Heart class="w-4 h-4" />
              {showDonate ? 'Hide' : 'Donate'}
            </button>
            
            <a 
              href="https://github.com/gandlafbtc/cashu-brrr" 
              class="btn btn-sm btn-outline gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code class="w-4 h-4" />
              Code
            </a>
          </div>
        </div>
      </div>
    </div>

    {#if showDonate}
      <div class="mt-6 rounded-xl bg-base-100 shadow-lg border border-base-200 p-6">
        <DonateCashu />
      </div>
    {/if}
  </div>
</div>
