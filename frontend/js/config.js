/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/config.js
   Central config: API base URL and all endpoint paths.
   Import this wherever you need a URL — never hardcode elsewhere.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const API_BASE = 'https://magnetai.onrender.com';

const ENDPOINTS = {
  leadMagnet:   `${API_BASE}/generate`,
  poster:       `${API_BASE}/generate-poster`,
  campaign:     `${API_BASE}/generate-campaign`,
  landingPage:  `${API_BASE}/generate-landing-page`,
};