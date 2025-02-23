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
  <div class="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide
              text-[#163300] transition-all duration-200 rounded-[10000px] border border-solid border-[1px]
              bg-[#9FE870] hover:opacity-90
              shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
    {units[0]}
  </div>
{:else}
  <div class="flex flex-wrap gap-2">
    {#each units as unitOption}
      <button
        class="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide
               transition-all duration-200 rounded-[10000px] border border-solid border-[1px]
               {unit === unitOption ? 
                 'text-[#163300] bg-[#9FE870] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] hover:opacity-90' : 
                 'bg-[#16330014] text-[#454745] hover:bg-[#16330028]'}"
        onclick={() => unit = unitOption}
      >
        {unitOption}
      </button>
    {/each}
  </div>
{/if}
