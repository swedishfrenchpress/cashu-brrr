<script lang="ts">
  import { step, selectedTemplate, selectedStyle, selectedDenomination, selectedNumberOfNotes, mint, preparedTokens, prints } from "./stores.svelte";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import ChaumNote from "./ChaumNote.svelte";
  import MeadowsNote from "./MeadowsNote.svelte";
  import { onMount } from "svelte";
  import { getEncodedTokenV4 } from "@cashu/cashu-ts";
  import { getAmountForTokenSet } from "./utils";
  import encodeQR from "qr";
  import JSZip from "jszip";

  // Get values from stores
  let numberOfNotes = $derived($selectedNumberOfNotes);
  let denomination = $derived($selectedDenomination);
  
  // Use preparedTokens if available (from history reprint), otherwise use most recent print job
  let currentTokens = $derived($preparedTokens.length > 0 ? $preparedTokens : ($prints[$prints.length - 1]?.tokens || []));

  // Print functionality - store current print data and open new tab
  function printNotes() {
    // Store the current print data in localStorage so the new tab can access it
    const printData = {
      tokens: currentTokens,
      denomination: denomination,
      numberOfNotes: numberOfNotes,
      template: $selectedTemplate,
      style: $selectedStyle,
      mintUrl: $mint?.url || 'Unknown',
      timestamp: Date.now()
    };
    
    localStorage.setItem('currentPrintData', JSON.stringify(printData));
    
    // Open the print page in new tab with print parameter
    const baseUrl = window.location.origin + window.location.pathname;
    window.open(baseUrl + '?print=true', '_blank');
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

<div class="w-full h-full flex flex-col p-4" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-left mb-4">
    <h2 class="text-3xl font-bold mb-1" style="color: #4E4318;">Print</h2>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col">
    <!-- Notes Preview Area -->
    <div class="flex-1 mb-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-2xl font-bold" style="color: #4E4318;">Your Notes ({currentTokens.length} total)</h3>
        <div class="text-sm text-gray-600">Ready to print your ecash notes!</div>
      </div>
      
      <!-- Notes Grid - Responsive with scroll limit for 9+ notes -->
      <div class="w-full {currentTokens.length > 9 ? 'overflow-y-auto' : ''}" style="{currentTokens.length > 9 ? 'max-height: 75vh; scrollbar-width: thin; scrollbar-color: #CD8A18 #F0E0B0;' : ''}">
        {#if $selectedTemplate?.type === 'comic'}
          <!-- Comic Design Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each currentTokens as token, index}
              <div class="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div class="text-sm font-bold mb-2 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Note #{index + 1}</div>
                <div style="width: 100%; max-width: 240px;">
                  <ComicNote
                    design={typeof $selectedStyle?.design === 'number' ? $selectedStyle.design : 7}
                    denomination={denomination}
                    mintUrl={$mint?.url || "example.mint.com"}
                    token={getEncodedTokenV4(token)}
                    unit="sat"
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else if $selectedTemplate?.type === 'custom'}
          <!-- Custom Color Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each currentTokens as token, index}
              <div class="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div class="text-sm font-bold mb-2 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Note #{index + 1}</div>
                <div style="width: 100%; max-width: 300px;">
                  <CustomNote
                    denomination={denomination}
                    mintUrl={$mint?.url || "example.mint.com"}
                    token={getEncodedTokenV4(token)}
                    colorCode={$selectedStyle?.colorCode || '#E4690A'}
                    cornerBrandLogoURL=""
                    brandLogoURL=""
                    unit="sat"
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else if $selectedTemplate?.type === 'sovereign'}
          <!-- Sovereign Note Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each currentTokens as token, index}
              <div class="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div class="text-sm font-bold mb-2 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Note #{index + 1}</div>
                <div style="width: 100%; max-width: 320px;">
                  <SovereignNote
                    denomination={denomination}
                    mintUrl={$mint?.url || "example.mint.com"}
                    token={getEncodedTokenV4(token)}
                    unit="sat"
                    design={typeof $selectedStyle?.design === 'string' ? $selectedStyle.design : 'Soverign_Note.png'}
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else if $selectedTemplate?.type === 'chaum'}
          <!-- Chaum Note Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each currentTokens as token, index}
              <div class="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div class="text-sm font-bold mb-2 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Note #{index + 1}</div>
                <div style="width: 100%; max-width: 320px;">
                  <ChaumNote
                    denomination={denomination}
                    mintUrl={$mint?.url || "example.mint.com"}
                    token={getEncodedTokenV4(token)}
                    unit="sat"
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else if $selectedTemplate?.type === 'meadows'}
          <!-- Mr. Meadows Note Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each currentTokens as token, index}
              <div class="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div class="text-sm font-bold mb-2 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Note #{index + 1}</div>
                <div style="width: 100%; max-width: 320px;">
                  <MeadowsNote
                    denomination={denomination}
                    mintUrl={$mint?.url || "example.mint.com"}
                    token={getEncodedTokenV4(token)}
                    unit="sat"
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <!-- Fallback -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each currentTokens as token, index}
              <div class="flex flex-col items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div class="text-sm font-bold mb-2 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Note #{index + 1}</div>
                <div class="w-full max-w-56 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                  <span class="text-amber-600 font-semibold">Note {index + 1}</span>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Bottom Action Buttons -->
    <div class="flex justify-end space-x-4 mt-auto">
      <!-- Download QRs Button -->
      <button
        onclick={downloadQRs}
        class="px-6 py-2 rounded-lg text-base font-bold transition-all duration-200 hover:scale-105"
        style="background-color: transparent; color: #CD8A18; border: 2px solid #CD8A18"
      >
        Download only QRs
      </button>

      <!-- Print Button -->
      <button
        onclick={printNotes}
        class="px-6 py-2 rounded-lg text-lg font-bold transition-all duration-200 hover:scale-105"
        style="background-color: #CD8A18; color: white; border: 2px solid #B0791C"
      >
        Print now! BRRRRRR
      </button>
    </div>
  </div>
</div>


