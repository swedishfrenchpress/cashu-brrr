<script lang="ts">
  import Step1 from "./Step1.svelte";
  import Step2 from "./Step2.svelte";
  import Step3 from "./Step3.svelte";
  import Step4 from "./Step4.svelte";
  import { step } from "./stores.svelte";
  import PostItCard from "./PostItCard.svelte";
</script>

<div class="min-h-screen w-full bg-yellow-300 px-32">
  <div class="w-full py-8 mb-6">
    <p class="text-center font-sedgwick text-green-800 text-3xl mb-2">
      Brrr is a tool.to.println(“Ecash”)
    </p>
    <h1 class="text-center font-ojuju font-bold text-9xl text-gray-900">
      Print your own Ecash notes
    </h1>
    <img src="/printer.png" alt="Printer illustration" class="mx-auto my-6 w-[36rem] h-auto" />
    <h2 class="text-center font-manrope font-bold text-4xl text-gray-900 mt-12 mb-4">
      Some frequently asked questions
    </h2>
    <div class="flex flex-col md:flex-row justify-center items-center gap-8 mt-8">
      <PostItCard title="What is Ecash?" body="Ecash is digital cash you can print and use privately." rotation="rotate-[15deg]" />
      <PostItCard title="Is it secure?" body="Yes! Your notes are cryptographically protected." rotation="-rotate-[15deg]" />
      <PostItCard title="How do I print?" body="Just follow the steps above and hit print!" rotation="rotate-[15deg]" />
    </div>
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