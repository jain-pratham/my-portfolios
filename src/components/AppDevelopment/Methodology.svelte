<script>
  const steps = [
    {
      number: "01",
      title: "Scoping & API Contracts",
      description: "We define precise component architectures and mock out server API endpoints. This isolates front-end UI velocity from pending back-end database changes."
    },
    {
      number: "02",
      title: "Tactical Execution Sprints",
      description: "Code is mapped into Jira/Linear epics and pushed rapidly. CI/CD pipelines trigger automated formatters, linters, and unit tests against mock datasets upon every commit."
    },
    {
      number: "03",
      title: "Device Emulation QA",
      description: "The build is aggressively tested across a matrix of hardware dimensions: Android tablets, bleeding-edge iPhones, legacy OS versions, low-battery states, and terrible 3G network conditions."
    },
    {
      number: "04",
      title: "Store Submission",
      description: "We handle the bureaucratic gauntlet of App Store compliance: localized asset generation, privacy policy declarations, and continuous Fastlane pipeline monitoring."
    }
  ];
</script>

<section class="bg-white py-24 relative">
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Our Methodology</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Iterative and QA-Obsessed.</h3>
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
