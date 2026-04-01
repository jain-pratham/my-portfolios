<script>
  const steps = [
    {
      number: "01",
      title: "Model Selection",
      description: "Evaluating your specific use case to choose the most cost-effective and capable foundation model."
    },
    {
      number: "02",
      title: "Middleware Setup",
      description: "Building the secure proxy layer that will handle API keys, rate-limiting, and error fallbacks so your frontend stays safe."
    },
    {
      number: "03",
      title: "Prompt Engineering",
      description: "Hardcoding robust system instructions so the API returns structured JSON or perfectly formatted text every single time."
    },
    {
      number: "04",
      title: "Frontend Wiring",
      description: "Hooking up the backend AI endpoints seamlessly into your product's UI with realistic loading states and error handling."
    }
  ];
</script>

<section class="bg-slate-900 py-24 text-white relative overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>
  
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 text-center">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">How We Will Do This</h2>
      <h3 class="text-4xl md:text-5xl font-black text-white tracking-tight">Integration Process</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each steps as step, i}
        <div class="relative pt-8 group">
          {#if i !== steps.length - 1}
            <div class="hidden lg:block absolute top-[4.5rem] left-[50%] w-full h-[1px] bg-slate-700 transition-colors group-hover:bg-[#00c6ff]"></div>
          {/if}
          
          <div class="mb-6 flex flex-col items-center">
            <span class="z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#00c6ff]/30 bg-[#1f4e79] text-2xl font-black text-[#00c6ff] shadow-[0_0_20px_rgba(0,198,255,0.2)] transition-transform group-hover:scale-110">
              {step.number}
            </span>
          </div>

          <div class="text-center">
            <h4 class="mb-3 text-xl font-black text-slate-100">{step.title}</h4>
            <p class="text-slate-400 leading-relaxed text-sm md:text-base">{step.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
