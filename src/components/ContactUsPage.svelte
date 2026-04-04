<script>
  import InlineIcon from './ui/InlineIcon.svelte';

  const contactCards = [
    {
      title: 'Strategic Consultation',
      value: '+91 99093 88561',
      detail: 'Discuss scope, timelines, and the right delivery model for your project.',
      href: 'tel:+919909388561',
      icon: 'phone'
    },
    {
      title: 'Project Briefs',
      value: 'info@core4ix.com',
      detail: 'Share requirements or wireframes for a structured technical evaluation.',
      href: 'mailto:info@core4ix.com',
      icon: 'mail'
    },
    {
      title: 'Headquarters',
      value: 'Ahmedabad, Gujarat',
      detail: 'TRP Mall. Available for discovery sessions and in-person workshops.',
      href: 'https://maps.google.com',
      icon: 'map-pin'
    }
  ];

  const valuePoints = [
    { title: 'Rapid Response', description: 'Initial technical feedback within 24 business hours.', icon: 'clock' },
    { title: 'Engineering-Led', description: 'Consult with architects, not high-pressure sales reps.', icon: 'cpu' },
    { title: 'Scale-First', description: 'Architecture designed for long-term growth and security.', icon: 'shield' }
  ];

  const engagementTracks = [
    { title: 'Product Discovery', description: 'Requirement shaping, technical planning, and scope validation.', icon: 'search' },
    { title: 'Dedicated Squads', description: 'High-velocity engineering teams to build and ship modern software.', icon: 'users' },
    { title: 'Enterprise Modernization', description: 'Cloud migration and upgrading legacy architecture for the AI era.', icon: 'layers' }
  ];

  const deliverySteps = [
    'Technical discovery and goal alignment',
    'Scope definition and engagement modeling',
    'Milestone-based execution and QA',
    'Launch and post-deployment optimization'
  ];

  let form = { name: '', email: '', company: '', service: 'Custom Web Application', budget: 'Under INR 2L', message: '' };
  let submitNote = '';

  function handleSubmit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`Inquiry: ${form.name} | ${form.company}`);
    const body = encodeURIComponent(`Service: ${form.service}\nBudget: ${form.budget}\n\nBrief: ${form.message}`);
    submitNote = 'Opening your email client to complete the submission...';
    window.location.href = `mailto:info@core4ix.com?subject=${subject}&body=${body}`;
  }
</script>

<section class="relative bg-white pt-24 pb-20 text-slate-900 font-sans">
  <div class="absolute inset-0 pointer-events-none opacity-[0.03]" style="background-image: radial-gradient(#1f4e79 1px, transparent 1px); background-size: 24px 24px;"></div>

  <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
    
    <div class="mb-16 max-w-3xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-6">
        <span class="w-2 h-2 rounded-full bg-blue-600"></span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-600">Contact Engineering</span>
      </div>
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-950 leading-[1.1]">
        Technical execution <span class="text-blue-600">beyond</span> delivery.
      </h1>
      <p class="mt-6 text-lg text-slate-600 leading-relaxed">
        Partner with a team that translates complex business challenges into scalable, production-ready systems. From AI integration to enterprise modernization, we build for what's next.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      
      <div class="lg:col-span-8 grid gap-6 md:grid-cols-3">
        {#each valuePoints as item}
          <div class="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
            <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 mb-4 shadow-sm">
              <InlineIcon name={item.icon} size={20} />
            </div>
            <h3 class="font-bold text-slate-900">{item.title}</h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
          </div>
        {/each}

        <div class="md:col-span-3 p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h3 class="text-xl font-bold mb-6">Engagement Tracks</h3>
          <div class="grid gap-4 md:grid-cols-3">
            {#each engagementTracks as track}
              <div class="group cursor-default">
                <div class="flex items-center gap-3 mb-2">
                  <div class="text-blue-600"><InlineIcon name={track.icon} size={18} /></div>
                  <h4 class="font-bold text-sm tracking-tight">{track.title}</h4>
                </div>
                <p class="text-xs text-slate-500 leading-normal">{track.description}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 p-8 rounded-3xl bg-slate-950 text-white shadow-2xl">
        <h3 class="text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">The Process</h3>
        <div class="space-y-6">
          {#each deliverySteps as step, i}
            <div class="flex gap-4 items-start">
              <span class="text-slate-600 font-mono text-sm">0{i+1}</span>
              <p class="text-sm font-medium text-slate-200">{step}</p>
            </div>
          {/each}
        </div>
        <div class="mt-12 pt-8 border-t border-slate-800 flex justify-between">
          <div>
            <p class="text-2xl font-bold">24h</p>
            <p class="text-[10px] uppercase tracking-tighter text-slate-500">Response Time</p>
          </div>
          <div>
            <p class="text-2xl font-bold">4.9/5</p>
            <p class="text-[10px] uppercase tracking-tighter text-slate-500">Delivery Rating</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid gap-6 md:grid-cols-3">
      {#each contactCards as card}
        <a href={card.href} class="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-all">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{card.title}</p>
          <p class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{card.value}</p>
          <p class="mt-1 text-xs text-slate-500">{card.detail}</p>
        </a>
      {/each}
    </div>

    <div id="contact-form" class="mt-16 bg-slate-50 rounded-[2.5rem] border border-slate-200 p-8 md:p-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-950">Initiate a Project</h2>
          <p class="mt-3 text-slate-600">Provide details below to receive a formal technical consultation.</p>
        </div>

        <form on:submit={handleSubmit} class="grid gap-6 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 ml-1" for="name">Full Name</label>
            <input bind:value={form.name} id="name" required type="text" placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 ml-1" for="email">Work Email</label>
            <input bind:value={form.email} id="email" required type="email" placeholder="name@company.com" class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 ml-1">Service Type</label>
            <select bind:value={form.service} class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none">
              <option>Custom Web Application</option>
              <option>AI Agent Development</option>
              <option>ERP Modernization</option>
              <option>Cloud Infrastructure</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 ml-1">Investment Range</label>
            <select bind:value={form.budget} class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none">
              <option>Under INR 2L</option>
              <option>INR 2L to 5L</option>
              <option>INR 10L+</option>
              <option>TBD / Need Guidance</option>
            </select>
          </div>
          <div class="md:col-span-2 space-y-1.5">
            <label class="text-xs font-bold text-slate-700 ml-1" for="message">Project Requirements</label>
            <textarea bind:value={form.message} id="message" rows="4" placeholder="Briefly describe the business problem and desired outcome..." class="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"></textarea>
          </div>
          
          <div class="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
            <p class="text-xs text-slate-500 max-w-xs text-center md:text-left">
              By submitting, you agree to our privacy policy and will receive a response within one business day.
            </p>
            <button type="submit" class="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
              Request Consultation
            </button>
          </div>
        </form>

        {#if submitNote}
          <div class="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm text-center font-medium italic">
            {submitNote}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>