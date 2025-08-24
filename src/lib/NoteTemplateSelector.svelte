<script lang="ts">
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import SovereignNote from "./SovereignNote.svelte";
  import { step, selectedTemplate } from "./stores.svelte";
  
  interface NoteTemplate {
    id: string;
    name: string;
    type: 'comic' | 'custom' | 'sovereign';
    design?: number;
    preview: string;
  }

  // Available note templates - based on the comic designs (3-25) and custom notes
  const noteTemplates: NoteTemplate[] = [
    { id: 'custom-1', name: 'Custom Note', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'bitpopart-1', name: 'Bitpopart', type: 'comic', design: 7, preview: '/Ecash_Note_template.svg' },
    { id: 'sovereign-1', name: 'Sovereign Note', type: 'sovereign', design: 6, preview: '/Soverign_Note.png' },
  ];

  let selectedTemplateId = $state<string | null>(null);

  function selectTemplate(template: NoteTemplate) {
    selectedTemplateId = template.id;
    // Store the selected template in the store
    selectedTemplate.set(template);
    console.log('Selected template:', template);
  }

  function proceedToNextStep() {
    if (selectedTemplate) {
      // Proceed to style selection step
      step.set(2);
    }
  }
</script>

<div class="w-full h-full flex flex-col p-8" style="background-color: #FFFCF6; border: 1px solid rgba(255, 222, 55, 0.35); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
  <!-- Header -->
  <div class="text-center mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2" style="color: #4E4318;">Pick one</h2>
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
                <div style="transform: scale(0.65);">
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
                    denomination={100}
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
      
      <!-- Second row: Sovereign Note centered -->
      <div class="flex justify-center items-center">
        {#each noteTemplates.slice(2) as template}
          <div class="flex flex-col items-center">
            <button
              class="border-2 rounded-lg p-6 transition-all duration-200 flex flex-col items-center {selectedTemplateId === template.id ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}"
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
                <div style="transform: scale(0.65);">
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
                    denomination={100}
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
