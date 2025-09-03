<script lang="ts">
  import { step, selectedTemplate, selectedStyle } from "./stores.svelte";
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import { toast } from "svelte-sonner";

  // Available comic designs (3-25 as mentioned in the user's memory)
  const comicDesigns = [
    { id: 3, name: 'Design 3', preview: 'Comic design 3' },
    { id: 4, name: 'Design 4', preview: 'Comic design 4' },
    { id: 5, name: 'Design 5', preview: 'Comic design 5' },
    { id: 6, name: 'Design 6', preview: 'Comic design 6' },
    { id: 7, name: 'Design 7', preview: 'Comic design 7' },
    { id: 8, name: 'Design 8', preview: 'Comic design 8' },
    { id: 9, name: 'Design 9', preview: 'Comic design 9' },
    { id: 10, name: 'Design 10', preview: 'Comic design 10' },
    { id: 11, name: 'Design 11', preview: 'Comic design 11' },
    { id: 12, name: 'Design 12', preview: 'Comic design 12' },
    { id: 13, name: 'Design 13', preview: 'Comic design 13' },
    { id: 14, name: 'Design 14', preview: 'Comic design 14' },
    { id: 15, name: 'Design 15', preview: 'Comic design 15' },
    { id: 16, name: 'Design 16', preview: 'Comic design 16' },
    { id: 17, name: 'Design 17', preview: 'Comic design 17' },
    { id: 18, name: 'Design 18', preview: 'Comic design 18' },
    { id: 19, name: 'Design 19', preview: 'Comic design 19' },
    { id: 20, name: 'Design 20', preview: 'Comic design 20' },
    { id: 21, name: 'Design 21', preview: 'Comic design 21' },
    { id: 22, name: 'Design 22', preview: 'Comic design 22' },
    { id: 23, name: 'Design 23', preview: 'Comic design 23' },
    { id: 24, name: 'Design 24', preview: 'Comic design 24' },
    { id: 25, name: 'Design 25', preview: 'Comic design 25' },
  ];

  // Available colors for custom notes
  const colorOptions = [
    { id: 'orange', name: 'Orange', code: '#E4690A' },
    { id: 'blue', name: 'Blue', code: '#3B82F6' },
    { id: 'green', name: 'Green', code: '#10B981' },
    { id: 'purple', name: 'Purple', code: '#8B5CF6' },
    { id: 'red', name: 'Red', code: '#EF4444' },
    { id: 'pink', name: 'Pink', code: '#EC4899' },
  ];

  // Available sovereign note designs
  const sovereignDesigns = [
    { id: 'Soverign_Note.png', name: 'Classic Sovereign', preview: 'Classic Sovereign design' },
    { id: 'Leafy-Nature-Note.png', name: 'Leafy Nature', preview: 'Nature-inspired design' },
    { id: 'Nostr-note-1.png', name: 'Nostr Note 1', preview: 'Nostr-inspired design 1' },
    { id: 'Nostr-note-2.png', name: 'Nostr Note 2', preview: 'Nostr-inspired design 2' },
    { id: 'Nostr-Note-3.png', name: 'Nostr Note 3', preview: 'Nostr-inspired design 3' },
    { id: 'Pizza-day-orange.png', name: 'Pizza Day Orange', preview: 'Orange pizza-themed design' },
    { id: 'Pizzaday-green.png', name: 'Pizza Day Green', preview: 'Green pizza-themed design' },
    { id: 'Satoshi-nirvana.png', name: 'Satoshi Nirvana', preview: 'Satoshi-inspired design' },
    { id: 'Taj-India-Note.png', name: 'Taj India', preview: 'India-inspired design' },
    { id: 'Your-honor.png', name: 'Your Honor', preview: 'Legal-themed design' },
  ];

  let selectedDesign: string | number = $state('Soverign_Note.png'); // Default to classic sovereign
  let selectedColor = $state('#E4690A'); // Default orange color

  function goBack() {
    step.set(1);
  }

  function proceedToNext() {
    // Store the selected style in the store
    selectedStyle.set({
      id: selectedDesign.toString(),
      name: typeof selectedDesign === 'string' ? selectedDesign : `Design ${selectedDesign}`,
      type: $selectedTemplate?.type || 'comic',
      design: selectedDesign,
      colorCode: selectedColor
    });
    
    step.set(3); // Move to mint connection step
  }

  function selectDesign(designId: number | string) {
    selectedDesign = designId;
  }

  function selectColor(colorCode: string) {
    selectedColor = colorCode;
  }
