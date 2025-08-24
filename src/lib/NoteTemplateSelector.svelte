<script lang="ts">
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import ChaumNote from "./ChaumNote.svelte";
  import { step, selectedTemplate, selectedStyle } from "./stores.svelte";
  
  interface NoteTemplate {
    id: string;
    name: string;
    type: 'comic' | 'custom' | 'sovereign' | 'chaum';
    design?: number;
    preview: string;
  }

  // Available note templates - based on the comic designs (3-25) and custom notes
  const noteTemplates: NoteTemplate[] = [
    { id: 'custom-1', name: 'Custom Note', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'bitpopart-1', name: 'Bitpopart', type: 'comic', design: 7, preview: '/Ecash_Note_template.svg' },
    { id: 'sovereign-1', name: 'Sovereign Note', type: 'sovereign', design: 6, preview: '/Soverign_Note.png' },
    { id: 'chaum-1', name: 'Chaum Note', type: 'chaum', preview: '/Chaum-note.jpg' },
  ];

  let selectedTemplateId = $state<string | null>(null);

  function selectTemplate(template: NoteTemplate) {
    selectedTemplateId = template.id;
    // Store the selected template in the store
    selectedTemplate.set(template);
    
    // For Chaum Note, also set the selectedStyle immediately
    if (template.type === 'chaum') {
      selectedStyle.set({
        id: 'chaum-1',
        name: 'Chaum Note',
        type: 'chaum'
      });
      console.log('Set selectedStyle for Chaum Note immediately');
    }
    
    console.log('Selected template:', template);
  }

  function proceedToNextStep() {
    if (selectedTemplate) {
      // For Chaum Note, skip customization and go directly to mint connection
      if ($selectedTemplate?.type === 'chaum') {
        console.log('Proceeding to mint connection for Chaum Note');
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
  <div class="text-center mb-8">
    <h2 class="text-left text-3xl font-bold text-gray-900 mb-2" style="color: #4E4318;">Select a note style</h2>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col justify-center">
    <!-- Note Selection Section -->
    <div class="flex flex-col items-center gap-12 px-8">
      <!-- First row: Custom Note and Bitpopart -->
      <div class="flex justify-center items-center gap-16">
        {#each noteTemplates.slice(0, 2) as template}
          <div class="flex flex-col items-center">
            <button
              class="border-2 rounded-lg p-6 transition-all duration-200 flex flex-col items-center {selectedTemplateId === template.id ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}"
              style="width: 280px; height: 280px;"
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
              {/if}
              <h3 class="text-base font-normal mt-4 text-center" style="color: #4E4318;">
                {template.name}
              </h3>
            </button>
          </div>
        {/each}
      </div>
      
      <!-- Second row: Sovereign Note and Chaum Note -->
      <div class="flex justify-center items-center gap-16">
        {#each noteTemplates.slice(2) as template}
          <div class="flex flex-col items-center">
            <button
              class="border-2 rounded-lg p-6 transition-all duration-200 flex flex-col items-center {selectedTemplateId === template.id ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}"
              style="width: 280px; height: 280px;"
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
              {/if}
              <h3 class="text-base font-normal mt-4 text-center" style="color: #4E4318;">
                {template.name}
              </h3>
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center mt-8 px-6 pb-6">
    <div></div> <!-- Empty div for spacing -->
    <button 
      class="btn px-6 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      style="background-color: {selectedTemplateId ? '#E4690A' : '#9CA3AF'}; color: white; border: 2px solid {selectedTemplateId ? '#A94705' : '#6B7280'};"
      onclick={proceedToNextStep}
      disabled={!selectedTemplateId}
    >
      Next →
    </button>
  </div>
</div>
