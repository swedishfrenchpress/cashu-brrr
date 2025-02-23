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

  <div class="w-full">
    {#if $mint}
      <div class="flex flex-col gap-4 w-full">
        <div class="w-full p-6 rounded-xl bg-gradient-to-r from-[#9FE87015] to-[#9FE87033] border border-[#9FE870]">
          <div class="flex items-center gap-3 mb-3">
            <div class="bg-[#9FE870] rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-[#163300]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-[#163300]">Successfully Connected!</h3>
          </div>
          
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-[#454745]">Mint URL:</span>
              <span class="font-medium text-[#163300] break-all">{$mint.url}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-[#454745]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You can now select your preferred currency and proceed to the next step</span>
            </div>
          </div>
        </div>

        <div class="w-full">
          <p class="text-left font-medium text-lg text-[#0E0F0C]">Select Your Currency</p>
          <p class="text-left text-sm text-[#454745] mt-1">
            Choose your preferred currency (sats will be auto-selected if it's the only option)
          </p>
          <div class="flex items-center gap-4 mt-4">
            <UnitSelector bind:unit />
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if $prints.length}
    <div class="w-full mt-8 border-t border-[#E5E7EB] pt-8">
      <p class="text-left font-medium text-lg text-[#0E0F0C]">Previous Prints</p>
      <p class="text-left text-sm text-[#454745] mt-1">
        Select a previous print to quickly recreate it
      </p>
      
      <div class="grid gap-4 mt-4">
        {#each $prints as print}
          <div class="flex flex-col gap-3 bg-white rounded-xl p-4 sm:p-6 border border-[#868685] hover:border-[#6A6C6A] transition-all duration-200">
            <!-- Header section -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-[#0E0F0C]">
                  {print.tokens.length} {print.tokens[0].unit === 'sat' ? 'Bitcoin' : print.tokens[0].unit} {print.tokens.length === 1 ? 'note' : 'notes'}
                </span>
                <span class="text-sm text-[#454745]">
                  {new Date(print.ts).toLocaleString()}
                </span>
              </div>
              <button
                class="inline-flex items-center justify-center h-10 px-5 font-medium
                       text-[#454745] bg-[#16330014] rounded-[10000px]
                       hover:bg-[#16330028] transition-all duration-200
                       shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]
                       w-full sm:w-auto"
                onclick={() => reprint(print)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print again
              </button>
            </div>

            <!-- Notes calculation section -->
            <div class="flex flex-wrap items-center gap-2 text-sm">
              <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#9FE870] text-[#163300]">
                1 <svg class="w-4 h-4 ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              <span class="text-[#454745]">×</span>
              <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#16330014] text-[#454745]">
                ₿ 1 sat
              </span>
              <span class="text-[#454745]">=</span>
              <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#16330014] text-[#454745]">
                ₿ 1 sat
              </span>
              <span class="text-[#454745]">+</span>
              <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#16330014] text-[#454745]">
                ₿ 1 sat
              </span>
            </div>
            
            <!-- Mint URL section -->
            <div class="flex flex-col gap-1 pt-2 border-t border-[#E5E7EB]">
              <div class="flex items-center gap-2 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 w-4 h-4 text-[#454745]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span class="text-sm text-[#454745] truncate">
                  {print.mint}
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
