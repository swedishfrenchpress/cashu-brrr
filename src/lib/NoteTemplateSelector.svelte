<script lang="ts">
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import ChaumNote from "./ChaumNote.svelte";
  import { step, selectedTemplate, selectedStyle } from "./stores.svelte";
  
  interface NoteTemplate {
    id: string;
    name: string;
    type: 'comic' | 'custom' | 'sovereign' | 'chaum' | 'meadows';
    design?: number;
    preview: string;
  }

  // Available note templates - based on the comic designs (3-25) and custom notes
  const noteTemplates: NoteTemplate[] = [
    { id: 'custom-1', name: 'Custom Note', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'bitpopart-1', name: 'Bitpopart', type: 'comic', design: 7, preview: '/Ecash_Note_template.svg' },
    { id: 'sovereign-1', name: 'Sovereign Note', type: 'sovereign', design: 6, preview: '/Soverign_Note.png' },
    { id: 'chaum-1', name: 'Chaum Note', type: 'chaum', preview: '/Chaum-note.jpg' },
    { id: 'meadows-1', name: 'Mr. Meadows', type: 'meadows', preview: '/mr-meadows-note.svg' },
  ];

  let selectedTemplateId = $state<string | null>(null);

  function selectTemplate(template: NoteTemplate) {
    selectedTemplateId = template.id;
    // Store the selected template in the store
    selectedTemplate.set(template);
    
    // For Chaum Note and Mr. Meadows, also set the selectedStyle immediately
    if (template.type === 'chaum') {
      selectedStyle.set({
        id: 'chaum-1',
        name: 'Chaum Note',
        type: 'chaum'
      });
      console.log('Set selectedStyle for Chaum Note immediately');
    } else if (template.type === 'meadows') {
      selectedStyle.set({
        id: 'meadows-1',
        name: 'Mr. Meadows',
        type: 'meadows'
      });
      console.log('Set selectedStyle for Mr. Meadows immediately');
    }
    
    console.log('Selected template:', template);
  }

  function proceedToNextStep() {
    if (selectedTemplate) {
      // For Chaum Note and Mr. Meadows, skip customization and go directly to mint connection
      if ($selectedTemplate?.type === 'chaum') {
        console.log('Proceeding to mint connection for Chaum Note');
        step.set(3); // Go directly to mint connection step
      } else if ($selectedTemplate?.type === 'meadows') {
        console.log('Proceeding to mint connection for Mr. Meadows');
        step.set(3); // Go directly to mint connection step
      } else {
        // For other notes, proceed to style selection step
        step.set(2);
      }
    }
  }
</script>

<div class="w-full h-full flex flex-col p-8" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold mb-4" style="color: #4E4318;">Choose Your Note Style</h2>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto">Select from our collection of beautifully designed ecash notes. Each style has its own unique character and charm.</p>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col justify-center">
    <!-- Note Selection Section -->
    <div class="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
      {#each noteTemplates as template}
        <div class="flex flex-col items-center">
          <button
            class="group relative bg-white rounded-xl p-6 transition-all duration-300 flex flex-col items-center shadow-sm hover:shadow-lg border-2 {selectedTemplateId === template.id ? 'border-orange-500 shadow-lg scale-105' : 'border-gray-100 hover:border-orange-200'}"
            style="width: 320px; height: 320px;"
            onclick={() => selectTemplate(template)}
          >
            {#if template.type === 'comic' && template.design}
              <div style="transform: scale(0.8);">
                <ComicNote
                  design={template.design}
                  denomination={100}
                  mintUrl="example.mint.com"
                  token="example-token"
                  unit="sat"
                />
              </div>
            {:else if template.type === 'custom'}
              <div style="transform: scale(0.8);">
                <CustomNote
                  denomination={100}
                  mintUrl="example.mint.com"
                  token="example-token"
                  colorCode="#E4690A"
                  cornerBrandLogoURL=""
                  brandLogoURL=""
                  unit="sat"
                />
              </div>
            {:else if template.type === 'sovereign'}
              <div style="transform: scale(0.8);">
                <SovereignNote
                  denomination={0}
                  mintUrl="example.mint.com"
                  token="example-token"
                  unit="sat"
                />
              </div>
            {:else if template.type === 'chaum'}
              <div style="transform: scale(0.8);">
                <ChaumNote
                  denomination={0}
                  mintUrl="example.mint.com"
                  token="example-token"
                  unit="sat"
                />
              </div>
            {:else if template.type === 'meadows'}
              <div style="transform: scale(0.8);">
                <img 
                  src="/mr-meadows-note.svg" 
                  alt="Mr. Meadows Note" 
                  style="width: 100%; height: auto;"
                />
              </div>
            {/if}
            <h3 class="text-lg font-semibold mt-4 text-center" style="color: #4E4318;">
              {template.name}
            </h3>
          </button>
        </div>
      {/each}
    </div>

    <!-- Navigation -->
    <div class="flex justify-end mt-12">
      <button 
        class="px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: {selectedTemplateId ? '#E4690A' : '#9CA3AF'}; color: white; border: 2px solid {selectedTemplateId ? '#A94705' : '#6B7280'};"
        onclick={proceedToNextStep}
        disabled={!selectedTemplateId}
      >
        Continue →
      </button>
    </div>
  </div>
</div>
