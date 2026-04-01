<script>
  import FaqAccordion from '../Faq.svelte';

  const faqs = [
    {
      question: "Do you use templates or CMS platforms like WordPress?",
      answer: "For complex corporate websites, we prefer headless CMS architectures (like Sanity or Contentful) tied to optimized frontend frameworks (like Next.js or Astro). This gives your marketing team full content control without sacrificing load performance or security."
    },
    {
      question: "Who owns the code?",
      answer: "You do. Upon project completion and final payment, your organization retains 100% ownership of the repository, source code, and intellectual property. We do not lock our clients into proprietary platforms."
    },
    {
      question: "How do you handle backend hosting?",
      answer: "Depending on your specific compliance and scalability needs, we architect deployments across Vercel, AWS (EC2/Lambda), or Dockerized multi-cloud setups. Security and uptime dictate the final infrastructure decision."
    },
    {
      question: "What is your stance on TypeScript?",
      answer: "We mandate strict TypeScript usage for all new web projects. The minimal overhead during development is overwhelmingly offset by entirely preventing runtime type errors and dramatically improving developer velocity during refactoring."
    }
  ];
</script>

<section class="bg-slate-50 py-24 border-t border-slate-100">
  <div class="container mx-auto px-6 max-w-7xl">
    <div class="flex flex-col lg:flex-row gap-16">
      
      <div class="lg:w-1/3">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Questions Answered</h2>
        <h3 class="text-4xl lg:text-5xl font-black text-[#1f4e79] tracking-tight mb-6">Technical Scope & Delivery</h3>
        <p class="text-slate-600 leading-relaxed max-w-md">Detailed context surrounding our engineering standards, handoff process, and infrastructure preferences.</p>
      </div>

      <div class="lg:w-2/3">
        <FaqAccordion items={faqs} />
      </div>

    </div>
  </div>
</section>
