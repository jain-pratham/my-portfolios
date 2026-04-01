<script>
  const steps = [
    {
      no: '01',
      title: 'Discovery & Consultation',
      desc: 'Collaborative consultation to align business goals, user needs, and technical feasibility before execution.',
      points: ['Define problems and objectives', 'Research users and market'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=700'
    },
    {
      no: '02',
      title: 'Planning and Strategy',
      desc: 'We set the roadmap, select the stack, and split scope into clear sprint milestones.',
      points: ['Shape user stories and features', 'Plan releases and resources'],
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=700'
    },
    {
      no: '03',
      title: 'Design & Development',
      desc: 'Agile sprints combine UI/UX design and scalable engineering with frequent reviews and refinements.',
      points: ['Build wireframes and prototypes', 'Develop with stakeholder feedback'],
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=700'
    },
    {
      no: '04',
      title: 'Quality Assurance',
      desc: 'Before launch we validate quality, performance, and security, then optimize with post-launch feedback.',
      points: ['Run functional and security tests', 'Monitor, fix, and improve'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=700'
    }
  ];
</script>

<section id="process" class="bg-[#f3f4f6] py-24">
  <div class="container mx-auto px-4 md:px-6">
    <div class="mb-16">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#0b7ea5] md:text-sm">✶ Workflow Insights ✶</p>
      <h2 class="mt-4 text-4xl font-black leading-tight text-[#0b0f14] md:text-6xl">
        From Concept to Code: Our Workflow
      </h2>
    </div>

    <div class="relative hidden lg:block">
      <div class="absolute left-0 right-0 top-[102px] h-px bg-slate-300"></div>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {#each steps as step}
        <article class="flex h-full flex-col">
          <div class="relative mb-7 flex justify-center">
            <img
              src={step.image}
              alt={step.title}
              class="h-44 w-44 rounded-full border-4 border-white object-cover shadow-lg"
              loading="lazy"
            />
            <div class="absolute -bottom-5 hidden h-5 w-px bg-slate-300 lg:block"></div>
            <div class="absolute -bottom-7 hidden h-3 w-3 rounded-full bg-[#0b0f14] lg:block"></div>
          </div>

          <div class="flex-1 rounded-md bg-[#d9e6eb] px-5 pb-6 pt-7 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7ea5]">Step {step.no}</p>
            <h3 class="mt-2 text-[1.95rem] font-extrabold leading-tight text-[#0b0f14] md:text-[2.05rem]">{step.title}</h3>
            <p class="mt-3 text-base leading-relaxed text-slate-700">{step.desc}</p>

            <ul class="mt-4 space-y-2.5 text-base text-slate-800">
              {#each step.points as point}
                <li class="flex items-start gap-2 leading-relaxed">
                  <span class="mt-2 block h-1.5 w-1.5 rounded-full bg-[#0b0f14]"></span>
                  <span>{point}</span>
                </li>
              {/each}
            </ul>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