</script>

<div class="w-full h-full flex flex-col p-8 overflow-hidden" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-left mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2" style="color: #4E4318;">Customize your note</h2>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex gap-8">
    <!-- Left Side - Styles Section -->
    <div class="w-2/5">
      <h3 class="text-lg font-semibold mb-4" style="color: #4E4318;">Styles</h3>
      <div class="overflow-y-auto pr-2 max-h-[600px]">
        {#if $selectedTemplate?.type === 'comic'}
          <!-- Comic Design Selection -->
          <div class="grid grid-cols-2 gap-4 p-2">
            {#each comicDesigns as design}
              <div
                onclick={() => selectDesign(design.id)}
                class="cursor-pointer p-1 rounded-lg {selectedDesign === design.id ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'}"
              >
                <div class="scale-75 transform pointer-events-none">
                  <ComicNote
                    design={design.id}
                    denomination={100}
                    mintUrl="example.mint.com"
                    token="example-token"
                    unit="sat"
                    isPrint={false}
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else if $selectedTemplate?.type === 'custom'}
          <!-- Custom Color Selection -->
          <div class="grid grid-cols-2 gap-4 p-2">
            {#each colorOptions as color}
              <div
                onclick={() => selectColor(color.code)}
                class="cursor-pointer p-1 rounded-lg {selectedColor === color.code ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'}"
              >
                <div class="scale-75 transform pointer-events-none">
                  <CustomNote
                    denomination={100}
                    mintUrl="example.mint.com"
                    token="example-token"
                    colorCode={color.code}
                    cornerBrandLogoURL=""
                    brandLogoURL=""
                    unit="sat"
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else if $selectedTemplate?.type === 'sovereign'}
          <!-- Sovereign Design Selection -->
          <div class="grid grid-cols-2 gap-4 p-2">
            {#each sovereignDesigns as design}
              <div
                onclick={() => selectDesign(design.id)}
                class="cursor-pointer p-1 rounded-lg {selectedDesign === design.id ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'}"
              >
                <div class="scale-75 transform pointer-events-none">
                  <SovereignNote
                    denomination={0}
                    mintUrl="example.mint.com"
                    token="example-token"
                    unit="sat"
                    design={design.id}
                  />
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Right Side - Large Preview -->
    <div class="flex-1 flex items-center justify-center">
      <div class="scale-[230%] transform">
        {#if $selectedTemplate?.type === 'comic'}
          <ComicNote
            design={typeof selectedDesign === 'number' ? selectedDesign : 7}
            denomination={100}
            mintUrl="example.mint.com"
            token="example-token"
            unit="sat"
            isPrint={false}
          />
        {:else if $selectedTemplate?.type === 'custom'}
          <CustomNote
            denomination={100}
            mintUrl="example.mint.com"
            token="example-token"
            colorCode={selectedColor}
            cornerBrandLogoURL=""
            brandLogoURL=""
            unit="sat"
          />
        {:else if $selectedTemplate?.type === 'sovereign'}
                          <SovereignNote
                  denomination={0}
                  mintUrl="example.mint.com"
                  token="example-token"
                  unit="sat"
                  design={typeof selectedDesign === 'string' ? selectedDesign : 'Soverign_Note.png'}
                />
        {:else}
          <div class="w-64 h-40 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
            <span class="text-amber-600 font-semibold">No template selected</span>
          </div>
        {/if}
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
