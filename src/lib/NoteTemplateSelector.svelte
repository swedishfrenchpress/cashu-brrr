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
    { id: 'sovereign-1', name: 'Sovereign note', type: 'comic', design: 5, preview: '/Ecash_Note_template.svg' },
    { id: 'bitpopart-1', name: 'Bitpopart', type: 'comic', design: 7, preview: '/Ecash_Note_template.svg' },
    { id: 'custom-2', name: 'Custom notes', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'custom-3', name: 'Custom notes', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'custom-4', name: 'Custom notes', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'custom-5', name: 'Custom notes', type: 'custom', preview: '/Ecash_Note_template.svg' },
    { id: 'custom-6', name: 'Custom notes', type: 'custom', preview: '/Ecash_Note_template.svg' },
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
      // Proceed to customization step (still step 1, but different view)
      step.set(1.5); // Use 1.5 to indicate customization phase
    }
  }
</script>

<div class="w-full max-w-6xl mx-auto p-6">
  <h2 class="text-3xl font-bold text-center mb-8">Pick one</h2>
  
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    {#each noteTemplates as template}
              <button
          class="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 border-2 {selectedTemplateId === template.id ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}"
          onclick={() => selectTemplate(template)}
        >
        <!-- Note Preview -->
        <div class="aspect-[3/2] mb-4 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {#if template.type === 'comic' && template.design}
            <div class="scale-50 transform pointer-events-none">
              <ComicNote
                design={template.design}
                denomination={100}
                mintUrl="example.mint.com"
                token="example-token"
                unit="sat"
              />
            </div>
          {:else if template.type === 'custom'}
            <div class="scale-50 transform pointer-events-none">
              <CustomNote
                denomination={100}
                mintUrl="example.mint.com"
                token="example-token"
                colorCode="#10B981"
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
        <h3 class="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        
        <!-- Selected indicator -->
        {#if selectedTemplateId === template.id}
          <div class="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Bottom Navigation -->
  <div class="flex justify-between items-center mt-8 px-6 pb-6">
    <!-- Left side - empty for now, will be back button in future steps -->
    <div></div>
    
    <!-- Right side - next button -->
    <button 
      class="btn px-6 py-2 transition-all duration-200 {selectedTemplateId ? 'hover:scale-105' : ''}"
      style="background-color: {selectedTemplateId ? '#E4690A' : '#9CA3AF'}; color: white; border: 2px solid {selectedTemplateId ? '#A94705' : '#6B7280'};"
      onclick={proceedToNextStep}
      disabled={!selectedTemplateId}
    >
      Go Brrrrrrrrrrrr →
    </button>
  </div>
</div>
