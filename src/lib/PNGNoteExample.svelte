<script lang="ts">
  import PNGNote from './PNGNote.svelte';
  import SVGPNGNote from './SVGPNGNote.svelte';
  import CanvasPNGNote from './CanvasPNGNote.svelte';

  // Example data
  const exampleData = {
    denomination: 1000,
    mintUrl: "https://example.com",
    token: "cashuA...", // Your actual token
    unit: "sat",
    pngUrl: "/path/to/your/note-design.png", // Your PNG image
    qrPosition: { x: 300, y: 150, width: 120, height: 120 }
  };
</script>

<div class="space-y-8 p-4">
  <h1 class="text-2xl font-bold">PNG Note Examples</h1>
  
  <div class="space-y-4">
    <h2 class="text-xl">Simple PNG with QR Overlay</h2>
    <PNGNote {...exampleData} />
  </div>
  
  <div class="space-y-4">
    <h2 class="text-xl">SVG with PNG Background</h2>
    <SVGPNGNote {...exampleData} svgWidth={800} svgHeight={400} />
  </div>
  
  <div class="space-y-4">
    <h2 class="text-xl">Canvas-Based Solution</h2>
    <CanvasPNGNote {...exampleData} canvasWidth={800} canvasHeight={400} />
  </div>
</div>
