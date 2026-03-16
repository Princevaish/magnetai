/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/features/landing_page_generator.js
   Landing Page Generator — controls, API call, preview, HTML download.
   Depends on: config.js · api.js · state.js · ui/toast.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initLandingPageGenerator() {

  /* ── DOM refs ───────────────────────────────────────────── */
  const generateLPBtn    = document.getElementById('generate-lp-btn');
  const lpThemeEl        = document.getElementById('lp-theme');
  const lpPreviewWrap    = document.getElementById('lp-preview-wrap');
  const lpDownloadBtn    = document.getElementById('lp-download-btn');

  /* Preview slots */
  const lpHeroTitle      = document.getElementById('lp-hero-title');
  const lpHeroSubtitle   = document.getElementById('lp-hero-subtitle');
  const lpCtaText        = document.getElementById('lp-cta-text');
  const lpBenefitsList   = document.getElementById('lp-benefits-list');
  const lpTestimonials   = document.getElementById('lp-testimonials-list');
  const lpFaqList        = document.getElementById('lp-faq-list');
  const lpFooterText     = document.getElementById('lp-footer-text');

  /* ── Sanitize helper ────────────────────────────────────── */
  function sanitizeField(text, maxLength) {
    if (!text) return '';
    const trimmed = String(text).trim();
    if (trimmed.length <= maxLength) return trimmed;
    const hard = trimmed.slice(0, maxLength);
    const lastSpace = hard.lastIndexOf(' ');
    return lastSpace > maxLength * 0.6 ? hard.slice(0, lastSpace) : hard;
  }

  /* ── Render preview ─────────────────────────────────────── */
  function renderPreview(data) {
    state.landingPage = data;

    if (lpHeroTitle)    lpHeroTitle.textContent    = data.hero_title    || '';
    if (lpHeroSubtitle) lpHeroSubtitle.textContent = data.hero_subtitle || '';
    if (lpCtaText)      lpCtaText.textContent      = data.cta_text      || '';
    if (lpFooterText)   lpFooterText.textContent   = data.footer_text   || '';

    /* Benefits */
    if (lpBenefitsList) {
      lpBenefitsList.innerHTML = '';
      (data.benefits || []).forEach(b => {
        const li = document.createElement('li');
        li.className   = 'lp-benefit-item';
        li.textContent = b;
        lpBenefitsList.appendChild(li);
      });
    }

    /* Testimonials */
    if (lpTestimonials) {
      lpTestimonials.innerHTML = '';
      (data.testimonials || []).forEach(t => {
        const li = document.createElement('li');
        li.className   = 'lp-testimonial-item';
        li.textContent = t;
        lpTestimonials.appendChild(li);
      });
    }

    /* FAQ */
    if (lpFaqList) {
      lpFaqList.innerHTML = '';
      (data.faq || []).forEach(item => {
        const div = document.createElement('div');
        div.className = 'lp-faq-item';
        div.innerHTML = `
          <p class="lp-faq-q">${escapeHtml(item.question)}</p>
          <p class="lp-faq-a">${escapeHtml(item.answer)}</p>
        `;
        lpFaqList.appendChild(div);
      });
    }

    /* Apply theme class to preview wrapper */
    if (lpPreviewWrap) {
      ['startup_neon','minimal_white','corporate_clean','gradient_dark','bold_startup'].forEach(t =>
        lpPreviewWrap.classList.remove(`lp-theme-${t}`)
      );
      lpPreviewWrap.classList.add(`lp-theme-${data.theme || 'startup_neon'}`);
    }
  }

  /* ── Show preview ───────────────────────────────────────── */
  function showLPPreview() {
    if (!lpPreviewWrap) return;
    lpPreviewWrap.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => lpPreviewWrap.classList.add('lp-preview-visible')));
    setTimeout(() => lpPreviewWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 250);
  }

  /* ── Build downloadable HTML ────────────────────────────── */
  function buildLandingPageHTML(data) {
    const theme   = data.theme || 'startup_neon';
    const benefits = (data.benefits || []).map(b => `<li>${b}</li>`).join('\n');
    const testimonials = (data.testimonials || []).map(t => `<blockquote>${t}</blockquote>`).join('\n');
    const faqs = (data.faq || []).map(f => `
      <div class="faq-item">
        <p class="faq-q">${f.question}</p>
        <p class="faq-a">${f.answer}</p>
      </div>`).join('\n');

    /* Theme CSS variables */
    const THEME_VARS = {
      startup_neon:    '--bg:#03030a;--text:#ede8ff;--accent:#00f0ff;--btn-bg:linear-gradient(135deg,#00f0ff,#9b6dff);--btn-text:#03030a;',
      minimal_white:   '--bg:#f8f8fb;--text:#0f0f1a;--accent:#9b6dff;--btn-bg:#0f0f1a;--btn-text:#f8f8fb;',
      corporate_clean: '--bg:#ffffff;--text:#1a1a2e;--accent:#0056b3;--btn-bg:#0056b3;--btn-text:#ffffff;',
      gradient_dark:   '--bg:linear-gradient(160deg,#050c1f,#0d1b3e);--text:#e8e0ff;--accent:#c8a84b;--btn-bg:linear-gradient(135deg,#c8a84b,#f0d060);--btn-text:#050c1f;',
      bold_startup:    '--bg:linear-gradient(135deg,#6b23c8,#e040a0,#ff8c38);--text:#fff;--accent:#fff;--btn-bg:rgba(255,255,255,0.95);--btn-text:#6b23c8;',
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.hero_title || 'Landing Page'} — MagnetAI</title>
  <style>
    :root { ${THEME_VARS[theme] || THEME_VARS.startup_neon} }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: Inter, system-ui, sans-serif; line-height: 1.65; }
    .container { max-width: 860px; margin: 0 auto; padding: 0 28px; }

    /* Hero */
    .hero { padding: 100px 28px 80px; text-align: center; }
    .hero h1 { font-size: clamp(2rem, 5vw, 3.6rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 24px; color: var(--accent); }
    .hero p  { font-size: 1.1rem; opacity: 0.76; max-width: 580px; margin: 0 auto 40px; }
    .cta-btn { display: inline-block; padding: 18px 48px; border-radius: 12px; background: var(--btn-bg); color: var(--btn-text); font-weight: 700; font-size: 1rem; text-decoration: none; letter-spacing: 0.04em; }

    /* Sections */
    section { padding: 72px 28px; }
    h2 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 36px; color: var(--accent); }

    /* Benefits */
    .benefits ul { list-style: none; display: flex; flex-direction: column; gap: 16px; }
    .benefits li { padding: 20px 24px; border: 1px solid rgba(128,128,128,0.2); border-radius: 12px; }
    .benefits li::before { content: '✦ '; color: var(--accent); }

    /* Testimonials */
    .testimonials { display: flex; flex-direction: column; gap: 20px; }
    blockquote { padding: 24px; border-left: 3px solid var(--accent); opacity: 0.84; font-style: italic; }

    /* FAQ */
    .faq-item { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid rgba(128,128,128,0.15); }
    .faq-q { font-weight: 700; margin-bottom: 8px; }
    .faq-a { opacity: 0.72; }

    /* Footer */
    footer { text-align: center; padding: 48px 28px; opacity: 0.55; font-size: 0.85rem; border-top: 1px solid rgba(128,128,128,0.15); }

    @media (max-width: 600px) { .hero { padding: 72px 20px 56px; } section { padding: 48px 20px; } }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <h1>${data.hero_title || ''}</h1>
      <p>${data.hero_subtitle || ''}</p>
      <a href="#" class="cta-btn">${data.cta_text || 'Get Started'}</a>
    </div>
  </section>

  <section class="benefits">
    <div class="container">
      <h2>Why It Works</h2>
      <ul>${benefits}</ul>
    </div>
  </section>

  <section>
    <div class="container">
      <h2>What People Are Saying</h2>
      <div class="testimonials">${testimonials}</div>
    </div>
  </section>

  <section>
    <div class="container">
      <h2>Frequently Asked Questions</h2>
      ${faqs}
    </div>
  </section>

  <footer>
    <div class="container">
      <p>${data.footer_text || 'Powered by MagnetAI'}</p>
    </div>
  </footer>
