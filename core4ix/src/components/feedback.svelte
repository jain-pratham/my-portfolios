<script>
  const testimonials = [
    {
      id: 1,
      name: 'Jeff Schreibman',
      role: 'CEO of Merch Free Poker',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote:
        'CORE4IX delivered a platform that improved our operational efficiency and reduced admin overhead. Their engineering depth helped us run multiple campaigns simultaneously without quality drops.'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Founder, Innovate Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote:
        'Working with CORE4IX was a game-changer. Their AI solution was accurate, fast, and production-ready. We also loved their security-first architecture and clean delivery process.'
    },
    {
      id: 3,
      name: 'David Rodriguez',
      role: 'CTO, NextGen ERP',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      quote:
        'Our ERP migration felt risky until CORE4IX stepped in. They broke complex requirements into clear phases and delivered reliably. Performance and team communication were excellent.'
    }
  ];

  let activeTabId = testimonials[0].id;
  $: activeTestimonial = testimonials.find((t) => t.id === activeTabId);
  $: activeIndex = testimonials.findIndex((t) => t.id === activeTabId);

  function goPrev() {
    const nextIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    activeTabId = testimonials[nextIndex].id;
  }

  function goNext() {
    const nextIndex = (activeIndex + 1) % testimonials.length;
    activeTabId = testimonials[nextIndex].id;
  }
</script>

<section id="testimonials" class="relative overflow-hidden border-t border-slate-100 bg-white py-16 md:py-20">
  <div class="absolute inset-0 -z-10 bg-blue-50/20 blur-[150px] opacity-60"></div>

  <div class="container mx-auto px-6">
    <div class="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end">
      <div class="max-w-xl">
        <span class="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-[#00c6ff]">* Echoes of Success *</span>
        <h2 class="text-4xl font-black leading-[0.95] tracking-tighter text-[#1f4e79] md:text-5xl">Testimonials</h2>
      </div>

      <div class="flex gap-2">
        <button type="button" on:click={goPrev} aria-label="Previous testimonial" class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-[#1f4e79] hover:text-[#1f4e79]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <button type="button" on:click={goNext} aria-label="Next testimonial" class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-[#1f4e79] hover:text-[#1f4e79]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_1fr] lg:gap-10">
      <div class="space-y-4">
        {#each testimonials as item}
          <button
            type="button"
            on:click={() => (activeTabId = item.id)}
            class="group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 {activeTabId === item.id ? 'border-[#1f4e79]/10 bg-white shadow-xl shadow-blue-900/5' : 'border-slate-100 bg-white hover:border-[#1f4e79]/20 hover:shadow-lg'}"
          >
            <div class="relative h-14 w-14 overflow-hidden rounded-full border-2 {activeTabId === item.id ? 'border-[#00c6ff]' : 'border-slate-100'}">
              <img src={item.avatar} alt={item.name} class="h-full w-full object-cover grayscale opacity-70 transition-all group-hover:grayscale-0 group-hover:opacity-100" />
            </div>

            <div class="flex-1">
              <h4 class="text-sm font-black tracking-tight text-[#1f4e79]">{item.name}</h4>
              <p class="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">{item.role}</p>
            </div>
          </button>
        {/each}
      </div>

      {#key activeTabId}
        <div class="lg:pl-4">
          <div class="group relative rounded-[32px] border border-slate-100 bg-slate-50 p-7 shadow-inner md:p-8">
            <div class="absolute left-8 top-2 text-5xl font-serif text-[#1f4e79] opacity-10">"</div>

            <p class="relative z-10 text-lg font-medium italic leading-[1.45] text-slate-700 md:text-[1.35rem]">
              "{activeTestimonial.quote}"
            </p>

            <div class="absolute bottom-5 right-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              CORE<span class="text-[#00c6ff]">4</span>IX Impact
              <div class="h-1.5 w-1.5 rounded-full bg-[#00c6ff] animate-pulse"></div>
            </div>
          </div>
        </div>
      {/key}
    </div>

    <div class="mt-12 flex flex-col items-center text-center">
      <div class="h-[1px] w-20 bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
      <p class="mx-auto mt-5 max-w-lg text-xs text-slate-400">
        Our clients trust us because we consistently deliver on time, on budget, and with uncompromising quality.
      </p>
      <a href="#contact" class="mt-5 border-b border-gray-300 text-xs font-bold text-[#1f4e79] transition-all hover:text-[#00c6ff]">Work with us -></a>
    </div>
  </div>
</section>

<style>
  p.italic {
    display: inline-block;
    opacity: 0;
    transform: translateY(12px);
    animation: reveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes reveal {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>


