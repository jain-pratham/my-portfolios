<script>
  const steps = [
    {
      number: "01",
      title: "Current-State Post Mortem",
      description: "We deploy monitoring daemons to your existing infrastructure to locate RAM bottlenecks, misconfigured routing tables, and security vulnerabilities before proposing migration."
    },
    {
      number: "02",
      title: "VPC & Subnet Geography",
      description: "We hardcode the network boundaries. Defining Public subnets for load balancers and Private subnets for databases to enforce military-grade network isolation."
    },
    {
      number: "03",
      title: "CI/CD Pipeline Construction",
      description: "GitHub Actions are wired directly into ECR (Docker Registries). Every semantic version release triggered on Git immediately compiles and deploys."
    },
    {
      number: "04",
      title: "Chaos Engineering",
      description: "Before sign-off, we intentionally crash production servers during simulated traffic loads to ensure auto-scaling groups and database read-replicas instantly take over."
    }
  ];
</script>

<section class="bg-white py-24 relative">
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Our Methodology</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Structured and Resilient.</h3>
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
