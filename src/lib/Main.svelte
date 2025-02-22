<script lang="ts">
  import { Toaster } from "svelte-sonner";
  import Step1 from "./Step1.svelte";
  import Step2 from "./Step2.svelte";
  import Step3 from "./Step3.svelte";
  import Step4 from "./Step4.svelte";
  import { step, mint, wallet } from "./stores.svelte";
  import { Bitcoin, Code, Copy, Heart, Zap } from "lucide-svelte";
  import { copyTextToClipboard, getWalletWithUnit } from "./utils";
  import DonateCashu from "./DonateCashu.svelte";
  
  let showDonate = $state(false);
  let unit = $state("sat");

  const confirm = async () => {
    wallet.set(await getWalletWithUnit($mint, unit));
    step.set(2);
  };

  // Reduce number of bills and simplify properties
  const moneyEmojis = ['💵', '💶', '💷', '💴'];
  
  const bills = Array(8).fill(null).map((_, i) => ({  // Reduced from 15 to 8 bills
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 6 + Math.random() * 4,  // Slightly slower falls
    emoji: moneyEmojis[i % moneyEmojis.length],  // Cycle through emojis instead of random
    finalLeft: Math.random() * 20 - 10
  }));

  // Add mouse tracking
  let mouseX = $state(0);
  let mouseY = $state(0);
  
  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
</script>

<Toaster richColors position="top-right" />

