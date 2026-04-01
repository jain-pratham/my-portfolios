<main id="top" class="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-32 md:pt-36">
  <div
    class="absolute inset-0 z-0 opacity-[0.04]"
    style="background-image: radial-gradient(#1f4e79 1px, transparent 1px); background-size: 45px 45px;"
  ></div>

  <div class="absolute top-1/3 -left-24 h-[500px] w-[500px] rounded-full bg-sky-200 opacity-20 blur-[120px]"></div>
  <div class="absolute bottom-1/4 -right-24 h-[500px] w-[500px] rounded-full bg-blue-200 opacity-20 blur-[120px]"></div>

  <div class="container relative z-10 mx-auto px-6">
    <div class="flex flex-col items-center text-center">
      <div class="mb-8 flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2 backdrop-blur-sm">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
        </span>
        <span class="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
          Founding Squad of 4 // Dev Phase
        </span>
      </div>

      <h1 class="text-5xl font-black leading-[1.05] tracking-tight text-[#1f4e79] md:text-8xl">
        Architecting the <br />
        <span class="animate-gradient-flow bg-gradient-to-r from-[#1f4e79] via-[#00c6ff] to-[#1f4e79] bg-[length:200%_auto] bg-clip-text text-transparent">
          Digital Frontier.
        </span>
      </h1>

      <p class="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
        We are an elite boutique agency specializing in high-performance digital products.
        Where engineering meets imagination.
      </p>

      <div class="mt-12 flex flex-col gap-5 sm:flex-row">
        <button class="rounded-2xl bg-[#1f4e79] px-10 py-5 font-bold text-white shadow-2xl shadow-blue-900/20 transition-all hover:-translate-y-1 hover:bg-[#163a5a] active:scale-95">
          Deploy Your Idea
        </button>

        <button class="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-10 py-5 font-bold text-[#1f4e79] transition-all hover:bg-slate-50 active:scale-95">
          Our Tech Stack
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>

      <div class="mt-24 flex w-full max-w-5xl flex-wrap justify-center gap-10 border-t border-slate-100 px-10 py-8 opacity-40 grayscale md:gap-20">
        <span class="text-xl font-black tracking-tighter">NEXTGEN UI</span>
        <span class="text-xl font-black tracking-tighter">CLOUD NATIVE</span>
        <span class="text-xl font-black tracking-tighter">AI READY</span>
        <span class="text-xl font-black tracking-tighter">SECURE BY DESIGN</span>
      </div>
    </div>
  </div>
</main>

<style>
  @keyframes gradient-flow {
    0% {
      background-position: 0% center;
    }
    50% {
      background-position: 100% center;
    }
    100% {
      background-position: 0% center;
    }
  }

  .animate-gradient-flow {
    animation: gradient-flow 6s ease infinite;
  }
</style>
