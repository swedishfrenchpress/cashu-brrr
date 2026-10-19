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

<!-- Artwork is 2216 x 1147; the QR sits inside the cream window on the right -->
<div class="note-container w-full relative" style="aspect-ratio: 2216/1147;">
  <img
    src={isPrint ? "/Chaum-note.jpg" : "/previews/Chaum-note.webp"}
    alt="Chaum Note"
    class="absolute top-0 left-0 w-full h-full"
  />

  {#if imageURL}
    <img
      src={imageURL}
      alt="QR code"
      class="absolute"
      style="left: 64.6%; top: 22.6%; width: 28.8%; height: 55.7%; object-fit: contain;"
    />
  {/if}

  {#if denomination > 0}
    <div class="absolute chaum-denomination" style="left: 5%; bottom: 20%;">
      {denomination}₿
    </div>
  {/if}
</div>

<style>
  .note-container {
    container-type: inline-size;
  }

  .chaum-denomination {
    font-family: "Martian Mono", monospace;
    font-weight: 600;
    font-size: 6.5cqw;
    line-height: 1;
    white-space: nowrap;
    color: #f7efc0;
    text-shadow:
      -1px -1px 0 #1e4c50,
      1px -1px 0 #1e4c50,
      -1px 1px 0 #1e4c50,
      1px 1px 0 #1e4c50;
  }
</style>
