<script>
  const services = [
    {
      title: "AI Readiness Assessment",
      description: "We evaluate your current data infrastructure, team capabilities, and business goals to determine if you are ready for AI integration.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    {
      title: "Data Strategy & Engineering",
      description: "AI is only as good as the data it runs on. We design scalable data pipelines that prepare your organization for machine learning.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>`
    },
    {
      title: "Generative AI Advisory",
      description: "Discover how LLMs and generative agents can automate your workflows, create new products, or dramatically improve customer service.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`
    },
    {
      title: "Security & Compliance Audits",
      description: "Ensure your AI implementations follow strict regulatory guidelines, protecting user privacy and preventing algorithmic bias.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`
    }
  ];
</script>

<section id="services" class="bg-white py-24 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">What We Provide</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Expert Guidance for <br/>the AI Era</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {#each services as service}
        <div class="group relative overflow-hidden rounded-3xl bg-slate-50 p-10 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#1f4e79] shadow-sm border border-slate-100 transition-colors group-hover:bg-[#1f4e79] group-hover:text-[#00c6ff]">
            {@html service.icon}
          </div>
          <h4 class="mb-4 text-2xl font-black text-slate-800">{service.title}</h4>
          <p class="text-slate-600 leading-relaxed text-lg">{service.description}</p>
          
          <!-- Decorative gradient edge -->
          <div class="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-[#00c6ff] to-blue-500 transition-all duration-500 group-hover:w-full"></div>
        </div>
      {/each}
    </div>
  </div>
</section>
