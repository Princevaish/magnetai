/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/app.js
   Entry point loaded by index.html as a classic <script>.
   Responsibilities:
     • Clerk authentication (complete, unchanged from script.js)
     • Canvas particle background (complete, unchanged)
   All feature modules load after this file via separate <script>
   tags at the bottom of index.html, so the DOM is always parsed.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   CLERK AUTHENTICATION
   Identical to the working version in script.js — zero changes.
═══════════════════════════════════════════════════════════════ */
const CLERK_PK = (
  document.querySelector('script[data-clerk-publishable-key]')
    ?.getAttribute('data-clerk-publishable-key') || ''
).trim();

const CLERK_APPEARANCE = {
  variables: {
    colorPrimary:                 '#00f0ff',
    colorBackground:              '#060614',
    colorText:                    '#ede8ff',
    colorTextSecondary:           'rgba(210,200,255,0.62)',
    colorTextOnPrimaryBackground: '#03030a',
    colorInputBackground:         'rgba(10,10,26,0.76)',
    colorInputText:               '#ede8ff',
    colorNeutral:                 '#ede8ff',
    colorDanger:                  '#f472b6',
    borderRadius:                 '12px',
    fontFamily:                   'Inter, sans-serif',
    fontFamilyButtons:            'Inter, sans-serif',
    shadowShimmer:                '0 0 0 1px rgba(110,85,255,0.20)',
  },
  elements: {
    rootBox:       'background: #060614;',
    pageScrollBox: 'background: #060614;',
    card: [
      'background: rgba(10,10,26,0.90)',
      'border: 1px solid rgba(110,85,255,0.20)',
      'backdrop-filter: blur(28px)',
      '-webkit-backdrop-filter: blur(28px)',
      'box-shadow: 0 0 60px rgba(155,109,255,0.07), 0 32px 80px rgba(0,0,0,0.45)',
      'border-radius: 20px',
    ].join(';'),
    headerTitle:    'color: #ede8ff; font-family: Inter, sans-serif; font-weight: 700;',
    headerSubtitle: 'color: rgba(210,200,255,0.62); font-family: Inter, sans-serif;',
    socialButtonsBlockButton: [
      'border: 1px solid rgba(110,85,255,0.30)',
      'background: rgba(10,10,26,0.60)',
      'color: #ede8ff',
      'border-radius: 10px',
    ].join(';'),
    socialButtonsBlockButtonText: 'color: #ede8ff;',
    formFieldInput: [
      'background: rgba(10,10,26,0.76)',
      'border: 1px solid rgba(110,85,255,0.22)',
      'color: #ede8ff',
      'border-radius: 10px',
    ].join(';'),
    formFieldLabel: 'color: rgba(210,200,255,0.62); font-size: 0.75rem; letter-spacing: 0.08em;',
    formButtonPrimary: [
      'background: linear-gradient(135deg,#00f0ff,#9b6dff)',
      'color: #03030a', 'font-weight: 700', 'border-radius: 10px', 'border: none',
    ].join(';'),
    formButtonReset: [
      'color: rgba(210,200,255,0.62)',
      'border: 1px solid rgba(110,85,255,0.22)',
      'border-radius: 10px', 'background: transparent',
    ].join(';'),
    otpCodeFieldInput: [
      'background: rgba(10,10,26,0.76)',
      'border: 1px solid rgba(110,85,255,0.30)',
      'color: #00f0ff', 'font-size: 1.4rem', 'border-radius: 10px', 'text-align: center',
    ].join(';'),
    dividerLine:             'background: rgba(110,85,255,0.20);',
    dividerText:             'color: rgba(210,200,255,0.38);',
    footerActionLink:        'color: #00f0ff;',
    footerActionText:        'color: rgba(210,200,255,0.50);',
    footer:                  'display: none !important;',
    badge:                   'display: none !important;',
    developmentModeNotice:   'display: none !important;',
    developmentModeBadge:    'display: none !important;',
    identityPreviewText:       'color: #ede8ff;',
    identityPreviewEditButton: 'color: #00f0ff;',
    alertText:                 'color: #ede8ff;',
    alertTextDanger:           'color: #f472b6;',
  },
};

const clerkLoadingEl  = document.getElementById('clerk-loading');
const authContainerEl = document.getElementById('auth-container');
const appContainerEl  = document.getElementById('app-container');

function showApp() {
  clerkLoadingEl?.classList.add('hidden');
  authContainerEl?.classList.add('hidden');
  appContainerEl?.classList.remove('hidden');
  if (appContainerEl) appContainerEl.style.display = '';
  document.body.classList.remove('auth-active');
}

function showAuth() {
  clerkLoadingEl?.classList.add('hidden');
  appContainerEl?.classList.add('hidden');
  if (appContainerEl) appContainerEl.style.display = 'none';
  authContainerEl?.classList.remove('hidden');
  document.body.classList.add('auth-active');
}

function showLoading() {
  clerkLoadingEl?.classList.remove('hidden');
  authContainerEl?.classList.add('hidden');
  appContainerEl?.classList.add('hidden');
  if (appContainerEl) appContainerEl.style.display = 'none';
  document.body.classList.remove('auth-active');
}

