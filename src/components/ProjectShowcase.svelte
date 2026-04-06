<script>
  import { onDestroy, onMount } from 'svelte';

  const projects = [
    {
      id: 1,
      title: 'Academic Consultancy Platform for PhD Thesis & Research Guidance',
      summary:
        'A professional academic consultancy website designed to provide PhD thesis guidance, research support, and dissertation services. The platform enables students to explore services, access academic resources, and request personalized consultation with ease.',
      image: '/project/poonam.png',
      imageAlt: 'Academic consultancy website interface for PhD thesis and research guidance'
    },
    {
  id: 2,
  title: 'Visa & Immigration Consultancy Website for Global Work and Study Services',
  summary:
    'A professional visa consultancy platform designed to help users explore work permits, student visas, and immigration services. The website enables users to understand visa options, book consultations, and start their application process easily.',
  image: '/project/lakshpathglobal.png',
  imageAlt: 'Visa consultancy website interface showing immigration and work permit services'
},
    {
  id: 3,
  title: 'Fashion Jewelry E-commerce Website for Modern Accessories Brand',
  summary:
    'A stylish e-commerce platform built for a jewelry brand, showcasing bracelets, necklaces, and fashion accessories. The website enables users to explore collections, view product details, and easily browse modern jewelry trends.',
  image: '/project/seluraofficial.png',
  imageAlt: 'Jewelry e-commerce website interface displaying bracelets and accessories collections'
},

  ];

  let activeIndex = 0;
  let intervalId;

  function goToSlide(index) {
    activeIndex = index;
  }

  function goToNext() {
    activeIndex = (activeIndex + 1) % projects.length;
  }

  function startAutoSlide() {
    clearInterval(intervalId);
    intervalId = setInterval(goToNext, 3500);
  }

  onMount(() => {
    startAutoSlide();
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<section id="projects" class="relative overflow-hidden bg-black py-16 sm:py-20">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(0,198,255,0.18),transparent_38%),radial-gradient(circle_at_10%_90%,rgba(31,78,121,0.2),transparent_40%)]"></div>

  <div class="container relative mx-auto grid grid-cols-1 gap-8 px-6 lg:grid-cols-[360px_1fr_auto] lg:items-center lg:gap-10">
    <div class="text-white">
  <h2 class="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
    <span class="text-[#ff3c3c]">06+</span> Projects Delivered <br />
    <span class="text-[#ff3c3c]">Building Modern Digital Solutions</span>
  </h2>
  <p class="mt-6 text-base leading-relaxed text-slate-300">
    We design and develop scalable web platforms, AI integrations, and high-performance applications for startups and growing businesses.
  </p>
</div>

    <div
      class="space-y-6"
      role="region"
      aria-label="Project showcase carousel"
      on:mouseenter={() => clearInterval(intervalId)}
      on:mouseleave={startAutoSlide}
    >
      <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/95 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-4">
        <div class="relative h-[220px] overflow-hidden rounded-xl sm:h-[320px]">
          {#each projects as project, index}
            <img
              src={project.image}
              alt={project.imageAlt}
              class="absolute inset-0 h-full w-full object-cover transition-all duration-700 {index === activeIndex ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          {/each}
        </div>
      </div>

      <div>
        <h3 class="text-2xl font-black leading-tight text-white sm:text-4xl">{projects[activeIndex].title}</h3>
        <p class="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">{projects[activeIndex].summary}</p>
      </div>
    </div>

    <div class="hidden flex-col gap-3 lg:flex">
      {#each projects as project, index}
        <button
          type="button"
          on:click={() => goToSlide(index)}
          class="h-3 w-3 rounded-full transition-all duration-300 {index === activeIndex ? 'h-8 bg-[#ff3c3c]' : 'bg-white/80 hover:bg-white'}"
          aria-label={`Show ${project.title}`}
        ></button>
      {/each}
    </div>
  </div>
</section>
