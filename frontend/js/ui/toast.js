/* ═══════════════════════════════════════════════════════════════
   MagnetAI — js/ui/toast.js
   Lightweight toast notification.
   Depends on: #toast and #toast-msg in the DOM.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

(function initToast() {
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let   timer    = null;

  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* Expose globally so every module can call showToast() */
  window.showToast = showToast;
})();