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
      {denomination}<span class="btc">B</span>
    </div>
  {/if}
</div>

<style>
  .note-container {
    container-type: inline-size;
  }

  .chaum-denomination {
    font-family: "Ultra", Georgia, serif;
    font-weight: 400;
    font-size: 6cqw;
    line-height: 1;
    white-space: nowrap;
    color: #f7efc0;
    /* One outline for the figures and the drawn bitcoin strokes alike */
    filter: drop-shadow(1px 0 0 #1e4c50) drop-shadow(-1px 0 0 #1e4c50) drop-shadow(0 1px 0 #1e4c50)
      drop-shadow(0 -1px 0 #1e4c50);
  }
  /* Ultra has no ₿, so the sign is its own B with the two strokes drawn through the top and bottom */
  .btc {
    position: relative;
    display: inline-block;
    margin-left: 0.04em;
  }
  .btc::before,
  .btc::after {
    content: "";
    position: absolute;
    left: 0.17em;
    width: 0.3em;
    height: 0.2em;
    box-sizing: border-box;
    border-left: 0.07em solid currentColor;
    border-right: 0.07em solid currentColor;
  }
  .btc::before {
    top: 0.02em;
  }
  .btc::after {
    bottom: 0;
  }
</style>