<div class="fixed inset-0 bg-[#163300] -z-10" />
<div class="money-container fixed inset-0 -z-5 overflow-hidden pointer-events-none">
  {#each bills as bill}
    <div
      class="money absolute"
      style="
        left: {bill.left}%;
        top: -50px;
        animation-delay: {bill.delay}s;
        animation-duration: {bill.duration}s;"
    >
      {bill.emoji}
    </div>
  {/each}
</div>

<div class="min-h-screen px-4 py-12">
  <div class="mx-auto max-w-4xl">
    <!-- Updated Header Section -->
    <div class="text-center mb-0">
      <h1 class="font-['Bank_TM'] text-[#9FE870] transform -rotate-6 flex flex-col gap-[-20px] md:gap-[-10px] mb-[10px] relative">
        <span 
          class="text-[48px] md:text-[96px] leading-none glow-effect mouse-reactive"
          style="--mouse-x: {mouseX}px; --mouse-y: {mouseY}px;"
        >Money printer</span>
        <span 
          class="text-[48px] md:text-[96px] leading-none mt-[5px] md:mt-[10px] glow-effect mouse-reactive"
          style="--mouse-x: {mouseX}px; --mouse-y: {mouseY}px;"
        >Go</span>
        <span 
          class="text-[80px] md:text-[200px] leading-none mt-[-10px] md:mt-[-40px] glow-effect mouse-reactive"
          style="--mouse-x: {mouseX}px; --mouse-y: {mouseY}px;"
        >Brrrrrr</span>
      </h1>
    </div>

    <!-- Main Card with enhanced shadows and borders -->
    <div class="rounded-2xl bg-white shadow-[0_0_50px_0_rgba(0,0,0,0.1)] 
                border border-slate-200/60 backdrop-blur-sm relative z-20">
      <!-- Progress Steps - Enhanced with personality -->
      <div class="px-8 pt-8 pb-6">
        <div class="relative">
          <!-- Progress Bar -->
          <div class="absolute top-[15px] left-0 w-full h-[3px]"> <!-- Increased height -->
            <!-- Background Line -->
            <div class="absolute w-full h-full bg-slate-200 rounded-full"></div>
            <!-- Active Line with glow effect -->
            <div 
              class="absolute h-full bg-[#9FE870] rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_10px_rgba(159,232,112,0.5)]"
              style="width: {(($step - 1) / 3) * 100}%"
            ></div>
          </div>

          <!-- Steps -->
          <div class="relative flex justify-between">
            {#each ['Connect', 'Configure', 'Payment', 'Print'] as stepName, index}
              <div class="flex flex-col items-center gap-2 group">
                <div 
                  class="w-10 h-10 rounded-full border-3 flex items-center justify-center
                         transition-all duration-300 text-base font-bold relative
                         {index + 1 <= $step ? 
                           'border-[#9FE870] bg-[#9FE870] text-[#163300] scale-110' : 
                           'border-slate-200 bg-white text-slate-400'}
                         hover:scale-110 transform-gpu
                         {index + 1 < $step ? 'step-completed' : ''}"
                >
                  <!-- Add checkmark for completed steps -->
                  {#if index + 1 < $step}
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  {:else}
                    {index + 1}
                  {/if}
                  
                  <!-- Glow effect for active step -->
                  {#if index + 1 === $step}
                    <div class="absolute inset-0 rounded-full animate-pulse-subtle bg-[#9FE870]/20 -z-10"></div>
                  {/if}
                </div>
                <span 
                  class="text-sm font-medium transition-all duration-300
                         {index + 1 <= $step ? 'text-[#163300]' : 'text-slate-400'}
                         group-hover:scale-105"
                >
                  {stepName}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Main Content with refined spacing -->
      <div class="px-8 py-10">
        <div class="min-h-[400px] relative flex flex-col justify-between">
          <div>
            {#if $step === 1}
              <Step1 />
            {:else if $step === 2}
              <Step2 />
            {:else if $step === 3}
              <Step3 />
            {:else}
              <Step4 />
            {/if}
          </div>
        </div>
      </div>

      <!-- Navigation Section -->
      <div class="p-8 bg-slate-50/80 border-t border-slate-200 rounded-b-2xl">
        <div class="flex justify-end">
          {#if $step === 1}
            <button
              onclick={confirm}
              class="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide
                     text-[#163300] transition-all duration-200 bg-[#9FE870] rounded-[10000px]
                     hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20
                     disabled:opacity-50 disabled:hover:bg-[#9FE870]
                     shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1),0px_8px_8px_0px_rgba(0,0,0,0.05),0px_18px_11px_0px_rgba(0,0,0,0.05),0px_32px_13px_0px_rgba(0,0,0,0.01),inset_0px_4px_14px_0px_rgba(255,255,255,0.45)]"
              disabled={!$mint}
            >
              Next
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Donate Section with matching styling -->
    {#if showDonate}
      <div class="mt-6 rounded-2xl bg-white shadow-[0_0_50px_0_rgba(0,0,0,0.1)] 
                  border border-slate-200/60 backdrop-blur-sm p-8
                  transition-all duration-300 ease-in-out">
        <DonateCashu />
      </div>
    {/if}

    <!-- Sponsor Section -->
    <div class="mt-8 text-center">
      <a 
        href="https://geyser.fund/project/brrr/rewards/view/5486"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-3 px-4 py-2 rounded-full 
               bg-white/80 border border-slate-200/60 
               shadow-[0_2px_10px_0_rgba(0,0,0,0.06)]
               hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.1)]
               transition-all duration-300 group"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden">
          <img 
            src="/i.jpeg" 
            alt="Sponsor logo"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900">
          Become a sponsor
        </span>
      </a>
    </div>
  </div>
</div>

<svelte:window on:mousemove={handleMouseMove}/>

<style>
  /* Add this to ensure the background color is also applied to the body */
  :global(body) {
    background-color: #163300;
  }
  
  /* Enhanced focus states */
  :global(.btn:focus-visible) {
    outline: 2px solid theme(colors.primary);
    outline-offset: 2px;
  }
  
  /* Smooth transitions */
  :global(.btn) {
    @apply transition-all duration-300 ease-in-out;
  }
  
  /* Enhanced step styling */
  :global(.step:after) {
    @apply transition-all duration-300 ease-in-out;
  }
  
  :global(.step-primary:after) {
    @apply shadow-md shadow-[#9FE870]/30;
  }

  .glow-effect {
    position: relative;
    text-shadow: 0 0 10px rgba(159, 232, 112, 0.5);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      text-shadow: 
        0 0 15px rgba(159, 232, 112, 0.5),
        0 0 30px rgba(159, 232, 112, 0.3),
        0 0 45px rgba(159, 232, 112, 0.1);
    }
    50% {
      text-shadow: 
        0 0 30px rgba(159, 232, 112, 0.8),
        0 0 60px rgba(159, 232, 112, 0.5),
        0 0 90px rgba(159, 232, 112, 0.3);
    }
  }

  .mouse-reactive {
    transition: transform 0.2s ease;
  }

  .mouse-reactive:hover {
    transform: perspective(1000px) 
               rotateX(calc((var(--mouse-y) - var(--y)) * -0.05deg))
               rotateY(calc((var(--mouse-x) - var(--x)) * 0.05deg));
  }

  .money-container {
    perspective: 1000px;
  }

  .money {
    opacity: 0.4;
    animation: fall linear infinite;
    font-size: 24px;
    will-change: transform;  /* Optimize for animations */
  }

  @keyframes fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.4;
    }
    100% {
      transform: translateY(calc(100vh + 100px)) rotate(360deg);
      opacity: 0.3;
    }
  }

  /* Simplified hover effect */
  .money:hover {
    opacity: 0.8;
  }

  /* Add these new styles */
  .step-completed {
    animation: bounce-subtle 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes bounce-subtle {
    0%, 100% { transform: scale(1.1); }
    50% { transform: scale(1.2); }
  }

  @keyframes pulse-subtle {
    0%, 100% { opacity: 0.8; transform: scale(1.2); }
    50% { opacity: 0.4; transform: scale(1.4); }
  }

  .animate-pulse-subtle {
    animation: pulse-subtle 2s ease-in-out infinite;
  }

  /* Enhanced progress bar glow effect */
  .progress-glow {
    filter: drop-shadow(0 0 8px rgba(159, 232, 112, 0.5));
  }

  /* Ensure smooth transitions */
  .transform-gpu {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
</style>
