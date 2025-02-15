<script lang="ts">
  import { mint } from "../stores.svelte";

  let { unit = $bindable() } = $props();

  const getUnits = () => {
    if (!$mint) {
      return ["sat"];
    }
    return $mint.keysets.keysets.reduce((acc, curr) => {
      if (acc.includes(curr.unit)) {
        return acc;
      } else {
        acc.push(curr.unit);
      }
      return acc;
    }, [] as string[]);
  };

  let units = $derived(getUnits());
</script>

{#if units.length === 1}
  <div class="inline-flex items-center justify-center h-10 px-5 font-medium
              text-primary bg-primary/10 rounded-full">
    {units[0]}
  </div>
{:else}
  <div class="flex flex-wrap gap-2">
    {#each units as unitOption}
      <button
        class="inline-flex items-center justify-center h-10 px-5 font-medium
               transition-all duration-200 rounded-full
               {unit === unitOption ? 
                 'bg-primary text-white' : 
                 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
        onclick={() => unit = unitOption}
      >
        {unitOption}
      </button>
    {/each}
  </div>
{/if}
