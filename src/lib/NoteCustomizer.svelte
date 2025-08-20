<script lang="ts">
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import { step, selectedStyle } from "./stores.svelte";

  interface StyleOption {
    id: string;
    name: string;
    type: 'comic' | 'custom';
    design?: number;
    colorCode?: string;
    preview: string;
  }

  // Props to receive the selected template from previous step
  interface Props {
    selectedTemplate: {
      id: string;
      name: string;
      type: 'comic' | 'custom';
      design?: number;
    };
  }

  let { selectedTemplate }: Props = $props();

  // Generate style options based on the selected template type
  let styleOptions: StyleOption[] = $state([]);
  let selectedStyleId = $state<string | null>(null);

  // Initialize style options based on template type
  $effect(() => {
    console.log('Template type:', selectedTemplate.type);
    
    if (selectedTemplate.type === 'comic') {
      // Comic note has different design numbers (3-25)
      const comicOptions = [
        { id: 'comic-3', name: 'Design 3', type: 'comic' as const, design: 3, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-5', name: 'Design 5', type: 'comic' as const, design: 5, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-7', name: 'Design 7', type: 'comic' as const, design: 7, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-8', name: 'Design 8', type: 'comic' as const, design: 8, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-9', name: 'Design 9', type: 'comic' as const, design: 9, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-10', name: 'Design 10', type: 'comic' as const, design: 10, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-11', name: 'Design 11', type: 'comic' as const, design: 11, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-12', name: 'Design 12', type: 'comic' as const, design: 12, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-13', name: 'Design 13', type: 'comic' as const, design: 13, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-14', name: 'Design 14', type: 'comic' as const, design: 14, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-15', name: 'Design 15', type: 'comic' as const, design: 15, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-16', name: 'Design 16', type: 'comic' as const, design: 16, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-17', name: 'Design 17', type: 'comic' as const, design: 17, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-18', name: 'Design 18', type: 'comic' as const, design: 18, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-19', name: 'Design 19', type: 'comic' as const, design: 19, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-20', name: 'Design 20', type: 'comic' as const, design: 20, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-21', name: 'Design 21', type: 'comic' as const, design: 21, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-22', name: 'Design 22', type: 'comic' as const, design: 22, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-23', name: 'Design 23', type: 'comic' as const, design: 23, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-24', name: 'Design 24', type: 'comic' as const, design: 24, preview: '/Ecash_Note_template.svg' },
        { id: 'comic-25', name: 'Design 25', type: 'comic' as const, design: 25, preview: '/Ecash_Note_template.svg' },
      ];
      styleOptions = comicOptions;
      selectedStyleId = comicOptions[0]?.id || null;
      console.log('Set comic options, selected:', selectedStyleId);
    } else if (selectedTemplate.type === 'custom') {
      // Custom notes have different color options
      const customOptions = [
        { id: 'custom-green', name: 'Emerald Green', type: 'custom' as const, colorCode: '#10B981', preview: '/Ecash_Note_template.svg' },
        { id: 'custom-blue', name: 'Ocean Blue', type: 'custom' as const, colorCode: '#3B82F6', preview: '/Ecash_Note_template.svg' },
        { id: 'custom-purple', name: 'Royal Purple', type: 'custom' as const, colorCode: '#8B5CF6', preview: '/Ecash_Note_template.svg' },
        { id: 'custom-orange', name: 'Sunset Orange', type: 'custom' as const, colorCode: '#F59E0B', preview: '/Ecash_Note_template.svg' },
        { id: 'custom-red', name: 'Ruby Red', type: 'custom' as const, colorCode: '#EF4444', preview: '/Ecash_Note_template.svg' },
      ];
      styleOptions = customOptions;
      selectedStyleId = customOptions[0]?.id || null;
      console.log('Set custom options, selected:', selectedStyleId);
    }
  });

  function selectStyle(styleId: string) {
    console.log('Selecting style:', styleId);
    selectedStyleId = styleId;
    console.log('Selected style ID is now:', selectedStyleId);
  }

  function goBack() {
    console.log('Going back to step 1');
    step.set(1);
  }

  function proceedToNext() {
    // Store the selected style and proceed to step 2 (mint connection)
    const currentStyleObj = styleOptions.find(style => style.id === selectedStyleId);
    if (currentStyleObj) {
      selectedStyle.set(currentStyleObj);
      console.log('Selected style:', currentStyleObj);
      step.set(2);
    }
  }

  // Get the currently selected style object
  let currentStyle = $derived(styleOptions.find(style => style.id === selectedStyleId));
</script>

<div class="w-full h-full flex">
  <!-- Left Sidebar - Styles -->
  <div class="w-64 bg-gray-50 p-4 border-r border-gray-200 flex flex-col h-[600px]">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Styles</h3>
    
    <div class="flex-1 overflow-y-auto space-y-2 pr-2">
      {#each styleOptions as style}
        <button
          class="w-full p-2 bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md {selectedStyleId === style.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}"
          onclick={() => selectStyle(style.id)}
        >
          <div class="aspect-[3/2] bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            {#if style.type === 'comic' && style.design}
              <div class="scale-50 transform pointer-events-none">
                <ComicNote
                  design={style.design}
                  denomination={100}
                  mintUrl="example.mint.com"
                  token="example-token"
                  unit="sat"
                />
              </div>
            {:else if style.type === 'custom' && style.colorCode}
              <div class="scale-50 transform pointer-events-none">
                <CustomNote
                  denomination={100}
                  mintUrl="example.mint.com"
                  token="example-token"
                  colorCode={style.colorCode}
                  cornerBrandLogoURL=""
                  brandLogoURL=""
                  unit="sat"
                />
              </div>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Right Section - Preview -->
  <div class="flex-1 p-6 flex flex-col">
    <h2 class="text-2xl font-bold text-gray-900 mb-3">Customize your note</h2>
    
    <!-- Large Preview -->
    <div class="flex-1 flex justify-center items-center">
      <div class="w-full max-w-3xl">
        {#if currentStyle}
          {#if currentStyle.type === 'comic' && currentStyle.design}
            <ComicNote
              design={currentStyle.design}
              denomination={100}
              mintUrl="example.mint.com"
              token="example-token"
              unit="sat"
            />
          {:else if currentStyle.type === 'custom' && currentStyle.colorCode}
            <CustomNote
              denomination={100}
              mintUrl="example.mint.com"
              token="example-token"
              colorCode={currentStyle.colorCode}
              cornerBrandLogoURL=""
              brandLogoURL=""
              unit="sat"
            />
          {:else}
            <div class="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p class="text-lg font-semibold mb-2">Style type not supported</p>
              <p>Style: {JSON.stringify(currentStyle)}</p>
            </div>
          {/if}
        {:else}
          <div class="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p class="text-lg font-semibold mb-2">No style selected</p>
            <p>Available styles: {styleOptions.length}</p>
            <p>Selected ID: {selectedStyleId || 'none'}</p>
            <p>Current Style: {currentStyle ? 'Found' : 'Not found'}</p>
            <p>Template Type: {selectedTemplate.type}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Bottom Navigation -->
<div class="flex justify-between items-center mt-8 px-6 pb-6">
  <!-- Back button -->
  <button 
    class="btn btn-secondary px-6 py-2"
    onclick={goBack}
  >
    ← Back
  </button>
  
  <!-- Next button -->
  <button 
    class="btn px-6 py-2 transition-all duration-200 hover:scale-105"
    style="background-color: #E4690A; color: white; border: 2px solid #A94705;"
    onclick={proceedToNext}
  >
    Next →
  </button>
</div>
