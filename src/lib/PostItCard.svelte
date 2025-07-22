<script lang="ts">
    export let title: string;
    export let body: string;
    export let rotation: string = "rotate-0"; // e.g., "rotate-12"
  </script>
  
  <div class={`bg-yellow-200 shadow-lg rounded-lg p-6 w-64 h-64 flex flex-col items-center justify-center ${rotation} border-2 border-yellow-300`} style="clip-path: polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%);">
    <h3 class="font-sedgwick text-2xl mb-2 text-gray-900 text-center">{title}</h3>
    <p class="font-sedgwick text-lg text-gray-800 text-center">{body}</p>
  </div>