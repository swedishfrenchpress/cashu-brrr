<script lang="ts">
  import Step1 from "./Step1.svelte";
  import Step2 from "./Step2.svelte";
  import Step3 from "./Step3.svelte";
  import Step4 from "./Step4.svelte";
  import { step } from "./stores.svelte";
</script>

<div class="min-h-screen w-full bg-yellow-300 px-32">
  <div class="w-full py-8 mb-6">
    <p class="text-center font-sedgwick text-green-800 text-3xl mb-2">
      Brrr is a tool.to.println(“Ecash”)
    </p>
    <h1 class="text-center font-ojuju font-bold text-9xl text-gray-900">
      Print your own Ecash notes
    </h1>
  </div>

  <div class="m-auto w-full">
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

  <div class="flex gap-4 justify-center mt-8">
    <!-- Action buttons or other controls can go here -->
  </div>
</div>