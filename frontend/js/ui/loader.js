/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/ui/loader.js
   Loader section: spinning steps + AI thinking banner.
   Depends on: #loader-section, #loader-sub, #step-1…4,
               #ai-thinking, #ai-thinking-text in the DOM.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initLoader() {

  /* ── AI thinking banner ─────────────────────────────────── */
  const AI_THINKING_STEPS = [
    'Analyzing your audience...',
    'Designing conversion strategy...',
    'Crafting the lead magnet...',
    'Writing high-converting copy...',
    'Building your email sequence...',
    'Optimizing for conversions...',
    'Finalizing your content outline...',
    'Polishing the call to action...',
  ];

  let thinkingInterval = null;
  let thinkingIdx      = 0;

  function startThinking() {
    const banner = document.getElementById('ai-thinking');
    const textEl = document.getElementById('ai-thinking-text');
    if (!banner || !textEl) return;

    thinkingIdx        = 0;
    textEl.textContent = AI_THINKING_STEPS[0];
    banner.classList.add('visible');

    thinkingInterval = setInterval(() => {
      thinkingIdx = (thinkingIdx + 1) % AI_THINKING_STEPS.length;
      textEl.classList.add('fade-out');
      setTimeout(() => {
        textEl.textContent = AI_THINKING_STEPS[thinkingIdx];
        textEl.classList.remove('fade-out');
      }, 260);
    }, 1100);
  }

  function stopThinking() {
    clearInterval(thinkingInterval);
    const banner = document.getElementById('ai-thinking');
    if (banner) banner.classList.remove('visible');
  }

  /* ── Step progress ──────────────────────────────────────── */
  const LOADER_STEPS = [
    { id: 'step-1', msg: 'Parsing business profile...' },
    { id: 'step-2', msg: 'Generating magnet strategy...' },
    { id: 'step-3', msg: 'Crafting conversion copy...' },
    { id: 'step-4', msg: 'Finalizing output...' },
  ];

  let loaderInterval = null;

  function activateStep(idx) {
    const step    = LOADER_STEPS[idx];
    const el      = document.getElementById(step.id);
    const loaderSub = document.getElementById('loader-sub');
    el.classList.add('active');
    if (loaderSub) loaderSub.textContent = step.msg;
  }

  function startLoaderSteps() {
    let idx = 0;
    LOADER_STEPS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) el.classList.remove('active', 'done');
    });
    activateStep(0);

    loaderInterval = setInterval(() => {
      const prev = document.getElementById(LOADER_STEPS[idx]?.id);
      if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
      idx++;
      if (idx < LOADER_STEPS.length) activateStep(idx);
      else clearInterval(loaderInterval);
    }, 1900);
  }

  function stopLoaderSteps() {
    clearInterval(loaderInterval);
    LOADER_STEPS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) { el.classList.remove('active'); el.classList.add('done'); }
    });
  }

  /* ── Show / hide loader ─────────────────────────────────── */
  function showLoader() {
    const loaderSection  = document.getElementById('loader-section');
    const resultsSection = document.getElementById('results-section');
    const inputSection   = document.getElementById('input-section');

    loaderSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    inputSection.style.opacity       = '0.38';
    inputSection.style.pointerEvents = 'none';
    inputSection.style.transition    = 'opacity 0.45s';
    loaderSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    startThinking();
  }

  function hideLoader() {
    const loaderSection = document.getElementById('loader-section');
    const inputSection  = document.getElementById('input-section');

    loaderSection.classList.add('hidden');
    inputSection.style.opacity       = '1';
    inputSection.style.pointerEvents = 'auto';
    stopThinking();
  }

  /* ── Expose ─────────────────────────────────────────────── */
  window.showLoader      = showLoader;
  window.hideLoader      = hideLoader;
  window.startLoaderSteps = startLoaderSteps;
  window.stopLoaderSteps  = stopLoaderSteps;

})();