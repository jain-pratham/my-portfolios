<script>
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const fullText = "CORE4IX";
  const intervalMs = 150;
  const finishDelayMs = 700;

  let index = 0;

  onMount(() => {
    let finishTimeout;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        index += 1;
        return;
      }

      clearInterval(interval);
      finishTimeout = setTimeout(() => {
        dispatch("complete");
      }, finishDelayMs);
    }, intervalMs);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimeout);
    };
  });
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
  <div class="relative flex items-center justify-center w-[400px] h-[400px]">
    <svg class="absolute -rotate-90 w-full h-full">
      <circle
        cx="200"
        cy="200"
        r="176"
        stroke="#f1f5f9"
        stroke-width="2"
        fill="transparent"
      />

      <circle
        cx="200"
        cy="200"
        r="176"
        stroke="url(#premiumGradient)"
        stroke-width="3"
        fill="transparent"
        stroke-dasharray="1105"
        stroke-linecap="round"
        class="animate-draw-ring"
      />

      <defs>
        <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%">
          <stop offset="0%" stop-color="#1f4e79" />
          <stop offset="100%" stop-color="#00c6ff" />
        </linearGradient>
      </defs>
    </svg>

    <div class="relative w-80 h-80 animate-logo-pop">
      <img
        src="logo1.png"
        alt="Logo"
        class="object-contain w-full h-full"
      />
    </div>
  </div>

  <div class="mt-8 text-center">
    <h1 class="text-6xl font-black tracking-widest flex items-center justify-center">
      {#each fullText.split("") as char, i}
        <span
          class={`inline-block opacity-0
          ${i < index ? "animate-char-in" : ""}
          ${
            char === "4"
              ? "text-[#00c6ff]"
              : char === "I" || char === "X"
              ? "bg-gradient-to-r from-[#1f4e79] to-[#00c6ff] bg-clip-text text-transparent"
              : "text-[#1f4e79]"
          }`}
          style={`transition-delay: ${i * 60}ms`}
        >
          {char}
        </span>
      {/each}
    </h1>
  </div>
</div>

<style>
  @keyframes drawRing {
    0% {
      stroke-dashoffset: 1105;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -1105;
    }
  }

  .animate-draw-ring {
    animation: drawRing 3.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }

  @keyframes logoPop {
    0% {
      transform: scale(0.9);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.9);
      opacity: 0.5;
    }
  }

  .animate-logo-pop {
    animation: logoPop 5s ease-in-out infinite;
  }

  @keyframes charIn {
    0% {
      opacity: 0;
      transform: translateY(15px) scale(0.8);
      filter: blur(4px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  .animate-char-in {
    animation: charIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
</style>
