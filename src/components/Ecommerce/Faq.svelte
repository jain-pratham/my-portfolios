<script>
  import FaqAccordion from '../Faq.svelte';

  const faqs = [
    {
      question: "Why should we move off standard Shopify templates to Headless Shopify?",
      description: "Liquid (Shopify's templating engine) is incredibly rigid. Once your store crosses $5M+ GMV, standard templates prevent you from building intricate product bundle logic, localized international storefronts, or instant page-to-page navigation. Headless separates the database from the design for complete control."
    },
    {
      question: "What happens to our established SEO rankings if we re-platform?",
      description: "If executed poorly, a migration will destroy your organic rankings. We strictly map 301 redirects for every legacy URL, retain exact H1 structures, and dramatically improve Core Web Vitals (which Google actively rewards)."
    },
    {
      question: "Do you integrate with massive ERPs?",
      description: "Yes. Complex B2B pricing grids, realtime inventory allocation, and automated fulfillment logic require deep API connections to systems like SAP, Oracle NetSuite, and Microsoft Dynamics."
    },
    {
      question: "Are your platforms PCI Compliant?",
      description: "We never store raw credit card data on our servers. All transaction payloads are directly tokenized and vaulted by secure payment processors (Stripe, Braintree, Adyen), completely bypassing internal architecture to ensure ironclad PCI-DSS compliance."
    }
  ];
</script>

<section class="bg-slate-50 py-24 border-t border-slate-100">
  <div class="container mx-auto px-6 max-w-7xl">
    <div class="flex flex-col lg:flex-row gap-16">
      
      <div class="lg:w-1/3">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Questions Answered</h2>
        <h3 class="text-4xl lg:text-5xl font-black text-[#1f4e79] tracking-tight mb-6">Technical Scope</h3>
        <p class="text-slate-600 leading-relaxed max-w-md">Detailed context surrounding replatforming safety, enterprise integrations, and compliance.</p>
      </div>

      <div class="lg:w-2/3">
        <FaqAccordion items={faqs} />
      </div>

    </div>
  </div>
</section>
