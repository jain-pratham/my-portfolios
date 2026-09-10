<script>
  import { onMount } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import InlineIcon from './ui/InlineIcon.svelte';

  let visible = false;

  onMount(() => {
    visible = true;
  });

  const trustFactors = [
    { 
      title: 'Innovative Solutions Built to Last', 
      desc: 'We use proven technologies to create scalable, future-ready platforms that support your business growth.',
      icon: 'cpu'
    },
    { 
      title: 'Integrated Systems for Smooth Operations', 
      desc: 'We harmonize your tech stack to eliminate silos and ensure data flows seamlessly across your enterprise.',
      icon: 'layers'
    },
    { 
      title: 'Focused on User Experience', 
      desc: 'Our mobile-first approach ensures your customers enjoy fast, reliable access across all devices.',
      icon: 'smartphone'
    },
    { 
      title: 'Industry Expertise You Can Rely On', 
      desc: "We've successfully delivered projects across multiple sectors, understanding the unique challenges you face.",
      icon: 'briefcase'
    },
    { 
      title: 'Clear Communication and Transparency', 
      desc: 'Our agile process keeps you informed with honest timelines and pricing—no surprises, just results.',
      icon: 'message-square'
    },
    { 
      title: 'Security at the Core', 
      desc: 'We prioritize data protection and compliance with enterprise-grade security measures.',
      icon: 'shield'
    }
  ];

  const growthStages = [
    { name: 'Startups', icon: 'rocket' },
    { name: 'Small Businesses', icon: 'bar-chart-3' },
    { name: 'Mid Size Organization', icon: 'building-2' },
    { name: 'Large Enterprises', icon: 'factory' }
  ];

  const coreValues = [
    { title: 'Trust', desc: 'We prioritize building strong relationships based on trust.', icon: 'shield-check' },
    { title: 'Innovation', desc: 'Pushing boundaries and developing cutting-edge solutions.', icon: 'lightbulb' },
    { title: 'Integrity', desc: 'Honesty and transparency in every interaction.', icon: 'scale' },
    { title: 'Teamwork', desc: 'Combining expertise to achieve shared goals.', icon: 'users-2' },
    { title: 'Adaptability', desc: 'Agile and responsive to the changing tech landscape.', icon: 'refresh-ccw' },
    { title: 'Knowledge', desc: 'Dedicated to continuous learning and advancement.', icon: 'book-open-check' }
  ];

  const partners = [
    { name: 'Dell', logo: '/logos/partner-1.png' },
    { name: 'Kotak', logo: '/logos/partner-2.png' },
    { name: 'Xebia', logo: '/logos/partner-3.png' },
    { name: 'Digital', logo: '/logos/partner-4.png' }
  ];
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
</svelte:head>

