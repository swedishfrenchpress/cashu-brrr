<script lang="ts">
  import Step1 from "./Step1.svelte";
  import Step2 from "./Step2.svelte";
  import Step3 from "./Step3.svelte";
  import Step4 from "./Step4.svelte";
  import { step } from "./stores.svelte";
</script>

<div class="w-full">
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
