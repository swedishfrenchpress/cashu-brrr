<script lang="ts">

  import PostItCard from "./PostItCard.svelte";
  import Sponsor from "./Sponsor.svelte";
  import { SPONSORS } from "./sponsors";

  // Array of available note images for random selection
  const noteImages = [
    "/Chaum-note.jpg",
    "/Taj-India-Note.png",
    "/Soverign_Note.png",
    "/Leafy-Nature-Note.png",
    "/Nostr-note-1.png",
    "/Nostr-note-2.png",
    "/Nostr-Note-3.png",
    "/Pizzaday-green.png",
    "/Satoshi-nirvana.png",
    "/Your-honor.png",
    "/Ecash_Note_template.svg"  // Cosmic Note (Bitpopart)
  ];

  // Function to get a random note image
  const getRandomNoteImage = () => {
    return noteImages[Math.floor(Math.random() * noteImages.length)];
  };

  // Function to get specific notes for testing - ensures Chaum and Taj India are visible
  const getSpecificNoteImage = (index: number) => {
    const specificNotes = [
      "/Chaum-note.jpg",           // Left top
      "/Taj-India-Note.png",       // Left second
      "/Soverign_Note.png",        // Left third
      "/Leafy-Nature-Note.png",    // Left bottom
      "/Nostr-note-1.png",         // Right top
      "/Ecash_Note_template.svg",  // Right second (Cosmic Note)
      "/Nostr-note-2.png",         // Right third (Cosmic Note variation)
      "/Satoshi-nirvana.png"       // Right bottom
    ];
    return specificNotes[index] || getRandomNoteImage();
  };


</script>

<div class="min-h-screen w-full px-32">
  <div class="w-full py-8 mb-6">
    <p class="text-center font-sedgwick text-green-800 text-3xl mb-2">
      Brrr is a tool.to.println(“Ecash”)
    </p>
    <!-- Headline -->
    <h1 class="text-center font-ojuju font-bold text-9xl text-gray-900 z-30 relative">
      Print your own Ecash notes
    </h1>

    <!-- Add margin-top to push the printer/notes down -->
    <div class="flex justify-center w-full mt-32">
      <div class="relative" style="width: 36rem; height: 600px;">
        <!-- Left notes (move further left with negative left values) -->
        <img src={getSpecificNoteImage(0)} alt="Note Template" class="absolute left-[-6rem] top-24 w-40 rotate-[-15deg]" />
        <img src={getSpecificNoteImage(1)} alt="Note Template" class="absolute left-[-8rem] top-48 w-40 rotate-[10deg]" />
        <img src={getSpecificNoteImage(2)} alt="Note Template" class="absolute left-[-5rem] top-80 w-40 rotate-[-8deg]" />
        <img src={getSpecificNoteImage(3)} alt="Note Template" class="absolute left-0 top-96 w-40 rotate-[5deg]" />

        <!-- Printer -->
        <img src="/printer.png" alt="Printer" class="absolute left-1/2 top-1/2 z-20 w-[36rem] -translate-x-1/2 -translate-y-1/2" />

        <!-- Right notes (move further right with negative right values) -->
        <img src={getSpecificNoteImage(4)} alt="Note Template" class="absolute right-[-6rem] top-24 w-40 rotate-[12deg]" />
        <img src={getSpecificNoteImage(5)} alt="Note Template" class="absolute right-[-8rem] top-48 w-40 rotate-[-10deg]" />
        <img src={getSpecificNoteImage(6)} alt="Note Template" class="absolute right-[-5rem] top-80 w-40 rotate-[7deg]" />
        <img src={getSpecificNoteImage(7)} alt="Note Template" class="absolute right-0 top-96 w-40 rotate-[-6deg]" />
      </div>
    </div>
    
    <!-- Sponsors Section -->
    {#if SPONSORS.length > 0}
      <div class="mt-16 mb-8">
        <h2 class="text-center font-ojuju font-bold text-4xl text-gray-900 mb-8">
          Our Sponsors
        </h2>
        <div class="flex flex-col md:flex-row justify-center items-center gap-6 max-w-4xl mx-auto">
          {#each SPONSORS as sponsor}
            <Sponsor {sponsor} />
          {/each}
        </div>
      </div>
    {/if}
    
    <h2 class="text-center font-ojuju font-bold text-4xl text-gray-900 mt-12 mb-4">
      FAQs
    </h2>
    <div class="flex flex-col md:flex-row justify-center items-center gap-8 mt-8">
      <PostItCard title="What is an ecash note?" body="A bitcoin ecash note is a printable slip with a QR code that holds a claimable amount of bitcoin-backed ecash. You can hand it to someone like cash, and they can scan it to redeem the funds. Once claimed, the note is no longer valid and can't be reused." rotation="rotate-[15deg]" />
      <PostItCard title="What happens if I lose it?" body="If the QR code on the note is never scanned and claimed, the ecash stays unredeemed. Only the person holding the physical note can access the funds, so treat it like real cash — if it's lost, it can't be recovered.." rotation="-rotate-[15deg]" />
      <PostItCard title="How do I print?" body="Just choose a design, select how many notes you want to print and for what amounts, then pay using lightning or ecash. The app will generate a printable sheet you can cut and hand out." rotation="rotate-[15deg]" />
    </div>
    
    <!-- GO BRRRR Button -->
    <div class="flex justify-center mt-16 mb-8">
      <button
        class="px-12 py-4 text-3xl font-bold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
        style="background-color: #E4690A; color: white; border: 3px solid #A94705; font-family: 'Cabinet Grotesk', sans-serif;"
        onclick={() => {
          // Navigate to fullscreen print page using hash routing
          console.log('GO BRRRR clicked! Setting hash to #print');
          window.location.hash = 'print';
          console.log('Hash set to:', window.location.hash);
        }}
      >
        GO BRRRR! 💰
      </button>
    </div>
  </div>


  
  <!-- Bottom spacing -->
  <div class="h-16"></div>
</div>