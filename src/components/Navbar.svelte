<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  let isScrolled = false;
  let mobileMenuOpen = false;
  let activeMegaMenu = null;
  let navShell;
  let closeTimeout;

  const navLinks = [
    {
      name: 'Services',
      href: '#solutions',
      menu: [
        { title: 'Web Development', detail: 'Modern websites and web apps', href: '/services/web-development' },
        { title: 'App Development', detail: 'Android and iOS solutions', href: '/services/app-development' },
        { title: 'E-Commerce', detail: 'Conversion-focused storefronts', href: '/services/ecommerce' },
        { title: 'ERP Solutions', detail: 'Business process automation', href: '/services/erp-solutions' },
        { title: 'Cloud Services', detail: 'Scalable cloud architecture', href: '/services/cloud-services' }
      ]
    },
    {
      name: 'Technologies',
      href: '#technologies',
      menu: [
        { title: 'Frontend Stack', detail: 'React, Next.js, Vue, Svelte' },
        { title: 'Backend Stack', detail: 'Node.js, Python, Java, PHP' },
        { title: 'Databases', detail: 'MySQL, PostgreSQL, MongoDB' },
        { title: 'DevOps', detail: 'Docker, CI/CD, Vercel, AWS' },
        { title: 'UI/UX Tools', detail: 'Figma, Framer, XD' }
      ]
    },
    {
      name: 'AI',
      href: '#services',
      menu: [
        { title: 'AI Consultancy', detail: 'Strategic AI planning and roadmap', href: '/ai/ai-consultancy' },
        { title: 'AI Integration', detail: 'Seamless deployment of AI tools', href: '/ai/ai-integration' },
        { title: 'AI/ML Development', detail: 'Custom models and algorithms', href: '/ai/ai-ml-development' },
        { title: 'AI Agent Development', detail: 'Autonomous intelligent agents', href: '/ai/ai-agent-development' },
        { title: 'Generative AI', detail: 'Content and creative AI solutions', href: '/ai/generative-ai' }
      ]
    },
    { name: 'Industries', href: '#industries' },
    { name: 'Portfolio', href: '#projects' },
  ];

  $: activeMenuConfig = navLinks.find((item) => item.name === activeMegaMenu);

  function closeMenus() {
    mobileMenuOpen = false;
    activeMegaMenu = null;
  }

  // Smooth Hover Logic
  function handleMouseEnter(name) {
    if (closeTimeout) clearTimeout(closeTimeout);
    activeMegaMenu = name;
  }

  function handleMouseLeave() {
    closeTimeout = setTimeout(() => {
      activeMegaMenu = null;
    }, 150); // Small delay so it doesn't flicker
  }

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };

    const handleDocClick = (event) => {
      if (!navShell || navShell.contains(event.target)) return;
      closeMenus();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMenus();
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleDocClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleDocClick);
      document.removeEventListener('keydown', handleEscape);
    };
  });
</script>

