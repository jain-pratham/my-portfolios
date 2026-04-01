<script>
  import { onMount } from 'svelte';

  let isScrolled = false;
  let mobileMenuOpen = false;
  let navShell;

  const navLinks = [
    {
    name: 'Services',
    menu: [
      { 
        title: 'Web Development', 
        detail: 'Modern websites and web apps',
        link: '/services/web-development'
      },
      { 
        title: 'App Development', 
        detail: 'Android and iOS solutions',
        link: '/services/app-development'
      },
      { 
        title: 'E-Commerce', 
        detail: 'Conversion-focused storefronts',
        link: '/services/ecommerce'
      },
      { 
        title: 'ERP Solutions', 
        detail: 'Business process automation',
        link: '/services/erp-solutions'
      },
      { 
        title: 'Cloud Services', 
        detail: 'Scalable cloud architecture',
        link: '/services/cloud-services'
      }
    ]
  },
    {
      name: 'TECHNOLOGIES',
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
      href: '#',
      menu: [
        { title: 'AI Consultancy', href: '/ai/ai-consultancy', detail: 'Strategic AI planning and roadmap' },
        { title: 'AI Integration', href: '/ai/ai-integration', detail: 'Seamless deployment of AI tools' },
        { title: 'AI/ML Development', href: '/ai/ai-ml-development', detail: 'Custom models and algorithms' },
        { title: 'AI Agent Development', href: '/ai/ai-agent-development', detail: 'Autonomous intelligent agents' },
        { title: 'Generative AI', href: '/ai/generative-ai', detail: 'Content and creative AI solutions' }
      ]
    },
    { name: 'INDUSTRIES', href: '#industries' },
    { name: 'PORTFOLIO', href: '#projects' },
  ];

  function closeMenus() {
    mobileMenuOpen = false;
  }

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };

    const handleDocClick = (event) => {
      if (!navShell || navShell.contains(event.target)) {
        return;
      }
      closeMenus();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenus();
      }
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

