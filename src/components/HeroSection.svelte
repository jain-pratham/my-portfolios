<script>
  // Carousel Data with added 'features' for the right side content
  const slides = [
    {
      title: "Architecting the Digital Frontier",
      subtitle: "We are an elite boutique agency specializing in high-performance digital products. Where enterprise-grade engineering meets startup imagination.",
      ctaText: "Deploy Your Idea",
      ctaLink: "#contact",
      secondaryText: "Founding Squad of 4 // Dev Phase",
      glowColor: "bg-sky-100",
      features: [
        "End-to-End Product Development",
        "Technical Architecture & Strategy",
        "High-Fidelity UI/UX Design",
        "Dedicated Elite Engineering Squad"
      ]
    },
    {
      title: "Custom Web Applications",
      subtitle: "We build bespoke, high-conversion web platforms tailored to your business logic. Moving beyond templates to create true, scalable digital assets.",
      ctaText: "Start Building",
      ctaLink: "#web-dev",
      secondaryText: "Built for Scale & Speed",
      glowColor: "bg-blue-100",
      features: [
        "Modern Single Page Applications (SPAs)",
        "Complex Enterprise Dashboards",
        "Secure E-Commerce Gateways",
        "Scalable Database Architecture"
      ]
    },
    {
      title: "AI-Driven Automation",
      subtitle: "Integrate intelligent LLMs and custom workflows directly into your operations. Reduce overhead, multiply your output, and eliminate repetitive tasks.",
      ctaText: "Automate Operations",
      ctaLink: "#ai",
      secondaryText: "Next-Gen AI Integration",
      glowColor: "bg-indigo-100",
      features: [
        "Custom LLM & ChatGPT Integrations",
        "n8n Visual Workflow Automation",
        "Intelligent Data Processing Pipelines",
        "24/7 AI Customer Support Agents"
      ]
    }
  ];

  let currentSlide = 0;

  // Pagination Logic (Manual Only)
  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  };
</script>

<main id="top" class="relative min-h-[90vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden bg-[#f8fafc] pt-28 pb-20">
  
  <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px); background-size: 32px 32px;"></div>

  {#each slides as slide, index}
    <div 
      class="absolute top-0 right-0 h-[800px] w-[800px] translate-x-1/4 -translate-y-1/4 rounded-full {slide.glowColor} opacity-70 blur-[120px] transition-opacity duration-700 ease-in-out z-0"
      class:opacity-70={currentSlide === index}
      class:opacity-0={currentSlide !== index}
    ></div>
  {/each}
  <div class="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/4 rounded-full bg-[#f1f5f9] opacity-80 blur-[100px] z-0"></div>

  <div class="absolute left-4 top-1/2 -translate-y-1/2 z-30 md:left-8">
    <button on:click={prevSlide} class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1f4e79] shadow-lg border border-slate-200 transition-all hover:bg-[#1f4e79] hover:text-white active:scale-95">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
  
  <div class="absolute right-4 top-1/2 -translate-y-1/2 z-30 md:right-8">
    <button on:click={nextSlide} class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1f4e79] shadow-lg border border-slate-200 transition-all hover:bg-[#1f4e79] hover:text-white active:scale-95">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  <div class="container relative z-10 mx-auto px-12 md:px-24 max-w-[1400px]">
    
    <div class="relative min-h-[500px] flex items-center">
      {#each slides as slide, index}
        <div 
          class="absolute inset-x-0 transition-all duration-700 ease-in-out transform w-full"
          class:opacity-100={currentSlide === index}
          class:opacity-0={currentSlide !== index}
          class:translate-y-0={currentSlide === index}
          class:translate-y-4={currentSlide !== index && currentSlide < index}
          class:-translate-y-4={currentSlide !== index && currentSlide > index}
          style={currentSlide !== index ? 'pointer-events: none;' : ''}
        >
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <div>
              <div class="mb-8 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2 shadow-sm inline-flex">
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00c6ff] opacity-75"></span>
                  <span class="relative inline-flex h-2 w-2 rounded-full bg-[#00c6ff]"></span>
                </span>
                <span class="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f4e79]">
                  {slide.secondaryText}
                </span>
              </div>

              <h1 class="text-[40px] font-black leading-[1.1] tracking-tight text-[#0f172a] md:text-[56px] lg:text-[64px] mb-6">
                {slide.title}
              </h1>

              <p class="text-[18px] font-medium leading-relaxed text-slate-600 mb-10 max-w-xl">
                {slide.subtitle}
              </p>

              <div class="flex items-center gap-6">
                <a href={slide.ctaLink} class="inline-flex items-center justify-center rounded-xl bg-[#1f4e79] px-8 py-4 text-[15px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#00c6ff] hover:text-[#0f172a] hover:shadow-[0_15px_30px_-5px_rgba(0,198,255,0.3)]">
                  {slide.ctaText}
                </a>
              </div>
            </div>

            <div class="hidden lg:block">
              <div class="bg-white border border-slate-100 rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_50px_-15px_rgba(31,78,121,0.1)] relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1f4e79] to-[#00c6ff]"></div>
                
                <h3 class="text-sm font-bold uppercase tracking-widest text-[#00c6ff] mb-8">What We Deliver</h3>
                
                <ul class="space-y-6">
                  {#each slide.features as feature}
                    <li class="flex items-start gap-4">
                      <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e0f2fe] text-[#00c6ff] mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-lg font-bold text-slate-700 leading-tight">{feature}</span>
                    </li>
                  {/each}
                </ul>

                <div class="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p class="text-2xl font-black text-[#1f4e79]">100<span class="text-[#00c6ff]">%</span></p>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Code Quality</p>
                  </div>
                  <div class="w-px h-8 bg-slate-200"></div>
                  <div>
                    <p class="text-2xl font-black text-[#1f4e79]">5.0</p>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Client Rating</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      {/each}
    </div>

    <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
      {#each slides as _, index}
        <button 
          on:click={() => { currentSlide = index; }}
          class="h-2.5 rounded-full transition-all duration-300 {currentSlide === index ? 'w-10 bg-[#00c6ff]' : 'w-2.5 bg-slate-300 hover:bg-[#1f4e79]'}"
          aria-label="Go to slide {index + 1}"
        ></button>
      {/each}
    </div>

  </div>
</main>
