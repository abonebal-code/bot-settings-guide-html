/* ═══════════════════════════════════════════════════
   sidebar.js — Sidebar collapse + nav + hover show
   ═══════════════════════════════════════════════════ */
const Sidebar = (() => {
  let collapsed = localStorage.getItem('sb-collapsed') === 'true';

  function init() {
    const sb      = document.getElementById('sidebar');
    const toggle  = document.getElementById('sb-toggle');
    const mob     = document.getElementById('mob-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sb) return;

    // Apply saved state
    if (collapsed) sb.classList.add('collapsed');

    // Toggle collapse
    if (toggle) toggle.addEventListener('click', _toggleCollapse);

    // Mobile open/close
    if (mob) mob.addEventListener('click', () => {
      sb.classList.toggle('mob-open');
      overlay && overlay.classList.toggle('show');
    });
    if (overlay) overlay.addEventListener('click', () => {
      sb.classList.remove('mob-open');
      overlay.classList.remove('show');
    });

    // Nav item clicks — delegate to FullPage
    document.querySelectorAll('.sb-item[data-section]').forEach(item => {
      item.addEventListener('click', () => {
        const sec = item.dataset.section;
        if (typeof FullPage !== 'undefined') FullPage.goTo(sec);
        // Close mobile sidebar
        if (window.innerWidth <= 1024) {
          sb.classList.remove('mob-open');
          overlay && overlay.classList.remove('show');
        }
      });
    });
  }

  function _toggleCollapse() {
    const sb = document.getElementById('sidebar');
    collapsed = !collapsed;
    sb.classList.toggle('collapsed', collapsed);
    localStorage.setItem('sb-collapsed', collapsed);
  }

  function setActive(id) {
    document.querySelectorAll('.sb-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === id);
    });
  }

  return { init, setActive };
})();
