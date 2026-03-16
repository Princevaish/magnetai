/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/features/lead_magnet.js
   Lead Magnet Generator — form, API call, render, export.
   Depends on: config.js · api.js · state.js
               ui/toast.js · ui/loader.js · ui/cards.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initLeadMagnet() {

  /* ── DOM refs ───────────────────────────────────────────── */
  const generateBtn    = document.getElementById('generate-btn');
  const regenerateBtn  = document.getElementById('regenerate-btn');
  const inputSection   = document.getElementById('input-section');
  const resultsSection = document.getElementById('results-section');
  const resultsGrid    = document.getElementById('results-grid');

  const fields = {
    business: document.getElementById('business'),
    industry: document.getElementById('industry'),
    audience: document.getElementById('audience'),
    goal:     document.getElementById('goal'),
    tone:     document.getElementById('tone'),
  };

  /* ── Card config ────────────────────────────────────────── */
  const CARD_CONFIG = [
    { key: 'lead_magnet',    label: 'Lead Magnet Idea',        icon: '⬡', cls: 'card-magnet'  },
    { key: 'headline',       label: 'Landing Page Headline',    icon: '✦', cls: 'card-headline' },
    { key: 'description',    label: 'Description',              icon: '◈', cls: 'card-desc'    },
    { key: 'cta',            label: 'Call To Action',           icon: '⚡', cls: 'card-cta'     },
    { key: 'email_template', label: 'Email Follow-Up Template', icon: '✉', cls: 'card-email'   },
    { key: 'content_outline',label: 'Content Outline',          icon: '◉', cls: 'card-outline' },
  ];

  /* ── Form validation ────────────────────────────────────── */
  function getFormData() {
    const data  = {};
    let   valid = true;
    for (const [key, el] of Object.entries(fields)) {
      const val = el.value.trim();
      if (!val) {
        el.style.borderColor = 'rgba(244, 114, 182, 0.65)';
        el.style.boxShadow   = '0 0 0 3px rgba(244, 114, 182, 0.12)';
        valid = false;
      } else {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
        data[key] = val;
      }
    }
    return valid ? data : null;
  }

  /* ── Render results ─────────────────────────────────────── */
  function showResults() {
    resultsSection.classList.remove('hidden');
    const exportWrap = document.getElementById('export-wrap');
    if (exportWrap) {
      exportWrap.style.opacity       = '0';
      exportWrap.style.transform     = 'translateY(16px)';
      exportWrap.style.pointerEvents = 'none';
      setTimeout(() => {
        exportWrap.style.opacity       = '1';
        exportWrap.style.transform     = 'translateY(0)';
        exportWrap.style.pointerEvents = 'auto';
      }, 700);
    }
    setTimeout(() => resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  function renderResults(data) {
    state.leadMagnet  = data;
    resultsGrid.innerHTML = '';
    CARD_CONFIG.forEach(cfg => {
      resultsGrid.appendChild(buildCard(cfg, data[cfg.key] || 'No data returned.'));
    });
    if (window.MagnetAI?.animateCards) window.MagnetAI.animateCards();

    /* Reveal downstream sections */
    document.getElementById('poster-section')?.classList.remove('hidden');
    document.getElementById('campaign-section')?.classList.remove('hidden');
    document.getElementById('landing-page-section')?.classList.remove('hidden');
  }

  /* ── Export ─────────────────────────────────────────────── */
  function exportLeadMagnet() {
    const data = state.leadMagnet;
    if (!data) { showToast('Generate a lead magnet first'); return; }

    const divider = '─'.repeat(60);
    const now     = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const lines   = [
      'MAGNETAI — LEAD MAGNET STRATEGY', '='.repeat(60), `Generated: ${now}`, '',
      divider, 'LEAD MAGNET IDEA',        divider, data.lead_magnet     || '', '',
      divider, 'LANDING PAGE HEADLINE',   divider, data.headline        || '', '',
      divider, 'DESCRIPTION',             divider, data.description     || '', '',
      divider, 'CALL TO ACTION',          divider, data.cta             || '', '',
      divider, 'EMAIL FOLLOW-UP TEMPLATE',divider, data.email_template  || '', '',
      divider, 'CONTENT OUTLINE',         divider, data.content_outline || '', '',
      divider, 'Powered by MagnetAI',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: 'lead-magnet.txt', style: 'display:none' });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Lead magnet exported ✦');
  }

  /* ── Generate handler ───────────────────────────────────── */
  async function handleGenerate() {
    const data = getFormData();
    if (!data) { showToast('Please fill in all fields'); return; }

    generateBtn.disabled = true;
    showLoader();
    startLoaderSteps();

    try {
      const result = await generateLeadMagnet(data);
      stopLoaderSteps();
      await new Promise(r => setTimeout(r, 400));
      hideLoader();
      renderResults(result);
      showResults();
      showToast('Lead magnet generated ✦');
    } catch (err) {
      stopLoaderSteps();
      hideLoader();
      showToast(`Error: ${err.message}`);
      console.error('[MagnetAI]', err);
    } finally {
      generateBtn.disabled = false;
    }
  }

  /* ── Event listeners ────────────────────────────────────── */
  generateBtn.addEventListener('click', handleGenerate);

  regenerateBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    const exportWrap = document.getElementById('export-wrap');
    if (exportWrap) {
      exportWrap.style.opacity       = '0';
      exportWrap.style.transform     = 'translateY(16px)';
      exportWrap.style.pointerEvents = 'none';
    }
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    inputSection.style.opacity       = '1';
    inputSection.style.pointerEvents = 'auto';
  });

  Object.values(fields).forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') handleGenerate(); });
    el.addEventListener('input',   () => { el.style.borderColor = ''; el.style.boxShadow = ''; });
  });

  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportLeadMagnet();
      exportBtn.style.transform = 'scale(0.97)';
      setTimeout(() => { exportBtn.style.transform = ''; }, 200);
    });
  }

})();