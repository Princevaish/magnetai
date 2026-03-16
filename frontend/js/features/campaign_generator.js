/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/features/campaign_generator.js
   Social Media Campaign Generator — API call, render, copy.
   Depends on: config.js · api.js · state.js
               ui/toast.js · ui/cards.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initCampaignGenerator() {

  /* ── Card config ────────────────────────────────────────── */
  const CAMPAIGN_CARD_CONFIG = [
    { key: 'linkedin_post',     label: 'LinkedIn Post',      icon: '◈', cls: 'card-magnet'  },
    { key: 'twitter_thread',    label: 'Twitter / X Thread', icon: '✦', cls: 'card-headline' },
    { key: 'instagram_caption', label: 'Instagram Caption',  icon: '⬡', cls: 'card-desc'    },
    { key: 'email_newsletter',  label: 'Email Newsletter',   icon: '✉', cls: 'card-email'   },
    { key: 'cta_variations',    label: 'CTA Variations',     icon: '⚡', cls: 'card-cta'     },
  ];

  /* ── Format complex fields into display strings ─────────── */
  function formatCampaignField(key, value) {
    if (key === 'twitter_thread' && Array.isArray(value)) {
      return value.map((tweet, i) => `${i + 1}. ${tweet}`).join('\n\n');
    }
    if (key === 'email_newsletter' && value && typeof value === 'object') {
      return `Subject: ${value.subject || ''}\n\n${value.body || ''}`;
    }
    if (key === 'cta_variations' && Array.isArray(value)) {
      return value.map(cta => `• ${cta}`).join('\n\n');
    }
    return String(value || 'No data returned.');
  }

  /* ── Sanitize helper (same as lead magnet) ──────────────── */
  function sanitizeField(text, maxLength) {
    if (!text) return '';
    const trimmed = String(text).trim();
    if (trimmed.length <= maxLength) return trimmed;
    const hard = trimmed.slice(0, maxLength);
    const lastSpace = hard.lastIndexOf(' ');
    return lastSpace > maxLength * 0.6 ? hard.slice(0, lastSpace) : hard;
  }

  /* ── Render campaign results ────────────────────────────── */
  function renderCampaignResults(data) {
    state.campaign = data;
    const grid = document.getElementById('campaign-results-grid');
    if (!grid) return;
    grid.innerHTML = '';

    CAMPAIGN_CARD_CONFIG.forEach(cfg => {
      const displayText = formatCampaignField(cfg.key, data[cfg.key]);
      const card = document.createElement('div');
      card.className = `result-card ${cfg.cls}`;
      card.innerHTML = `
        <div class="card-header">
          <div class="card-tag-wrap">
            <span class="card-icon">${cfg.icon}</span>
            <span class="card-tag">${cfg.label}</span>
          </div>
          <button class="copy-btn" aria-label="Copy ${cfg.label}">
            <span>⎘</span> Copy
          </button>
        </div>
        <div class="card-body">${escapeHtml(displayText)}</div>
      `;
      card.querySelector('.copy-btn').addEventListener('click', function () {
        handleCopy(this, displayText);
      });
      grid.appendChild(card);
    });

    /* Reveal results wrapper */
    const wrap = document.getElementById('campaign-results-wrap');
    if (wrap) {
      wrap.classList.remove('hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('campaign-results-visible')));
    }

    if (window.MagnetAI?.animateCards) window.MagnetAI.animateCards();
    setTimeout(() => wrap?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }

  /* ── Generate handler ───────────────────────────────────── */
  async function handleGenerateCampaign() {
    if (!state.leadMagnet) { showToast('Generate a lead magnet first'); return; }

    const campaignBtn = document.getElementById('generate-campaign-btn');
    if (!campaignBtn) return;

    const btnLabel = campaignBtn.querySelector('.btn-label');

    /* Read audience/tone directly from the form fields */
    const audienceEl = document.getElementById('audience');
    const toneEl     = document.getElementById('tone');
    const audience   = audienceEl?.value.trim() || '';
    const tone       = toneEl?.value.trim()     || '';

    if (!audience) { showToast('Audience field is empty — please fill the form first'); return; }
    if (!tone)     { showToast('Tone field is empty — please select a tone first');     return; }

    campaignBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Generating…';

    try {
      const payload = {
        headline:    sanitizeField(state.leadMagnet.headline,    200),
        description: sanitizeField(state.leadMagnet.description, 500),
        cta:         sanitizeField(state.leadMagnet.cta,         100),
        audience,
        tone,
      };
      const campaignData = await generateCampaign(payload);
      renderCampaignResults(campaignData);
      showToast('Campaign generated ✦');
    } catch (err) {
      showToast(`Campaign error: ${err.message}`);
      console.error('[MagnetAI campaign]', err);
    } finally {
      campaignBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Generate Campaign';
    }
  }

  /* ── Bind button ────────────────────────────────────────── */
  const btn = document.getElementById('generate-campaign-btn');
  if (btn) {
    btn.addEventListener('click', handleGenerateCampaign);
    console.log('[MagnetAI] Campaign button bound ✓');
  } else {
    console.warn('[MagnetAI] #generate-campaign-btn not found');
  }

})();