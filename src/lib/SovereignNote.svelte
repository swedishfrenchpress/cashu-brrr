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
    isPrint?: boolean;
  }

  let {
    denomination,
    mintUrl,
    token,
    unit,
    isPrint = false
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


</script>

<div class="invisible h-0">
  <QRCodeImage
    text={token}
    scale={9}
    displayType="canvas"
    displayID="qr-{randomID}"
  />
</div>

<div class="note-container w-full relative" style="aspect-ratio: 2/1; max-width: 100%;">
  <!-- PNG Background -->
  <img 
    src="/Soverign_Note.png" 
    alt="Sovereign Note" 
    class="absolute top-0 left-0 w-full h-full object-contain"
  />
  
  <!-- QR Code Overlay - positioned in the left textured area -->
  <img 
    src={imageURL} 
    alt="QR Code" 
    class="absolute"
    style="
      left: 10%; 
      top: 25%; 
      width: 15%; 
      height: 30%;
    "
  />
  
  <!-- Amount Display - positioned at bottom right of the note -->
  {#if denomination > 0}
    <div 
      class="absolute font-bold sovereign-denomination denomination-text {isPrint ? 'print-size' : ''}"
      style="
        right: 6%;
        bottom: 20%;
        color: #8B4513;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        font-family: 'Porter Sans Inline Block', sans-serif;
        white-space: nowrap;
      "
    >
      {denomination}₿
    </div>
  {/if}
  

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
  
  /* Default font size for preview */
  .denomination-text {
    font-size: 0.75rem;
  }
  
  /* Print-specific font size for denomination text */
  .denomination-text.print-size {
    font-size: 42px;
  }
</style>