<nav class="fixed left-0 top-0 z-120 w-full transition-all duration-500 {isScrolled ? 'py-3' : 'py-6'}">
  <div bind:this={navShell} class="container mx-auto px-4 sm:px-6 max-w-[1400px]">
    
    <div class="relative flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/95 px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300 md:px-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      
      <a href="#top" class="group flex items-center gap-3 shrink-0" on:click={closeMenus}>
        <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-slate-50 border border-slate-100/50">
          <img
            src="/logo1.png"
            alt="CORE4IX Logo"
            class="h-full w-full translate-y-[3px] scale-[1.5] object-cover transition-transform duration-500 group-hover:scale-[1.6]"
          />
        </div>
        <div class="hidden sm:flex flex-col">
          <span class="leading-none text-[22px] font-black tracking-tighter text-[#1f4e79]">
            CORE<span class="text-[#00c6ff]">4</span>IX
          </span>
          <span class="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">Tech Studio</span>
        </div>
      </a>

      <div class="hidden xl:flex items-center gap-8">
        {#each navLinks as link}
          <div class="group relative flex items-center h-full">
            {#if link.menu}
              <a href={link.href} class="flex items-center gap-1.5 py-4 text-[12px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:text-[#1f4e79]">
                {link.name}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-[#00c6ff] transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </a>

              <div class="absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-50 cursor-default">
                
                <div class="w-[800px] rounded-2xl border border-slate-100 bg-white shadow-[0_25px_50px_-12px_rgba(31,78,121,0.2)] overflow-hidden">
                  <div class="grid grid-cols-[1.4fr_0.9fr] min-h-[380px]">
                    
                    <div class="p-10">
                      <div class="mb-8 flex items-center gap-3">
                        <div class="h-2 w-2 rounded-full bg-[#00c6ff]"></div>
                        <h4 class="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8ba2b5]">{link.name} CAPABILITIES</h4>
                      </div>

                      <div class="grid grid-cols-2 gap-x-8 gap-y-8">
                        {#each link.menu as item}
                          <a href={item.href || link.href} class="group/item flex items-start gap-4 transition-all duration-300" on:click={closeMenus}>
                            <div class="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm text-[#1f4e79] transition-all duration-300 group-hover/item:border-[#00c6ff] group-hover/item:text-[#00c6ff]">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <p class="text-[14px] font-black text-slate-800 transition-colors group-hover/item:text-[#1f4e79]">
                                {item.title}
                              </p>
                              <p class="mt-1 text-[13px] leading-[1.4] text-[#8ba2b5]">{item.detail}</p>
                            </div>
                          </a>
                        {/each}
                      </div>
                    </div>

                    <div class="bg-[#1f4e79] p-10 flex flex-col">
                      <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-[#00c6ff] mb-6">PORTFOLIO SPOTLIGHT</p>
                      
                      <h3 class="text-[32px] font-black leading-[1.1] text-white tracking-tight">
                        Smart Tech,<br/>Smarter Results.
                      </h3>
                      
                      <p class="mt-5 text-[14px] leading-relaxed text-[#a8c1d8]">
                        Build scalable, secure, and future-ready products with CORE4IX enterprise-grade engineering expertise.
                      </p>

                      <div class="mt-auto pt-8">
                        <a href="#contact" class="inline-flex items-center gap-2 rounded-full bg-[#00c6ff] px-6 py-3.5 text-[14px] font-bold text-[#1f4e79] transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,198,255,0.4)]" on:click={closeMenus}>
                          Start a Project
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            {:else}
              <a href={link.href} class="group relative flex items-center py-4 text-[12px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:text-[#1f4e79]" on:click={closeMenus}>
                {link.name}
                <span class="absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-0 rounded-full bg-[#00c6ff] transition-all duration-300 group-hover:w-[15px]"></span>
              </a>
            {/if}
          </div>
        {/each}
      </div>

      <div class="hidden md:flex items-center gap-5 shrink-0">
        <div class="text-right hidden lg:block">
          <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">Ready to build?</p>
          <a href="tel:+919909388561" class="text-[15px] font-black tracking-tight text-[#1f4e79] hover:text-[#00c6ff] transition-colors">+91 99093 88561</a>
        </div>
        
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a href="#contact" class="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-slate-900 text-white transition-all hover:bg-[#1f4e79] hover:shadow-lg hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l1.09 3.27a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.59 6.59l1.27-1.27a2 2 0 012.11-.45l3.27 1.09A2 2 0 0121 17.72V21a2 2 0 01-2 2h-1C9.16 23 1 14.84 1 5V5z" />
          </svg>
        </a>
      </div>

      <button
        type="button"
        class="md:hidden p-2 text-[#1f4e79]"
        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={mobileMenuOpen}
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
      >
        <div class="mb-1.5 h-[2px] w-6 bg-current transition-all duration-300 {mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}"></div>
        <div class="mb-1.5 h-[2px] w-6 bg-current transition-all duration-300 {mobileMenuOpen ? 'opacity-0' : ''}"></div>
        <div class="h-[2px] w-6 bg-current transition-all duration-300 {mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}"></div>
      </button>
    </div>

    {#if mobileMenuOpen}
      <div class="absolute left-4 right-4 top-24 rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl p-6 shadow-2xl md:hidden">
        <div class="mb-8 rounded-xl bg-[#1f4e79] p-6 text-white">
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#00c6ff]">Start your project</p>
          <p class="mt-1 text-2xl font-black">+91 99093 88561</p>
          <a href="tel:+919909388561" class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00c6ff] px-5 py-2.5 text-xs font-bold text-[#1f4e79]">Call Now</a>
        </div>

        <div class="flex flex-col gap-1">
          {#each navLinks as link}
            <a href={link.href} class="flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-black text-slate-700 hover:bg-slate-50 hover:text-[#1f4e79]" on:click={closeMenus}>
              {link.name}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</nav>