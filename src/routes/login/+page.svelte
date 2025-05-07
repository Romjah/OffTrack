<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let isSignup = false;

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('offtrack_users') || '{}');
    } catch {
      return {};
    }
  }
  function setUsers(users: Record<string, string>) {
    localStorage.setItem('offtrack_users', JSON.stringify(users));
  }

  function login() {
    error = '';
    loading = true;
    setTimeout(() => {
      if (email.trim() === '' || password.trim() === '') {
        error = 'Please enter both email and password.';
        loading = false;
        return;
      }
      const users = getUsers();
      if (!users[email] || users[email] !== password) {
        error = 'Invalid email or password.';
        loading = false;
        return;
      }
      localStorage.setItem('offtrack_user', JSON.stringify({ email }));
      goto('/');
    }, 700);
  }

  function signup() {
    error = '';
    loading = true;
    setTimeout(() => {
      if (email.trim() === '' || password.trim() === '') {
        error = 'Please enter both email and password.';
        loading = false;
        return;
      }
      const users = getUsers();
      if (users[email]) {
        error = 'An account with this email already exists.';
        loading = false;
        return;
      }
      users[email] = password;
      setUsers(users);
      localStorage.setItem('offtrack_user', JSON.stringify({ email }));
      goto('/');
    }, 700);
  }

  onMount(() => {
    // Si déjà connecté, redirige vers le dashboard
    const user = localStorage.getItem('offtrack_user');
    if (user) goto('/');
  });
</script>

<style>
  .login-container {
    max-width: 400px;
    margin: 60px auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    padding: 2.5rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .login-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    text-align: center;
  }
  .login-label {
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 0.3rem;
  }
  .login-input {
    width: 100%;
    padding: 0.7rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 1rem;
    background: #f7fafc;
    transition: border 0.2s;
  }
  .login-input:focus {
    border: 1.5px solid #3182ce;
    outline: none;
    background: #fff;
  }
  .login-btn {
    width: 100%;
    padding: 0.8rem;
    background: linear-gradient(90deg, #5b87c7 0%, #63d297 100%);
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 0.5rem;
  }
  .login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .login-error {
    color: #e53e3e;
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 6px;
    padding: 0.7rem 1rem;
    margin-bottom: 0.5rem;
    text-align: center;
    font-size: 1rem;
  }
  .switch-link {
    color: #5b87c7;
    cursor: pointer;
    text-align: center;
    margin-top: 0.7rem;
    font-size: 1rem;
    text-decoration: underline;
    transition: color 0.18s;
  }
  .switch-link:hover {
    color: #3182ce;
  }
</style>

<div class="login-container">
  <div class="login-title">{isSignup ? 'Create your account' : 'Sign in to OffTrack'}</div>
  {#if error}
    <div class="login-error">{error}</div>
  {/if}
  <form on:submit|preventDefault={isSignup ? signup : login}>
    <label class="login-label" for="email">Email</label>
    <input class="login-input" id="email" type="email" bind:value={email} placeholder="you@email.com" autocomplete="username" required />
    <label class="login-label" for="password">Password</label>
    <input class="login-input" id="password" type="password" bind:value={password} placeholder="Password" autocomplete="current-password" required />
    <button class="login-btn" type="submit" disabled={loading}>{loading ? (isSignup ? 'Creating...' : 'Signing in...') : (isSignup ? 'Create account' : 'Sign in')}</button>
  </form>
  <div class="switch-link" on:click={() => { isSignup = !isSignup; error = ''; }}>
    {isSignup ? 'Already have an account? Sign in' : 'No account? Create one'}
  </div>
</div> 