</body>
</html>`;
  }

  /* ── Download HTML ──────────────────────────────────────── */
  function handleDownloadLP() {
    const data = state.landingPage;
    if (!data) { showToast('Generate a landing page first'); return; }
    const html = buildLandingPageHTML(data);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: 'landing_page.html', style: 'display:none' });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Landing page downloaded ✦');
  }

  /* ── Generate handler ───────────────────────────────────── */
  async function handleGenerateLandingPage() {
    if (!state.leadMagnet) { showToast('Generate a lead magnet first'); return; }

    const btnLabel = generateLPBtn?.querySelector('.btn-label');
    if (generateLPBtn) generateLPBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Generating…';

    try {
      const audienceEl = document.getElementById('audience');
      const toneEl     = document.getElementById('tone');

      const payload = {
        headline:    sanitizeField(state.leadMagnet.headline,    200),
        description: sanitizeField(state.leadMagnet.description, 500),
        cta:         sanitizeField(state.leadMagnet.cta,         100),
        audience:    audienceEl?.value.trim() || 'General audience',
        tone:        toneEl?.value.trim()     || 'Professional and authoritative',
        theme:       lpThemeEl?.value         || 'startup_neon',
      };

      const lpData = await generateLandingPage(payload);
      renderPreview(lpData);
      showLPPreview();
      showToast('Landing page generated ✦');

    } catch (err) {
      showToast(`Landing page error: ${err.message}`);
      console.error('[MagnetAI landing page]', err);
    } finally {
      if (generateLPBtn) generateLPBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Generate Landing Page';
    }
  }

  /* ── Event listeners ────────────────────────────────────── */
  if (generateLPBtn) {
    generateLPBtn.addEventListener('click', handleGenerateLandingPage);
    console.log('[MagnetAI] Landing page button bound ✓');
  }
  if (lpDownloadBtn) {
    lpDownloadBtn.addEventListener('click', handleDownloadLP);
  }

})();