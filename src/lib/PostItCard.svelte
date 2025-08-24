<script lang="ts">
    export let title: string;
    export let body: string;
    export let rotation: string = "rotate-0"; // e.g., "rotate-12"
  </script>
  
  <div class={`bg-yellow-200 shadow-lg rounded-lg p-6 w-80 h-80 flex flex-col items-start justify-start ${rotation} border-2 border-yellow-300 postit-card`} style="clip-path: polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%);">
    <h3 class="font-sedgwick text-2xl mb-2 text-gray-900 text-left">{title}</h3>
    <p class="font-sedgwick text-lg text-gray-800 text-left leading-tight">{body}</p>
  </div>