<script lang="ts">
  import { onMount } from "svelte";
  import { QRCodeImage } from "svelte-qrcode-image";

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

  const randomID = crypto.randomUUID().replaceAll("-", "").slice(0, 12);

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

<!-- Artwork is 595 x 239; the QR sits on the right, clear of the CASHU.SPACE mark -->
<div class="note-container w-full relative" style="aspect-ratio: 595/239;">
  <img
    src={isPrint ? "/mr-meadows-note.svg" : "/previews/mr-meadows-note.webp"}
    alt="Mr. Meadows Note"
    class="absolute top-0 left-0 w-full h-full"
  />

  {#if imageURL}
    <img
      src={imageURL}
      alt="QR code"
      class="absolute"
      style="left: 77.5%; top: 29%; width: 20%; height: 50%; object-fit: contain;"
    />
  {/if}

  {#if denomination > 0}
    <div class="absolute meadows-denomination" style="left: 6%; top: 3%;">
      {denomination}
    </div>
  {/if}
</div>

<style>
  .note-container {
    container-type: inline-size;
  }

  .meadows-denomination {
    font-family: "Dela Gothic One", sans-serif;
    font-size: 6cqw;
    line-height: 1;
    white-space: nowrap;
    color: #000;
  }
</style>