<main id="top" class="min-h-screen bg-[#f8fafc] font-['Inter'] text-slate-900 selection:bg-[#00c6ff]/20 selection:text-[#1f4e79] overflow-hidden">
  
  {#if visible}
    <section class="relative flex min-h-[85vh] items-center overflow-hidden bg-[#f8fafc] px-6 py-24 z-10 border-b border-slate-200">
      
      <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px); background-size: 32px 32px;"></div>
      
      <div class="absolute top-0 right-0 h-[800px] w-[800px] translate-x-1/4 -translate-y-1/4 rounded-full bg-sky-100 opacity-70 blur-[120px] z-0 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/4 rounded-full bg-[#e0f2fe] opacity-60 blur-[100px] z-0 pointer-events-none"></div>

      <div class="container relative z-10 mx-auto max-w-[1400px] px-4 md:px-12">
        <div in:fly={{ y: 50, duration: 1000 }} class="max-w-4xl">
          
          <div class="mb-8 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2 shadow-sm inline-flex">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00c6ff] opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-[#00c6ff]"></span>
            </span>
            <span class="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f4e79]">
              Elite Digital Agency
            </span>
          </div>

          <h1 class="text-[40px] font-black leading-[1.1] tracking-tight text-[#0f172a] md:text-[64px] lg:text-[72px] mb-6">
            Transform Together, <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#1f4e79] to-[#00c6ff]">Thrive Forever</span>
          </h1>
          
          <p class="mt-8 max-w-2xl text-[18px] font-medium leading-relaxed text-slate-600 mb-10">
            Your journey to success starts here. We believe in growing alongside our customers, fostering innovation,
            and enabling businesses to stay ahead through smart technology adoption.
          </p>
          
          <div class="mt-10 flex flex-wrap items-center gap-8">
            <button class="inline-flex items-center justify-center rounded-xl bg-[#1f4e79] px-8 py-4 text-[14px] font-extrabold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#00c6ff] hover:text-[#0f172a] hover:shadow-[0_15px_30px_-5px_rgba(0,198,255,0.3)]">
              Let's Talk <InlineIcon name="chevron-right" size={18} class="ml-2" />
            </button>
            
            <div class="flex items-center gap-6 border-l border-slate-300 pl-8">
              <div class="font-['JetBrains_Mono']">
                <p class="text-3xl font-black text-[#1f4e79]">145<span class="text-[#00c6ff]">+</span></p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Global Clients</p>
              </div>
              <div class="h-10 w-px bg-slate-200"></div>
              <div class="font-['JetBrains_Mono']">
                <p class="text-3xl font-black text-[#1f4e79]">5.0</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Client Rating</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="relative bg-white px-6 py-32 overflow-hidden z-10">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-[#f8fafc] -skew-x-12 translate-x-20 z-0"></div>

      <div class="container relative z-10 mx-auto max-w-[1400px] px-4 md:px-12">
        <div class="text-center mb-20 max-w-3xl mx-auto">
          <h3 class="text-xs font-bold uppercase tracking-[0.25em] text-[#00c6ff] mb-4 font-['JetBrains_Mono']">Why Choose Us</h3>
          <h2 class="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight tracking-tight">
            Why CORE4IX Is Your Trusted <br/> Technology Partner
          </h2>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {#each trustFactors as factor, i}
            <div 
              class="group relative flex flex-col rounded-[2rem] bg-white p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(31,78,121,0.15)] overflow-hidden"
              in:fade={{ delay: i * 100, duration: 500 }}
            >
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-100 to-slate-200 group-hover:from-[#1f4e79] group-hover:to-[#00c6ff] transition-all duration-500"></div>
              
              <div class="mb-8 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f8fafc] text-[#1f4e79] border border-slate-100 transition-colors duration-300 group-hover:bg-[#00c6ff] group-hover:text-white group-hover:border-transparent">
                 <InlineIcon name={factor.icon} size={24} />
              </div>

              <h3 class="mb-4 text-xl font-extrabold leading-tight text-[#0f172a]">{factor.title}</h3>
              <p class="text-[15px] font-medium leading-relaxed text-slate-500">{factor.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="relative px-6 py-32 bg-[#f8fafc] overflow-hidden">
  
  <div class="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#00c6ff]/5 rounded-full blur-[100px] pointer-events-none"></div>
  <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#1f4e79]/5 rounded-full blur-[120px] pointer-events-none"></div>

  <div class="container relative z-10 max-w-7xl mx-auto">
    
    <div class="text-center max-w-3xl mx-auto mb-20">
      <div class="inline-block px-4 py-1.5 mb-6 rounded-full bg-white border border-slate-200 shadow-sm">
        <span class="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-[0.3em] text-[#00c6ff]">
          Scale Architecture
        </span>
      </div>
      <h2 class="text-5xl md:text-7xl font-black text-[#1f4e79] leading-tight tracking-tighter mb-8">
        Built to <span class="text-slate-400 italic">Outlast</span> <br/> 
        The Competition.
      </h2>
      <p class="text-xl text-slate-500 font-medium leading-relaxed">
        We don't just build for today. At <span class="text-[#00c6ff] font-bold">CORE4IX</span>, we engineer systems that adapt, scale, and evolve as your business dominates the market.
      </p>
    </div>

    <div class="grid md:grid-cols-12 gap-6">
      
      <div class="md:col-span-8 relative group overflow-hidden rounded-[2.5rem] bg-[#1f4e79] p-10 md:p-14 text-white shadow-2xl transition-transform duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg class="w-40 h-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          </svg>
        </div>
        
        <h3 class="text-3xl font-black mb-6">Future-Proof Infrastructure</h3>
        <p class="text-white/70 text-lg max-w-md leading-relaxed mb-8">
          Our backend architectures are built using microservices and event-driven patterns, ensuring 99.9% uptime even during massive traffic surges.
        </p>
        
        <div class="flex gap-4 font-['JetBrains_Mono'] text-[12px] font-bold">
          <span class="px-3 py-1 bg-white/10 rounded-md border border-white/10">KUBERNETES</span>
          <span class="px-3 py-1 bg-white/10 rounded-md border border-white/10">AWS/AZURE</span>
          <span class="px-3 py-1 bg-white/10 rounded-md border border-white/10">NODE.JS</span>
        </div>
      </div>

      <div class="md:col-span-4 rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-[#00c6ff]/30 transition-all">
        <div>
          <div class="w-12 h-12 bg-[#00c6ff]/10 rounded-2xl flex items-center justify-center text-[#00c6ff] mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-2xl font-black text-[#1f4e79] mb-4">Ultra-Low Latency</h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            Every millisecond costs money. We optimize for Core Web Vitals to keep your users engaged.
          </p>
        </div>
        <div class="mt-8 pt-6 border-t border-slate-50">
           <span class="text-[11px] font-black text-[#00c6ff] tracking-[0.2em] uppercase font-['JetBrains_Mono']">Performance First</span>
        </div>
      </div>

      <div class="md:col-span-12 rounded-[2.5rem] bg-gradient-to-r from-[#f1f5f9] to-white border border-slate-100 p-10 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div class="max-w-xl">
          <h3 class="text-2xl font-black text-[#1f4e79] mb-3">Supporting Every Stage</h3>
          <p class="text-slate-500">From early-stage MVPs to complex enterprise modernization—we bridge the gap between vision and reality.</p>
        </div>
        <div class="flex -space-x-4">
          <div class="w-16 h-16 rounded-full bg-[#1f4e79] border-4 border-white flex items-center justify-center text-white font-bold text-xs">MVP</div>
          <div class="w-16 h-16 rounded-full bg-[#00c6ff] border-4 border-white flex items-center justify-center text-white font-bold text-xs">SCALE</div>
          <div class="w-16 h-16 rounded-full bg-slate-800 border-4 border-white flex items-center justify-center text-white font-bold text-xs">CORP</div>
        </div>
      </div>

    </div>
  </div>
</section>

    <section class="bg-white px-6 py-32 relative overflow-hidden">
      <div class="container mx-auto max-w-[1400px] px-4 md:px-12">
        <div class="grid items-center gap-16 lg:grid-cols-2">
          
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-tr from-[#1f4e79] to-[#00c6ff] rounded-[2.5rem] translate-x-4 translate-y-4 opacity-20"></div>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" alt="Tech Dashboard" class="relative rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(31,78,121,0.2)] object-cover h-[600px] w-full border border-slate-100" />
            
            <div class="absolute -left-8 top-12 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center gap-4 hidden md:flex">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2fe] text-[#00c6ff]">
                <InlineIcon name="trending-up" size={24} />
              </div>
              <div>
                <p class="font-['JetBrains_Mono'] text-2xl font-black text-[#1f4e79]">100%</p>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Success</p>
              </div>
            </div>
          </div>

          <div class="lg:pl-10">
            <h3 class="text-xs font-bold uppercase tracking-[0.25em] text-[#00c6ff] mb-4 font-['JetBrains_Mono']">Who We Are</h3>
            <h2 class="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight tracking-tight">Our Organization</h2>
            <p class="mt-6 text-[18px] font-medium leading-relaxed text-slate-600">
              Seamless. Smart. Scalable. We focus on turning tech hurdles into strategic advantages, architecting robust systems that empower your team.
            </p>
            
            <div class="mt-12 grid gap-6">
              <div class="group rounded-[1.5rem] bg-[#f8fafc] p-8 border border-slate-100 transition-all duration-300 hover:shadow-lg hover:border-[#1f4e79]/30 relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-2 bg-[#1f4e79]"></div>
                <h4 class="font-['JetBrains_Mono'] text-lg font-bold text-[#1f4e79]">Our Mission</h4>
                <p class="mt-3 text-[15px] font-medium text-slate-500 leading-relaxed">Equipping businesses with AI and tech expertise for sustainable progress and market dominance.</p>
              </div>
              
              <div class="group rounded-[1.5rem] bg-[#f8fafc] p-8 border border-slate-100 transition-all duration-300 hover:shadow-lg hover:border-[#00c6ff]/30 relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-2 bg-[#00c6ff]"></div>
                <h4 class="font-['JetBrains_Mono'] text-lg font-bold text-[#00c6ff]">Our Vision</h4>
                <p class="mt-3 text-[15px] font-medium text-slate-500 leading-relaxed">Driving scalable growth through advanced, impactful AI solutions and production-grade engineering.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="relative bg-[#f8fafc] px-6 py-32 border-t border-slate-200">
       <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px); background-size: 32px 32px;"></div>

      <div class="container relative z-10 mx-auto max-w-[1400px] px-4 md:px-12">
        <div class="text-center mb-20">
          <h3 class="text-xs font-bold uppercase tracking-[0.25em] text-[#00c6ff] mb-4 font-['JetBrains_Mono']">Our DNA</h3>
          <h2 class="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight tracking-tight">Our Core Values</h2>
        </div>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {#each coreValues as value}
            <div class="group rounded-[2rem] border border-slate-200 bg-white p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(31,78,121,0.1)]">
              <div class="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8fafc] text-[#1f4e79] border border-slate-100 transition-colors duration-300 group-hover:bg-[#1f4e79] group-hover:text-white">
                <InlineIcon name={value.icon} size={28} />
              </div>
              <h4 class="font-['JetBrains_Mono'] text-xl font-bold text-[#0f172a] mb-3">{value.title}</h4>
              <p class="text-[15px] font-medium text-slate-500 leading-relaxed">{value.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </section> 

    <section class="bg-white px-6 py-16 border-t border-slate-200">
      <div class="container mx-auto max-w-[1400px] px-4 md:px-12 text-center">
        <h2 class="mb-10 font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
          Reliable Solutions, Trusted Partnerships
        </h2>
        <div class="flex flex-wrap justify-center items-center gap-12 md:gap-24">
  {#each partners as partner}
    <div class="flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
      <img 
        src={partner.logo} 
        alt={partner.name} 
        class="max-h-16 md:max-h-20 object-contain"
      />
    </div>
  {/each}
</div>
      </div>
    </section>
  {/if}
</main>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
