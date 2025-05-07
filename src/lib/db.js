import { openDB } from 'idb';
import { browser } from '$app/environment';

const dbName = 'offtrack-db';
const version = 1;

// Initialiser la base de données uniquement côté client
const initDB = async () => {
  if (!browser) return null;
  
  return openDB(dbName, version, {
    upgrade(db) {
      // Store pour les activités
      if (!db.objectStoreNames.contains('activities')) {
        const activityStore = db.createObjectStore('activities', { keyPath: 'id', autoIncrement: true });
        activityStore.createIndex('date', 'date');
        activityStore.createIndex('type', 'type');
      }

      // Store pour les paramètres utilisateur
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // Store pour les données de synchronisation
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('status', 'status');
        syncStore.createIndex('timestamp', 'timestamp');
      }
    },
  });
};

const dbPromise = initDB();

export const db = {
  async addActivity(activity) {
    if (!browser) return;
    const db = await dbPromise;
    return db.add('activities', {
      ...activity,
      timestamp: Date.now(),
      syncStatus: 'pending'
    });
  },

  async getActivities() {
    if (!browser) return [];
    const db = await dbPromise;
    return db.getAll('activities');
  },

  async getActivity(id) {
    if (!browser) return null;
    const db = await dbPromise;
    return db.get('activities', id);
  },

  async updateActivity(id, updates) {
    if (!browser) return;
    const db = await dbPromise;
    return db.put('activities', {
      ...updates,
      id,
      timestamp: Date.now(),
      syncStatus: 'pending'
    });
  },

  async deleteActivity(id) {
    if (!browser) return;
    const db = await dbPromise;
    return db.delete('activities', id);
  },

  async getSettings() {
    if (!browser) return [];
    const db = await dbPromise;
    return db.getAll('settings');
  },

  async updateSetting(key, value) {
    if (!browser) return;
    const db = await dbPromise;
    return db.put('settings', { key, value });
  },

  async addToSyncQueue(item) {
    if (!browser) return;
    const db = await dbPromise;
    return db.add('syncQueue', {
      ...item,
      timestamp: Date.now(),
      status: 'pending'
    });
  },

  async getPendingSyncItems() {
    if (!browser) return [];
    const db = await dbPromise;
    const tx = db.transaction('syncQueue', 'readonly');
    const index = tx.store.index('status');
    return index.getAll('pending');
  }
}; 