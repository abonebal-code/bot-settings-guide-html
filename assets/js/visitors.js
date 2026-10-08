/* ═══════════════════════════════════════════════════
   visitors.js — Real visitor counter via counterapi.dev
   Free, no signup, CORS-safe on GitHub Pages
   ═══════════════════════════════════════════════════ */
const Visitors = (() => {

  // counterapi.dev — الـ namespace والـ key لكل صفحة
  const BASE = 'https://api.counterapi.dev/v1';

  // ── عداد الصفحة الرئيسية ──────────────────────────
  async function init() {
    const el = document.getElementById('visitor-count');
    if (!el) return;

    try {
      const res  = await fetch(`${BASE}/abonebal-portfolio/main/up`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const n    = data?.count ?? null;
      if (n !== null) {
        _animate(el, n);
      } else {
        el.textContent = '1';
      }
    } catch {
      el.textContent = '1';
    }
  }

  // ── عداد لأي صفحة بـ key محدد ─────────────────────
  // يُستخدم لعداد showcase
  async function hitPage(key, el) {
    if (!el) return;
    try {
      const res  = await fetch(`${BASE}/abonebal-portfolio/${key}/up`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const n    = data?.count ?? null;
      if (n !== null) _animate(el, n);
    } catch {
      if (el) el.textContent = '—';
    }
  }

  // ── جلب العدد بدون زيادة (للعرض فقط) ─────────────
  async function getCount(key, el) {
    if (!el) return;
    try {
      const res  = await fetch(`${BASE}/abonebal-portfolio/${key}/get`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const n    = data?.count ?? null;
      if (n !== null) _animate(el, n);
    } catch {
      if (el) el.textContent = '—';
    }
  }

  // ── Animation ────────────────────────────────────
  function _animate(el, target) {
    const n = Number(target);
    if (!n || n <= 0) { el.textContent = '1'; return; }
    if (n === 1)      { el.textContent = '1'; return; }
    let cur = 0;
    const step  = Math.max(1, Math.floor(n / 40));
    const timer = setInterval(() => {
      cur += step;
      if (cur >= n) {
        clearInterval(timer);
        el.textContent = n.toLocaleString('en-US');
      } else {
        el.textContent = cur.toLocaleString('en-US');
      }
    }, 28);
  }

  return { init, hitPage, getCount };
})();
