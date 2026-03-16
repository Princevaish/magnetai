/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/state.js
   Single source of truth for all generated content.
   Modules read/write via the exported `state` object.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const state = {
  leadMagnet:  null,   /* LeadMagnetResponse — set after /generate        */
  poster:      null,   /* PosterResponse     — set after /generate-poster  */
  campaign:    null,   /* CampaignResponse   — set after /generate-campaign*/
  landingPage: null,   /* LandingPageResponse— set after /generate-landing-page */
};