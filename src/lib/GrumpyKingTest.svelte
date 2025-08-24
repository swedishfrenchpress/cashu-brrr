<script lang="ts">
  import GrumpyKingNote from './GrumpyKingNote.svelte';

  // Sample test data - replace with real token when testing
  const testData = {
    denomination: 1000,
    mintUrl: "https://example.mint.com",
    token: "cashuAeyJ0b2tlbiI6W3sibWludCI6Imh0dHBzOi8vZXhhbXBsZS5taW50LmNvbSIsInByb29mcyI6W3siaWQiOiJleGFtcGxlIiwic2VjcmV0IjoiZXhhbXBsZSIsIkMiOiJleGFtcGxlIn1dfV0sInVuaXQiOiJzYXQifQ==",
    unit: "sat"
  };
</script>

<div class="p-8 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      🏰 Grumpy King Note Test
    </h1>
    
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Test Note Preview</h2>
      <div class="flex justify-center">
        <GrumpyKingNote {...testData} />
      </div>
    </div>
    
    <div class="bg-blue-50 rounded-lg p-4">
      <h3 class="font-semibold text-blue-800 mb-2">Test Instructions:</h3>
      <ul class="text-blue-700 space-y-1">
        <li>• The QR code should appear in the left textured area</li>
        <li>• Click "Download Note" to save the combined image</li>
        <li>• Test the QR code with a Cashu wallet app</li>
        <li>• Adjust position by modifying qrPosition in GrumpyKingNote.svelte</li>
      </ul>
    </div>
  </div>
</div>
