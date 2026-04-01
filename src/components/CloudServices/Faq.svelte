<script>
  import FaqAccordion from '../Faq.svelte';

  const faqs = [
    {
      question: "AWS vs. GCP vs. Azure - Which do you recommend?",
      description: "It depends strictly on your stack. AWS dominates for general microservices and massive ecosystem tooling. GCP is superior if you heavily rely on Kubernetes (GKE) and BigQuery. Azure is mandatory if your enterprise uses Microsoft Active Directory and .NET."
    },
    {
      question: "Why should we containerize with Docker?",
      description: "Because 'It works on my machine' is unacceptable in production. Docker guarantees that the exact environment dependencies your developer used locally are perfectly mirrored when the code reaches the Linux production server."
    },
    {
      question: "Are your platforms HIPAA/SOC2 compliant?",
      description: "Compliance isn't a checkbox; it's an architectural mindset. We can build environments with KMS-managed encryption-at-rest, strictly audited CloudTrail logs, and hardened Bastion hosts specifically designed to pass SOC2 Type II and HIPAA audits."
    },
    {
      question: "Do you offer 24/7 on-call DevOps support?",
      description: "High-tier SLA contracts include direct PagerDuty access to our senior site reliability engineers (SREs). If a database deadlocks at 3 AM on a Sunday, our monitoring catches it and we intervene immediately."
    }
  ];
</script>

<section class="bg-slate-50 py-24 border-t border-slate-100">
  <div class="container mx-auto px-6 max-w-7xl">
    <div class="flex flex-col lg:flex-row gap-16">
      
      <div class="lg:w-1/3">
        <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Questions Answered</h2>
        <h3 class="text-4xl lg:text-5xl font-black text-[#1f4e79] tracking-tight mb-6">Technical Scope</h3>
        <p class="text-slate-600 leading-relaxed max-w-md">Detailed context surrounding cloud provider selection, container orchestration, and security compliance.</p>
      </div>

      <div class="lg:w-2/3">
        <FaqAccordion items={faqs} />
      </div>

    </div>
  </div>
</section>
