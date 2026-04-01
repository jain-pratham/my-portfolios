<script>
  const steps = [
    {
      number: "01",
      title: "Data Blueprinting",
      description: "We map out existing product taxonomies, variant logic, pricing tiers, and legacy order histories ensuring nothing is lost during the backend database migration."
    },
    {
      number: "02",
      title: "Backend Interconnectivity",
      description: "APIs are established between your primary commerce engine (Shopify Plus) and your operational tools: ERPs (NetSuite), CRMs (Hubspot), and 3PL fulfillment networks."
    },
    {
      number: "03",
      title: "Frontend Engineering",
      description: "Simultaneously, we construct the rapid React-based storefront components prioritizing LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) for perfect Google Lighthouse scores."
    },
    {
      number: "04",
      title: "Cutover & Go-Live",
      description: "Store migration requires militant coordination. We execute DNS routing and final database syncs during statistically low traffic windows to prevent dropped cart conversions."
    }
  ];
</script>

<section class="bg-white py-24 relative">
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Our Methodology</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Structured and Data-Safe.</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each steps as step, i}
        <div class="relative pt-6">
          <div class="text-[#00c6ff] font-black text-6xl opacity-10 absolute top-0 -left-2 -z-10">{step.number}</div>
          <div class="text-[#1f4e79] font-black text-xl mb-4">{step.title}</div>
          <p class="text-slate-500 leading-relaxed text-sm">{step.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
