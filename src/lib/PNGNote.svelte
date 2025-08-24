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
    pngUrl: string; // URL to your PNG image
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
    qrPosition = { x: 50, y: 50, width: 100, height: 100 } // Default position
  }: Props = $props();

  let imageURL = $state("");

  const randomID = bytesToHex(secp256k1.utils.randomPrivateKey()).slice(0, 12);

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
      // Use html2canvas or similar library to capture the entire note
      // For now, we'll create a simple download of the PNG with QR overlay
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size to match your PNG
        canvas.width = 800; // Adjust based on your PNG size
        canvas.height = 400; // Adjust based on your PNG size
        
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
            link.download = `${mintUrl}_${denomination}_${unit}.png`;
            link.href = canvas.toDataURL();
            link.click();
          };
          qrImg.src = imageURL;
        };
        img.src = pngUrl;
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
    src={pngUrl} 
    alt="Note Background" 
    class="absolute top-0 left-0 w-full h-full object-cover"
  />
  
  <!-- QR Code Overlay -->
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
    class="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Download Note
  </button>
</div>
