<script>
  const techTabs = ['Frontend', 'Backend', 'Platforms', 'Database', 'UI/UX'];

  const techByTab = {
    Frontend: [
      { name: 'React', type: 'react' },
      { name: 'Next.js', type: 'nextjs' },
      { name: 'Vue.js', type: 'vue' },
      { name: 'Svelte', type: 'svelte' },
      { name: 'Tailwind', type: 'tailwind' }
    ],
    Backend: [
      { name: 'Node.js', type: 'nodejs' },
      { name: 'Python', type: 'python' },
      { name: 'Laravel', type: 'laravel' },
      { name: 'PHP', type: 'php' },
      { name: 'Java', type: 'java' }
    ],
    Platforms: [
      { name: 'AWS', type: 'aws' },
      { name: 'Azure', type: 'azure' },
      { name: 'Docker', type: 'docker' },
      { name: 'Vercel', type: 'vercel' },
      { name: 'Netlify', type: 'netlify' }
    ],
    Database: [
      { name: 'MySQL', type: 'mysql' },
      { name: 'PostgreSQL', type: 'postgresql' },
      { name: 'MongoDB', type: 'mongodb' },
      { name: 'Redis', type: 'redis' },
      { name: 'Firebase', type: 'firebase' }
    ],
    'UI/UX': [
      { name: 'Figma', type: 'figma' },
      { name: 'Adobe XD', type: 'xd' },
      { name: 'Framer', type: 'framer' },
      { name: 'Canva', type: 'canva' },
      { name: 'Illustrator', type: 'illustrator' }
    ]
  };

  let activeTab = 'Backend';
  $: activeTechs = techByTab[activeTab];
</script>

<section id="technologies" class="scroll-mt-28 bg-[#f5f5f5] py-10 md:py-12">
  <div class="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
    <div class="px-2 sm:px-4">
      <h3 class="text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
        Technologies and Platforms We Work With
      </h3>

      <!-- Tabs -->
      <div class="mt-8 grid grid-cols-2 border-b border-slate-300/80 sm:grid-cols-5">
        {#each techTabs as tab}
          <button
            type="button"
            on:click={() => (activeTab = tab)}
            aria-pressed={activeTab === tab}
            class="pb-4 text-center text-[13px] font-black uppercase tracking-[0.05em] transition-colors sm:text-base {activeTab === tab ? 'border-b-[3px] border-[#1f4e79] text-[#0f172a]' : 'text-slate-500 hover:text-slate-700'}"
          >
            {tab}
          </button>
        {/each}
      </div>

      <!-- Tech Grid -->
      <div class="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
  {#each activeTechs.filter(tech => tech.type !== 'canva') as tech}
    <div class="text-center">
      
      <!-- PROFESSIONAL ICON -->
      <div class="mx-auto flex h-12 w-12 items-center justify-center transition-transform duration-300 hover:scale-110">
  
  {#if tech.type === 'canva'}
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg" 
      alt="Canva" 
      class="h-10 w-10"
    />

  {:else if tech.type === 'framer'}
    <img 
      src="https://cdn.simpleicons.org/framer/0055FF" 
      alt="Framer" 
      class="h-10 w-10"
    />

  {:else}
    <img 
      src={`https://skillicons.dev/icons?i=${tech.type}`} 
      alt={tech.name} 
      class="h-10 w-10 drop-shadow-md hover:drop-shadow-[0_0_10px_rgba(0,168,214,0.5)]"
    />
  
  {/if}

</div>

      <!-- NAME -->
      <p class="mt-2 text-xl font-bold tracking-tight text-[#0f172a]">
        {tech.name}
      </p>

    </div>
  {/each}
</div>
  </div>
  </div>
</section>