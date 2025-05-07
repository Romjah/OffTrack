<script>
  import { onMount } from 'svelte';
  export let durationByType = {};

  /** @type {any} */
  let ChartComponent = null;

  onMount(async () => {
    const mod = await import('./ActivityChart.svelte');
    ChartComponent = mod.default;
  });
</script>

{#if ChartComponent}
  <svelte:component this={ChartComponent} {durationByType} />
{/if} 