<section class="py-20 bg-white relative overflow-hidden">
  <div class="container mx-auto px-6">
    
    <div class="flex flex-col items-center mb-16 text-center">
      <div class="h-[1px] w-12 bg-[#00c6ff] mb-6"></div>
      <h2 class="text-[#1f4e79] text-xs font-bold uppercase tracking-[0.5em]">The CORE4IX Impact</h2>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 relative">
      
      <div class="hidden lg:block absolute inset-y-0 left-1/4 w-[1px] bg-slate-100"></div>
      <div class="hidden lg:block absolute inset-y-0 left-2/4 w-[1px] bg-slate-100"></div>
      <div class="hidden lg:block absolute inset-y-0 left-3/4 w-[1px] bg-slate-100"></div>

      <div class="group relative flex flex-col items-center justify-center transition-all duration-500">
        <div class="relative">
          <span class="text-6xl md:text-7xl font-black text-[#1f4e79] tracking-tighter transition-transform duration-500 group-hover:scale-110 block">06</span>
          <div class="absolute -top-1 -right-4 w-3 h-3 bg-[#00c6ff] rounded-full shadow-[0_0_15px_#00c6ff] animate-pulse"></div>
        </div>
        <p class="mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Projects Delivered</p>
        <div class="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 -z-10 rounded-3xl transition-all duration-500"></div>
      </div>

      <div class="group relative flex flex-col items-center justify-center transition-all duration-500">
        <div class="relative">
          <span class="text-6xl md:text-7xl font-black text-[#1f4e79] tracking-tighter group-hover:text-[#00c6ff] transition-colors duration-500">150</span>
          <span class="absolute -right-6 top-2 text-xl font-bold text-slate-300">k+</span>
        </div>
        <p class="mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Lines of Code</p>
      </div>

      <div class="group relative flex flex-col items-center justify-center transition-all duration-500">
        <div class="relative">
          <span class="text-6xl md:text-7xl font-black text-[#1f4e79] tracking-tighter">99</span>
          <span class="absolute -right-6 top-2 text-xl font-bold text-[#00c6ff]">%</span>
        </div>
        <p class="mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Client Success</p>
      </div>

      <div class="group relative flex flex-col items-center justify-center transition-all duration-500">
        <div class="relative">
          <span class="text-6xl md:text-7xl font-black text-[#1f4e79] tracking-tighter italic">04</span>
          <span class="absolute -right-8 top-2 text-xl font-black text-slate-200">IX</span>
        </div>
        <p class="mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Founding Minds</p>
      </div>

    </div>
  </div>

  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-50/50 rounded-full blur-[120px] -z-20"></div>
</section>

<style>
  /* Premium Reveal Animation */
  span {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px);
    animation: reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes reveal {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Each stat enters with a delay */
  div.group:nth-child(2) span { animation-delay: 0.1s; }
  div.group:nth-child(3) span { animation-delay: 0.2s; }
  div.group:nth-child(4) span { animation-delay: 0.3s; }
  div.group:nth-child(5) span { animation-delay: 0.4s; }
</style>