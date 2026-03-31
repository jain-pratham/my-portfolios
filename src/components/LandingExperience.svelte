<script>
  import HeroSection from './HeroSection.svelte';
  import InnovationLoader from './InnovationLoader.svelte';

  let showLoader = true;

  function handleComplete() {
    showLoader = false;
  }
</script>

{#if showLoader}
  <InnovationLoader on:complete={handleComplete} />
{:else}
  <HeroSection />
{/if}
