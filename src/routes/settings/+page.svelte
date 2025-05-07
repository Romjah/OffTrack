<script lang="ts">
  function relancerOnboarding() {
    localStorage.setItem('offtrack_onboarding_requested', 'true');
    window.location.href = '/';
  }
</script>

<div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
  <h2 class="text-2xl font-bold mb-6">Paramètres</h2>
  <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition" on:click={relancerOnboarding}>
    Aide / Relancer le didacticiel
  </button>
</div> 