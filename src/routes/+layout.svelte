<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import { goto } from '$app/navigation';

  let deferredPrompt: any = null;
  let showInstallButton = false;
  let user: { email: string } | null = null;
  let navOpen = false;
  let profileOpen = false;
  let syncActive = true; // à relier à l'état réel plus tard

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Stats', href: '/stats' },
    { name: 'Activities', href: '/activities' },
    { name: 'Settings', href: '/settings' }
  ];

  onMount(() => {
    // Auth check
    user = null;
    try {
      const stored = localStorage.getItem('offtrack_user');
      if (stored) user = JSON.parse(stored);
    } catch {}
    // Redirige si non connecté et pas déjà sur /login
    if (!user && !window.location.pathname.startsWith('/login')) {
      goto('/login');
    }

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

  function logout() {
    localStorage.removeItem('offtrack_user');
    goto('/login');
  }
</script>

<main class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
  <header class="glass-navbar">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center relative">
      <div class="flex items-center gap-6">
        <h1 class="text-2xl font-extrabold text-blue-600 tracking-tight drop-shadow-sm logo-glass">OffTrack</h1>
        <div class="hidden md:flex gap-2">
          {#each navLinks as link}
            <a href={link.href} class="nav-link">{link.name}</a>
          {/each}
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button class="sync-btn" aria-label="Synchronisation" title="Synchronisation avec FocusFlow">
          <span class="sync-dot {syncActive ? 'active' : ''}"></span>
          <span class="hidden sm:inline">Sync</span>
        </button>
        {#if user && user.email}
          <div class="relative">
            <button class="profile-btn" on:click={() => profileOpen = !profileOpen} aria-label="Profil">
              <span class="avatar">{user.email.charAt(0).toUpperCase()}</span>
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {#if profileOpen}
              <div class="profile-menu">
                <div class="profile-email">{user.email}</div>
                <button class="logout-btn" on:click={logout}>Logout</button>
              </div>
            {/if}
          </div>
        {/if}
        <button class="md:hidden nav-toggle" on:click={() => navOpen = !navOpen} aria-label="Menu">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        {#if showInstallButton}
          <button
            on:click={installPWA}
            class="install-btn"
          >
            Installer l'application
          </button>
        {/if}
      </div>
      {#if navOpen}
        <div class="mobile-nav">
          {#each navLinks as link}
            <a href={link.href} class="nav-link" on:click={() => navOpen = false}>{link.name}</a>
          {/each}
        </div>
      {/if}
    </nav>
  </header>

  <div class="container mx-auto px-4 py-8">
    <slot />
  </div>
</main>

<style>
  .glass-navbar {
    background: rgba(255,255,255,0.7);
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.07);
    backdrop-filter: blur(8px);
    border-bottom: 1.5px solid rgba(99,210,151,0.08);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .logo-glass {
    background: rgba(99,210,151,0.10);
    border-radius: 10px;
    padding: 0.2em 0.7em;
    box-shadow: 0 2px 8px 0 rgba(99,210,151,0.08);
  }
  .nav-link {
    color: #2d3748;
    font-weight: 500;
    padding: 0.5em 1.1em;
    border-radius: 8px;
    transition: background 0.18s, color 0.18s;
    text-decoration: none;
    font-size: 1.08rem;
  }
  .nav-link:hover, .nav-link.active {
    background: linear-gradient(90deg, #5b87c7 0%, #63d297 100%);
    color: #fff;
  }
  .sync-btn {
    display: flex;
    align-items: center;
    gap: 0.5em;
    background: rgba(99,210,151,0.13);
    border: none;
    border-radius: 8px;
    padding: 0.4em 1em;
    font-weight: 500;
    color: #2d3748;
    cursor: pointer;
    transition: background 0.18s;
    box-shadow: 0 1px 4px 0 rgba(99,210,151,0.07);
  }
  .sync-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #f44336;
    box-shadow: 0 0 6px #f44336;
    display: inline-block;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .sync-dot.active {
    background: #4CAF50;
    box-shadow: 0 0 8px #4CAF50;
  }
  .profile-btn {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2em 0.5em;
    border-radius: 8px;
    transition: background 0.18s;
  }
  .profile-btn:hover {
    background: rgba(99,210,151,0.10);
  }
  .avatar {
    background: linear-gradient(90deg, #5b87c7 0%, #63d297 100%);
    color: #fff;
    font-weight: 700;
    border-radius: 50%;
    width: 2.1em;
    height: 2.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
    box-shadow: 0 2px 8px 0 rgba(99,210,151,0.10);
  }
  .profile-menu {
    position: absolute;
    right: 0;
    top: 2.8em;
    background: rgba(255,255,255,0.98);
    border-radius: 10px;
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
    min-width: 180px;
    padding: 1em 0.7em 0.7em 0.7em;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    animation: fadeIn 0.18s;
  }
  .profile-email {
    color: #2d3748;
    font-size: 1.01em;
    font-weight: 500;
    margin-bottom: 0.3em;
    word-break: break-all;
  }
  .logout-btn {
    background: linear-gradient(90deg, #f44336 0%, #ffb347 100%);
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 0.5em 1em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }
  .logout-btn:hover {
    background: linear-gradient(90deg, #e53935 0%, #ff9800 100%);
  }
  .nav-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.3em;
    border-radius: 8px;
    margin-left: 0.5em;
    transition: background 0.18s;
  }
  .nav-toggle:hover {
    background: rgba(99,210,151,0.10);
  }
  .mobile-nav {
    position: absolute;
    top: 3.5em;
    right: 0;
    background: rgba(255,255,255,0.98);
    border-radius: 10px;
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
    min-width: 180px;
    padding: 1em 0.7em 0.7em 0.7em;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    animation: fadeIn 0.18s;
  }
  .install-btn {
    background: linear-gradient(90deg, #5b87c7 0%, #63d297 100%);
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    padding: 0.5em 1.2em;
    font-size: 1.05em;
    cursor: pointer;
    margin-left: 0.7em;
    transition: background 0.18s;
    box-shadow: 0 1px 4px 0 rgba(99,210,151,0.07);
  }
  .install-btn:hover {
    background: linear-gradient(90deg, #63d297 0%, #5b87c7 100%);
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style> 