<script>
  const services = [
    {
      title: "Data Integrity Pipelines",
      description: "Automated cron jobs and webhook architectures that guarantee absolute parity between warehouse inventory scanners and the financial ledger, eliminating human data-entry errors.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>`
    },
    {
      title: "Task Routing & Automation",
      description: "Encoding your standard operating procedures into code. We build deterministic approval chains where purchase orders and vacation requests route automatically based on complex organizational logic.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`
    },
    {
      title: "Granular Access Control",
      description: "Implementing complex multi-tenant Role-Based Access Control (RBAC). Floor managers, accountants, and executives see totally isolated views containing only the data they are authorized to interact with.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`
    },
    {
      title: "Intelligent Procurement",
      description: "Algorithms that automatically fire purchase orders to vendors when SKU counts drop below historical velocity thresholds, ensuring you never face a stockout scenario.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17L15 11M5 7L10 12L15 7M5 17L10 12L15 17" /></svg>`
    }
  ];
</script>

<section id="services" class="bg-white py-24 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Core Capabilities</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">System Modules</h3>
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
