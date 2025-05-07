<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  export let durationByType = {};

  /** @type {HTMLCanvasElement|null} */
  let canvas = null;
  /** @type {any} */
  let chart = null;

  function renderChart() {
    if (!canvas) return;
    if (chart) chart.destroy();

    const labels = Object.keys(durationByType);
    const data = Object.values(durationByType);

    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Temps passé (min)',
          data,
          backgroundColor: '#4a90e2',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  onMount(() => {
    renderChart();
    return () => { if (chart) chart.destroy(); };
  });

  $: renderChart();
</script>

<div class="w-full" style="min-height:200px;">
  <canvas bind:this={canvas} height="120"></canvas>
</div> 