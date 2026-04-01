<script>
  const services = [
    {
      title: "Extensible Frontend Routing",
      description: "Implementing Next.js or Nuxt.js frameworks to guarantee instant page transitions, ensuring the user's dopamine loop is never broken by a loading spinner.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`
    },
    {
      title: "Headless CMS Interlopability",
      description: "We pair your e-commerce backend with systems like Sanity or Contentful. Marketing teams can aggressively deploy landing pages without begging engineering for deployment windows.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`
    },
    {
      title: "Algorithmic Search & Filtering",
      description: "Integrating Elasticsearch or Algolia to provide typo-tolerant, sub-millisecond facet filtering across catalogs numbering in the hundreds of thousands.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`
    },
    {
      title: "Granular Analytics Infrastructure",
      description: "Configuring server-side tracking via Segment or Google Tag Manager to bypass Apple's ITP restrictions, yielding deterministic ad attribution modeling.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`
    }
  ];
</script>

<section id="services" class="bg-white py-24 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Core Capabilities</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Retail Infrastructure</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {#each services as service}
        <div class="group relative overflow-hidden rounded-3xl bg-slate-50 p-10 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#1f4e79] shadow-sm border border-slate-100 transition-colors group-hover:bg-[#1f4e79] group-hover:text-[#00c6ff]">
            {@html service.icon}
          </div>
          <h4 class="mb-4 text-2xl font-black text-slate-800">{service.title}</h4>
          <p class="text-slate-600 leading-relaxed text-lg">{service.description}</p>
          
          <div class="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-[#00c6ff] to-blue-500 transition-all duration-500 group-hover:w-full"></div>
        </div>
      {/each}
    </div>
  </div>
</section>
