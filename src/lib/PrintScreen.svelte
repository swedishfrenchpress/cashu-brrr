<script lang="ts">
  import { step, selectedTemplate, selectedStyle, selectedDenomination, selectedNumberOfNotes, mint, preparedTokens, prints } from "./stores.svelte";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import { onMount } from "svelte";
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import { getAmountForTokenSet } from "./utils";
  import encodeQR from "qr";
  import JSZip from "jszip";

  // Get values from stores
  let numberOfNotes = $derived($selectedNumberOfNotes);
  let denomination = $derived($selectedDenomination);
  
  // Use the same token source as PrintPage - get from most recent print job
  let currentPrint = $derived($prints[$prints.length - 1]);
  let currentTokens = $derived(currentPrint?.tokens || []);
  
  // Pagination for notes preview - use actual number of tokens
  let currentPage = $state(1);
  let notesPerPage = 3;
  let totalPages = $derived(Math.ceil(currentTokens.length / notesPerPage));
  
  // Calculate which notes to show on current page
  let startIndex = $derived((currentPage - 1) * notesPerPage);
  let endIndex = $derived(Math.min(startIndex + notesPerPage, currentTokens.length));
  let currentNotes = $derived(Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i));

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  // Print functionality - simple approach
  function printNotes() {
    // Open current page in new tab with print parameter
    window.open(window.location.href + '?print=true', '_blank');
  }

  function generateNoteHtml(index: number): string {
    // Generate HTML for a single note based on the selected template
    if ($selectedTemplate?.type === 'comic') {
      return '<div style="width: 300px; height: 200px; border: 2px solid #E4690A; border-radius: 12px; padding: 20px; background: white;"><h3>Comic Note ' + (index + 1) + '</h3><p>Value: ' + denomination + ' sats</p><p>Mint: ' + ($mint?.url || 'Unknown') + '</p><p>Design: ' + ($selectedStyle?.design || 7) + '</p></div>';
    } else if ($selectedTemplate?.type === 'custom') {
      return '<div style="width: 300px; height: 200px; border: 2px solid #E4690A; border-radius: 12px; padding: 20px; background: white;"><h3>Custom Note ' + (index + 1) + '</h3><p>Value: ' + denomination + ' sats</p><p>Mint: ' + ($mint?.url || 'Unknown') + '</p><p>Color: ' + ($selectedStyle?.colorCode || '#E4690A') + '</p></div>';
    } else {
      return '<div style="width: 300px; height: 200px; border: 2px solid #E4690A; border-radius: 12px; padding: 20px; background: white;"><h3>Note ' + (index + 1) + '</h3><p>Value: ' + denomination + ' sats</p><p>Mint: ' + ($mint?.url || 'Unknown') + '</p></div>';
    }
  }

  // Download QR codes functionality - uses actual tokens
  async function downloadQRs() {
    const zip = new JSZip();
    
    // Use actual tokens for QR generation
    for (let i = 0; i < currentTokens.length; i++) {
      const token = currentTokens[i];
      
      // Encode the token to a string for QR generation
      const tokenString = getEncodedTokenV4(token);
      
      // Generate the SVG QR code from the encoded token
      let svg = encodeQR(tokenString, "svg");
      
      // Add a white background by inserting a rectangle element
      const svgStartIndex = svg.indexOf("<svg");
      if (svgStartIndex !== -1) {
        const contentStartIndex = svg.indexOf(">", svgStartIndex) + 1;
        if (contentStartIndex !== 0) {
          const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
          let width = 100;
          let height = 100;
          
          if (viewBoxMatch && viewBoxMatch[1]) {
            const viewBoxValues = viewBoxMatch[1].split(" ");
            if (viewBoxValues.length >= 4) {
              width = parseFloat(viewBoxValues[2]);
              height = parseFloat(viewBoxValues[3]);
            }
          }
          
          const whiteRect = `<rect width="${width}" height="${height}" fill="white"/>`;
          svg = svg.slice(0, contentStartIndex) + whiteRect + svg.slice(contentStartIndex);
        }
      }
      
      zip.file(`${denomination}_sats_${i + 1}.svg`, svg);
    }
    
    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    // Download the zip file
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cashu_qr_codes.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="w-full h-full flex flex-col p-8" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); min-height: 600px;">
  <!-- Header -->
  <div class="text-left mb-8">
    <h2 class="text-3xl font-bold mb-2" style="color: #4E4318;">Print</h2>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex gap-8">
    <!-- Left Side - Preview Area -->
    <div class="flex-1 max-w-md">
      <div class="overflow-y-auto pr-2 max-h-96">
        {#if $selectedTemplate?.type === 'comic'}
          <!-- Comic Design Selection -->
          <div class="space-y-0">
            {#each currentNotes as noteIndex}
              <div class="cursor-pointer -mb-2">
                <div class="scale-[0.8] transform pointer-events-none">
                  {#if currentTokens[noteIndex]}
                    <ComicNote
                      design={$selectedStyle?.design || 7}
                      denomination={denomination}
                      mintUrl={$mint?.url || "example.mint.com"}
                      token={getEncodedTokenV4(currentTokens[noteIndex])}
                      unit="sat"
                    />
                  {:else}
                    <div class="w-64 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span class="text-gray-500 font-semibold">Loading token...</span>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else if $selectedTemplate?.type === 'custom'}
          <!-- Custom Color Selection -->
          <div class="space-y-0">
            {#each currentNotes as noteIndex}
              <div class="cursor-pointer -mb-2">
                <div class="scale-[0.8] transform pointer-events-none">
                  {#if currentTokens[noteIndex]}
                    <CustomNote
                      denomination={denomination}
                      mintUrl={$mint?.url || "example.mint.com"}
                      token={getEncodedTokenV4(currentTokens[noteIndex])}
                      colorCode={$selectedStyle?.colorCode || '#E4690A'}
                      cornerBrandLogoURL=""
                      brandLogoURL=""
                      unit="sat"
                    />
                  {:else}
                    <div class="w-64 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span class="text-gray-500 font-semibold">Loading token...</span>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <!-- Fallback -->
          <div class="space-y-0">
            {#each currentNotes as noteIndex}
              <div class="cursor-pointer -mb-2">
                <div class="scale-[0.8] transform pointer-events-none">
                  <div class="w-64 h-40 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                    <span class="text-amber-600 font-semibold">Note {noteIndex + 1}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="flex justify-center items-center space-x-4 mt-6">
            <!-- Page Numbers -->
            <div class="flex items-center space-x-2">
              {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                <button
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
                  style="background-color: {page === currentPage ? '#E4690A' : 'transparent'}; color: {page === currentPage ? 'white' : '#CD8A18'}"
                  onclick={() => currentPage = page}
                >
                  {page}
                </button>
              {/each}
              
              <!-- Next Arrow -->
              {#if currentPage < totalPages}
                <button
                  onclick={nextPage}
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
                  style="color: #CD8A18"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </div>

    <!-- Right Side - Print Actions -->
    <div class="w-80 space-y-4">
      <!-- Download QRs Button -->
      <button
        onclick={downloadQRs}
        class="w-full py-4 px-6 rounded-lg text-lg font-bold transition-all duration-200 hover:scale-105"
        style="background-color: #CD8A18; color: white; border: 2px solid #B0791C"
      >
        Download only QRs
      </button>

      <!-- Print Button -->
      <button
        onclick={printNotes}
        class="w-full py-4 px-6 rounded-lg text-xl font-bold transition-all duration-200 hover:scale-105"
        style="background-color: transparent; color: #CD8A18; border: 2px solid #CD8A18"
      >
        Print now! BRRRRRR
      </button>
    </div>
  </div>
</div>


