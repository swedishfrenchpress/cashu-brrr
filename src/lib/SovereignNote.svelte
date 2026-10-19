<script lang="ts">
  import { onMount } from "svelte";
  import { QRCodeImage } from "svelte-qrcode-image";

  interface Props {
    denomination: number;
    mintUrl: string;
    token: string;
    unit: string;
    isPrint?: boolean;
    design?: string;
  }

  // Color mapping for different Sovereign Note designs
  const designColors = {
    'Soverign_Note.png': '#8B4513', // Classic brown
    'Leafy-Nature-Note.png': '#2D5016', // Dark green
    'Nostr-note-1.png': '#581C87', // Dark purple
    'Nostr-note-2.png': '#581C87', // Dark purple
    'Nostr-Note-3.png': '#581C87', // Dark purple
    'Pizza-day-orange.png': '#D97706', // Orange
    'Pizzaday-green.png': '#059669', // Green
    'Satoshi-nirvana.png': '#B45309', // Dark orange
    'Taj-India-Note.png': '#92400E', // Dark brown
    'Your-honor.png': '#581C87', // Dark purple
  };

  let {
    denomination,
    mintUrl,
    token,
    unit,
    isPrint = false,
    design = 'Soverign_Note.png'
  }: Props = $props();

  // Get the appropriate text color for the current design
  let textColor = $derived(designColors[design as keyof typeof designColors] || '#8B4513');

  let imageURL = $state("");

  const randomID = crypto.randomUUID().replaceAll("-", "").slice(0, 12);

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

<!-- Artwork is 3500 x 1672; the QR sits in the textured panel on the left -->
<div class="note-container w-full relative" style="aspect-ratio: 3500/1672;">
  <img
    src={isPrint ? `/${design}` : `/previews/${design.replace(/\.png$/, ".webp")}`}
    alt="Sovereign Note"
    class="absolute top-0 left-0 w-full h-full"
  />

  {#if imageURL}
    <img
      src={imageURL}
      alt="QR code"
      class="absolute"
      style="left: 6%; top: 13.4%; width: 25%; height: 68%; object-fit: contain;"
    />
  {/if}

  {#if denomination > 0}
    <div class="absolute sovereign-denomination" style="right: 6%; bottom: 18.6%; color: {textColor};">
      {denomination}₿
    </div>
  {/if}
</div>

<style>
  .note-container {
    container-type: inline-size;
  }

  .sovereign-denomination {
    font-family: "Porter Sans Inline Block", sans-serif;
    font-size: 7cqw;
    line-height: 1;
    white-space: nowrap;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  }
</style>
