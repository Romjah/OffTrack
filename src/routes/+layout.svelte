<script>
  import { onMount } from 'svelte';
  import '../app.css';

  let deferredPrompt;
  let showInstallButton = false;

  onMount(async () => {
    // Enregistrement du service worker
    // if ('serviceWorker' in navigator) {
    //   try {
    //     const registration = await navigator.serviceWorker.register('/sw.js');
    //     console.log('Service Worker enregistré avec succès:', registration);
    //   } catch (error) {
    //     console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
    //   }
    // }

    // Gestion de l'installation de la PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton = true;
    });
  });

  async function installPWA() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Installation ${outcome}`);
      deferredPrompt = null;
      showInstallButton = false;
    }
  }
</script>

<main class="min-h-screen bg-gray-100">
  <header class="bg-white shadow">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-blue-600">OffTrack</h1>
      {#if showInstallButton}
        <button
          on:click={installPWA}
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Installer l'application
        </button>
      {/if}
    </nav>
  </header>

  <div class="container mx-auto px-4 py-8">
    <slot />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 