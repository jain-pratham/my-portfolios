<script>
  const services = [
    {
      title: "Cross-Platform Frameworks",
      description: "Utilizing React Native and Flutter to deliver near-native performance across iOS and Android from a single shared codebase, cutting development time in half.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`
    },
    {
      title: "Native iOS & Android",
      description: "For applications requiring deep hardware-level integration (Bluetooth, advanced camera arrays, background geolocation), we deploy dedicated Swift and Kotlin architectures.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`
    },
    {
      title: "Mobile Backend as a Service",
      description: "Wiring your interface to robust cloud infrastructure via GraphQL or REST. We implement secure token exchange, push notification pipelines, and WebSocket handlers.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>`
    },
    {
      title: "CI/CD & App Store Deployment",
      description: "Automating the grueling App Store review workflows. We configure Fastlane pipelines that run static analysis, unit tests, and automated build generation on every git push.",
      icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>`
    }
  ];
</script>

<section id="services" class="bg-white py-24 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
  <div class="container mx-auto px-6 max-w-7xl relative z-10">
    <div class="mb-16 md:w-3/4 lg:w-1/2">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-[#00c6ff] mb-4">Core Capabilities</h2>
      <h3 class="text-4xl md:text-5xl font-black text-[#1f4e79] tracking-tight">Mobile Infrastructure</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {#each services as service}
        <div class="group relative overflow-hidden rounded-3xl bg-slate-50 p-10 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#1f4e79] shadow-sm border border-slate-100 transition-colors group-hover:bg-[#1f4e79] group-hover:text-[#00c6ff]">
            {@html service.icon}
          </div>
          <h4 class="mb-4 text-2xl font-black text-slate-800">{service.title}</h4>
          <p class="text-slate-600 leading-relaxed text-lg">{service.description}</p>
          
          <div class="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-[#00c6ff] to-blue-500 transition-all duration-500 group-hover:w-full"></div>
        </div>
      {/each}
    </div>
  </div>
</section>
