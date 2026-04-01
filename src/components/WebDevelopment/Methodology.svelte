<script>
  const steps = [
    {
      number: "01",
      title: "System Discovery",
      description: "Requirements are strictly translated into domain boundaries, API contracts, and delivery milestones. We clarify exactly what is being built and how it interfaces with legacy systems before writing code."
    },
    {
      number: "02",
      title: "Engineering",
      description: "Frontend and backend layers are constructed with modular patterns that simplify code maintenance. Version-controlled endpoints and rigid types ensure regressions are caught at compile, not runtime."
    },
    {
      number: "03",
      title: "Validation",
      description: "Load behavior, rendering performance, and integration stability are relentlessly tested. Automated CI pipelines run tests against staging environments to mirror production conditions."
    },
    {
      number: "04",
      title: "Release & Observability",
      description: "Production rollout occurs with a fallback strategy. We include deep observability hooks to monitor exception rates and server latency in real-time."
    }
  ];
</script>

<section class="bg-white py-24 relative">
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Our Methodology</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Structured and Predictable.</h3>
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
