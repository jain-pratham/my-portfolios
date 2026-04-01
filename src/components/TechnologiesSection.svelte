<script>
  const techTabs = ['Frontend', 'Backend', 'Platforms', 'Database', 'UI/UX'];

  const techByTab = {
    Frontend: [
      { name: 'React', type: 'react' },
      { name: 'Next.js', type: 'next' },
      { name: 'Vue.js', type: 'vue' },
      { name: 'Svelte', type: 'svelte' },
      { name: 'Tailwind', type: 'tailwind' }
    ],
    Backend: [
      { name: 'Node.js', type: 'node' },
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
      { name: 'PostgreSQL', type: 'postgres' },
      { name: 'MongoDB', type: 'mongo' },
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
      <h3 class="text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">Technologies and Platforms We Work With</h3>

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

      <div class="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {#each activeTechs as tech}
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center text-[#1f4e79] transition-colors duration-300 hover:text-[#00a8d6]">
              {#if tech.type === 'node'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.8l8 4.6v9.2L12 21.2 4 16.6V7.4L12 2.8z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 10v4m6-4v4m-3-5v7" />
                </svg>
              {:else if tech.type === 'python'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 4h5a3 3 0 013 3v2H8a2 2 0 00-2 2v2H4V9a5 5 0 014-5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 20h-5a3 3 0 01-3-3v-2h8a2 2 0 002-2v-2h2v4a5 5 0 01-4 5z" />
                </svg>
              {:else if tech.type === 'laravel'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 7l6-3 6 3-6 3-6-3zM4 7v7l6 3m6-10v7l6 3m-12 0l6-3m-6 3v-7" />
                </svg>
              {:else if tech.type === 'php'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 9h3a2 2 0 010 4H7V9zm5 0h2.5a2 2 0 010 4H12V9z" />
                </svg>
              {:else if tech.type === 'java'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 18h8M9 14h6m-5-3c0-2 4-2 4-4" />
                </svg>
              {:else if tech.type === 'react'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="1.5" />
                  <ellipse cx="12" cy="12" rx="9" ry="4.4" />
                  <ellipse cx="12" cy="12" rx="9" ry="4.4" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="12" rx="9" ry="4.4" transform="rotate(120 12 12)" />
                </svg>
              {:else if tech.type === 'next'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 15V9l8 6V9" />
                </svg>
              {:else if tech.type === 'vue'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6l8 12L20 6M8 6l4 6 4-6" />
                </svg>
              {:else if tech.type === 'svelte'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 6c0-2-6-2-6 1s6 1 6 4-6 2-6 5 6 3 6 1" />
                </svg>
              {:else if tech.type === 'tailwind'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 10c2-4 6-4 8 0s6 4 8 0M4 16c2-4 6-4 8 0s6 4 8 0" />
                </svg>
              {:else if tech.type === 'aws' || tech.type === 'azure' || tech.type === 'docker' || tech.type === 'vercel' || tech.type === 'netlify' || tech.type === 'cloud'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 18h10a4 4 0 000-8 5 5 0 00-9.7-1.6A4 4 0 007 18z" />
                </svg>
              {:else if tech.type === 'mysql' || tech.type === 'postgres' || tech.type === 'mongo' || tech.type === 'redis' || tech.type === 'firebase' || tech.type === 'database'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <ellipse cx="12" cy="6" rx="7" ry="3" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l8-12 8 12M7 16v4m10-4v4M10 12h4" />
                </svg>
              {/if}
            </div>
            <p class="mt-2 text-xl font-bold tracking-tight text-[#0f172a]">{tech.name}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
