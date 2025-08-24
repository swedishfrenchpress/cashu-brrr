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
  }

  let {
    denomination,
    mintUrl,
    token,
    unit
  }: Props = $props();

  let imageURL = $state("");

  const randomID = bytesToHex(secp256k1.utils.randomPrivateKey()).slice(0, 12);

  // QR code position for the left textured area
  const qrPosition = {
    x: 80,  // Adjust these values based on your PNG dimensions
    y: 200, // and the exact position you want the QR code
    width: 120,
    height: 120
  };

  onMount(() => {
    const element = document.getElementById("qr-" + randomID);
    if (element && element instanceof HTMLCanvasElement) {
      imageURL = element.toDataURL();
    }
  });

  const downloadNote = async (e: Event) => {
    const target = e.target as HTMLElement;
    const container = target.closest('.note-container');
    if (container) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size to match your PNG (adjust these dimensions)
        canvas.width = 800;  // Adjust based on your PNG width
        canvas.height = 400; // Adjust based on your PNG height
        
        // Load and draw the PNG background
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Load and draw the QR code
          const qrImg = new Image();
          qrImg.onload = () => {
            ctx.drawImage(qrImg, qrPosition.x, qrPosition.y, qrPosition.width, qrPosition.height);
            
            // Download the combined image
            const link = document.createElement('a');
            link.download = `grumpy-king-${denomination}-${unit}.png`;
            link.href = canvas.toDataURL();
            link.click();
          };
          qrImg.src = imageURL;
        };
        img.src = '/Soverign_Note.png'; // Your PNG filename
      }
    }
  };
</script>

<div class="invisible h-0">
  <QRCodeImage
    text={token}
    scale={9}
    displayType="canvas"
    displayID="qr-{randomID}"
  />
</div>

<div class="note-container w-full relative" style="width: 800px; height: 400px;">
  <!-- PNG Background -->
  <img 
    src="/Soverign_Note.png" 
    alt="Grumpy King Note" 
    class="absolute top-0 left-0 w-full h-full object-cover"
  />
  
  <!-- QR Code Overlay - positioned in the left textured area -->
  <img 
    src={imageURL} 
    alt="QR Code" 
    class="absolute"
    style="
      left: {qrPosition.x}px; 
      top: {qrPosition.y}px; 
      width: {qrPosition.width}px; 
      height: {qrPosition.height}px;
    "
  />
  
  <!-- Download Button -->
  <button 
    on:click={downloadNote}
    class="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
  >
    Download Note
  </button>
</div>

<style>
  .note-container {
    max-width: 100%;
    height: auto;
  }
  
  /* Ensure the note maintains its aspect ratio */
  .note-container img {
    max-width: 100%;
    height: auto;
  }
</style>
