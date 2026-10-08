/* ═══════════════════════════════════════════════════
   render.js — Dynamic section rendering from config
   ═══════════════════════════════════════════════════ */
const Render = (() => {

  function all() {
    heroStats();
    heroBio();
    heroTerminal();
    skills();
    services();
    contact();
    navLabels();
  }

  function heroStats() {
    const el = document.getElementById('hero-stats');
    if (!el || !PROFILE) return;
    const stats = PROFILE.stats[Lang.get()];
    el.innerHTML = stats.map(s => `
      <div class="hero-stat">
        <div class="hero-stat-num">${s.number}</div>
        <div class="hero-stat-lbl">${s.label}</div>
      </div>`).join('');
  }

  function heroBio() {
    const el = document.getElementById('hero-bio');
    if (!el || !PROFILE) return;
    el.textContent = Lang.t(PROFILE.bio);
  }

  function heroTerminal() {
    const el = document.getElementById('hero-terminal');
    if (!el || !PROFILE) return;
    const ar = Lang.get() === 'ar';
    el.innerHTML = `
      <div class="t-line"><span class="t-prompt">➜</span> <span class="t-cmd">whoami</span></div>
      <div class="t-line t-out"><span class="t-key">${ar?'الاسم':'name'}</span>: Abonebal</div>
      <div class="t-line t-out"><span class="t-key">${ar?'التخصص':'role'}</span>: ${ar?'مطور بوتات Discord':'Discord Bot Developer'}</div>
      <div class="t-line t-out"><span class="t-key">${ar?'الخبرة':'exp'}</span>: ${Lang.t(PROFILE.experience)}</div>
      <div class="t-line t-out"><span class="t-key">${ar?'اللغة':'lang'}</span>: JavaScript / Node.js</div>
      <div class="t-line"><span class="t-prompt">➜</span> <span class="t-cursor-terminal">█</span></div>`;
  }

  function skills() {
    const el = document.getElementById('skills-container');
    if (!el || !PROFILE) return;
    el.innerHTML = PROFILE.skills.map(s => `
      <div class="skill-badge" style="--skill-color:${s.color}">
        <span>${s.icon}</span><span>${s.name}</span>
      </div>`).join('');
  }

  function services() {
    const el = document.getElementById('services-grid');
    if (!el || !LINKS) return;
    el.innerHTML = LINKS.services.map(s => `
      <div class="service-card reveal" style="--srv-color:${s.color}">
        <span class="srv-icon">${s.icon}</span>
        <div class="srv-title">${Lang.t(s.title)}</div>
        <div class="srv-desc">${Lang.t(s.desc)}</div>
        <div class="srv-price">💰 ${Lang.t(s.price)}</div>
      </div>`).join('');
  }

  function contact() {
    const el = document.getElementById('contact-grid');
    if (!el || !LINKS) return;
    const ar = Lang.get() === 'ar';
    el.innerHTML = LINKS.contact.map(c => `
      <div class="contact-card reveal" style="--c-color:${c.color}">
        <div class="c-icon">${c.icon}</div>
        <div style="flex:1;min-width:0">
          <div class="c-label">${Lang.t(c.label)}</div>
          <div class="c-value">${c.value}</div>
          ${c.url ? `<div class="c-link" onclick="window.open('${c.url}','_blank')">🔗 ${ar?'فتح':'Open'}</div>` : ''}
        </div>
        ${c.copyable ? `<button class="copy-btn" onclick="Utils.copy('${c.value}',this)">📋 ${ar?'نسخ':'Copy'}</button>` : ''}
      </div>`).join('');
  }

  function navLabels() {
    if (!LINKS) return;
    LINKS.nav.forEach(item => {
      const lbl = document.querySelector(`.sb-item[data-section="${item.id}"] .sb-item-label`);
      if (lbl) lbl.textContent = Lang.t(item.label);
      const tip = document.querySelector(`.sb-item[data-section="${item.id}"] .sb-tooltip`);
      if (tip) tip.textContent = Lang.t(item.label);
    });
  }

  return { all, heroStats, heroBio, heroTerminal, skills, services, contact, navLabels };
})();
