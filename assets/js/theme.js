/* ═══════════════════════════════════════════════════
   theme.js — Dark / Light mode manager
   ═══════════════════════════════════════════════════ */
const Theme = (() => {
  let dark = localStorage.getItem('theme') !== 'light';

  function apply() {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const icon = dark ? '🌙' : '☀️';
    _setBtn('theme-btn',    icon);
    _setBtn('nb-theme-btn', icon);
  }

  function toggle() {
    dark = !dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    apply();
  }

  function isDark() { return dark; }

  function _setBtn(id, icon) {
    const el = document.getElementById(id);
    if (el) el.textContent = icon;
  }

  function init() {
    apply();
    _bind('theme-btn');
    _bind('nb-theme-btn');
  }

  function _bind(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', toggle);
  }

  return { init, toggle, isDark };
})();
