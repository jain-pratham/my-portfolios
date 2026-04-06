<script>
  import InlineIcon from '../ui/InlineIcon.svelte';

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Portfolio', href: '/projects' },
    { label: 'Technologies', href: '/technologies' },
    { label: 'Contact Us', href: '/contactus' }
  ];

  const serviceLinks = [
    { label: 'Web Development', href: '/services/web-development' },
    { label: 'AI Consultancy', href: '/ai/ai-consultancy' },
    { label: 'AI Integration', href: '/ai/ai-integration' },
    { label: 'AI/ML Development', href: '/ai/ai-ml-development' },
    { label: 'AI Agent Development', href: '/ai/ai-agent-development' },
    { label: 'Generative AI', href: '/ai/generative-ai' }
  ];

  const actionLinks = [
    { label: 'Call Us', href: 'tel:+919909388561', icon: 'phone' },
    { label: 'Email Us', href: 'mailto:info@core4ix.com', icon: 'mail' },
    { label: 'Portfolio', href: '/projects', icon: 'briefcase-business' },
    { label: 'Contact', href: '/contactus', icon: 'message-square-quote' }
  ];

  // Refined contact items for a more compact horizontal layout
  const contactItems = [
    {
      value: '+91 99093 88561',
      detail: 'Mon-Sat: 9AM - 7PM',
      icon: 'phone',
      href: 'tel:+919909388561'
    },
    {
      value: 'info@core4ix.com',
      detail: 'Project inquiries',
      icon: 'mail',
      href: 'mailto:info@core4ix.com'
    },
    {
      value: 'Ahmedabad, Gujarat, India',
      detail: 'Serving global teams',
      icon: 'map-pin',
      href: '/contactus'
    }
  ];
</script>

<footer class="relative border-t border-slate-200 bg-white pt-16 pb-6 text-slate-600">
  <div class="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#00c6ff]/40 to-transparent"></div>

  <div class="mx-auto max-w-7xl px-6">
    <div class="grid grid-cols-1 gap-y-10 lg:gap-x-10 lg:grid-cols-12">

     <div class="lg:col-span-4">
  <a href="/" class="group mb-6 flex items-center gap-4">
    <div class="flex h-14 w-auto items-center justify-center overflow-visible">
      <img 
        src="/logo1.png" 
        alt="Core4ix logo" 
        class="h-full w-auto scale-[2.2] object-contain transition-transform duration-500 group-hover:scale-[2.4]" 
      />
    </div>
    
    <div class="ml-4 h-10 w-[1px] bg-slate-200"></div>

    <div class="flex flex-col justify-center">
      <h3 class="text-2xl font-black leading-none tracking-tight text-[#1f4e79]">CORE4IX</h3>
      <p class="mt-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#00c6ff]">Tech Studio</p>
    </div>
  </a>

  <p class="mb-6 max-w-sm text-[15px] leading-relaxed text-slate-500/90">
    Engineering modern web platforms and AI-driven ecosystems. Bridging complex technology with seamless user experiences.
  </p>

  <div class="flex gap-3">
    {#each actionLinks as item}
      <a
        href={item.href}
        class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:-translate-y-1 hover:border-[#00c6ff] hover:bg-[#00c6ff] hover:text-white"
      >
        <InlineIcon name={item.icon} size={16} />
      </a>
    {/each}
  </div>
</div>

      <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-8">
        
        <div>
          <h4 class="mb-4 text-xs font-bold uppercase tracking-wider text-[#1f4e79]">Company</h4>
          <ul class="space-y-2.5">
            {#each quickLinks as link}
              <li>
                <a href={link.href} class="group flex items-center text-[14px] transition-colors hover:text-[#00c6ff]">
                  <span class="h-[1px] w-0 bg-[#00c6ff] transition-all duration-300 group-hover:mr-2 group-hover:w-2.5"></span>
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div>
          <h4 class="mb-4 text-xs font-bold uppercase tracking-wider text-[#1f4e79]">Expertise</h4>
          <ul class="space-y-2.5">
            {#each serviceLinks as link}
              <li>
                <a href={link.href} class="group flex items-center text-[14px] transition-colors hover:text-[#00c6ff]">
                  <span class="h-[1px] w-0 bg-[#00c6ff] transition-all duration-300 group-hover:mr-2 group-hover:w-2.5"></span>
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <h4 class="mb-4 text-xs font-bold uppercase tracking-wider text-[#1f4e79]">Get in Touch</h4>
          <div class="space-y-4">
            {#each contactItems as item}
              <a href={item.href} class="group flex items-start gap-3 transition-transform hover:translate-x-1">
                <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-[#00c6ff] border border-slate-100 group-hover:border-[#00c6ff]/30 group-hover:bg-[#00c6ff]/5">
                  <InlineIcon name={item.icon} size={13} />
                </div>
                <div class="flex flex-col">
                  <span class="text-[14px] font-medium text-slate-700 group-hover:text-[#1f4e79]">{item.value}</span>
                  <span class="text-[12px] text-slate-400">{item.detail}</span>
                </div>
              </a>
            {/each}
          </div>
        </div>

      </div>
    </div>

    <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 md:flex-row">
      <p class="text-[13px] text-slate-400">
        &copy; {currentYear} <span class="font-semibold text-slate-600">Core4ix Studio</span>. Built for the future.
      </p>

      <div class="flex items-center gap-6">
        <a href="/privacy" class="text-[13px] text-slate-400 transition hover:text-[#00c6ff]">Privacy Policy</a>
        <a href="/terms" class="text-[13px] text-slate-400 transition hover:text-[#00c6ff]">Terms of Service</a>
        <div class="hidden h-3 w-px bg-slate-200 sm:block"></div>
        <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-[12px] font-medium text-slate-500">System Status: Optimal</span>
        </div>
      </div>
    </div>
  </div>
</footer>