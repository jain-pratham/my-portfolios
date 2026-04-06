<script>
  let form = { 
    name: '', 
    email: '', 
    service: 'AI Agent Development', 
    budget: 'INR 2L - 5L', 
    message: '' 
  };
  
  let submitNote = '';

  const services = [
    'AI Agent Development',
    'Generative AI Pipelines',
    'AI & ML Development',
    'AI Strategy & Consulting',
    'Custom Web/App Ecosystems',
    'ERP & Cloud Modernization'
  ];

  const budgets = [
    'Under INR 2L',
    'INR 2L - 5L',
    'INR 10L+',
    'TBD / Need Guidance'
  ];

  const processSteps = [
    { number: '01', title: 'Discovery', description: 'Technical audit of your current data or business workflow.' },
    { number: '02', title: 'Blueprint', description: 'Architecting the AI/Automation logic and scaling path.' },
    { number: '03', title: 'Execution', description: 'Iterative build with 24/7 visibility into progress.' }
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    submitNote = 'Sending your request...';

    const formData = new FormData();
    // Use the API key from environment variables, fallback is just for safety/example
    formData.append("access_key", import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE');
    formData.append("subject", `New Project Inquiry from ${form.name}`);
    formData.append("from_name", form.name);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("service", form.service);
    formData.append("budget", form.budget);
    formData.append("message", form.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      
      if (result.success) {
        submitNote = 'Your request has been sent successfully! We will contact you soon.';
        // Reset form
        form = { name: '', email: '', service: 'AI Agent Development', budget: 'INR 2L - 5L', message: '' };
      } else {
        submitNote = 'Failed to send. Please verify your Web3Forms Access Key in the .env file.';
      }
    } catch(error) {
      submitNote = 'An error occurred. Please try emailing us directly.';
      console.error(error);
    }
  }
</script>

<section class="bg-white pt-36 pb-24 relative overflow-hidden">
  <!-- Decorative background -->
  <div class="absolute inset-0 pointer-events-none opacity-[0.02]" style="background-image: radial-gradient(#1f4e79 1px, transparent 1px); background-size: 32px 32px;"></div>
  <div class="absolute top-0 right-0 w-96 h-96 bg-[#00c6ff] opacity-5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
  
  <div class="container relative z-10 mx-auto px-6 max-w-7xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
      
      <!-- Left: Content & Process -->
      <div class="space-y-12">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-[#00c6ff]"></span>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8ba2b5]">Contact Engineering</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-[#1f4e79] mb-8" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            Technical execution <br/> <span class="text-[#00c6ff]">beyond</span> delivery.
          </h1>
          <p class="text-xl text-slate-600/90 leading-relaxed max-w-xl">
            Partner with a lean startup squad of 4 experts that translates complex business challenges into production-ready AI systems.
          </p>
        </div>

        <!-- 3-Step Process -->
        <div class="space-y-8">
           <h3 class="text-xs font-bold uppercase tracking-[0.3em] text-[#8ba2b5]">The Discovery Path</h3>
           <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
             {#each processSteps as step}
               <div class="group">
                 <div class="text-[#00c6ff] font-bold text-3xl mb-3 opacity-20 group-hover:opacity-100 transition-opacity" style="font-family: 'Plus Jakarta Sans', sans-serif;">{step.number}</div>
                 <h4 class="font-bold text-slate-800 mb-2" style="font-family: 'Plus Jakarta Sans', sans-serif;">{step.title}</h4>
                 <p class="text-xs text-slate-500 leading-relaxed">{step.description}</p>
               </div>
             {/each}
           </div>
        </div>

        <!-- Direct Contacts -->
        <div class="flex flex-col sm:flex-row gap-8 pt-8 border-t border-slate-100">
           <div>
             <p class="text-[10px] font-bold uppercase tracking-widest text-[#8ba2b5] mb-2">Email the Squad</p>
             <a href="mailto:core4ix@gmail.com" class="text-lg font-bold text-slate-800 hover:text-[#00c6ff] transition-colors" style="font-family: 'Plus Jakarta Sans', sans-serif;">core4ix@gmail.com</a>
           </div>
           <div>
             <p class="text-[10px] font-bold uppercase tracking-widest text-[#8ba2b5] mb-2">Speak Directly</p>
             <a href="tel:+917016945985" class="text-lg font-bold text-slate-800 hover:text-[#00c6ff] transition-colors" style="font-family: 'Plus Jakarta Sans', sans-serif;">+91 70169 45985</a>
           </div>
        </div>
      </div>

      <!-- Right: Standard Form -->
      <div class="relative">
        <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
          <h2 class="text-3xl font-bold text-[#1f4e79] mb-3" style="font-family: 'Plus Jakarta Sans', sans-serif;">Start a Project</h2>
          <p class="text-slate-500 mb-10">Briefly outline your challenge. You'll hear from an engineer within 24 hours.</p>

          <form on:submit={handleSubmit} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[11px] font-bold uppercase tracking-widest text-[#8ba2b5] ml-1" for="name">Full Name</label>
                <input bind:value={form.name} id="name" required type="text" placeholder="John Doe" class="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#00c6ff]/5 focus:border-[#00c6ff] outline-none transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[11px] font-bold uppercase tracking-widest text-[#8ba2b5] ml-1" for="email">Work Email</label>
                <input bind:value={form.email} id="email" required type="email" placeholder="name@company.com" class="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#00c6ff]/5 focus:border-[#00c6ff] outline-none transition-all" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[11px] font-bold uppercase tracking-widest text-[#8ba2b5] ml-1">Service Type</label>
                <select bind:value={form.service} class="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none">
                  {#each services as s}
                    <option>{s}</option>
                  {/each}
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[11px] font-bold uppercase tracking-widest text-[#8ba2b5] ml-1">Budget Range</label>
                <select bind:value={form.budget} class="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none">
                  {#each budgets as b}
                    <option>{b}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-bold uppercase tracking-widest text-[#8ba2b5] ml-1" for="message">Your Requirements</label>
              <textarea bind:value={form.message} id="message" rows="4" placeholder="Briefly describe what you're looking to automate or build..." class="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#00c6ff]/5 focus:border-[#00c6ff] outline-none transition-all"></textarea>
            </div>

            <div class="pt-6">
              <button type="submit" class="w-full py-5 bg-[#1f4e79] hover:bg-[#163a5c] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#1f4e79]/10 active:scale-[0.98]" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                Request Technical Consultation
              </button>
            </div>
            
            {#if submitNote}
              <p class="text-sm text-center font-medium italic text-[#00c6ff] mt-4">{submitNote}</p>
            {/if}
          </form>
        </div>
      </div>

    </div>
  </div>
</section>