/* ═══════════════════════════════════════════════════
   app.js — Main entry point, initialises everything
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Core ── */
  Theme.init();
  Lang.init();
  Cursor.init();
  Particles.init();

  /* ── Layout ── */
  Sidebar.init();
  Navbar.init();
  FullPage.init();

  /* ── Content ── */
  Render.all();
  Typewriter.init();
  Visitors.init();
  Projects.load();
  Contact.init();

  /* ── View toggle buttons ── */
  document.querySelectorAll('.vbtn').forEach(btn => {
    btn.addEventListener('click', () => Projects.setView(btn.dataset.view));
  });

  /* ── Refresh button ── */
  const refresh = document.getElementById('proj-refresh');
  if (refresh) refresh.addEventListener('click', () => Projects.load());

  /* ── Hero CTA scroll helpers ── */
  window._goTo = (id) => FullPage.goTo(id);

  /* ── Logo: apply from config ── */
  _applyLogo();
});

function _applyLogo() {
  if (!PROFILE || !PROFILE.logoUrl) return;
  // Sidebar logo icon
  const sbIcon = document.querySelector('.sb-logo-icon');
  if (sbIcon) {
    sbIcon.innerHTML = `<img src="${PROFILE.logoUrl}" alt="logo" style="width:100%;height:100%;object-fit:cover;border-radius:9px;" />`;
  }
  // User avatar
  const avatar = document.querySelector('.sb-user-avatar');
  if (avatar) {
    avatar.innerHTML = `<img src="${PROFILE.logoUrl}" alt="avatar" />`;
  }
  // About avatar
  const aboutAv = document.querySelector('.about-avatar');
  if (aboutAv) {
    aboutAv.innerHTML = `<img src="${PROFILE.logoUrl}" alt="avatar" />`;
  }
  // Favicon (optional, if logoUrl is an absolute URL)
  try {
    const link = document.querySelector("link[rel='icon']");
    if (link && PROFILE.logoUrl.startsWith('http')) link.href = PROFILE.logoUrl;
  } catch {}
}
