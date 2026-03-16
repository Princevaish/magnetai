/* ═══════════════════════════════════════════════════════════════
   MagnetAI — animations.js  (v3 Premium)
   GSAP · ScrollTrigger · Letter Split · Counters · 3D Tilt
   Cursor Glow · Shimmer · Micro-interactions · Parallax
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initAnimations() {

  /* ── Guard: GSAP must be present ──────────────────────────── */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[MagnetAI] GSAP not found — retrying in 200ms');
    setTimeout(initAnimations, 200);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Shared eases ─────────────────────────────────────────── */
  const E_OUT  = 'power3.out';
  const E_EXPO = 'expo.out';
  const E_BACK = 'back.out(1.6)';
  const E_SINE = 'sine.inOut';


  /* ════════════════════════════════════════════════════════════
     1 · SMOOTH CURSOR GLOW
  ════════════════════════════════════════════════════════════ */
  const cursorEl = document.getElementById('cursor-glow');

  if (cursorEl && window.matchMedia('(pointer: fine)').matches) {
    let cx = innerWidth / 2, cy = innerHeight / 2;
    let tx = cx, ty = cy;

    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    (function lerpCursor() {
      cx += (tx - cx) * 0.085;
      cy += (ty - cy) * 0.085;
      cursorEl.style.left = cx + 'px';
      cursorEl.style.top  = cy + 'px';
      requestAnimationFrame(lerpCursor);
    })();

    /* Scale down near interactive elements */
    const interactiveEls = document.querySelectorAll('button, a, input, select, .copy-btn, .panel-badge');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () =>
        gsap.to(cursorEl, { width: 60, height: 60, opacity: 0.5, duration: 0.3, ease: E_OUT })
      );
      el.addEventListener('mouseleave', () =>
        gsap.to(cursorEl, { width: 320, height: 320, opacity: 1, duration: 0.5, ease: E_OUT })
      );
    });
  }


  /* ════════════════════════════════════════════════════════════
     2 · NAVBAR: entrance + scroll-state
  ════════════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');

  gsap.from(navbar, {
    yPercent: -110,
    opacity: 0,
    duration: 1.0,
    ease: E_EXPO,
    delay: 0.05,
  });

  ScrollTrigger.create({
    start: 'top -70px',
    onEnter:     () => navbar?.classList.add('scrolled'),
    onLeaveBack: () => navbar?.classList.remove('scrolled'),
  });


  /* ════════════════════════════════════════════════════════════
     3 · HERO: LETTER-BY-LETTER HEADING REVEAL
  ════════════════════════════════════════════════════════════ */
  const titleLines = document.querySelectorAll('.title-line[data-line]');

  /*
   * Split strategy: wrap the entire word in a `display:inline-block; white-space:nowrap`
   * container, then put .char spans inside it.
   * This ensures words NEVER break mid-character at any viewport width.
   */
  titleLines.forEach(line => {
    const raw = line.getAttribute('data-line') || '';
    const words = raw.split(' ');

    line.innerHTML = words.map(word =>
      `<span class="word" style="display:inline-block;white-space:nowrap;">${
        word.split('').map(ch =>
          `<span class="char">${ch}</span>`
        ).join('')
      }</span>`
    ).join('<span class="char-space" style="display:inline-block;width:0.28em;"> </span>');
  });

  /* Staggered reveal per line */
  const charTL = gsap.timeline({ delay: 0.2 });

  titleLines.forEach((line, li) => {
    const chars = line.querySelectorAll('.char');
    /* Reset starting state to match CSS (translateY 60%, rotateX -30deg) */
    gsap.set(chars, { opacity: 0, y: '60%', rotateX: -30 });

    charTL.to(
      chars,
      {
        opacity:  1,
        y:        0,
        rotateX:  0,
        duration: 0.72,
        stagger:  0.032,
        ease:     'back.out(1.8)',
      },
      li * 0.17
    );
  });

  /* Persistent glow pulse on last char of "Dominate." */
  charTL.add(() => {
    const lastChar = document.querySelector('.line-3 .char:last-child');
    if (lastChar) {
      gsap.to(lastChar, {
        filter: 'drop-shadow(0 0 26px #00f0ff) drop-shadow(0 0 48px rgba(0,240,255,0.4))',
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: E_SINE,
      });
    }
  });


  /* ════════════════════════════════════════════════════════════
     4 · HERO: SUPPORTING ELEMENTS FADE-UP
  ════════════════════════════════════════════════════════════ */
  /* Set starting positions */
  gsap.set(['#hero-sub', '#hero-metrics', '#hero-scroll-hint'], { y: 26 });

  const heroTL = gsap.timeline({ delay: 0.12 });
  heroTL
    .to('#hero-eyebrow',      { opacity: 1, y: 0, duration: 0.8, ease: E_OUT },      0)
    .to('#hero-sub',          { opacity: 1, y: 0, duration: 0.8, ease: E_OUT },      0.6)
    .to('#hero-metrics',      { opacity: 1, y: 0, duration: 0.75, ease: E_BACK },    0.82)
    .to('#hero-scroll-hint',  { opacity: 1, duration: 0.6, ease: E_OUT },           1.05)
    .add(initCounters, 1.0); /* counters fire after metrics appear */


  /* ════════════════════════════════════════════════════════════
     5 · ANIMATED COUNTERS (RAF-based, ease-out cubic)
  ════════════════════════════════════════════════════════════ */
  function initCounters() {
    const DURATION = 1550; /* ms */

    const counters = [
      { id: 'counter-magnets',    target: 12, suffix: 'k+', prefix: ''    },
      { id: 'counter-conversion', target: 94, suffix: '%',  prefix: ''    },
      { id: 'counter-speed',      target: 8,  suffix: 's',  prefix: '< '  },
    ];

    counters.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;

      const startTime = performance.now();

      (function tick(now) {
        const t  = Math.min((now - startTime) / DURATION, 1);
        const e  = 1 - Math.pow(1 - t, 3); /* ease-out cubic */
        const v  = Math.round(cfg.target * e);
        el.textContent = cfg.prefix + v + cfg.suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = cfg.prefix + cfg.target + cfg.suffix;
      })(performance.now());
    });
  }

  /* Also trigger on scroll for repeat visits */
  ScrollTrigger.create({
    trigger: '#hero-metrics',
    start: 'top 90%',
    once: true,
    onEnter: initCounters,
  });


  /* ════════════════════════════════════════════════════════════
     6 · SCROLL REVEAL — SECTION BLOCKS
  ════════════════════════════════════════════════════════════ */
  gsap.utils.toArray('.reveal-block').forEach(el => {
    gsap.to(el, {
      opacity:  1,
      y:        0,
      duration: 0.88,
      ease:     E_OUT,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* Form fields — cascade stagger tied to panel trigger */
  gsap.utils.toArray('.reveal-field').forEach((el, i) => {
    gsap.to(el, {
      opacity:  1,
      y:        0,
      duration: 0.68,
      ease:     E_OUT,
      delay:    i * 0.075,
      scrollTrigger: { trigger: '#input-panel', start: 'top 80%', once: true },
    });
  });


  /* ════════════════════════════════════════════════════════════
     7 · GENERATE BUTTON — IDLE BREATHE + CLICK RIPPLE
  ════════════════════════════════════════════════════════════ */
  const genBtn = document.getElementById('generate-btn');

  if (genBtn) {
    const breathe = gsap.to(genBtn, {
      scale:    1.018,
      duration: 2.4,
      repeat:   -1,
      yoyo:     true,
      ease:     E_SINE,
      paused:   true,
    });

    setTimeout(() => breathe.play(), 2200);

    genBtn.addEventListener('mouseenter', () => {
      breathe.pause();
      gsap.to(genBtn, { scale: 1, duration: 0.2 });
    });
    genBtn.addEventListener('mouseleave', () => setTimeout(() => breathe.play(), 500));
    genBtn.addEventListener('click', () => {
      breathe.pause();
      gsap.fromTo(genBtn,
        { scale: 0.96 },
        { scale: 1, duration: 0.45, ease: E_BACK }
      );
    });
  }


  /* ════════════════════════════════════════════════════════════
     8 · INPUT FIELD: FOCUS LIFT MICRO-INTERACTION
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.field-input').forEach(input => {
    const group = input.closest('.field-group');
    if (!group) return;

    input.addEventListener('focus', () =>
      gsap.to(group, { y: -2, scale: 1.01, duration: 0.3, ease: E_OUT })
    );
    input.addEventListener('blur', () =>
      gsap.to(group, { y: 0, scale: 1, duration: 0.3, ease: E_OUT })
    );
  });


  /* ════════════════════════════════════════════════════════════
     9 · GLASS PANEL 3D TILT (subtle — only on desktop)
  ════════════════════════════════════════════════════════════ */
  const inputPanel = document.getElementById('input-panel');

  if (inputPanel && window.matchMedia('(pointer: fine)').matches) {
    const MAX_ROT = 1.6;

    inputPanel.addEventListener('mousemove', e => {
      const r  = inputPanel.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      gsap.to(inputPanel, {
        rotateY:  dx *  MAX_ROT,
        rotateX:  dy * -MAX_ROT,
        duration: 0.5,
        ease:     E_OUT,
        transformPerspective: 1000,
      });
    });

    inputPanel.addEventListener('mouseleave', () =>
      gsap.to(inputPanel, { rotateX: 0, rotateY: 0, duration: 0.7, ease: E_EXPO })
    );
  }


  /* ════════════════════════════════════════════════════════════
     10 · RESULT CARDS: STAGGER + PER-CARD 3D TILT
         Exposed via window.MagnetAI.animateCards()
  ════════════════════════════════════════════════════════════ */
  function animateCards() {
    requestAnimationFrame(() => {
      const cards = document.querySelectorAll('.result-card');

      /* Reset */
      gsap.set(cards, { opacity: 0, y: 40, scale: 0.95, rotateX: 0, rotateY: 0 });

      /* Stagger entrance */
      gsap.to(cards, {
        opacity:  1,
        y:        0,
        scale:    1,
        duration: 0.65,
        stagger:  0.1,
        ease:     E_BACK,
        delay:    0.12,
      });

      /* Per-card 3D tilt on mouse */
      if (window.matchMedia('(pointer: fine)').matches) {
        cards.forEach(card => {
          card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const dx = (e.clientX - r.left) / r.width  - 0.5;
            const dy = (e.clientY - r.top)  / r.height - 0.5;
            gsap.to(card, {
              rotateX: -dy * 6,
              rotateY:  dx * 6,
              duration: 0.35,
              ease:     E_OUT,
              transformPerspective: 700,
            });
          });
          card.addEventListener('mouseleave', () =>
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.55, ease: E_EXPO })
          );
        });
      }
    });
  }


  /* ════════════════════════════════════════════════════════════
     11 · RESULTS SECTION REVEAL
  ════════════════════════════════════════════════════════════ */
  ScrollTrigger.create({
    trigger: '#results-section',
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.from('.results-title', { opacity: 0, y: 22, duration: 0.75, ease: E_OUT });
      gsap.from('.regenerate-btn', { opacity: 0, x: 14, duration: 0.65, ease: E_OUT, delay: 0.15 });
    },
  });


  /* ════════════════════════════════════════════════════════════
     12 · SPLINE PARALLAX (hero scene drifts up on scroll)
  ════════════════════════════════════════════════════════════ */
  const splineWrap = document.querySelector('.spline-wrap');
  if (splineWrap) {
    gsap.to(splineWrap, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start:   'top top',
        end:     'bottom top',
        scrub:   1.8,
      },
    });
  }


  /* ════════════════════════════════════════════════════════════
     13 · FOOTER REVEAL
  ════════════════════════════════════════════════════════════ */
  gsap.from('.footer', {
    opacity:  0,
    y:        20,
    duration: 0.8,
    ease:     E_OUT,
    scrollTrigger: { trigger: '.footer', start: 'top 96%', once: true },
  });


  /* ════════════════════════════════════════════════════════════
     14 · SECTION LABELS FADE-IN FROM LEFT
  ════════════════════════════════════════════════════════════ */
  gsap.utils.toArray('.section-label').forEach(label => {
    gsap.from(label, {
      opacity:  0,
      x:        -18,
      duration: 0.65,
      ease:     E_OUT,
      scrollTrigger: { trigger: label, start: 'top 90%', once: true },
    });
  });


  /* ════════════════════════════════════════════════════════════
     15 · AUTH SCREEN ANIMATIONS
         MutationObserver fires when Clerk reveals #auth-container
         (removes .hidden class). Then runs:
           a. Auth card slide-up + fade-in
           b. Brand icon glow burst
           c. Brand name slide
           d. Tagline fade — Clerk host div is intentionally
              excluded from the stagger (see guard notes below)

         ✦ OTP-SAFE DESIGN
         ─────────────────
         Clerk emits user=null during OTP verification, which makes
         script.js call showAuth() → auth-container removes .hidden.
         The MutationObserver fires again. We must NOT re-run the
         entrance animation in this case because:

           1. #clerk-sign-in already has the OTP card mounted in it.
              Running gsap.fromTo([..., clerkSignIn], {opacity:0}…)
              sets the host div to opacity:0 — the OTP card goes
              invisible for the ~700ms tween duration. This was
              the exact cause of Problem 1.

           2. .auth-inner is already visible with its idle breathe
              running. Re-setting it to {opacity:0, y:36, scale:0.97}
              would jank the card back to a hidden state.

         Guard: `isClerkMounted()` checks `data-mounted="true"` on
         #clerk-sign-in (set by script.js mountSignIn) and falls back
         to checking for child elements. When Clerk is live we skip
         all opacity tweens and only restart the idle breathe.
  ════════════════════════════════════════════════════════════ */
  (function initAuthAnimations() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    /* ── Returns true when the Clerk SignIn component is live
       (email-entry, OTP step, password reset, MFA, etc.)

       ✦ PRIMARY check: childElementCount > 0
         If Clerk has rendered ANY DOM inside #clerk-sign-in,
         it is live and we must not touch the container with
         GSAP tweens. This is reliable even when script.js
         calls unmountSignIn() mid-flow (which clears dataset.mounted)
         because Clerk keeps its DOM until fully unmounted.

       ✦ SECONDARY check: dataset.mounted === 'true'
         Belt-and-suspenders for the case where Clerk has been
         instructed to mount but hasn't rendered children yet.   */
    function isClerkMounted() {
      const el = document.getElementById('clerk-sign-in');
      if (!el) return false;
      return (el.childElementCount > 0) || (el.dataset.mounted === 'true');
    }

    /* ── Core entrance — only safe to run when Clerk is NOT yet
       mounted. Once Clerk is live, tweening its host div is
       forbidden (it produces the opacity flash / OTP disappear). */
    function playAuthEntrance() {
      const authInner   = authContainer.querySelector('.auth-inner');
      const brandIcon   = authContainer.querySelector('.auth-brand-icon');
      const brandName   = authContainer.querySelector('.auth-brand-name');
      const tagline     = authContainer.querySelector('.auth-tagline');
      const clerkSignIn = authContainer.querySelector('#clerk-sign-in');

      if (!authInner) return;

      /* ── Guard: if Clerk is already mounted (OTP step etc.)
         Only restart the breathe animation. Never set opacity:0
         on authInner or clerkSignIn — both are live and visible. */
      if (isClerkMounted()) {
        gsap.killTweensOf(authInner);
        gsap.set(authInner, { opacity: 1, y: 0, clearProps: 'transform' });
        gsap.to(authInner, {
          y: -3, duration: 3.8, repeat: -1, yoyo: true, ease: E_SINE,
        });
        /* Always ensure the Clerk host stays fully opaque */
        if (clerkSignIn) {
          gsap.set(clerkSignIn, { clearProps: 'opacity,transform,y' });
        }
        return;
      }

      /* ── Fresh entrance: Clerk has not yet mounted ────────── */

      /* Kill tweens + clear all inline GSAP styles — removes any
         residual transform from the previous idle breathe.        */
      gsap.killTweensOf(authInner);
      gsap.set(authInner, { clearProps: 'all' });

      /* ✦ FIX: Only animate opacity + y — NO scale.
         Using scale in the entrance tween is what caused the
         card to appear to shrink/collapse when:
           • the tween is interrupted mid-flight by a second
             showAuth() call (leaves card at intermediate scale)
           • GSAP clearProps timing and breathe tween conflict
         Without scale the card's physical size never changes
         during any animation — it only moves and fades.          */
      gsap.set(authInner, { opacity: 0, y: 36 });

      /* ── a. Card: fade up from below — no scale involved ──── */
      gsap.fromTo(authInner,
        { opacity: 0, y: 36 },
        {
          opacity:  1,
          y:        0,
          duration: 0.95,
          ease:     E_BACK,
          /* clearProps y so CSS transform:none resting state takes
             over after entrance. Keep GSAP's inline opacity:1.    */
          clearProps: 'y,transform',
          onComplete() {
            /* ── e. Idle breathe — deferred to after clearProps ─ */
            gsap.to(authInner, {
              y: -3, duration: 3.8, repeat: -1, yoyo: true, ease: E_SINE,
            });
          },
        }
      );

      /* ── b. Brand icon: one-shot glow burst ────────────────
         CSS pulse-icon already runs — we overlay a brief extra
         burst without removing the CSS animation.                */
      if (brandIcon) {
        gsap.fromTo(brandIcon,
          { filter: 'drop-shadow(0 0 2px rgba(0,240,255,0.2))' },
          {
            filter:   'drop-shadow(0 0 28px #00f0ff) drop-shadow(0 0 52px rgba(0,240,255,0.5))',
            duration: 0.7,
            ease:     'power2.out',
            delay:    0.25,
            yoyo:     true,
            repeat:   1,
          }
        );
      }

      /* ── c. Brand name: slide in from left ─────────────────  */
      if (brandName) {
        gsap.fromTo(brandName,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.65, ease: E_OUT, delay: 0.18 }
        );
      }

      /* ── d. Tagline only — Clerk host div is intentionally
         excluded from this stagger.

         WHY: including clerkSignIn in a gsap.fromTo([…], {opacity:0})
         is what caused the OTP card to vanish. Even on a fresh mount
         the timing is tight — Clerk's SignIn component begins rendering
         ~60ms after this code runs (the rAF+setTimeout delay above).
         If we tween its host div opacity from 0→1 we risk the tween
         conflicting with Clerk's own DOM injection timing.

         The correct approach: let Clerk manage the visibility of its
         own host element entirely. We only animate our own markup
         (tagline, brand, card). Clerk's card appears naturally at
         full opacity inside #clerk-sign-in.                        */
      if (tagline) {
        gsap.fromTo(tagline,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: E_OUT, delay: 0.32 }
        );
      }

      /* Safety: ensure no lingering GSAP inline styles on the
         Clerk host that could suppress its visibility.           */
      if (clerkSignIn) {
        gsap.set(clerkSignIn, { clearProps: 'opacity,transform,y' });
      }
    }

    /* ── MutationObserver: watch for .hidden being removed ─── */
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.type !== 'attributes' || m.attributeName !== 'class') return;

        const wasHidden  = m.oldValue?.includes('hidden') ?? true;
        const nowVisible = !authContainer.classList.contains('hidden');

        if (!wasHidden || !nowVisible) return; /* only care about hidden→visible */

        if (isClerkMounted()) {
          /* Mid-flow (OTP etc.): Clerk is live — never set opacity:0
             on auth-inner or clerkSignIn. Just restart the breathe. */
          const inner = authContainer.querySelector('.auth-inner');
          if (inner) {
            gsap.killTweensOf(inner);
            gsap.set(inner, { opacity: 1, y: 0, clearProps: 'transform' });
            gsap.to(inner, {
              y: -3, duration: 3.8, repeat: -1, yoyo: true, ease: E_SINE,
            });
          }
          /* Belt-and-suspenders: clear any opacity left on Clerk host */
          const clerkEl = authContainer.querySelector('#clerk-sign-in');
          if (clerkEl) gsap.set(clerkEl, { clearProps: 'opacity,transform,y' });
          return;
        }

        /* Fresh show: synchronously hide the card — opacity+y only,
           NO scale. Scale shrink is what the user was seeing.        */
        const inner = authContainer.querySelector('.auth-inner');
        if (inner) gsap.set(inner, { opacity: 0, y: 36 });

        /* rAF + small delay gives Clerk time to mount its DOM     */
        requestAnimationFrame(() => setTimeout(playAuthEntrance, 60));
      });
    });

    observer.observe(authContainer, {
      attributes:        true,
      attributeFilter:   ['class'],
      attributeOldValue: true,
    });

    /* ── Handle page-load: auth-container already visible ──────
       Signed-out refresh lands here once Clerk resolves quickly. */
    if (!authContainer.classList.contains('hidden')) {
      if (!isClerkMounted()) {
        const inner = authContainer.querySelector('.auth-inner');
        if (inner) gsap.set(inner, { opacity: 0, y: 36 });
      }
      setTimeout(playAuthEntrance, 120);
    }
  })();


  /* ════════════════════════════════════════════════════════════
     EXPOSE PUBLIC API
  ════════════════════════════════════════════════════════════ */
  window.MagnetAI          = window.MagnetAI || {};
  window.MagnetAI.animateCards = animateCards;
  window.MagnetAI.initGSAP     = g  => console.log('[MagnetAI] External GSAP:', g);
  window.MagnetAI.initSpline   = s  => console.log('[MagnetAI] Spline scene:', s);
  window.MagnetAI.setApiUrl    = url => console.log('[MagnetAI] API URL →', url);

})();