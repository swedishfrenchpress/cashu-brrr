<script lang="ts">
  import { CashuMint, CashuWallet } from "@cashu/cashu-ts";
  import {
    discoveredMints,
    mint,
    pool,
    step,
    wallet,
  } from "./stores.svelte";
  import { type Event, type Filter } from "nostr-tools";
  import {
    delay,
    getWalletWithUnit,
    loadMint,
  } from "./utils";
  import UnitSelector from "./comp/UnitSelector.svelte";
  import { toast } from "svelte-sonner";
  import { DEFAULT_RELAYS } from "../nostr";

  // Predefined mint suggestions - only the working mints
  const suggestedMints = [
    "https://mint.minibits.cash/Bitcoin",
    "https://mint.lnvoltz.com"
  ];

  let mintUrl = $state("");
  let isConnecting = $state(false);
  let isDiscovering = $state(false);

  // Format URL to ensure it has https://
  const formatMintUrl = (url: string): string => {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    return formattedUrl;
  };

  // Connect to the specified mint
  const connectToMint = async () => {
    if (!mintUrl.trim()) {
      toast.error("Please enter a mint URL");
      return;
    }

    try {
      isConnecting = true;
      const formattedUrl = formatMintUrl(mintUrl);
      console.log('Attempting to connect to:', formattedUrl);
      
      const m = await loadMint(formattedUrl);
      mint.set(m);
      mintUrl = formattedUrl; // Update the input with the formatted URL
      toast.success("Connected to " + m.url);
    } catch (error: any) {
      console.error('Mint connection error:', error);
      let errorMessage = "Failed to connect to mint";
      
      if (error.message.includes('CORS')) {
        errorMessage = "CORS error: The mint server doesn't allow connections from this domain";
      } else if (error.message.includes('404')) {
        errorMessage = "Mint not found: Please check the URL and try again";
      } else if (error.message.includes('fetch')) {
        errorMessage = "Network error: Unable to reach the mint server";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      isConnecting = false;
    }
  };

  // Disconnect from the current mint
  const disconnectMint = () => {
    // Clear the mint store by setting it to undefined
    // This will trigger a re-render and show the connect button again
    mint.set(undefined as any);
    mintUrl = "";
    toast.success("Disconnected from mint");
  };

  // Discover mints from Nostr network
  const discoverMints = async () => {
    try {
      isDiscovering = true;
      discoveredMints.set([]);
      const activeRelays = DEFAULT_RELAYS;
      const filter: Filter = { kinds: [38000], limit: 2000 };
      
      console.log('Starting mint discovery with relays:', activeRelays);
      
      pool.subscribeMany(activeRelays, [filter], {
        onevent: (event: Event) => {
          console.log('Received Nostr event:', event);
          const uTag = event.tags.find((t) => t[0] === "u");
          const kTag = event.tags.find((t) => t[0] === "k");
          if (!kTag || !uTag) {
            console.log('Missing required tags:', { uTag, kTag });
            return;
          }

          if (kTag[1] != "38172") {
            console.log('Wrong k tag value:', kTag[1]);
            return;
          }
          const mintUrl = uTag[1];
          console.log('Adding discovered mint:', mintUrl);
          discoveredMints.add(mintUrl);
        },
      });
      await delay(2000);
      
      // If no mints were discovered, show a helpful message
      if ($discoveredMints.length === 0) {
        toast.info("No mints discovered from Nostr network. You can still manually enter a mint URL.");
      }
    } catch (error: any) {
      console.error('Mint discovery error:', error);
      toast.error("Failed to discover mints: " + error.message);
    } finally {
      isDiscovering = false;
    }
  };

  // Set mint URL from suggestion
  const selectMint = (url: string) => {
    mintUrl = formatMintUrl(url);
  };

  // Go back to previous step
  const goBack = () => {
    step.set(1.5);
  };

  // Proceed to next step (amount selection)
  const proceedToNext = async () => {
    if (!$mint) {
      toast.error("Please connect to a mint first");
      return;
    }
    
    try {
      // For now, just proceed to the next step without initializing wallet
      // Currency selection will be handled in the next step
      step.set(3); // Move to amount selection step
    } catch (error: any) {
      toast.error("Failed to proceed: " + error.message);
    }
  };

  // Handle Enter key in input field
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      connectToMint();
    }
  };
