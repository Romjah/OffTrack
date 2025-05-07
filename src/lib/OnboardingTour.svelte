<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let steps: { selector: string, title: string, description: string }[] = [];
  export let active = false;

  let current = 0;
  let highlightRect = { top: 0, left: 0, width: 0, height: 0 };
  let tooltipStyle = '';
  const dispatch = createEventDispatcher();
  let listenersActive = false;

  function updateTooltipPosition() {
    if (!browser) return;
    const el = document.querySelector(steps[current].selector) as HTMLElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      highlightRect = {
        top: rect.top + window.scrollY - 8,
        left: rect.left + window.scrollX - 8,
        width: rect.width + 16,
        height: rect.height + 16
      };
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const tooltipHeight = 180;
      let maxWidth = Math.min(380, viewportWidth - 24);
      let minWidth = Math.min(320, viewportWidth - 24);
      let top = highlightRect.top + highlightRect.height + 16;
      let left = highlightRect.left;
      if (top + tooltipHeight > window.scrollY + viewportHeight) {
        top = highlightRect.top - tooltipHeight - 16;
      }
      if (left + maxWidth > window.scrollX + viewportWidth - 12) {
        left = window.scrollX + viewportWidth - maxWidth - 12;
      }
      if (left < window.scrollX + 12) left = window.scrollX + 12;
      if (top < window.scrollY + 8) top = highlightRect.top + highlightRect.height + 16;
      if (viewportWidth < 600) {
        top = window.scrollY + viewportHeight - tooltipHeight - 16;
        left = window.scrollX + (viewportWidth - maxWidth) / 2;
        maxWidth = viewportWidth - 16;
        minWidth = viewportWidth - 16;
      }
      tooltipStyle = `top: ${top}px; left: ${left}px; max-width: ${maxWidth}px; min-width: ${minWidth}px; width: auto;`;
    }
  }

  function focusStep() {
    if (!browser) return;
    const el = document.querySelector(steps[current].selector) as HTMLElement;
    if (el) {
      updateTooltipPosition();
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const tooltipHeight = 180;
      if (rect.bottom + tooltipHeight > viewportHeight || rect.top < 0) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function addListeners() {
    if (!browser || listenersActive) return;
    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition, true);
    listenersActive = true;
  }
  function removeListeners() {
    if (!browser || !listenersActive) return;
    window.removeEventListener('resize', updateTooltipPosition);
    window.removeEventListener('scroll', updateTooltipPosition, true);
    listenersActive = false;
  }

  function next() {
    if (current < steps.length - 1) {
      current++;
      focusStep();
    } else {
      finish();
    }
  }
  function skip() {
    finish();
  }
  function finish() {
    removeListeners();
    dispatch('finish');
  }

  onMount(() => {
    if (!browser) return;
    if (active && steps.length > 0) {
      focusStep();
      addListeners();
    }
  });

  onDestroy(() => {
    removeListeners();
  });

  $: if (active) focusStep();
</script>

{#if active && steps.length > 0}
  <div class="onboarding-overlay"></div>
  <div class="onboarding-highlight" style="top: {highlightRect.top}px; left: {highlightRect.left}px; width: {highlightRect.width}px; height: {highlightRect.height}px;"></div>
  <div class="onboarding-tooltip" style={tooltipStyle}>
    <div class="onboarding-title">{steps[current].title}</div>
    <div class="onboarding-desc">{steps[current].description}</div>
    <div class="onboarding-actions">
      <button class="onboarding-skip" on:click={skip}>Passer</button>
      <button class="onboarding-next" on:click={next}>{current < steps.length - 1 ? 'Suivant' : 'Terminer'}</button>
    </div>
  </div>
{/if}

<style>
  .onboarding-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(30, 41, 59, 0.45);
    z-index: 1000;
    pointer-events: all;
  }
  .onboarding-highlight {
    position: absolute;
    border: 3px solid #63d297;
    border-radius: 14px;
    box-shadow: 0 0 0 6px rgba(99,210,151,0.18);
    background: rgba(255,255,255,0.15);
    z-index: 1001;
    pointer-events: none;
    transition: all 0.25s cubic-bezier(.4,2,.6,1);
  }
  .onboarding-tooltip {
    position: absolute;
    min-width: 320px;
    max-width: 380px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.13);
    padding: 1.3em 1.2em 1em 1.2em;
    z-index: 1002;
    animation: fadeIn 0.18s;
  }
  .onboarding-title {
    font-size: 1.25em;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.4em;
  }
  .onboarding-desc {
    color: #4a5568;
    font-size: 1.05em;
    margin-bottom: 1em;
  }
  .onboarding-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.7em;
  }
  .onboarding-skip {
    background: none;
    border: none;
    color: #5b87c7;
    font-weight: 500;
    cursor: pointer;
    font-size: 1em;
    padding: 0.4em 1em;
    border-radius: 7px;
    transition: background 0.18s;
  }
  .onboarding-skip:hover {
    background: #f7fafc;
  }
  .onboarding-next {
    background: linear-gradient(90deg, #5b87c7 0%, #63d297 100%);
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: 7px;
    padding: 0.4em 1.2em;
    font-size: 1em;
    cursor: pointer;
    transition: background 0.18s;
  }
  .onboarding-next:hover {
    background: linear-gradient(90deg, #63d297 0%, #5b87c7 100%);
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 600px) {
    .onboarding-tooltip {
      left: 8px !important;
      right: 8px !important;
      min-width: calc(100vw - 16px) !important;
      max-width: calc(100vw - 16px) !important;
      top: auto !important;
      bottom: 16px !important;
      transform: none !important;
    }
  }
</style> 