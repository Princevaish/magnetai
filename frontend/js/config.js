/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/config.js
   Central config: API base URL and all endpoint paths.
   Import this wherever you need a URL — never hardcode elsewhere.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const API_BASE = 'http://127.0.0.1:8000';

const ENDPOINTS = {
  leadMagnet:   `${API_BASE}/generate`,
  poster:       `${API_BASE}/generate-poster`,
  campaign:     `${API_BASE}/generate-campaign`,
  landingPage:  `${API_BASE}/generate-landing-page`,
};