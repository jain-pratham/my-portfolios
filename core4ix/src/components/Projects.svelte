<script>
  import InlineIcon from './ui/InlineIcon.svelte';

  // Categories for filtering
  const categories = ['All', 'Education', 'AI/ML', 'E-commerce'];
  let activeCategory = 'All';

  const projects = [
    {
  title: 'Academic Consultancy Platform for PhD Thesis & Research Guidance',
  client: 'Dr. Poonam Khamar Shah Consultancy',
  category: 'Education',
  description:
    'Developed a SEO-optimized academic consultancy website using Next.js, focused on PhD thesis guidance, research support, and dissertation services. The platform features structured service pages, blog-based content strategy, and lead generation through consultation forms.',
  tags: ['Next.js', 'SEO Optimization', 'Content Architecture', 'Responsive UI'],
  image: '/project/poonam.png',
  link: 'https://thesiswithdrpoonam.in/'
},
   {
  id: 5,
  title: 'Visa & Immigration Consultancy Platform with Service-Based User Flow',
  client: 'LakshPath Global',
  category: 'Consultancy / Immigration',
  description:
    'Developed a professional visa consultancy website enabling users to explore work permits, student visas, and immigration services. The platform features structured service pages, clear user navigation, and consultation-driven lead generation for global opportunities.',
  tags: ['Astro', 'Svelte', 'Node.js', 'Astra DB', 'Responsive UI'],
  image: '/project/lakshpathglobal.png',
  link: 'https://www.lakshpathglobal.com/'
},
    {
  title: 'Fashion Jewelry E-commerce Platform with Modern UI & Secure Checkout',
  client: 'Selura Official',
  category: 'E-commerce',
  description:
    'Developed a modern e-commerce platform for a fashion jewelry brand, enabling users to explore curated collections of bracelets and accessories with a seamless shopping experience. Integrated secure payment gateway, responsive UI, and optimized performance for fast browsing and conversions.',
  tags: ['Astro', 'Svelte', 'Node.js', 'Express', 'Payment Gateway', 'Astra DB'],
  image: '/project/seluraofficial.png',
  link: 'https://seluraofficial.in/'
},
   {
  title: 'Business Website for Trading & Supply Services with Modern UI',
  client: 'Pragati Trading',
  category: 'E-commerce',
  description:
    'Developed a professional business website for a trading company, showcasing products, services, and company information. The platform focuses on clear presentation, responsive design, and easy navigation to help users understand offerings and connect for business inquiries.',
  tags: ['Astro', 'Svelte', 'Responsive UI', 'Landing Page'],
  image: '/project/pragatitrading.png',
  link: 'https://pragatitrading.netlify.app/'
},
{
  title: 'Construction & Infrastructure Company Website with Service Showcase',
  client: 'CoreBuild Constructions',
  category: 'E-commerce',
  description:
    'Developed a professional website for a construction company to showcase infrastructure projects, services, and company expertise. The platform highlights completed work, service offerings, and enables easy client inquiries through a clean and responsive interface.',
  tags: ['Astro', 'Svelte', 'Responsive UI', 'Service Website'],
  image: '/project/elite.png',
  link: '#'
}
  ];

  $: filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);
</script>

<section id="projects" class="relative bg-[#f8fafc] pt-24 pb-32 text-slate-900 overflow-hidden">
  <div class="absolute right-0 top-0 w-[500px] h-[500px] bg-[#00c6ff] opacity-[0.03] rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2 -z-10"></div>

  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-4">
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8ba2b5]">Case Studies</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-black tracking-tight text-[#1f4e79]">
          Selected Engineering Works
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          A collection of high-impact systems designed for performance, scalability, and user experience.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        {#each categories as category}
          <button 
            on:click={() => activeCategory = category}
            class="px-5 py-2 text-sm font-bold rounded-full transition-all border
            {activeCategory === category 
              ? 'bg-[#1f4e79] text-white border-[#1f4e79] shadow-lg shadow-blue-900/10' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-[#00c6ff] hover:text-[#00c6ff]'}">
            {category}
          </button>
        {/each}
      </div>
    </div>

    <div class="grid gap-8 md:grid-cols-2">
      {#each filteredProjects as project (project.title)}
        <div class="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
  
  <!-- IMAGE SECTION -->
  <div class="relative aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-hidden">
    
    <!-- Glow background -->
    <div class="absolute inset-0 bg-[#00c6ff]/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-[80px]"></div>

    <!-- Image Card -->
    <div class="relative z-10 bg-white rounded-2xl shadow-lg p-4 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
      <img 
        src={project.image} 
        alt={project.title} 
        class="max-h-[220px] w-auto object-contain"
      />
    </div>

    <!-- Category Badge -->
    <div class="absolute top-6 left-6 z-20">
      <span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-[#1f4e79] rounded-full shadow-md">
        {project.category}
      </span>
    </div>

  </div>

  <!-- CONTENT -->
  <div class="flex flex-1 flex-col p-8 lg:p-10">
    
    <div class="mb-4">
      <p class="text-xs font-bold text-[#00c6ff] uppercase tracking-wider">
        {project.client}
      </p>

      <h3 class="mt-2 text-2xl font-black text-[#1f4e79] leading-tight">
        {project.title}
      </h3>
    </div>

    <p class="text-slate-600 text-sm leading-relaxed mb-8 font-medium">
      {project.description}
    </p>

    <!-- TAGS -->
    <div class=" border-t border-slate-100 ">
     
    </div>

    <!-- LINK -->
    <a 
      href={project.link} 
      class="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#1f4e79] hover:text-[#00c6ff] transition-colors group/link"
    >
      View Project Details
      <span class="transition-transform group-hover/link:translate-x-1">
        <InlineIcon name="arrow-right" size={16} />
      </span>
    </a>

  </div>
</div>
      {/each}
    </div>

    <div class="mt-24 text-center">
      <div class="inline-block p-1 rounded-2xl bg-slate-100/50 border border-slate-200">
        <div class="px-8 py-10 rounded-xl bg-white border border-slate-100 shadow-sm max-w-2xl">
          <h3 class="text-2xl font-black text-[#1f4e79]">Have a vision for a project?</h3>
          <p class="mt-2 text-slate-600 italic">We are currently accepting new technical partnerships for Q3 2026.</p>
          <a href="/contactus" class="mt-6 inline-flex items-center px-8 py-3 bg-[#00c6ff] text-white font-bold rounded-lg hover:bg-[#1f4e79] transition-all shadow-sm">
            Let's Talk Technicals
          </a>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  div {
    animation: fadeIn 0.4s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>