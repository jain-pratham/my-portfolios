<script>
  import { onMount } from 'svelte';
  let isScrolled = false;

  onMount(() => {
    const handleScroll = () => (isScrolled = window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav class="fixed top-0 left-0 w-full z-[100] transition-all duration-500 {isScrolled ? 'py-2' : 'py-4'}">
  <div class="container mx-auto px-6">
    <div class="flex items-center justify-between bg-white/80 backdrop-blur-md border border-slate-100 rounded-full px-6 py-1.5 shadow-sm">
      
      <div class="flex items-center gap-3 group cursor-pointer">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden">
          <img 
            src="/logo2.png" 
            alt="CORE4IX" 
            class="w-full h-full object-cover scale-[1.55] translate-y-[5px] transition-transform duration-500 group-hover:scale-[1.65]" 
          />
        </div>
        <span class="text-lg font-black tracking-tighter text-slate-900 uppercase">
          Core<span class="text-sky-500">4</span>ix
        </span>
      </div>

      <div class="hidden md:flex items-center gap-10">
        {#each ['Engine', 'Solutions', 'Manifesto'] as link}
          <a href="#{link}" class="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors">{link}</a>
        {/each}
      </div>

      <button class="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-sky-600 transition-all">
        Contact
      </button>
    </div>
  </div>
</nav>
