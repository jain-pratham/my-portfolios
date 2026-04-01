<script>
  const services = [
    {
      title: "LLM API Integration",
      description: "We securely connect models like GPT-4, Claude 3, or Gemini into your existing codebase so your app can generate text, summarize data, or answer queries natively.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`
    },
    {
      title: "RAG Setup (Retrieval-Augmented)",
      description: "We integrate vector databases (Pinecone, Milvus) so that the AI models can pull context directly from your private PDFs and company wikis before answering.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>`
    },
    {
      title: "Middleware & Caching",
      description: "LLM APIs are expensive and sometimes slow. We build custom middleware that caches frequent requests and handles rate limits so your app stays fast.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`
    },
    {
      title: "Vision & Audio Pipelines",
      description: "Integrating multimodal capabilities like automatic image tagging, receipt OCR processing, or voice-to-text transcription directly into your workflow.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`
    }
  ];
</script>

<section id="services" class="bg-white py-24 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">What We Provide</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Integration Services</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {#each services as service}
        <div class="group relative overflow-hidden rounded-3xl bg-slate-50 p-10 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#1f4e79] shadow-sm border border-slate-100 transition-colors group-hover:bg-[#1f4e79] group-hover:text-[#00c6ff]">
            {@html service.icon}
          </div>
          <h4 class="mb-4 text-2xl font-black text-slate-800">{service.title}</h4>
          <p class="text-slate-600 leading-relaxed text-lg">{service.description}</p>
          
          <div class="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-[#00c6ff] to-blue-500 transition-all duration-500 group-hover:w-full"></div>
        </div>
      {/each}
    </div>
  </div>
</section>
