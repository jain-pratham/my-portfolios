<script>
  let activeTab = 'Web Development';

  const serviceDetails = {
    'Web Design': {
      title: 'Experience-Led Design',
      desc: 'Hum interfaces banate hain jo users ko engage karein aur brand storytelling par focus karein.',
      features: ['UI/UX Audit', 'Visual Identity', 'Prototyping'],
      image: 'web.webp' 
    },
    'Web Development': {
      title: 'High-Performance Engineering',
      desc: 'High-level development with clean, scalable code to minimize business obstructions.',
      features: ['Custom Web Apps', 'Node.js/PHP', 'API Integration'],
      image: 'https://cdn-icons-png.flaticon.com/512/1336/1336494.png'
    },
    'Mobile Application': {
      title: 'Native & Hybrid Apps',
      desc: 'Seamless performance across iOS and Android with a modern mobile tech stack.',
      features: ['iOS/Android', 'Flutter/React Native', 'App Store SEO'],
      image: 'https://cdn-icons-png.flaticon.com/512/2586/2586488.png'
    },
    'eCommerce Solutions': {
      title: 'Scalable Digital Commerce',
      desc: 'End-to-end online store development with secure payment gateways and easy management.',
      features: ['Payment Integration', 'Inventory', 'B2B Platforms'],
      image: 'https://cdn-icons-png.flaticon.com/512/1162/1162499.png'
    },
    'Branding': {
      title: 'Strategic Brand Identity',
      desc: 'Market mein stand out karne ke liye unique brand identity aur guidelines design karna.',
      features: ['Logo Design', 'Brand Guidelines', 'Typography'],
      image: 'https://cdn-icons-png.flaticon.com/512/1055/1055661.png'
    },
    'Online Marketing': {
      title: 'Data-Driven Growth',
      desc: 'Strategies jo aapke digital footprint aur ROI ko grow karne mein help karti hain.',
      features: ['SEO Strategy', 'PPC Ads', 'Analytics'],
      image: 'https://cdn-icons-png.flaticon.com/512/1998/1998087.png'
    }
  };

  const tabs = Object.keys(serviceDetails);
</script>

<section id="solutions" class="py-12 bg-white overflow-hidden"> <div class="container mx-auto px-6">
    
    <div class="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-2 md:gap-6 border-b border-slate-100 mb-10 px-2">
      {#each tabs as tab}
        <button 
          on:click={() => activeTab = tab}
          class="pb-3 px-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap
          {activeTab === tab ? 'text-[#1f4e79]' : 'text-slate-400 hover:text-slate-600'}"
        >
          {tab}
          {#if activeTab === tab}
            <div class="absolute bottom-0 left-0 w-full h-1 bg-[#00c6ff] rounded-t-full shadow-[0_-2px_8px_rgba(0,198,255,0.5)] animate-slideIn"></div>
          {/if}
        </button>
      {/each}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      
      <div class="relative flex justify-center items-center order-2 lg:order-1">
        <div class="absolute inset-0 bg-sky-100/30 rounded-full filter blur-[80px] opacity-40"></div>
        <img 
          src={serviceDetails[activeTab].image} 
          alt={activeTab} 
          class="relative z-10 w-56 h-56 md:w-72 md:h-72 object-contain animate-float"
        />
      </div>

      <div class="order-1 lg:order-2">
        <div class="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-4">
            <span class="text-[9px] font-bold text-[#00c6ff] uppercase tracking-[0.2em]">Core Expertise</span>
        </div>
        
        <h3 class="text-3xl md:text-4xl font-black text-[#1f4e79] mb-4 leading-tight">
          {serviceDetails[activeTab].title}
        </h3>
        
        <p class="text-slate-500 text-base leading-relaxed mb-6 max-w-lg">
          {serviceDetails[activeTab].desc}
        </p>

        <div class="grid grid-cols-2 gap-3 mb-8 pl-4 border-l-2 border-sky-100">
          {#each serviceDetails[activeTab].features as feature}
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-[#00c6ff] rounded-full shadow-[0_0_5px_#00c6ff]"></div>
              <span class="text-slate-700 font-bold text-xs">{feature}</span>
            </div>
          {/each}
        </div>

        <div class="flex flex-wrap gap-4 items-center">
          <button class="px-7 py-3.5 bg-[#1f4e79] text-white rounded-xl text-sm font-bold hover:bg-[#163a5a] transition-all shadow-lg active:scale-95">
            Deploy Idea
          </button>
          <a href="#contact" class="text-sm font-bold text-[#1f4e79] border-b-2 border-sky-100 hover:border-[#00c6ff] transition-all">
            Contact us →
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  .animate-float { animation: float 5s ease-in-out infinite; }

  @keyframes slideIn {
    from { width: 0; opacity: 0; }
    to { width: 100%; opacity: 1; }
  }
  .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }

  /* Smooth switch animation */
  h3, p, img {
    animation: fadeIn 0.4s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>


