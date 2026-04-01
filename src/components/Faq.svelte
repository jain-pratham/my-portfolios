<script>
  const faqs = [
    {
      q: 'What services does CORE4IX provide?',
      a: 'We provide software engineering, web development, cloud solutions, AI integrations, cybersecurity, and IT consulting for startups and enterprises.'
    },
    {
      q: 'What industries does CORE4IX work with?',
      a: 'We work with healthcare, education, real estate, manufacturing, logistics, and digital commerce teams across multiple markets.'
    },
    {
      q: 'How does CORE4IX ensure data security and confidentiality?',
      a: 'We follow security-first architecture, role-based access, encrypted data handling, and strict delivery workflows with confidentiality controls.'
    },
    {
      q: 'What development process does CORE4IX follow?',
      a: 'Our process includes discovery, roadmap planning, sprint-based development, QA cycles, and post-launch optimization with transparent updates.'
    },
    {
      q: 'Does CORE4IX build custom enterprise-grade software?',
      a: 'Yes. We build custom enterprise software tailored to business workflows, scale requirements, and long-term maintainability.'
    },
    {
      q: 'Why do global businesses choose CORE4IX as their technology partner?',
      a: 'Clients choose us for fast execution, clean engineering, business-focused delivery, and dependable communication throughout the project.'
    },
    {
      q: 'How does CORE4IX integrate AI into solutions?',
      a: 'We integrate AI through intelligent automation, data pipelines, and model-assisted features that fit practical product use-cases.'
    },
    {
      q: 'How can I start a project with CORE4IX?',
      a: 'Start by reaching out through our contact section with your scope. We then schedule a discovery call and share a project roadmap.'
    }
  ];

  let openIndex = -1;

  function toggle(index) {
    openIndex = openIndex === index ? -1 : index;
  }
</script>

<section id="faq" class="bg-[#f3f3f3] py-14 md:py-16">
  <div class="container mx-auto px-6">
    <h2 class="mb-7 text-3xl font-black tracking-tight text-[#1f2937] md:mb-9 md:text-5xl">Frequently Asked Questions</h2>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {#each faqs as item, i}
        <article class="overflow-hidden rounded-2xl border border-slate-200 bg-[#ececec]">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 px-5 py-5 text-left transition-colors hover:bg-[#e7e7e7] md:px-6"
            on:click={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-panel-${i}`}
          >
            <span class="text-base leading-snug text-slate-700 md:text-xl">{item.q}</span>
            <span class="shrink-0 text-3xl font-light leading-none text-[#00a8da] transition-transform duration-300 {openIndex === i ? 'rotate-180' : ''}">↓</span>
          </button>

          {#if openIndex === i}
            <div id={`faq-panel-${i}`} class="border-t border-slate-300 px-5 pb-5 pt-3 md:px-6" role="region">
              <p class="text-sm leading-relaxed text-slate-600 md:text-base">{item.a}</p>
            </div>
          {/if}
        </article>
      {/each}
    </div>
  </div>
</section>
