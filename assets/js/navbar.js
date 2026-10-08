/* ═══════════════════════════════════════════════════
   navbar.js — Top navbar links + search sync
   ═══════════════════════════════════════════════════ */
const Navbar = (() => {
  function init() {
    // Nav link clicks
    document.querySelectorAll('.nb-link[data-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof FullPage !== 'undefined') FullPage.goTo(btn.dataset.section);
      });
    });

    // Navbar search → sync with in-page search + filter projects
    const nbSearch = document.getElementById('nb-search-input');
    if (nbSearch) {
      nbSearch.addEventListener('input', () => {
        const val = nbSearch.value;
        const s2  = document.getElementById('proj-search-2');
        if (s2) s2.value = val;
        if (typeof Projects !== 'undefined') Projects.filter(val);
      });
    }

    // In-page search
    const s2 = document.getElementById('proj-search-2');
    if (s2) {
      s2.addEventListener('input', () => {
        if (typeof Projects !== 'undefined') Projects.filter(s2.value);
        const nb = document.getElementById('nb-search-input');
        if (nb) nb.value = s2.value;
      });
    }
  }

  function setActive(sectionId) {
    document.querySelectorAll('.nb-link[data-section]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === sectionId);
    });
  }

  return { init, setActive };
})();
