<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { db } from '$lib/db';

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

  onMount(async () => {
    if (browser) {
      await loadActivities();
    }
  });

  async function loadActivities() {
    if (!browser) return;
    activities = await db.getActivities();
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  async function deleteActivity(id) {
    if (!browser) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      await db.deleteActivity(id);
      await loadActivities();
    }
  }
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
</div>
