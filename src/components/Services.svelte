<script>
  let activeTab = 'Web Development';

  const serviceDetails = {
    'Web Development': {
      badge: 'Core Expertise',
      title: 'High-Performance Web Platforms',
      desc: 'We build fast, conversion-aware websites and web applications that combine polished user experience, clean engineering, and a scalable technical foundation.',
      features: ['Custom Web Apps', 'Responsive UI Systems', 'API Integrations', 'SEO and Performance'],
      image: '/web.webp',
      href: '/services/web-development'
    },
    'Mobile Apps': {
      badge: 'Core Expertise',
      title: 'Mobile Experiences Built for Daily Use',
      desc: 'Our mobile solutions are designed for reliability, intuitive flows, and seamless platform performance across customer apps, internal tools, and field operations.',
      features: ['Android and iOS', 'Cross-Platform Builds', 'Backend Connectivity', 'Release Support'],
      image: 'mobile.webp',
      href: '/services/app-development'
    },
    'E-Commerce': {
      badge: 'Core Expertise',
      title: 'Commerce Systems That Support Growth',
      desc: 'We create storefronts and operational commerce workflows that make buying easier for customers while improving visibility for internal teams.',
      features: ['Storefront UX', 'Payment Flows', 'Catalog Design', 'Order Operations'],
      image: '/ecommerce.png',
      href: '/services/ecommerce'
    },
    'AI Solutions': {
      badge: 'AI Services',
      title: 'Practical AI for Real Business Work',
      desc: 'From AI strategy and intelligent automation to agents and generative experiences, we help businesses deploy AI in ways that are secure, useful, and production-ready.',
      features: ['AI Strategy', 'GenAI Workflows', 'Agent Systems', 'Model Integrations'],
      image: '/ai.jpg',
      href: '/ai/ai-consultancy'
    }
  };

  const tabs = Object.keys(serviceDetails);
  $: activeService = serviceDetails[activeTab];
</script>

<section id="solutions" class="overflow-hidden bg-white py-16">
  <div class="container mx-auto px-6">
    <div class="mx-auto mb-12 max-w-3xl text-center">
      <span class="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#00c6ff]">
        Services and AI
      </span>
      <h2 class="mt-5 text-3xl font-black leading-tight text-[#1f4e79] md:text-5xl">
        Digital delivery built for growth, automation, and long-term reliability
      </h2>
      <p class="mt-4 text-base leading-relaxed text-slate-500 md:text-lg">
        Explore our core delivery capabilities and AI-focused offerings designed to help teams modernize systems, improve efficiency, and ship with confidence.
      </p>
    </div>

    <div class="mb-10 flex justify-start gap-2 overflow-x-auto border-b border-slate-100 px-2 no-scrollbar md:justify-center md:gap-6">
      {#each tabs as tab}
        <button
          on:click={() => activeTab = tab}
          class="relative whitespace-nowrap px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all md:text-xs
          {activeTab === tab ? 'text-[#1f4e79]' : 'text-slate-400 hover:text-slate-600'}"
        >
          {tab}
          {#if activeTab === tab}
            <div class="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-[#00c6ff] shadow-[0_-2px_8px_rgba(0,198,255,0.5)] animate-slideIn"></div>
          {/if}
        </button>
      {/each}
    </div>

    <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div class="order-2 flex items-center justify-center lg:order-1">
  <div class="relative flex h-full w-full max-w-md aspect-[4/3] items-center justify-center rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
    
    <!-- Glow Effect -->
    <div class="absolute inset-6 rounded-full bg-sky-100/40 blur-[80px]"></div>
    
    <!-- Image -->
    <img
      src={activeService.image}
      alt={activeTab}
      class="relative z-10 w-full h-full object-cover animate-float rounded-xl"
    />
    
  </div>
</div>
      <div class="order-1 lg:order-2">
        <div class="inline-block rounded-full border border-slate-100 bg-slate-50 px-3 py-1">
          <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00c6ff]">{activeService.badge}</span>
        </div>

        <h3 class="mt-4 text-3xl font-black leading-tight text-[#1f4e79] md:text-4xl">
          {activeService.title}
        </h3>

        <p class="mb-6 mt-4 max-w-xl text-base leading-relaxed text-slate-500">
          {activeService.desc}
        </p>

        <div class="mb-8 grid grid-cols-2 gap-3 border-l-2 border-sky-100 pl-4">
          {#each activeService.features as feature}
            <div class="flex items-center gap-2">
              <div class="h-1.5 w-1.5 rounded-full bg-[#00c6ff] shadow-[0_0_5px_#00c6ff]"></div>
              <span class="text-xs font-bold text-slate-700">{feature}</span>
            </div>
          {/each}
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <a
            href={activeService.href}
            class="rounded-xl bg-[#1f4e79] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#163a5a] active:scale-95"
          >
            Explore Service
          </a>
          <a
            href="/contactus"
            class="border-b-2 border-sky-100 text-sm font-bold text-[#1f4e79] transition-all hover:border-[#00c6ff]"
          >
            Contact us ->
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  .animate-float { animation: float 5s ease-in-out infinite; }

  @keyframes slideIn {
    from { width: 0; opacity: 0; }
    to { width: 100%; opacity: 1; }
  }
  .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }

  h3, p, img {
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
