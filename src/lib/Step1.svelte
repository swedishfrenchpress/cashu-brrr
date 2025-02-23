<script lang="ts">
  import { CashuMint, CashuWallet } from "@cashu/cashu-ts";
  import {
    discoveredMints,
    mint,
    pool,
    preparedTokens,
    prints,
    selectedDenomination,
    selectedNumberOfNotes,
    step,
    wallet,
    type Print,
  } from "./stores.svelte";
  import NotesCalc from "./comp/NotesCalc.svelte";
  import { type Event, type Filter } from "nostr-tools";
  import {
    delay,
    getAmountForTokenSet,
    getWalletWithUnit,
    loadMint,
  } from "./utils";
  import UnitSelector from "./comp/UnitSelector.svelte";
  import { toast } from "svelte-sonner";
    import { DEFAULT_RELAYS } from "../nostr";

  const mints = [
    "https://mint.minibits.cash/Bitcoin",
    "https://stablenut.umint.cash",
    "https://mint.lnvoltz.com",
  ];

  let mintUrl = $state("");
  let isConnecting = $state(false);
  let isDiscovering = $state(false);
  let unit = $state("sat");

  const connect = async () => {
    try {
      isConnecting = true;
      const m = await loadMint(mintUrl);
      mint.set(m);
      toast.success("Connected to " + $mint.url);
    } catch (error) {
      toast.error(error.message);
    } finally {
      isConnecting = false;
    }
  };

  export const discoverMints = async () => {
    try {
      isDiscovering = true;
      discoveredMints.set([]);
      const activeRelays = DEFAULT_RELAYS;
      const filter: Filter = { kinds: [38000], limit: 2000 };
      pool.subscribeMany(activeRelays, [filter], {
        onevent: (event: Event) => {
          const uTag = event.tags.find((t) => t[0] === "u");
          const kTag = event.tags.find((t) => t[0] === "k");
          if (!kTag || !uTag) {
            return;
          }

          if (kTag[1] != "38172") {
            return;
          }
          const mintUrl = uTag[1];
          discoveredMints.add(mintUrl);
        },
      });
      await delay(2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      isDiscovering = false;
    }
  };

  const reprint = (print: Print) => {
    wallet.set(new CashuWallet(new CashuMint(print.mint)));
    preparedTokens.set(print.tokens);
    selectedDenomination.set(print.tokens[0].proofs[0].amount);
    selectedNumberOfNotes.set(print.tokens.length);
    step.set(4);
  };

  const confirm = async () => {
    wallet.set(await getWalletWithUnit($mint, unit));
    step.set(2);
  };
</script>

<div class="flex flex-col gap-5 justify-center items-center w-full">
  <div class="w-full">
    <p class="text-left font-medium text-lg text-[#0E0F0C]">Connect to mint</p>
    <p class="text-left text-sm text-[#454745] mt-1">
      Enter a Cashu mint URL to connect your wallet. You can choose from our suggested mints below.
    </p>
  </div>
  
  <!-- Primary Connection Input -->
  <div class="flex gap-2 justify-center w-full">
    <div class="relative flex-1">
      <input
        type="text"
        bind:value={mintUrl}
        class="peer w-full bg-transparent text-[#0E0F0C] text-sm 
               border border-[#868685] rounded-lg px-3 py-3
               transition-all duration-300 ease-in-out
               hover:border-[#6A6C6A]
               focus:outline-none focus:border-[#9FE870] focus:ring-1 focus:ring-[#9FE870]
               shadow-sm focus:shadow"
      />
      <label 
        class="absolute cursor-text bg-white px-1 left-2.5 top-3
               text-[#6A6C6A] text-sm transition-all transform origin-left
               peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs 
               peer-focus:text-[#454745] peer-focus:scale-90
               peer-[:not(:placeholder-shown)]:-top-2 
               peer-[:not(:placeholder-shown)]:left-2.5
               peer-[:not(:placeholder-shown)]:text-xs
               peer-[:not(:placeholder-shown)]:text-[#454745]
               peer-[:not(:placeholder-shown)]:scale-90"
      >
        Enter mint url here...
      </label>
    </div>
    <button
      onclick={connect}
      class="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide
             text-[#163300] transition-all duration-200 rounded-[10000px] border border-solid
             bg-[#9FE870] hover:opacity-90
             shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]
             disabled:opacity-50"
      disabled={isConnecting}
    >
      Connect
    </button>
  </div>

  <!-- Mint Options -->
  <div class="flex flex-wrap gap-2 justify-start w-full">
    {#if !$mint}
      {#if $discoveredMints.length}
        {#each $discoveredMints as m}
          <button
            class="inline-flex items-center justify-center px-4 py-2 font-medium
                   text-slate-600 bg-slate-50/80 rounded-lg
                   hover:bg-slate-100 transition-all duration-200
                   shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            onclick={() => (mintUrl = m.url)}
          >
            {m.url}
          </button>
        {/each}
      {:else}
        {#each mints as m}
          <button
            class="inline-flex items-center justify-center px-4 py-2 font-medium
                   text-slate-600 bg-slate-50/80 rounded-lg
                   hover:bg-slate-100 transition-all duration-200
                   shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
            onclick={() => (mintUrl = m)}
          >
            {m}
          </button>
        {/each}
      {/if}
    {/if}
    <button
      class="inline-flex items-center justify-center px-4 py-2 font-medium
             text-[#454745] bg-[#16330014] rounded-lg
             hover:bg-[#16330028] transition-all duration-200
             shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
      onclick={discoverMints}
      disabled={isDiscovering}
    >
      Discover more mints
    </button>
  </div>

  <div class="h-10">
    {#if $mint}
      <div class="flex gap-1 px-3 py-1.5 rounded-lg bg-[#16330014]">
        <p class="text-[#454745]">Connected to</p>
        <p class="text-[#163300]">{$mint.url}</p>
      </div>
    {/if}
  </div>

  {#if $mint}
    <p class="text-center text-[#454745] mb-2">Select a currency</p>
    <div class="flex items-center gap-4 justify-center">
      <UnitSelector bind:unit />
    </div>
  {/if}

  {#if $prints.length}
    <div class="divider text-slate-400">or</div>
    <button
      class="inline-flex items-center justify-center h-10 px-5 font-medium
             text-slate-600 transition-all duration-200 bg-transparent rounded-lg
             border border-slate-200 hover:bg-slate-50
             shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
      onclick={() => document.getElementById('prints-section')?.scrollIntoView({ behavior: 'smooth' })}
    >
      Re-print previous print
    </button>
    
    <div id="prints-section" class="h-fit mt-4">
      <div class="h-full max-h-52 lg:max-h-96 flex flex-col gap-3 overflow-x-scroll">
        {#each $prints as print}
          <div class="flex gap-2 flex-col bg-slate-50 rounded-lg p-4 w-80 border border-slate-200">
            <button
              class="inline-flex items-center justify-center h-8 px-4 font-medium
                     text-slate-600 transition-all duration-200 bg-white rounded-lg
                     border border-slate-200 hover:bg-slate-50"
              onclick={() => reprint(print)}
            >
              Print
            </button>
            <NotesCalc
              selectedDenomination={getAmountForTokenSet(print.tokens[0].proofs)}
              selectedNumberOfNotes={print.tokens.length}
              unit={print.tokens[0].unit}
              isDonate={print.donation}
              donationAmount={getAmountForTokenSet(print.donation?.proofs??[])}
            />
            <p class="break-all text-sm text-slate-600">
              {print.mint}
            </p>
            <p class="text-sm text-slate-400">
              {new Date(print.ts).toLocaleString()}
            </p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
