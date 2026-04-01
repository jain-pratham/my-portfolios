<script>
  const services = [
    'Software Development',
    'Mobile Development',
    'IT Consulting & Advisory',
    'Cloud Services',
    'Cyber Security',
    'Network Connectivity',
    'Web Development',
    'ERP Solutions'
  ];

  const contacts = [
    {
      title: 'Call Any Time',
      value: '+91 99093 88561',
      href: 'tel:+919909388561',
      type: 'phone'
    },
    {
      title: 'Address',
      value: 'TRP Mall, Ahmedabad, Gujarat',
      href: 'https://maps.google.com/?q=TRP+Mall+Ahmedabad',
      type: 'address'
    },
    {
      title: 'Say Hello',
      value: 'info@core4ix.com',
      href: 'mailto:info@core4ix.com',
      type: 'email'
    }
  ];

</script>

<section id="solutions" class="relative overflow-hidden bg-[#f5f5f5] py-6 md:py-7 xl:py-8">
  <div class="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
    <div class="grid items-center gap-7 xl:grid-cols-[1.1fr_1fr_1.1fr] xl:gap-7">
      <div class="space-y-5">
        <div>
          <h2 class="text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl xl:text-[3.1rem]">Our Solutions</h2>
          <div class="mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
        </div>

        <div class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {#each services as service}
            <p class="group flex items-center text-[1.03rem] font-medium tracking-wide text-slate-700 transition-all duration-300 hover:translate-x-1 hover:text-[#0369a1]">
              <span class="mr-2 h-1.5 w-1.5 rounded-full bg-[#0ea5e9] transition-transform duration-300 group-hover:scale-125"></span>
              {service}
            </p>
          {/each}
        </div>
      </div>

      <div class="relative flex min-h-[170px] items-center justify-center py-0.5 sm:min-h-[210px]">
        <div class="dot-field" aria-hidden="true">
          <span class="dot-ring dot-ring--one"></span>
          <span class="dot-ring dot-ring--two"></span>
        </div>
        <div class="logo-panel">
          <img src="/logo2.png" alt="Core4ix logo" class="h-40 w-56 object-contain sm:h-48 sm:w-64" loading="lazy" />
        </div>
      </div>

      <div class="space-y-3 xl:pl-4">
        <p class="text-xs font-bold uppercase tracking-[0.3em] text-[#0284c7]">* THEY TOLD ABOUT *</p>
        <h3 class="text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl xl:text-[3.1rem]">What Sets Us Apart?</h3>
        <p class="max-w-xl text-lg leading-relaxed text-slate-600">
          CORE4IX delivers high-performance software engineering with deep expertise in web platforms, cloud systems,
          cybersecurity, ERP modernization, and enterprise IT consulting.
        </p>
      </div>
    </div>

    <div class="mt-5 border-t border-slate-300/70 pt-3 sm:pt-4">
      <div class="grid gap-4 md:grid-cols-3 md:gap-3">
        {#each contacts as item}
          <a href={item.href} target={item.type === 'address' ? '_blank' : undefined} rel={item.type === 'address' ? 'noreferrer' : undefined} class="group flex items-start gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-white/70">
            <div class="mt-0.5 text-[#0284c7]">
              {#if item.type === 'phone'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l1.09 3.27a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.59 6.59l1.27-1.27a2 2 0 012.11-.45l3.27 1.09A2 2 0 0121 17.72V21a2 2 0 01-2 2h-1C9.16 23 1 14.84 1 5V5z" />
                </svg>
              {:else if item.type === 'address'}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8l-8.586 8.586a2 2 0 01-2.828 0L3 10" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18l-7.5 8.5a2 2 0 01-3 0L3 6z" />
                </svg>
              {/if}
            </div>

            <div>
              <p class="text-[0.92rem] font-medium text-[#0284c7]">{item.title}</p>
              <p class="mt-0.5 text-[1.35rem] font-semibold leading-tight tracking-tight text-slate-700 transition-colors duration-300 group-hover:text-[#0f172a] sm:text-[1.55rem]">{item.value}</p>
            </div>
          </a>
        {/each}
      </div>
    </div>

    <div id="contact" class="mt-6 sm:mt-8">
      <div class="contact-cta relative overflow-hidden rounded-3xl px-5 py-6 sm:px-8 sm:py-8">
        <div class="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl"></div>
        <div class="absolute -left-16 -bottom-20 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl"></div>

        <div class="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200">Contact Us</p>
            <h4 class="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Let's Build Something Powerful Together</h4>
            <p class="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">Fast response. Clear roadmap. Enterprise-grade execution for your next product.</p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <a href="tel:+919909388561" class="rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-[#0f172a] transition-transform hover:-translate-y-0.5">
              Call Now
            </a>
            <a href="mailto:info@core4ix.com" class="rounded-xl border border-white/35 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .logo-panel {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 17rem;
    height: 10rem;
    animation: logoIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .dot-field {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    z-index: 1;
  }

  .dot-ring {
    position: absolute;
    border-radius: 9999px;
    background-image: radial-gradient(circle, rgba(15, 23, 42, 0.3) 1.6px, transparent 1.8px);
    background-repeat: repeat;
    transform-origin: center;
    opacity: 0.9;
    /* Keep middle clear so no circle/radial appears on top of logo */
    mask-image: radial-gradient(circle, transparent 0 26%, rgba(0, 0, 0, 0.86) 40%, rgba(0, 0, 0, 0.52) 80%, transparent 100%);
  }

  .dot-ring--one {
    width: 20rem;
    height: 20rem;
    background-size: 13px 13px;
    animation: dotPulse 7.2s ease-out infinite;
  }

  .dot-ring--two {
    width: 16.5rem;
    height: 16.5rem;
    background-size: 9px 9px;
    opacity: 0.78;
    animation: dotPulse 5.8s ease-out infinite;
    animation-delay: -1.6s;
  }

  .contact-cta {
    background: linear-gradient(135deg, #0f172a 0%, #1f4e79 45%, #0284c7 100%);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
  }

  @keyframes logoIn {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.94);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes dotPulse {
    0% {
      opacity: 0.28;
      transform: scale(0.88);
    }
    65% {
      opacity: 0.36;
    }
    100% {
      opacity: 0;
      transform: scale(1.16);
    }
  }

  @media (max-width: 768px) {
    .logo-panel {
      width: 14rem;
      height: 8rem;
    }

    .dot-ring--one {
      width: 14rem;
      height: 14rem;
    }

    .dot-ring--two {
      width: 11.5rem;
      height: 11.5rem;
    }
  }
</style>
