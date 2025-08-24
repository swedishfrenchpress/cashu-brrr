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
  <!-- PNG Background -->
  <img 
    src="/Chaum-note.jpg" 
    alt="Chaum Note" 
    class="absolute top-0 left-0 w-full h-full object-contain"
  />

  <!-- QR Code Overlay - positioned on the right side -->
  <img 
    src={imageURL} 
    alt="QR Code" 
    class="absolute"
    style="
      right: 0%;
      left: 40%;
      top: 15%; 
      width: 75%; 
      height: 70%; 
      object-fit: contain;
    "
  />

  <!-- Amount Display - positioned at bottom left of the note -->
  {#if denomination > 0}
    <div 
      class="absolute font-bold chaum-denomination denomination-text {isPrint ? 'print-size' : ''}"
      style="
        left: 5%;
        bottom: 0%;
        color: #1E4C50;
        -webkit-text-stroke: 0.5px #F7EFC0;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        font-family: 'Roboto',sans-serif;
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
