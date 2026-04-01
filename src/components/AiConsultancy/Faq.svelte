<script>
  const faqs = [
    {
      q: 'How long does an AI readiness audit take?',
      a: 'A typical AI readiness audit takes between 2 to 4 weeks depending on the size of your organization and the complexity of your existing data infrastructure.'
    },
    {
      q: 'Do we need an existing data team to work with you?',
      a: 'Not necessarily. We can act as your off-site AI and data engineering team, setting up the necessary pipelines and infrastructure from scratch.'
    },
    {
      q: 'Is my data secure when using Generative AI?',
      a: 'Yes. We prioritize deploying enterprise-grade AI models within your secure environment (e.g., private cloud or VPC) ensuring your proprietary data is never used to train public models.'
    },
    {
      q: 'What kind of ROI can we expect from AI implementation?',
      a: 'ROI varies by use case, but our clients typically see 30-50% improvements in operational efficiency and significant reductions in manual processing times.'
    }
  ];

  let openIndex = -1;

  function toggle(index) {
    if (openIndex === index) {
      openIndex = -1;
    } else {
      openIndex = index;
    }
  }
</script>

<section class="bg-[#f8fafc] py-24">
  <div class="container mx-auto px-6 max-w-4xl">
    <div class="mb-12 text-center">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">FAQ</h2>
      <h3 class="text-3xl md:text-5xl font-black tracking-tight text-[#1f2937]">Consultancy Questions</h3>
    </div>

    <div class="space-y-4">
      {#each faqs as item, i}
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-[#1f4e79]/30 hover:shadow-md">
          <button
            class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            on:click={() => toggle(i)}
            aria-expanded={openIndex === i}
          >
            <span class="text-lg font-bold text-slate-800">{item.q}</span>
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[#1f4e79] transition-transform duration-300 {openIndex === i ? 'rotate-180 bg-[#1f4e79] text-white' : ''}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
          
          {#if openIndex === i}
            <div class="px-6 pb-6 pt-2 text-slate-600 leading-relaxed text-base border-t border-slate-100">
              {item.a}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
