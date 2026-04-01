<script>
  const steps = [
    {
      number: "01",
      title: "Process Mapping & Blueprinting",
      description: "Before writing any code, we deploy solutions architects to map your exact manual operations. We define where data bottlenecks occur and how legacy tools are failing."
    },
    {
      number: "02",
      title: "Data Migration Strategy",
      description: "We architect secure extraction pipelines to pull historical ledgers, vendor lists, and product taxonomies from outdated MySQL databases or disparate Excel files."
    },
    {
      number: "03",
      title: "Component Engineering",
      description: "We build modular interfaces—billing, inventory, CRM—using decoupled micro-frontends. This allows single departments to receive system updates without affecting the entire company."
    },
    {
      number: "04",
      title: "Phased Deployment",
      description: "A huge ERP go-live usually results in chaos. We enforce a phased rollout, onboarding one department at a time while heavily monitoring user adoption and error logs."
    }
  ];
</script>

<section class="bg-white py-24 relative">
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Our Methodology</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Structured and Audited.</h3>
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
