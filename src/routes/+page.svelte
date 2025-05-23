<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { db } from '$lib/db';
  import ClientOnlyChart from './ClientOnlyChart.svelte';
  import OnboardingTour from '$lib/OnboardingTour.svelte';
  import { goto } from '$app/navigation';
  import { onboardingRequested } from '$lib/onboarding';

  /**
   * @type {Array<{id: any, type: string, duration: number, notes: string, date: string}>}
   */
  let activities = [];
  let newActivity = {
    type: '',
    duration: 0,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  };

  const activityTypes = [
    'Sport',
    'Méditation',
    'Lecture',
    'Écriture',
    'Musique',
    'Autre'
  ];

  // Statistiques
  /** @type {{[key: string]: number}} */
  let durationByType = {};
  /** @type {{[key: string]: number}} */
  let countByType = {};
  let totalDuration = 0;
  let totalCount = 0;

  let showOnboarding = false;
  let onboardingSteps = [
    {
      selector: '.nav-link[href="/"]',
      title: 'Dashboard',
      description: 'Ceci est votre tableau de bord principal. Retrouvez ici vos activités et statistiques.'
    },
    {
      selector: '.nav-link[href="/stats"]',
      title: 'Statistiques',
      description: 'Accédez à vos statistiques détaillées et visualisez vos progrès.'
    },
    {
      selector: '.nav-link[href="/activities"]',
      title: 'Activités',
      description: 'Gérez et ajoutez vos activités quotidiennes ici.'
    },
    {
      selector: '.sync-btn',
      title: 'Synchronisation',
      description: "Synchronisez vos données avec l'extension FocusFlow pour une expérience enrichie."
    },
    {
      selector: 'form',
      title: 'Ajouter une activité',
      description: 'Ajoutez rapidement une nouvelle activité à votre journal.'
    },
    {
      selector: '.onboarding-chart',
      title: 'Graphique',
      description: "Visualisez la répartition de votre temps par type d'activité."
    }
  ];

  onMount(() => {
    // Détecte si c'est un nouveau compte (flag onboarding)
    const user = JSON.parse(localStorage.getItem('offtrack_user') || '{}');
    if (user && !user.onboarded) {
      showOnboarding = true;
    }
    // Déclenche le didacticiel si demandé via settings
    if (localStorage.getItem('offtrack_onboarding_requested') === 'true') {
      showOnboarding = true;
      localStorage.removeItem('offtrack_onboarding_requested');
      // Supprime le flag onboarded pour permettre le tour
      if (user && user.email) {
        delete user.onboarded;
        localStorage.setItem('offtrack_user', JSON.stringify(user));
      }
    }
  });

  onMount(async () => {
    if (browser) {
      await loadActivities();
    }
  });

  async function loadActivities() {
    if (!browser) return;
    activities = await db.getActivities();
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    computeStats();
  }

  function computeStats() {
    totalDuration = 0;
    totalCount = activities.length;
    durationByType = {};
    countByType = {};
    for (const a of activities) {
      totalDuration += Number(a.duration) || 0;
      durationByType[a.type] = (durationByType[a.type] || 0) + (Number(a.duration) || 0);
      countByType[a.type] = (countByType[a.type] || 0) + 1;
    }
  }

  async function addActivity() {
    if (!browser) return;
    if (!newActivity.type || !newActivity.duration) return;

    await db.addActivity(newActivity);
    newActivity = {
      type: '',
      duration: 0,
      notes: '',
      date: new Date().toISOString().split('T')[0]
    };
    await loadActivities();
  }

  /**
   * @param {any} id
   */
  async function deleteActivity(id) {
    if (!browser) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      await db.deleteActivity(id);
      await loadActivities();
    }
  }

  function finishOnboarding() {
    showOnboarding = false;
    // Marque le compte comme onboardé
    const user = JSON.parse(localStorage.getItem('offtrack_user') || '{}');
    user.onboarded = true;
    localStorage.setItem('offtrack_user', JSON.stringify(user));
  }

  function relancerOnboarding() {
    const user = JSON.parse(localStorage.getItem('offtrack_user') || '{}');
    if (user && user.email) {
      delete user.onboarded;
      localStorage.setItem('offtrack_user', JSON.stringify(user));
      showOnboarding = true;
    }
  }

  onboardingRequested.subscribe(val => {
    if (val) {
      showOnboarding = true;
      onboardingRequested.set(false);
      // Supprime le flag onboarded pour permettre le tour
      const user = JSON.parse(localStorage.getItem('offtrack_user') || '{}');
      if (user && user.email) {
        delete user.onboarded;
        localStorage.setItem('offtrack_user', JSON.stringify(user));
      }
    }
  });
</script>

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-lg shadow p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">Ajouter une activité</h2>
    <form on:submit|preventDefault={addActivity} class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type d'activité</label>
          <select
            id="type"
            bind:value={newActivity.type}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            {#each activityTypes as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700">Durée (minutes)</label>
          <input
            type="number"
            id="duration"
            bind:value={newActivity.duration}
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          bind:value={newActivity.notes}
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          id="date"
          bind:value={newActivity.date}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ajouter l'activité
      </button>
    </form>
  </div>

  <div class="bg-white rounded-lg shadow mb-8">
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Statistiques</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="font-medium">Nombre total d'activités : <span class="text-blue-700">{totalCount}</span></p>
          <p class="font-medium">Temps total passé : <span class="text-blue-700">{totalDuration} min</span></p>
        </div>
        <div>
          <p class="font-medium mb-2">Par type :</p>
          <ul class="text-sm">
            {#each Object.keys(countByType) as type}
              <li>
                <span class="font-semibold">{type} :</span>
                {countByType[type]} activité{countByType[type] > 1 ? 's' : ''} — {durationByType[type]} min
              </li>
            {/each}
          </ul>
        </div>
      </div>
      <div class="mt-8 onboarding-chart">
        {#if browser}
          <ClientOnlyChart {durationByType} />
        {/if}
      </div>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow">
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Historique des activités</h2>
      {#if activities.length === 0}
        <p class="text-gray-500 text-center py-4">Aucune activité enregistrée</p>
      {:else}
        <div class="space-y-4">
          {#each activities as activity (activity.id)}
            <div class="border rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">{activity.type}</h3>
                  <p class="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString()} - {activity.duration} minutes
                  </p>
                  {#if activity.notes}
                    <p class="mt-2 text-gray-700">{activity.notes}</p>
                  {/if}
                </div>
                <button
                  on:click={() => deleteActivity(activity.id)}
                  class="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <OnboardingTour steps={onboardingSteps} active={showOnboarding} on:finish={finishOnboarding} />
</div>
