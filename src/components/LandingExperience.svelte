<script>
  import HeroSection from './HeroSection.svelte';
  import Navbar from './Navbar.svelte';
  import InnovationLoader from './InnovationLoader.svelte';
  import Services from './Services.svelte';
  import ProjectShowcase from './ProjectShowcase.svelte';
  import TrustedBy from './TrustedBy.svelte';
  import Num from './num.svelte';
  import AboutUs from './aboutus.svelte';
  import Industry from './Industries.svelte';
  import Process from './process.svelte';
  import TechnologiesSection from './TechnologiesSection.svelte';
  import Footer from './footer/Footer.svelte';
  import Feedback from './feedback.svelte'
  import Faq from './Faq.svelte';

  let showLoader = true;

  function handleComplete() {
    showLoader = false;
  }
</script>

{#if showLoader}
  <InnovationLoader on:complete={handleComplete} />
{:else}
  <Navbar />
  <HeroSection />
  <TrustedBy/>
  <AboutUs/>
  <Services/>
  <Num />
  <Industry/>
  <Process/>
  <TechnologiesSection/>
  <ProjectShowcase/>
  <Feedback/>
  <Faq/>
  <Footer/>
{/if}
