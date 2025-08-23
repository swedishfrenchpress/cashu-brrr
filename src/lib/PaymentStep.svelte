<script lang="ts">
  import { step, selectedTemplate, mint, wallet, selectedDenomination, selectedNumberOfNotes, donation } from "./stores.svelte";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import { toast } from "svelte-sonner";
  import QRCode from "qrcode";
  import { onMount } from "svelte";

  // Payment details from stores
  let numberOfNotes = $derived($selectedNumberOfNotes);
  let denomination = $derived($selectedDenomination);
  let platformFee = $state(2); // Fixed platform fee
  let totalAmount = $derived(numberOfNotes * denomination + platformFee);

  // Lightning invoice details
  let lightningInvoice = $state("");
  let qrCodeDataUrl = $state("");
  let isLoading = $state(true);

  // Generate lightning invoice when component mounts
  onMount(async () => {
    try {
      console.log('Wallet state:', $wallet);
      console.log('Total amount:', totalAmount);
      
      if ($wallet && $mint) {
        const quote = await $wallet.createMintQuote(totalAmount);
        console.log('Quote created:', quote);
        lightningInvoice = quote.request;
        
        // Generate QR code
        QRCode.toDataURL(lightningInvoice, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }).then((url: string) => {
          qrCodeDataUrl = url;
          isLoading = false;
        }).catch((err: any) => {
          console.error('Error generating QR code:', err);
          isLoading = false;
        });
      } else {
        console.error('No wallet or mint connected');
        toast.error("No wallet or mint connected. Please go back and connect to a mint first.");
        isLoading = false;
      }
    } catch (error: any) {
      console.error('Error creating mint quote:', error);
      toast.error("Failed to create lightning invoice: " + error.message);
      isLoading = false;
    }
  });

  function goBack() {
    step.set(3);
  }

  function proceedToNext() {
    // Handle payment completion
    step.set(4);
  }

  function copyInvoice() {
    navigator.clipboard.writeText(lightningInvoice).then(() => {
      toast.success("Lightning invoice copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy invoice");
    });
  }
</script>

<div class="w-full h-full flex flex-col p-8 overflow-hidden" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-left mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2" style="color: #4E4318; text-decoration: underline;">Step 3: Payment</h2>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
    <div class="p-6 mb-6">
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Left Side - Payment Summary and Preview -->
        <div class="space-y-6">
          <!-- Payment Details -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium" style="color: #4E4318;">Mint:</span>
              <div class="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-900">
                //{$mint?.url || "mint.lnvoltz.com"}
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium" style="color: #4E4318;">Number of notes:</span>
              <span class="text-sm font-semibold text-gray-900">{numberOfNotes.toString().padStart(2, '0')}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium" style="color: #4E4318;">Denomination:</span>
              <span class="text-sm font-semibold text-gray-900">{denomination.toString().padStart(2, '0')}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium" style="color: #4E4318;">Platform fee:</span>
              <span class="text-sm font-semibold text-gray-900">{platformFee} Sats</span>
            </div>
            
            <div class="flex justify-between items-center pt-3 border-t border-gray-200">
              <span class="text-lg font-semibold" style="color: #4E4318;">Total:</span>
              <span class="text-lg font-bold text-orange-600">{totalAmount} Sats</span>
            </div>
          </div>

          <!-- Note Preview Section -->
          <div class="flex flex-col items-center">
            <div class="relative bg-gray-200 rounded-lg p-4 w-full" style="background-color: #EFEDEA;">
              <span class="absolute top-2 left-2 text-sm font-medium" style="color: #4E4318;">Preview</span>
              <div class="scale-75 transform mt-4 grid place-items-center w-full">
                {#if $selectedTemplate}
                  {#if $selectedTemplate.type === 'comic' && $selectedTemplate.design}
                    <ComicNote
                      design={$selectedTemplate.design}
                      denomination={denomination}
                      mintUrl={$mint?.url || "example.mint.com"}
                      token="example-token"
                      unit="sat"
                    />
                  {:else if $selectedTemplate.type === 'custom'}
                    <CustomNote
                      denomination={denomination}
                      mintUrl={$mint?.url || "example.mint.com"}
                      token="example-token"
                      colorCode="#E4690A"
                      cornerBrandLogoURL=""
                      brandLogoURL=""
                      unit="sat"
                    />
                  {/if}
                {:else}
                  <div class="w-48 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                    <span class="text-amber-600 font-semibold text-sm">No template selected</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - QR Code and Invoice -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Payment QR Code</h3>
          
          <!-- QR Code -->
          <div class="flex justify-center">
            <div class="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center p-4">
              {#if isLoading}
                <div class="text-center text-gray-500">
                  <div class="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <span class="text-sm">Creating invoice...</span>
                  </div>
                  <p class="text-xs">Please wait</p>
                </div>
              {:else if qrCodeDataUrl && lightningInvoice}
                <img src={qrCodeDataUrl} alt="Lightning QR Code" class="w-full h-full" />
              {:else}
                <div class="text-center text-gray-500">
                  <div class="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <span class="text-sm">Failed to create invoice</span>
                  </div>
                  <p class="text-xs">Please try again</p>
                </div>
              {/if}
            </div>
          </div>
          
          <!-- Lightning Invoice String -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Lightning Invoice:</label>
            <div class="relative">
              <input
                type="text"
                value={lightningInvoice}
                readonly
                class="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-900"
                style="background-color: #FFF9EF; border: 1px solid #EFAF42; color: #5C4214;"
                placeholder={isLoading ? "Creating invoice..." : "No invoice available"}
              />
              <button
                onclick={copyInvoice}
                disabled={!lightningInvoice || isLoading}
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy invoice"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Progress Indicator -->
  <div class="flex justify-center mb-6">
    <div class="flex items-center gap-4">
      <!-- Step 1: Connect Mint (Completed) -->
      <div class="w-6 h-6 rounded-full" style="background-color: #2B9707;"></div>
      
      <!-- Connector Line -->
      <div class="w-8 h-0.5" style="background-color: #FFD700;"></div>
      
      <!-- Step 2: Customize (Completed) -->
      <div class="w-6 h-6 rounded-full" style="background-color: #2B9707;"></div>
      
      <!-- Connector Line -->
      <div class="w-8 h-0.5" style="background-color: #FFD700;"></div>
      
      <!-- Step 3: Payment (Active/Current) -->
      <div class="w-6 h-6 rounded-full flex items-center justify-center" style="background-color: #5C4F21;">
        <div class="w-4 h-4 rounded-full" style="background-color: #8B7B2F;"></div>
      </div>
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
      class="btn px-6 py-2 transition-all duration-200 hover:scale-105"
      style="background-color: #E4690A; color: white; border: 2px solid #A94705;"
      onclick={proceedToNext}
    >
      Next →
    </button>
  </div>
</div>
