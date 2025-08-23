<script lang="ts">
  import ComicNote from "./ComicNote.svelte";
  import CustomNote from "./CustomNote.svelte";
  import { step, selectedTemplate } from "./stores.svelte";
  
  interface NoteTemplate {
    id: string;
    name: string;
    type: 'comic' | 'custom';
    design?: number;
    preview: string;
  }

  // Available note templates - based on the comic designs (3-25) and custom notes
  const noteTemplates: NoteTemplate[] = [
    { id: 'custom-1', name: 'Custom Note', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'bitpopart-1', name: 'Bitpopart', type: 'comic', design: 7, preview: '/Ecash_Note_template.svg' },
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
  <div class="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
    <!-- Note Selection Section -->
    <div class="bg-transparent rounded-xl border-0 p-8 mb-8">
      <div class="flex justify-center gap-8">
        {#each noteTemplates as template}
          <button
            class="group relative bg-transparent rounded-lg transition-all duration-200 p-4 border-2 {selectedTemplateId === template.id ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}"
            onclick={() => selectTemplate(template)}
          >
            <!-- Note Preview -->
            <div class="mb-4 h-48 flex items-center justify-center">
              {#if template.type === 'comic' && template.design}
                <div class="scale-75 transform pointer-events-none">
                  <ComicNote
                    design={template.design}
                    denomination={100}
                    mintUrl="example.mint.com"
                    token="example-token"
                    unit="sat"
                  />
                </div>
              {:else if template.type === 'custom'}
                <div class="scale-75 transform pointer-events-none">
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
              {:else}
                <!-- Fallback placeholder -->
                <div class="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center pointer-events-none">
                  <span class="text-amber-600 font-semibold">Custom</span>
                </div>
              {/if}
            </div>
            
            <!-- Template Name -->
            <h3 class="text-base font-normal transition-colors" style="color: #4E4318;">
              {template.name}
            </h3>
          </button>
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
