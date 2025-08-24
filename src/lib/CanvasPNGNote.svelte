<script lang="ts">
  import { onMount } from "svelte";
  import { QRCodeImage } from "svelte-qrcode-image";
  import { secp256k1 } from "@noble/curves/secp256k1";
  import { bytesToHex } from "@noble/curves/abstract/utils";

  interface Props {
    denomination: number;
    mintUrl: string;
    token: string;
    unit: string;
    pngUrl: string;
    canvasWidth: number;
    canvasHeight: number;
    qrPosition: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }

  let {
    denomination,
    mintUrl,
    token,
    unit,
    pngUrl,
    canvasWidth = 800,
    canvasHeight = 400,
    qrPosition = { x: 50, y: 50, width: 100, height: 100 }
  }: Props = $props();

  let imageURL = $state("");
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const randomID = bytesToHex(secp256k1.utils.randomPrivateKey()).slice(0, 12);

  onMount(() => {
    const element = document.getElementById("qr-" + randomID);
    if (element && element instanceof HTMLCanvasElement) {
      imageURL = element.toDataURL();
      renderCanvas();
    }
  });

  const renderCanvas = () => {
    if (!canvas || !ctx || !imageURL) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Load and draw PNG background
    const bgImg = new Image();
    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
      
      // Load and draw QR code
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrPosition.x, qrPosition.y, qrPosition.width, qrPosition.height);
        
        // Add text overlays
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`${denomination} ${unit}`, 20, 30);
        
        // Add mint URL
        ctx.font = '12px Arial';
        ctx.fillText(mintUrl, 20, canvasHeight - 20);
      };
      qrImg.src = imageURL;
    };
    bgImg.src = pngUrl;
  };

  const downloadNote = () => {
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${mintUrl}_${denomination}_${unit}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Watch for changes and re-render
  $effect(() => {
    if (imageURL) {
      renderCanvas();
    }
  });
</script>

<div class="invisible h-0">
  <QRCodeImage
    text={token}
    scale={9}
    displayType="canvas"
    displayID="qr-{randomID}"
  />
</div>

<div class="w-full flex flex-col items-center gap-4">
  <canvas
    bind:this={canvas}
    width={canvasWidth}
    height={canvasHeight}
    class="border border-gray-300"
  ></canvas>
  
  <button 
    on:click={downloadNote}
    class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
  >
    Download Note
  </button>
</div>

<style>
  canvas {
    max-width: 100%;
    height: auto;
  }
</style>
