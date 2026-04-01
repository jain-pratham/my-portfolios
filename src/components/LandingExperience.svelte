<script>
  import HeroSection from './HeroSection.svelte';
  import InnovationLoader from './InnovationLoader.svelte';
  import Services from './Services.svelte';
  import TrustedBy from './TrustedBy.svelte';
  import Num from './num.svelte';
  import AboutUs from './aboutus.svelte';
  import Industry from './Industries.svelte';
  import Process from './process.svelte';

  let showLoader = true;

  function handleComplete() {
    showLoader = false;
  }
</script>

{#if showLoader}
  <InnovationLoader on:complete={handleComplete} />
{:else}
  <HeroSection />
  <TrustedBy/>
  <AboutUs/>
  <Services/>
  <Num />
  <Industry/>
  <Process/>
{/if}
