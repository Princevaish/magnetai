/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/api.js
   All fetch calls. Each function throws on non-2xx so callers
   can catch and show the error via showToast().
   Depends on: js/config.js  (ENDPOINTS must be in scope)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Shared fetch helper ──────────────────────────────────── */
async function _post(url, payload) {
  const response = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const detail  = errData.detail;
    throw new Error(
      Array.isArray(detail)
        ? detail.map(e => `${e.loc?.join('.')} — ${e.msg}`).join(' | ')
        : detail || `Server error ${response.status}`
    );
  }

  return response.json();
}

/* ── Feature API calls ────────────────────────────────────── */

async function generateLeadMagnet(payload) {
  return _post(ENDPOINTS.leadMagnet, payload);
}

async function generatePoster(payload) {
  return _post(ENDPOINTS.poster, payload);
}

async function generateCampaign(payload) {
  return _post(ENDPOINTS.campaign, payload);
}

async function generateLandingPage(payload) {
  return _post(ENDPOINTS.landingPage, payload);
}