<script lang="ts">
  import { onMount } from "svelte";
  import QRCode from "qrcode";
  
  interface Props {
    denomination: number;
    mintUrl: string;
    token: string;
    unit?: string;
  }
  
  let { denomination, mintUrl, token, unit = "sat" }: Props = $props();
  
  let qrCodeDataUrl = $state("");
  
  onMount(async () => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(token, {
        width: 80,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      qrCodeDataUrl = qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  });
</script>

<style>
  @media print {
    .note-container {
      width: 800px !important;
      height: 500px !important;
    }
    
    .note-container img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
    }
    
    .qr-code-overlay {
      top: 240px !important;
      right: 20px !important;
    }
    
    .qr-code-overlay img {
      width: 160px !important;
      height: 160px !important;
    }
  }
</style>

<div class="note-container" style="width: 400px; height: 250px; position: relative;">
  <img 
    src="/sfnote.jpg" 
    alt="SF Note" 
    style="width: 100%; height: 100%; object-fit: contain;"
  />
  
  <!-- QR Code overlay on the right side -->
  {#if qrCodeDataUrl}
    <div class="qr-code-overlay" style="position: absolute; top: 120px; right: 10px; background: white; padding: 4px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <img src={qrCodeDataUrl} alt="QR Code" style="width: 80px; height: 80px;" />
    </div>
  {/if}
</div>
