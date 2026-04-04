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
      desc: 'We use proven technologies to create scalable, future-ready platforms that support your business growth.' 
    },
    { 
      title: 'Integrated Systems for Smooth Operations', 
      desc: 'We harmonize your tech stack to eliminate silos and ensure data flows seamlessly across your enterprise.' 
    },
    { 
      title: 'Focused on User Experience', 
      desc: 'Our mobile-first approach ensures your customers enjoy fast, reliable access across all devices.' 
    },
    { 
      title: 'Industry Expertise You Can Rely On', 
      desc: "We've successfully delivered projects across multiple sectors, understanding the unique challenges you face." 
    },
    { 
      title: 'Clear Communication and Transparency', 
      desc: 'Our agile process keeps you informed with honest timelines and pricing—no surprises, just results.' 
    },
    { 
      title: 'Security at the Core', 
      desc: 'We prioritize data protection and compliance with enterprise-grade security measures.' 
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
    { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' },
    { name: 'Kotak', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Kotak_Mahindra_Bank_logo.svg' },
    { name: 'Xebia', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Xebia_logo.svg' },
    { name: 'Digital', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Digital_Equipment_Corporation_logo.svg' }
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
</svelte:head>

<div id="top" class="min-h-screen bg-slate-50 font-inter text-slate-900 selection:bg-blue-100 selection:text-blue-900">
  {#if visible}
    <section class="relative flex min-h-[85vh] items-center overflow-hidden bg-[#0a192f] px-6 py-24 text-white">
      <div class="absolute inset-0 opacity-25">
        <div class="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0a192f]/60 to-transparent"></div>
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Team" class="h-full w-full object-cover" />
      </div>

      <div class="container relative mx-auto max-w-6xl">
        <div in:fly={{ y: 50, duration: 1000 }}>
          <h1 class="font-montserrat text-5xl font-black leading-tight tracking-tighter md:text-7xl">
            Transform Together, <br />
            <span class="text-[#00c6ff]">Thrive Forever</span>
          </h1>
          <p class="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl">
            Your journey to success starts here. We believe in growing alongside our customers, fostering innovation,
            and enabling businesses to stay ahead through smart technology adoption.
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <button class="flex items-center gap-2 rounded-full bg-[#00c6ff] px-8 py-4 font-montserrat text-sm font-extrabold text-[#0a192f] transition-all hover:scale-105 hover:bg-white hover:shadow-xl">
              Let's Talk <InlineIcon name="chevron-right" size={18} />
            </button>
            <div class="flex items-center gap-6 border-l border-white/20 pl-6">
              <div>
                <p class="font-montserrat text-2xl font-black">145+</p>
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">US Clients</p>
              </div>
              <div class="h-8 w-px bg-white/10"></div>
              <div>
                <p class="font-montserrat text-2xl font-black">5.0/5</p>
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Clutch Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#f8faff] px-6 py-24">
      <div class="container mx-auto max-w-6xl">
        <h2 class="mb-16 text-center font-montserrat text-4xl font-black text-[#1f4e79] md:text-5xl">
          Why Universal Software Is Your Trusted <br/> Technology Partner
        </h2>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {#each trustFactors as factor, i}
            <div 
              class="group relative flex flex-col rounded-3xl bg-white p-10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
              in:fade={{ delay: i * 100, duration: 500 }}
            >
              <div class="absolute top-0 left-0 h-2 w-full rounded-t-3xl bg-[#1f4e79]/10 group-hover:bg-[#00c6ff] transition-colors"></div>
              <h3 class="mb-4 font-montserrat text-xl font-extrabold leading-tight text-[#1f4e79]">{factor.title}</h3>
              <p class="text-[15px] font-normal leading-relaxed text-slate-600">{factor.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="overflow-hidden px-6 py-24">
      <div class="container mx-auto max-w-6xl">
        <div class="grid items-center gap-16 lg:grid-cols-2">
          <div in:fade={{ x: -50, duration: 800 }}>
            <h2 class="font-montserrat text-5xl font-black leading-tight text-[#1f4e79]">
              Scalable Solutions for <br/> Every Stage of Growth
            </h2>
            <p class="mt-8 text-lg font-medium leading-relaxed text-slate-600">
              At Universal Software, we partner with businesses of all sizes—from startups to large enterprises—to deliver customized digital solutions that fuel innovation, streamline operations, and support sustainable growth.
            </p>
          </div>
          
          <div class="relative grid grid-cols-2 gap-6" in:fade={{ x: 50, duration: 800 }}>
            {#each growthStages as stage, i}
              <div class="group flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-10 text-center shadow-md transition-all hover:bg-[#1f4e79] hover:shadow-2xl {i % 2 !== 0 ? 'mt-12' : 'mb-12'}">
                <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-[#1f4e79] transition-colors group-hover:bg-white/10 group-hover:text-white">
                  <InlineIcon name={stage.icon} size={40} strokeWidth={1.7} />
                </div>
                <span class="font-montserrat text-lg font-extrabold text-[#1f4e79] group-hover:text-white">{stage.name}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white px-6 py-24">
      <div class="container mx-auto max-w-6xl">
        <div class="grid items-center gap-16 lg:grid-cols-2">
          <div class="relative">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" alt="Tech" class="rounded-3xl shadow-2xl" />
            <div class="absolute -bottom-6 -right-6 h-32 w-32 rounded-3xl bg-[#00c6ff] opacity-20 -z-10"></div>
          </div>
          <div>
            <h2 class="font-montserrat text-4xl font-black text-[#1f4e79]">Our Organization</h2>
            <p class="mt-6 font-medium text-slate-600">Seamless. Smart. Scalable. We focus on turning tech hurdles into strategic advantages.</p>
            <div class="mt-10 grid gap-6">
              <div class="rounded-2xl bg-slate-50 p-6 border-l-4 border-[#1f4e79] transition-all hover:translate-x-2">
                <h4 class="font-montserrat font-extrabold text-[#1f4e79]">Our Mission</h4>
                <p class="mt-2 text-sm text-slate-500">Equipping businesses with AI and tech expertise for sustainable progress.</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-6 border-l-4 border-[#00c6ff] transition-all hover:translate-x-2">
                <h4 class="font-montserrat font-extrabold text-[#00c6ff]">Our Vision</h4>
                <p class="mt-2 text-sm text-slate-500">Driving scalable growth through advanced, impactful AI solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#f8faff] px-6 py-24">
      <div class="container mx-auto max-w-6xl text-center">
        <h2 class="font-montserrat text-4xl font-black text-[#1f4e79]">Our Core Values</h2>
        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {#each coreValues as value}
            <div class="group rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-xl">
              <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f4e79]/5 text-[#1f4e79] transition-colors group-hover:bg-[#1f4e79] group-hover:text-white">
                <InlineIcon name={value.icon} size={28} />
              </div>
              <h4 class="font-montserrat text-xl font-bold text-slate-800">{value.title}</h4>
              <p class="mt-3 text-sm font-medium text-slate-500">{value.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="bg-[#0a192f] px-6 py-20 text-white">
      <div class="container mx-auto max-w-6xl text-center">
        <h2 class="mb-12 font-montserrat text-xl font-bold uppercase tracking-widest opacity-50">Reliable Solutions, Trusted Partnerships</h2>
        <div class="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {#each partners as partner}
            <div class="flex h-24 items-center justify-center rounded-2xl bg-white/5 p-6 transition-all hover:bg-white/10 grayscale hover:grayscale-0">
              <img src={partner.logo} alt={partner.name} class="max-h-8 opacity-60 transition-opacity group-hover:opacity-100" />
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  .font-inter {
    font-family: 'Inter', sans-serif;
  }

  .font-montserrat {
    font-family: 'Montserrat', sans-serif;
  }
</style>