function mountUserButton() {
  const slot = document.getElementById('clerk-user-btn');
  if (!slot || slot.dataset.mounted || !window.Clerk?.mountUserButton) return;
  slot.dataset.mounted = 'true';
  window.Clerk.mountUserButton(slot, {
    afterSignOutUrl: window.location.href,
    appearance: {
      variables: {
        colorPrimary: '#00f0ff', colorBackground: 'rgba(10,10,26,0.92)',
        colorText: '#ede8ff', colorTextSecondary: 'rgba(210,200,255,0.62)',
        colorNeutral: '#ede8ff', borderRadius: '12px', fontFamily: 'Inter, sans-serif',
      },
      elements: {
        userButtonPopoverCard: [
          'background: rgba(10,10,26,0.92)',
          'border: 1px solid rgba(110,85,255,0.20)',
          'backdrop-filter: blur(28px)', '-webkit-backdrop-filter: blur(28px)',
          'box-shadow: 0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(110,85,255,0.12)',
          'border-radius: 16px',
        ].join(';'),
        userButtonPopoverActionButton:     'color: rgba(210,200,255,0.80); border-radius: 8px;',
        userButtonPopoverActionButtonText: 'color: rgba(210,200,255,0.80);',
        userButtonPopoverActionButtonIcon: 'color: rgba(210,200,255,0.55);',
        userButtonPopoverActionButton__manageAccount: 'color: #ede8ff;',
        userButtonPopoverActionButton__signOut:       'color: #f472b6;',
        userButtonPopoverFooter: 'display: none;',
        userButtonPopoverMain:   'padding: 8px;',
        userButtonAvatarBox:     'border: 2px solid transparent; transition: border-color 0.25s, box-shadow 0.25s;',
        userPreviewMainIdentifier:      'color: #ede8ff; font-weight: 600;',
        userPreviewSecondaryIdentifier: 'color: rgba(210,200,255,0.55); font-size: 0.75rem;',
        badge:                 'display: none !important;',
        developmentModeBadge:  'display: none !important;',
        developmentModeNotice: 'display: none !important;',
      },
    },
  });
}

function mountSignIn() {
  const el = document.getElementById('clerk-sign-in');
  if (!el || !window.Clerk?.mountSignIn) return;
  if (el.dataset.mounted === 'true') return;
  el.dataset.mounted = 'true';
  window.Clerk.mountSignIn(el, {
    routing:                'virtual',
    signInForceRedirectUrl: window.location.href,
    appearance:             CLERK_APPEARANCE,
  });
}

function unmountSignIn() {
  const el = document.getElementById('clerk-sign-in');
  if (!el) return;
  if (el.dataset.mounted === 'true' && window.Clerk?.unmountSignIn) {
    window.Clerk.unmountSignIn(el);
  }
  el.innerHTML       = '';
  el.dataset.mounted = '';
}

async function initClerk() {
  showLoading();

  if (!CLERK_PK || CLERK_PK === 'CLERK_PUBLISHABLE_KEY') {
    console.warn('[MagnetAI] Clerk publishable key not configured. Auth DISABLED.');
    showApp();
    return;
  }
  if (!window.Clerk) {
    console.error('[MagnetAI] Clerk SDK not available.');
    showApp();
    return;
  }

  try {
    await window.Clerk.load({ publishableKey: CLERK_PK });

    if (window.Clerk.user) {
      showApp();
      mountUserButton();
    } else {
      showAuth();
      mountSignIn();
    }

    window.Clerk.addListener(({ user }) => {
      if (user) {
        unmountSignIn();
        showApp();
        mountUserButton();
      } else {
        const signInEl      = document.getElementById('clerk-sign-in');
        const clerkIsActive = (signInEl?.childElementCount ?? 0) > 0
                           || signInEl?.dataset.mounted === 'true';
        if (clerkIsActive) {
          showAuth();
        } else {
          showAuth();
          unmountSignIn();
          mountSignIn();
        }
      }
    });

  } catch (err) {
    console.error('[MagnetAI] Clerk.load() failed:', err);
    showApp();
  }
}

initClerk();


/* ═══════════════════════════════════════════════════════════════
   CANVAS PARTICLE BACKGROUND
   Identical to the working version in script.js — zero changes.
═══════════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  const mouse  = { x: -9999, y: -9999 };
  const COLORS = [
    'rgba(0, 240, 255, VAL)', 'rgba(155, 109, 255, VAL)',
    'rgba(244, 114, 182, VAL)', 'rgba(57, 255, 20, VAL)',
  ];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function makeParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.5 + 0.3, alpha: Math.random() * 0.45 + 0.08,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.007 + Math.random() * 0.013,
    };
  }

  function initParticles(count = 110) { particles = Array.from({ length: count }, makeParticle); }

  function drawAmbient() {
    const g1 = ctx.createRadialGradient(W*.15, H*.85, 0, W*.15, H*.85, W*.55);
    g1.addColorStop(0, 'rgba(90,40,200,0.09)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(W*.85, H*.25, 0, W*.85, H*.25, W*.45);
    g2.addColorStop(0, 'rgba(0,180,210,0.06)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H); drawAmbient();
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const pAlpha = p.alpha * (0.55 + 0.45 * Math.sin(p.pulse));
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) { const f = (130-dist)/130; p.vx += (dx/dist)*f*0.038; p.vy += (dy/dist)*f*0.038; }
      p.vx *= 0.978; p.vy *= 0.978;
      const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
      if (speed > 1.4) { p.vx = (p.vx/speed)*1.4; p.vy = (p.vy/speed)*1.4; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const c = p.color.replace('VAL', pAlpha);
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*3.2);
      grd.addColorStop(0, c); grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r*3.2, 0, Math.PI*2); ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = c; ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize(); initParticles(); draw();
})();