</script>

<div class="w-full h-full flex flex-col p-8" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-center mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2">
      Step 1: Connect to a Mint
    </h2>
    <p class="text-gray-600 text-lg">Choose a mint to connect to and start printing your ecash notes</p>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
    <!-- Mint Input Section -->
    <div class="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">
      <div class="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Add a mint name"
          bind:value={mintUrl}
          onkeypress={handleKeyPress}
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        {#if $mint}
          <button
            onclick={disconnectMint}
            class="btn px-6 py-2 transition-all duration-200 hover:scale-105"
            style="background-color: #B0791C; color: white; border: 2px solid #CD8A18;"
          >
            Disconnect
          </button>
        {:else}
          <button
            onclick={connectToMint}
            disabled={isConnecting}
            class="btn px-6 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: #B0791C; color: white; border: 2px solid #CD8A18;"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        {/if}
      </div>

      <!-- Suggested Mints -->
      <div class="mb-6">
        <p class="text-sm font-medium text-gray-700 mb-4">Popular mints:</p>
        <div class="flex gap-3">
          {#each suggestedMints as suggestedMint}
            <button
              onclick={() => selectMint(suggestedMint)}
              class="px-4 py-2 transition-all duration-200 hover:scale-105 text-center flex-1"
              style="color: #CD8A18; background: transparent !important; border: none !important; box-shadow: none !important;"
            >
              {suggestedMint}
            </button>
          {/each}
        </div>
      </div>

      <!-- Discover More Button -->
      <button
        onclick={discoverMints}
        disabled={isDiscovering}
        class="text-sm text-orange-600 hover:text-orange-700 underline disabled:opacity-50 font-medium"
      >
        {isDiscovering ? 'Discovering...' : 'Discover more mints'}
      </button>

      <!-- Discovered Mints -->
      {#if $discoveredMints.length > 0}
        <div class="mt-6">
          <p class="text-sm font-medium text-gray-700 mb-3">Discovered mints:</p>
          <div class="flex flex-wrap gap-2">
            {#each $discoveredMints as discoveredMint}
              <button
                onclick={() => selectMint(discoveredMint.url)}
                class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                style="color: #CD8A18;"
              >
                {discoveredMint.url}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Connection Status -->
    {#if $mint}
      <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
        <div class="flex items-center gap-3">
          <!-- Green checkmark icon -->
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="text-green-800 font-medium text-lg">Connected to {$mint.url}</p>
        </div>
      </div>


    {/if}
  </div>

  <!-- Progress Indicator -->
  <div class="flex justify-center mb-8">
    <div class="flex items-center gap-4">
      <div class="w-4 h-4 bg-orange-600 rounded-full"></div>
      <div class="w-4 h-4 bg-gray-300 rounded-full border border-gray-400"></div>
      <div class="w-4 h-4 bg-gray-300 rounded-full border border-gray-400"></div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center mt-8 px-6 pb-6">
    <button 
      class="btn px-6 py-2 transition-all duration-200 hover:scale-105"
      style="color: #CD8A18; background: transparent; border: none;"
      onclick={goBack}
    >
      ← Back
    </button>
    
    <button 
      class="btn px-6 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      style="background-color: {!$mint ? '#9CA3AF' : '#E4690A'}; color: white; border: 2px solid {!$mint ? '#6B7280' : '#A94705'};"
      onclick={proceedToNext}
      disabled={!$mint}
    >
      Next →
    </button>
  </div>
</div>
