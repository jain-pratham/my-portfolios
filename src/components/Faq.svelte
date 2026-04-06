<script>
  const faqs = [
    {
      q: 'What exactly does CORE4IX do?',
      a: 'CORE4IX is an elite tech studio specializing in high-performance web applications, mobile apps, custom AI integration, and enterprise-grade software. We partner with businesses to architect scalable digital solutions that drive growth and operational efficiency.'
    },
    {
      q: 'What is your typical process for a new development project?',
      a: 'We start with a technical discovery phase to understand your business goals. From there, we design a scalable architecture, map out a sprint-based development roadmap, and execute with precision. You receive continuous updates, rigorous QA, and dedicated support post-launch.'
    },
    {
      q: 'Can you help integrate AI into my existing business operations?',
      a: 'Absolutely. Our dedicated AI team specializes in Custom LLM integration, AI agent development, n8n visual workflows, and generative AI features. We build intelligent automation solutions that reduce overhead and streamline your specific workflows.'
    },
    {
      q: 'We need a complex e-commerce or marketplace platform. Is that something you handle?',
      a: 'Yes. We build conversion-focused storefronts and complex multi-vendor marketplaces. We move beyond basic templates, delivering scalable, highly secure platforms designed for high traffic and seamless user experiences.'
    },
    {
      q: 'Do you work with specific industries?',
      a: 'We have hands-on experience developing platforms across diverse sectors, including digital commerce, logistics, healthcare, academic consultancy, and fintech. Our custom applications and ERP solutions are tailored to meet unique compliance and scaling needs.'
    },
    {
      q: 'How long does it usually take to build a custom application?',
      a: 'Timelines vary based on project scope and complexity. A standard business portal might take a few weeks, while complex AI integrations or ERPs are delivered in phased milestones over a few months. We establish clear, transparent timelines during the initial setup.'
    },
    {
      q: 'What happens after my application is launched?',
      a: 'We do not just launch and leave. We provide post-launch optimization, cloud infrastructure maintenance, security updates, and ongoing technical support to ensure your product remains robust, secure, and future-ready.'
    },
    {
      q: 'I have an idea. How do we get started?',
      a: 'It\'s simple. Reach out to us via our Contact page or call us directly at +91 7016945985. We will schedule a technical discussion to explore your vision and outline how CORE4IX can bring your idea to life.'
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
