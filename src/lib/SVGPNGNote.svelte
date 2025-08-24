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
    svgWidth: number;
    svgHeight: number;
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
    svgWidth = 800,
    svgHeight = 400,
    qrPosition = { x: 50, y: 50, width: 100, height: 100 }
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
    const svg = target.closest('svg');
    if (svg) {
      const xml = new XMLSerializer().serializeToString(svg);
      const svg64 = btoa(xml);
      var a = document.createElement("a");
      a.href = "data:image/svg+xml;base64," + svg64;
      a.download = `${mintUrl}_${denomination}_${unit}.svg`;
      a.click();
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

<div class="w-full">
  <svg
    version="1.1"
    viewBox="0 0 {svgWidth} {svgHeight}"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <!-- Define the PNG as a pattern or image -->
      <pattern id="pngBackground" patternUnits="userSpaceOnUse" width="{svgWidth}" height="{svgHeight}">
        <image href={pngUrl} width="{svgWidth}" height="{svgHeight}" />
      </pattern>
    </defs>
    
    <!-- Background rectangle with PNG pattern -->
    <rect width="{svgWidth}" height="{svgHeight}" fill="url(#pngBackground)" />
    
    <!-- QR Code positioned exactly where you want it -->
    <image
      href={imageURL}
      x="{qrPosition.x}"
      y="{qrPosition.y}"
      width="{qrPosition.width}"
      height="{qrPosition.height}"
    />
    
    <!-- Optional: Add text overlays for denomination, etc. -->
    <text x="20" y="30" font-family="Arial" font-size="16" fill="black">
      {denomination} {unit}
    </text>
    
    <!-- Download button (will be part of the SVG) -->
    <rect x="{svgWidth - 120}" y="{svgHeight - 40}" width="100" height="30" 
          fill="#3B82F6" rx="5" />
    <text x="{svgWidth - 70}" y="{svgHeight - 20}" font-family="Arial" font-size="12" 
          fill="white" text-anchor="middle" on:click={downloadNote}>
      Download
    </text>
  </svg>
</div>
