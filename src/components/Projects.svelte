<script>
  import InlineIcon from './ui/InlineIcon.svelte';

  // Categories for filtering
  const categories = ['All', 'Web Apps', 'AI/ML', 'Enterprise', 'Mobile'];
  let activeCategory = 'All';

  const projects = [
    {
      title: 'NexGen ERP Modernization',
      client: 'Global Logistics Corp',
      category: 'Enterprise',
      description: 'Transitioned a legacy on-premise ERP to a cloud-native microservices architecture, improving processing speed by 40%.',
      tags: ['SvelteKit', 'Go', 'PostgreSQL', 'AWS'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      link: '#'
    },
    {
      title: 'Autonomous Support Agent',
      client: 'SaaS Startup',
      category: 'AI/ML',
      description: 'An LLM-powered support agent capable of resolving 65% of common customer queries without human intervention.',
      tags: ['Python', 'OpenAI', 'Pinecone', 'LangChain'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      link: '#'
    },
    {
      title: 'FinTrack Wealth Manager',
      client: 'Personal Project',
      category: 'Web Apps',
      description: 'A high-performance financial dashboard featuring real-time data visualization and automated portfolio rebalancing.',
      tags: ['React', 'D3.js', 'Node.js', 'Redis'],
      image: 'https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=800',
      link: '#'
    },
    {
      title: 'HealthSync Mobile',
      client: 'Wellness Tech',
      category: 'Mobile',
      description: 'Cross-platform healthcare application integrating biometric data from wearable devices for predictive health alerts.',
      tags: ['Flutter', 'Firebase', 'GraphQL'],
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      link: '#'
    }
  ];

  $: filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);
</script>

<section id="projects" class="relative bg-white pt-24 pb-32 text-slate-900 overflow-hidden">
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-slate-50 [mask-image:linear-gradient(to_bottom,white,transparent)] -z-10"></div>

  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">Case Studies</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
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
              ? 'bg-slate-950 text-white border-slate-950 shadow-lg shadow-slate-200' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}">
            {category}
          </button>
        {/each}
      </div>
    </div>

    <div class="grid gap-8 md:grid-cols-2">
      {#each filteredProjects as project (project.title)}
        <div class="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white transition-all hover:shadow-2xl hover:shadow-slate-200">
          
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img 
              src={project.image} 
              alt={project.title} 
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="absolute top-6 left-6">
              <span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-slate-900/60 backdrop-blur-md rounded-full">
                {project.category}
              </span>
            </div>
          </div>

          <div class="flex flex-1 flex-col p-8 lg:p-10">
            <div class="mb-4">
              <p class="text-xs font-bold text-blue-600 uppercase tracking-wider">{project.client}</p>
              <h3 class="mt-2 text-2xl font-bold text-slate-950 leading-tight">
                {project.title}
              </h3>
            </div>

            <p class="text-slate-600 text-sm leading-relaxed mb-8">
              {project.description}
            </p>

            <div class="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {#each project.tags as tag}
                <span class="px-2.5 py-1 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-md">
                  {tag}
                </span>
              {/each}
            </div>

            <a href={project.link} class="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-950 group/link">
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
      <div class="inline-block p-1 rounded-2xl bg-slate-50 border border-slate-200">
        <div class="px-8 py-10 rounded-xl bg-white border border-slate-100 shadow-sm max-w-2xl">
          <h3 class="text-2xl font-bold text-slate-950">Have a vision for a project?</h3>
          <p class="mt-2 text-slate-600">We are currently accepting new technical partnerships for Q3 2026.</p>
          <a href="#contact" class="mt-6 inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
            Let's Talk Technicals
          </a>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  /* Optional: Smooth fade-in animation for filtered items */
  div {
    animation: fadeIn 0.4s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>