<nav class="fixed left-0 top-0 z-[120] w-full transition-all duration-300 {isScrolled ? 'py-2' : 'py-4'}">
  <div bind:this={navShell} class="container mx-auto px-4 sm:px-6" on:mouseleave={handleMouseLeave}>
    
    <div class="relative flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-2 shadow-lg shadow-blue-900/5 backdrop-blur-xl md:px-6">
      
      <a href="#top" class="group flex items-center gap-3" on:click={closeMenus}>
        <div class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl">
          <img
            src="/logo1.png"
            alt="CORE4IX Logo"
            class="h-full w-full translate-y-[5px] scale-[1.6] object-cover transition-transform duration-300 group-hover:scale-[1.7]"
          />
        </div>
        <div class="hidden sm:flex flex-col">
          <span class="leading-none text-xl font-black tracking-tighter text-[#1f4e79]">
            CORE<span class="text-[#00c6ff]">4</span>IX
          </span>
          <span class="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Tech Studio</span>
        </div>
      </a>

      <div class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:flex items-center gap-7">
        {#each navLinks as link}
          {#if link.menu}
            <button
              type="button"
              on:mouseenter={() => handleMouseEnter(link.name)}
              class="group flex items-center gap-1 py-4 text-sm font-bold transition-colors {activeMegaMenu === link.name ? 'text-[#1f4e79]' : 'text-slate-600 hover:text-[#1f4e79]'}"
            >
              {link.name}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-300 {activeMegaMenu === link.name ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          {:else}
            <a href={link.href} class="group relative py-4 text-sm font-bold text-slate-600 transition-colors hover:text-[#1f4e79]" on:click={closeMenus}>
              {link.name}
              <span class="absolute bottom-3 left-0 h-0.5 w-0 bg-[#00c6ff] transition-all group-hover:w-full"></span>
            </a>
          {/if}
        {/each}
      </div>

      <div class="hidden md:flex items-stretch overflow-hidden rounded-xl border border-slate-300 bg-[#eef2f4]">
        <a href="tel:+919909388561" class="flex items-center gap-2 px-3 py-1.5 lg:px-3.5">
          <div class="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-[#1f4e79]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l1.09 3.27a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.59 6.59l1.27-1.27a2 2 0 012.11-.45l3.27 1.09A2 2 0 0121 17.72V21a2 2 0 01-2 2h-1C9.16 23 1 14.84 1 5V5z" />
            </svg>
          </div>
          <div class="leading-tight">
            <p class="text-[9px] font-bold text-slate-500">Any Question</p>
            <p class="text-sm font-black tracking-tight text-[#1f2937] lg:text-base">+91 99093 88561</p>
          </div>
        </a>
      </div>

      <button
        type="button"
        class="md:hidden p-2"
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
      >
        <div class="mb-1.5 h-0.5 w-6 bg-[#1f4e79] transition-all {mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}"></div>
        <div class="mb-1.5 h-0.5 w-6 bg-[#1f4e79] {mobileMenuOpen ? 'opacity-0' : ''}"></div>
        <div class="h-0.5 w-6 bg-[#1f4e79] transition-all {mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}"></div>
      </button>
    </div>

    {#if activeMenuConfig?.menu}
      <div 
        on:mouseenter={() => handleMouseEnter(activeMegaMenu)}
        transition:fly={{ y: 10, duration: 300 }}
        id="desktop-mega-menu" 
        class="mt-3 hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl xl:block"
      >
        <div class="grid grid-cols-[1.4fr_1fr] gap-6">
          <div>
            <h4 class="text-2xl font-black tracking-tight text-[#1f4e79]">{activeMenuConfig.name}</h4>
            <p class="mt-1 text-sm text-slate-500">Choose a focus area and we can help you ship faster.</p>

            <div class="mt-4 grid grid-cols-2 gap-3">
              {#each activeMenuConfig.menu as item}
                <a href={item.href || activeMenuConfig.href} class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[#1f4e79]/20 hover:bg-white" on:click={closeMenus}>
                  <p class="text-base font-bold text-slate-800">{item.title}</p>
                  <p class="mt-1 text-xs text-slate-500">{item.detail}</p>
                </a>
              {/each}
            </div>
          </div>

          <div class="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#dff3ff] p-5">
            <p class="text-sm font-black uppercase tracking-[0.14em] text-[#1f4e79]">Smart Tech, Smarter Results</p>
            <p class="mt-3 text-lg leading-relaxed text-slate-700">
              Build scalable, secure, and future-ready products with CORE4IX engineering expertise.
            </p>
            <a href="#contact" class="mt-6 inline-block rounded-xl bg-[#1f4e79] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#183b5c]" on:click={closeMenus}>Hire Now</a>
          </div>
        </div>
      </div>
    {/if}

    {#if mobileMenuOpen}
      <div transition:fade={{ duration: 200 }} class="absolute left-6 right-6 top-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl md:hidden">
        <a href="tel:+919909388561" class="mb-5 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-md bg-white text-[#1f4e79]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l1.09 3.27a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.59 6.59l1.27-1.27a2 2 0 012.11-.45l3.27 1.09A2 2 0 0121 17.72V21a2 2 0 01-2 2h-1C9.16 23 1 14.84 1 5V5z" />
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-500">Any Question</p>
            <p class="text-base font-black text-[#1f2937]">+91 99093 88561</p>
          </div>
        </a>

        <div class="flex flex-col gap-4">
          {#each navLinks as link}
            <a href={link.href} class="text-lg font-bold text-slate-800" on:click={closeMenus}>{link.name}</a>
          {/each}
          <a href="#contact" class="mt-1 rounded-xl bg-[#1f4e79] py-3 text-center font-bold text-white" on:click={closeMenus}>Contact Us</a>
        </div>
      </div>
    {/if}
  </div>
</nav>