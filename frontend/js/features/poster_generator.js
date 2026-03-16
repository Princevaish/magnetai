/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/features/poster_generator.js
   Poster Generator — controls, API call, preview, PNG download.
   Depends on: config.js · api.js · state.js · ui/toast.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initPosterGenerator() {

  /* ── DOM refs ───────────────────────────────────────────── */
  const posterPreviewWrap = document.getElementById('poster-preview-wrap');
  const posterCanvas      = document.getElementById('poster-canvas');
  const posterHeadlineEl  = document.getElementById('poster-headline');
  const posterSubtextEl   = document.getElementById('poster-subtext');
  const posterCtaEl       = document.getElementById('poster-cta');
  const generatePosterBtn = document.getElementById('generate-poster-btn');
  const posterDownloadBtn = document.getElementById('poster-download-btn');
  const posterTemplateEl  = document.getElementById('poster-template');
  const posterSizeEl      = document.getElementById('poster-size');

  const POSTER_TEMPLATES = ['startup_neon','minimal_white','gradient_dark','bold_impact','corporate_clean'];

  /* ── Helpers ────────────────────────────────────────────── */
  function sanitizeField(text, maxLength) {
    if (!text) return '';
    const trimmed = String(text).trim();
    if (trimmed.length <= maxLength) return trimmed;
    const hard = trimmed.slice(0, maxLength);
    const lastSpace = hard.lastIndexOf(' ');
    return lastSpace > maxLength * 0.6 ? hard.slice(0, lastSpace) : hard;
  }

  function applyPosterSize(sizeStr) {
    const [w, h] = sizeStr.split('x').map(Number);
    if (!w || !h) return;
    const scale = 360 / w;
    posterCanvas.style.width     = `${w}px`;
    posterCanvas.style.height    = `${h}px`;
    posterCanvas.style.transform = `scale(${scale})`;
    const stage = posterCanvas.closest('.poster-stage');
    if (stage) stage.style.height = `${Math.round(h * scale)}px`;
  }

  function renderPoster(data) {
    state.poster = data;
    posterHeadlineEl.textContent = data.headline || '';
    posterSubtextEl.textContent  = data.subtext   || '';
    posterCtaEl.textContent      = data.cta        || '';
    POSTER_TEMPLATES.forEach(t => posterCanvas.classList.remove(t));
    const tpl = data.template || 'startup_neon';
    if (POSTER_TEMPLATES.includes(tpl)) posterCanvas.classList.add(tpl);
    applyPosterSize(data.poster_size || '1080x1080');
  }

  function showPosterPreview() {
    posterPreviewWrap.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => posterPreviewWrap.classList.add('visible')));
    setTimeout(() => posterPreviewWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250);
  }

  /* ── Generate ───────────────────────────────────────────── */
  async function handleGeneratePoster() {
    if (!state.leadMagnet) { showToast('Generate a lead magnet first'); return; }

    const btnLabel = generatePosterBtn.querySelector('.btn-label');
    generatePosterBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Generating…';

    try {
      const rawHeadline    = sanitizeField(state.leadMagnet.headline,    200);
      const rawDescription = sanitizeField(state.leadMagnet.description, 500);
      const rawCta         = sanitizeField(state.leadMagnet.cta,         100);

      if (rawHeadline.length < 4)    { showToast('Headline too short — regenerate first'); return; }
      if (rawDescription.length < 4) { showToast('Description too short — regenerate first'); return; }
      if (rawCta.length < 2)         { showToast('CTA too short — regenerate first'); return; }

      const payload = {
        headline:    rawHeadline,
        description: rawDescription,
        cta:         rawCta,
        template:    posterTemplateEl?.value || 'startup_neon',
        poster_size: posterSizeEl?.value     || '1080x1080',
      };

      const posterData = await generatePoster(payload);
      renderPoster(posterData);
      showPosterPreview();
      showToast('Poster generated ✦');

      /* Reveal campaign section */
      document.getElementById('campaign-section')?.classList.remove('hidden');

    } catch (err) {
      showToast(`Poster error: ${err.message}`);
      console.error('[MagnetAI poster]', err);
    } finally {
      generatePosterBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Generate Poster';
    }
  }

  /* ── Download PNG ───────────────────────────────────────── */
  async function handleDownloadPoster() {
    if (!posterCanvas) return;
    const btnLabel = posterDownloadBtn.querySelector('.btn-label');
    posterDownloadBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Exporting…';

    const host  = document.createElement('div');
    host.style.cssText = [
      'position:fixed','top:0','left:0',
      `width:${posterCanvas.style.width}`,
      `height:${posterCanvas.style.height}`,
      'overflow:hidden','pointer-events:none','opacity:0','z-index:-1',
    ].join(';');

    const clone = posterCanvas.cloneNode(true);
    clone.style.transform       = 'none';
    clone.style.transformOrigin = 'top left';
    host.appendChild(clone);
    document.body.appendChild(host);

    try {
      const canvas = await html2canvas(clone, {
        useCORS: true, allowTaint: true, backgroundColor: null, scale: 2, logging: false,
        width:  parseInt(posterCanvas.style.width)  || 1080,
        height: parseInt(posterCanvas.style.height) || 1080,
      });
      const link = Object.assign(document.createElement('a'), {
        download: 'magnetai_poster.png',
        href:     canvas.toDataURL('image/png'),
        style:    'display:none',
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Poster downloaded ✦');
    } catch (err) {
      showToast(`Download failed: ${err.message}`);
      console.error('[MagnetAI poster download]', err);
    } finally {
      document.body.removeChild(host);
      posterDownloadBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Download PNG';
    }
  }

  /* ── Event listeners ────────────────────────────────────── */
  if (generatePosterBtn) generatePosterBtn.addEventListener('click', handleGeneratePoster);
  if (posterDownloadBtn) posterDownloadBtn.addEventListener('click', handleDownloadPoster);

  if (posterTemplateEl) {
    posterTemplateEl.addEventListener('change', () => {
      const t = posterTemplateEl.value;
      POSTER_TEMPLATES.forEach(x => posterCanvas.classList.remove(x));
      if (POSTER_TEMPLATES.includes(t)) posterCanvas.classList.add(t);
    });
  }

})();