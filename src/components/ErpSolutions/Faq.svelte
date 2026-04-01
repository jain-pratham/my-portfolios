<script>
  import FaqAccordion from '../Faq.svelte';

  const faqs = [
    {
      question: "Should we buy off-the-shelf (NetSuite/SAP) or build custom?",
      description: "If your business strictly aligns with standard logistics and accounting models, buying off-the-shelf is faster. However, if your company has a unique, proprietary operational model that delivers your competitive advantage, forcing it into rigid SAP templates will destroy your efficiency. In that case, custom is required."
    },
    {
      question: "How do you ensure data isn't lost during migration?",
      description: "We build isolated staging environments and perform multiple dry-run migrations. Scripts are written to explicitly calculate checksums between the legacy export and the new database. If a single decimal point is off, the migration fails before hitting production."
    },
    {
      question: "Can you rescue an ERP implementation that has gone over budget and failed?",
      description: "Yes. This is unfortunately common. We start with a codebase audit to determine if the underperforming system can be refactored module-by-module, or if the architecture is so compromised it requires an aggressive rebuild."
    },
    {
      question: "Do you utilize Microservices or Monolithic architecture for ERPs?",
      description: "For new builds, we prefer a well-structured Monolith initially for development velocity, designed with strict domain boundaries. As specific features (like the analytics engine) require massive horizontal scaling, we break them out into independent Microservices."
    }
  ];
</script>

<section class="bg-slate-50 py-24 border-t border-slate-100">
  <div class="container mx-auto px-6 max-w-7xl">
    <div class="flex flex-col lg:flex-row gap-16">
      
      <div class="lg:w-1/3">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Questions Answered</h2>
        <h3 class="text-4xl lg:text-5xl font-black text-[#1f4e79] tracking-tight mb-6">Technical Scope</h3>
        <p class="text-slate-600 leading-relaxed max-w-md">Detailed context surrounding custom vs. out-of-the-box decisions, migration safety, and architectural strategy.</p>
      </div>

      <div class="lg:w-2/3">
        <FaqAccordion items={faqs} />
      </div>

    </div>
  </div>
</section>
