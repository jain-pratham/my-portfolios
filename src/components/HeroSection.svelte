<script>
  import { onMount } from 'svelte';

  let isScrolled = false;
  let mobileMenuOpen = false;
  let visible = false;

  onMount(() => {
    visible = true;
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Our Process', href: '#process' },
    { name: 'Stack', href: '#stack' },
    { name: 'Manifesto', href: '#manifesto' }
  ];
</script>

<nav class="fixed top-0 left-0 w-full z-[100] transition-all duration-500 {isScrolled ? 'py-2' : 'py-4'}">
  <div class="container mx-auto px-6">
    <div class="relative flex items-center justify-between bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl px-6 py-1.5 transition-all duration-500 {isScrolled ? 'shadow-lg shadow-blue-900/5' : 'shadow-none'}">
      
      <div class="flex items-center gap-3 group cursor-pointer">
        <div class="w-14 h-14 flex items-center justify-center overflow-hidden">
          <img
            src="/logo1.png"
            alt="CORE4IX Logo"
            class="w-full h-full object-cover scale-[1.6] translate-y-[5px] transition-transform duration-300 group-hover:scale-[1.7]"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-black tracking-tighter text-[#1f4e79] leading-none">
            CORE<span class="text-[#00c6ff]">4</span>IX
          </span>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Tech Studio</span>
        </div>
      </div>

      <div class="hidden md:flex items-center gap-8">
        {#each navLinks as link}
          <a href={link.href} class="text-sm font-bold text-slate-600 hover:text-[#1f4e79] transition-all relative group">
            {link.name}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00c6ff] transition-all group-hover:w-full"></span>
          </a>
        {/each}
      </div>

      <div class="flex items-center gap-4">
        <a href="#contact" class="hidden sm:flex px-6 py-2.5 bg-[#1f4e79] text-white text-xs font-bold rounded-xl hover:bg-[#163a5a] transition-all shadow-md active:scale-95">
          Get Started
        </a>
        <button
          type="button"
          class="md:hidden p-2"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          on:click={() => mobileMenuOpen = !mobileMenuOpen}
        >
          <div class="w-6 h-0.5 bg-[#1f4e79] mb-1.5 transition-all {mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}"></div>
          <div class="w-6 h-0.5 bg-[#1f4e79] mb-1.5 {mobileMenuOpen ? 'opacity-0' : ''}"></div>
          <div class="w-6 h-0.5 bg-[#1f4e79] transition-all {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></div>
        </button>
      </div>
    </div>

    {#if mobileMenuOpen}
      <div class="absolute top-24 left-6 right-6 md:hidden bg-white border border-slate-100 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
        {#each navLinks as link}
          <a href={link.href} class="text-2xl font-bold text-slate-800" on:click={() => mobileMenuOpen = false}>{link.name}</a>
        {/each}
        <button class="w-full py-4 bg-[#1f4e79] text-white font-bold rounded-2xl">Contact Us</button>
      </div>
    {/if}
  </div>
</nav>

<main class="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-32 md:pt-36">
  
  <div class="absolute inset-0 z-0 opacity-[0.04]" 
       style="background-image: radial-gradient(#1f4e79 1px, transparent 1px); background-size: 45px 45px;">
  </div>
  
  <div class="absolute top-1/3 -left-24 w-[500px] h-[500px] bg-sky-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse"></div>
  <div class="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse delay-700"></div>

  <div class="container mx-auto px-6 relative z-10">
    <div class="flex flex-col items-center text-center">
      
      <div class="mb-8 px-5 py-2 rounded-full border border-slate-200 bg-slate-50/50 backdrop-blur-sm flex items-center gap-3">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em]">
          Founding Squad of 4 // Dev Phase
        </span>
      </div>

      <h1 class="text-5xl md:text-8xl font-black text-[#1f4e79] leading-[1.05] tracking-tight">
        Architecting the <br /> 
        <span class="bg-gradient-to-r from-[#1f4e79] via-[#00c6ff] to-[#1f4e79] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-flow">
          Digital Frontier.
        </span>
      </h1>

      <p class="mt-8 max-w-2xl text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
        We are an elite boutique agency specializing in high-performance digital products. 
        Where engineering meets imagination.
      </p>

      <div class="mt-12 flex flex-col sm:flex-row gap-5">
        <button class="px-10 py-5 bg-[#1f4e79] text-white rounded-2xl font-bold hover:bg-[#163a5a] transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-900/20 active:scale-95">
          Deploy Your Idea
        </button>
        
        <button class="px-10 py-5 bg-white text-[#1f4e79] border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3">
          Our Tech Stack
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>

      <div class="mt-24 w-full max-w-5xl px-10 py-8 border-t border-slate-100 flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 grayscale">
         <span class="font-black text-xl tracking-tighter">NEXTGEN UI</span>
         <span class="font-black text-xl tracking-tighter">CLOUD NATIVE</span>
         <span class="font-black text-xl tracking-tighter">AI READY</span>
         <span class="font-black text-xl tracking-tighter">SECURE BY DESIGN</span>
      </div>

    </div>
  </div>
</main>

<style>
  @keyframes gradient-flow {
    0% { background-position: 0% center; }
    50% { background-position: 100% center; }
    100% { background-position: 0% center; }
  }

  .animate-gradient-flow {
    animation: gradient-flow 6s ease infinite;
  }
</style>
