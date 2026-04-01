<script>
  const industries = [
    {
      name: 'Cargo & Courier Services',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="24" width="28" height="18" rx="2"/><path d="M34 30h10l8 6v6h-18z"/><path d="M15 46h0M45 46h0"/><circle cx="15" cy="46" r="4"/><circle cx="45" cy="46" r="4"/><path d="M20 35l5 5 9-10"/></svg>`
    },
    {
      name: 'Corporate Website',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="20" width="18" height="28" rx="2"/><rect x="27" y="14" width="22" height="34" rx="2"/><rect x="49" y="22" width="8" height="26" rx="2"/><path d="M15 26h6M15 33h6M33 21h6M42 21h1M33 29h6M42 29h1M33 37h6M42 37h1"/></svg>`
    },
    {
      name: 'eCommerce Website',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="14" width="44" height="30" rx="3"/><path d="M10 22h44"/><path d="M16 28h14v10H16z"/><path d="M36 28h12M36 34h10M16 48h28"/><circle cx="22" cy="52" r="2.3"/><circle cx="36" cy="52" r="2.3"/></svg>`
    },
    {
      name: 'Education',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24l24-10 24 10-24 10z"/><path d="M18 28v8c0 5 7 9 14 9s14-4 14-9v-8"/><path d="M50 26v10"/><rect x="14" y="44" width="36" height="8" rx="2"/></svg>`
    },
    {
      name: 'Healthcare',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M31 50s-17-8.3-17-22a10 10 0 0118-6 10 10 0 0118 6c0 13.7-17 22-17 22z"/><path d="M25 32h14M32 25v14"/><circle cx="52" cy="14" r="8"/><path d="M52 10v8M48 14h8"/></svg>`
    },
    {
      name: 'Manufacturer Industrial',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 50V26l14-6v6l10-6v8l10-6v28z"/><rect x="42" y="18" width="8" height="32" rx="2"/><path d="M12 44h4M20 38h4M28 44h4M36 38h4"/><circle cx="49" cy="11" r="5"/><path d="M49 8v6M46 11h6"/></svg>`
    },
    {
      name: 'Real Estate',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 34l24-20 24 20"/><path d="M14 30v20h36V30"/><path d="M28 50V38h8v12"/><path d="M8 50h48"/><path d="M10 45c4 0 6-3 10-3s6 3 10 3 6-3 10-3 6 3 10 3"/></svg>`
    },
    {
      name: 'Religious & Communities',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 50c0-9 6-16 14-16s14 7 14 16"/><circle cx="32" cy="25" r="7"/><path d="M8 48c0-7 5-13 12-13M56 48c0-7-5-13-12-13"/><circle cx="15" cy="26" r="5"/><circle cx="49" cy="26" r="5"/></svg>`
    },
    {
      name: 'Religious Organization',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h10l-4 12 8 20-14-14z"/><path d="M52 20H42l4 12-8 20 14-14z"/><path d="M22 20h20v12H22z"/><path d="M28 12h8M32 8v8"/></svg>`
    },
    {
      name: 'Travel & Tourism',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="22" width="16" height="30" rx="2"/><path d="M8 30h16M12 38h8"/><path d="M30 40l22-22M40 12l12 6-6 12"/><rect x="30" y="44" width="22" height="8" rx="2"/></svg>`
    }
  ];
</script>

<section id="industries" class="bg-[#f5f5f5] py-24">
  <div class="container mx-auto px-6">
    <div class="text-center">
      <h2 class="text-[2.15rem] font-semibold tracking-tight text-slate-900 md:text-5xl">
        Industries <span class="font-black">We Serve</span>
      </h2>
    </div>

    <div class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {#each industries as industry}
        <article class="group flex min-h-[210px] flex-col items-center justify-center border border-slate-300 bg-white p-6 text-center shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.15)]">
          <div class="h-20 w-20 text-[#3b9ad7] transition-transform duration-300 group-hover:scale-105">
            {@html industry.icon}
          </div>
          <h3 class="mt-5 text-[1.15rem] font-medium leading-snug text-slate-600">{industry.name}</h3>
        </article>
      {/each}
    </div>

    <div class="mt-12 flex justify-center">
      <a
        href="#contact"
        class="inline-flex items-center rounded-full bg-gradient-to-r from-[#454a9f] to-[#5eaed4] px-12 py-4 text-2xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        Browse Our Portfolio
      </a>
    </div>
  </div>
</section>
