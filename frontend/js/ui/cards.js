/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/ui/cards.js
   Builds result cards, handles copy-to-clipboard.
   Depends on: showToast() from toast.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initCards() {

  /* ── escapeHtml ─────────────────────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ── Copy to clipboard ──────────────────────────────────── */
  async function handleCopy(btn, text) {
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied', 'copy-flash');
      btn.innerHTML = '<span aria-hidden="true">✓</span> Copied!';
      showToast('Copied to clipboard');
      setTimeout(() => btn.classList.remove('copy-flash'), 600);
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<span aria-hidden="true">⎘</span> Copy';
      }, 1500);
    } catch {
      showToast('Copy failed — select text manually');
    }
  }

  /* ── Build a single result card ─────────────────────────── */
  function buildCard(cfg, value) {
    const card        = document.createElement('div');
    card.className    = `result-card ${cfg.cls}`;
    card.innerHTML    = `
      <div class="card-header">
        <div class="card-tag-wrap">
          <span class="card-icon">${cfg.icon}</span>
          <span class="card-tag">${cfg.label}</span>
        </div>
        <button class="copy-btn" aria-label="Copy ${cfg.label}">
          <span>⎘</span> Copy
        </button>
      </div>
      <div class="card-body">${escapeHtml(value)}</div>
    `;
    card.querySelector('.copy-btn').addEventListener('click', function () {
      handleCopy(this, value);
    });
    return card;
  }

  /* ── Expose ─────────────────────────────────────────────── */
  window.buildCard  = buildCard;
  window.escapeHtml = escapeHtml;
  window.handleCopy = handleCopy;

})();