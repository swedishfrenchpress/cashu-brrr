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
  
  // Use preparedTokens if available (from history reprint), otherwise use most recent print job
  let currentTokens = $derived($preparedTokens.length > 0 ? $preparedTokens : ($prints[$prints.length - 1]?.tokens || []));

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
      <div class="overflow-y-auto" style="max-height: 400px; padding-right: 16px; scrollbar-width: thin; scrollbar-color: #CD8A18 #F0E0B0;">
        {#if $selectedTemplate?.type === 'comic'}
          <!-- Comic Design Selection -->
          <div class="space-y-6">
            {#each currentTokens as token, index}
              <div class="flex justify-center">
                <div style="width: 100%; max-width: 280px;">
                  <ComicNote
                    design={$selectedStyle?.design || 7}
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
          <div class="space-y-6">
            {#each currentTokens as token, index}
              <div class="flex justify-center">
                <div style="width: 100%; max-width: 360px;">
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
        {:else}
          <!-- Fallback -->
          <div class="space-y-6">
            {#each currentTokens as token, index}
              <div class="flex justify-center">
                <div class="w-full max-w-64 h-40 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                  <span class="text-amber-600 font-semibold">Note {index + 1}</span>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
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


