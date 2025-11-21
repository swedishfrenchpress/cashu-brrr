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
  <!-- SVG Background -->
  <img 
    src="/mr-meadows-note.svg" 
    alt="Mr. Meadows Note" 
    class="absolute top-0 left-0 w-full h-full object-contain"
  />
  
  <!-- QR Code Overlay -->
  <img 
    src={imageURL} 
    alt="QR Code" 
    class="absolute"
    style="
      left: 75%; 
      top: 15%; 
      width: 25%; 
      height: 65%;
      object-fit: contain;
    "
  />
  
  <!-- Amount Display -->
  {#if denomination > 0}
    <div 
      class="absolute font-bold meadows-denomination denomination-text {isPrint ? 'print-size' : ''}"
      style="
        left: 6%;
        top: 2%;
        color: #000000;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        font-family: 'Dela Gothic One', sans-serif;
        white-space: nowrap;
      "
    >
      {denomination}
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
