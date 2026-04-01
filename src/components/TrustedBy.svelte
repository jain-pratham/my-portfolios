<section class="py-8 bg-white overflow-hidden"> <div class="container mx-auto px-6 mb-6"> <div class="flex flex-col items-center">
      <div class="mb-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
        <h2 class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center">
          Strategic Collaborations
        </h2>
      </div>
      <p class="text-slate-400 text-[11px] font-medium uppercase tracking-tighter">Powering innovation</p>
    </div>
  </div>

  <div class="relative flex overflow-x-hidden group">
    <div class="flex animate-marquee whitespace-nowrap items-center gap-12 md:gap-24 px-10">
      {#each Array(6) as _, i}
        <div class="flex items-center justify-center w-36 md:w-44 h-16 md:h-20 opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer">
          <img 
            src="/logos/partner-{i + 1}.png" 
            alt="Partner {i + 1}" 
            class="max-w-full max-h-full object-contain drop-shadow-sm"
          />
        </div>
      {/each}
    </div>

    <div class="absolute top-0 flex animate-marquee2 whitespace-nowrap items-center gap-12 md:gap-24 px-10" aria-hidden="true">
      {#each Array(6) as _, i}
        <div class="flex items-center justify-center w-36 md:w-44 h-16 md:h-20 opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer">
          <img 
            src="/logos/partner-{i + 1}.png" 
            alt="Partner {i + 1}" 
            class="max-w-full max-h-full object-contain drop-shadow-sm"
          />
        </div>
      {/each}
    </div>

    <div class="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white via-white/50 to-transparent z-10"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white via-white/50 to-transparent z-10"></div>
  </div>

  <div class="container mx-auto px-6 mt-8"> <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
  </div>
</section>

<style>
  .animate-marquee {
    animation: marquee 40s linear infinite;
  }

  .animate-marquee2 {
    animation: marquee2 40s linear infinite;
  }

  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }

  @keyframes marquee2 {
    0% { transform: translateX(100%); }
    100% { transform: translateX(0%); }
  }

  .group:hover .animate-marquee,
  .group:hover .animate-marquee2 {
    animation-play-state: paused;
  }

  .animate-marquee, .animate-marquee2 {
    will-change: transform;
    backface-visibility: hidden;
  }
</style>
