/**
 * ╔══════════════════════════════════════════════════════════╗
 *   main.js — Abonebal Portfolio — All JavaScript Logic
 * ╚══════════════════════════════════════════════════════════╝
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. LANGUAGE MANAGER
   ═══════════════════════════════════════════════════════════════ */
const Lang = (() => {
  let current = localStorage.getItem('lang') || 'ar';

  function get() { return current; }

  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[current] || obj['ar'] || '';
  }

  function toggle() {
    current = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', current);
    document.documentElement.lang = current;
    document.documentElement.dir  = current === 'ar' ? 'rtl' : 'ltr';
    render();
  }

  function render() {
    // Update all [data-ar] / [data-en] elements
    document.querySelectorAll('[data-ar]').forEach(el => {
      el.textContent = current === 'ar'
        ? el.dataset.ar
        : (el.dataset.en || el.dataset.ar);
    });
    // Update lang toggle button label
    const btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = current === 'ar' ? '🌐 EN' : '🌐 عر';
    // Re-render typewriter with new language
    Typewriter.restart();
    // Re-render stats
    renderHeroStats();
    // Re-render skills
    renderSkills();
    // Re-render services
    renderServices();
    // Re-render contact
    renderContact();
    // Re-render nav labels
    renderNavLabels();
  }

  function init() {
    document.documentElement.lang = current;
    document.documentElement.dir  = current === 'ar' ? 'rtl' : 'ltr';
  }

  return { get, t, toggle, render, init };
})();

/* ═══════════════════════════════════════════════════════════════
   2. THEME MANAGER
   ═══════════════════════════════════════════════════════════════ */
const Theme = (() => {
  let isDark = localStorage.getItem('theme') !== 'light';

  function apply() {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
    if (isDark) btn && btn.classList.remove('active');
    else        btn && btn.classList.add('active');
  }

  function toggle() {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    apply();
  }

  function init() { apply(); }

  return { toggle, init };
})();

/* ═══════════════════════════════════════════════════════════════
   3. CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════════ */
const Cursor = (() => {
  function init() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    // Move both elements instantly on mousemove
    document.addEventListener('mousemove', e => {
      const x = e.clientX, y = e.clientY;
      dot.style.left  = x + 'px';
      dot.style.top   = y + 'px';
      ring.style.left = x + 'px';
      ring.style.top  = y + 'px';
    }, { passive: true });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    const hoverTargets = 'a,button,.btn,.sb-item,.proj-card,.service-card,.contact-card,.skill-badge,.copy-btn,.sb-ctrl-btn,.vbtn';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
    }, { passive: true });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
    }, { passive: true });
  }
  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════════ */
const ScrollProgress = (() => {
  function init() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${pct})`;
    }, { passive: true });
  }
  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   5. TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════════════════ */
const Typewriter = (() => {
  let idx = 0, charIdx = 0, deleting = false, timer = null;

  function init() {
    tick();
  }

  function restart() {
    clearTimeout(timer);
    idx = 0; charIdx = 0; deleting = false;
    const el = document.getElementById('tw-text');
    if (el) el.textContent = '';
    tick();
  }

  function tick() {
    const titles = PROFILE.titles[Lang.get()];
    const el = document.getElementById('tw-text');
    if (!el || !titles) return;

    const current = titles[idx % titles.length];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        timer = setTimeout(tick, 2000);
      } else {
        timer = setTimeout(tick, 80);
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx++;
        timer = setTimeout(tick, 300);
      } else {
        timer = setTimeout(tick, 40);
      }
    }
  }

  return { init, restart };
})();

/* ═══════════════════════════════════════════════════════════════
   6. PARTICLES BACKGROUND
   ═══════════════════════════════════════════════════════════════ */
const Particles = (() => {
  function init() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.a  = Math.random() * 0.5 + 0.1;
        this.da = (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.a += this.da;
        if (this.a > 0.6 || this.a < 0.05) this.da *= -1;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(176,110,240,${this.a})`;
        ctx.fill();
      }
    }

    resize();
    for (let i = 0; i < 60; i++) particles.push(new Particle());
    window.addEventListener('resize', resize, { passive: true });

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    })();
  }
  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   7. SIDEBAR
   ═══════════════════════════════════════════════════════════════ */
const Sidebar = (() => {
  let collapsed = localStorage.getItem('sb-collapsed') === 'true';
  let activeId  = 'home';

  function init() {
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    if (collapsed) sb.classList.add('collapsed');

    // Toggle collapse
    const toggleBtn = document.getElementById('sb-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleCollapse);

    // Mobile toggle
    const mobBtn  = document.getElementById('mob-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    if (mobBtn)   mobBtn.addEventListener('click', () => { sb.classList.toggle('mob-open'); overlay.classList.toggle('show'); });
    if (overlay)  overlay.addEventListener('click', () => { sb.classList.remove('mob-open'); overlay.classList.remove('show'); });

    // Nav items
    document.querySelectorAll('.sb-item[data-section]').forEach(item => {
      item.addEventListener('click', () => {
        const sec = item.dataset.section;
        scrollToSection(sec);
        setActive(sec);
        if (window.innerWidth <= 1024) {
          sb.classList.remove('mob-open');
          overlay && overlay.classList.remove('show');
        }
      });
    });

    // Scroll spy
    window.addEventListener('scroll', onScroll, { passive: true });

    // Highlight bar
    updateHighlight();
  }

  function toggleCollapse() {
    const sb = document.getElementById('sidebar');
    collapsed = !collapsed;
    sb.classList.toggle('collapsed', collapsed);
    localStorage.setItem('sb-collapsed', collapsed);
    updateHighlight();
  }

  function setActive(id) {
    activeId = id;
    document.querySelectorAll('.sb-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === id);
    });
    updateHighlight();
  }

  function updateHighlight() {
    const bar    = document.querySelector('.sb-highlight');
    const active = document.querySelector('.sb-item.active');
    if (!bar || !active) return;
    const rect    = active.getBoundingClientRect();
    const navRect = active.closest('.sb-nav').getBoundingClientRect();
    bar.style.top    = (rect.top - navRect.top + active.closest('.sb-nav').scrollTop) + 'px';
    bar.style.height = rect.height + 'px';
    bar.classList.add('visible');
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function onScroll() {
    const sections = ['hero','about','projects','services','contact'];
    let current = 'hero';
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (window.scrollY >= el.offsetTop - 160) current = id;
    }
    if (current !== activeId) setActive(current);
  }

  return { init, setActive };
})();

/* ═══════════════════════════════════════════════════════════════
   8. VISITOR COUNTER
   ═══════════════════════════════════════════════════════════════ */
const VisitorCounter = (() => {
  const NAMESPACE = 'abonebal-portfolio';
  const KEY       = 'visits';
  const API       = `https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`;

  async function init() {
    const el = document.getElementById('visitor-count');
    if (!el) return;
    try {
      const res  = await fetch(API);
      const data = await res.json();
      if (data && data.value != null) {
        animateNumber(el, 0, data.value);
      }
    } catch {
      el.textContent = '—';
    }
  }

  function animateNumber(el, from, to) {
    const diff = to - from;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      el.textContent = Math.floor(from + (diff * step / steps)).toLocaleString('en-US');
      if (step >= steps) { clearInterval(timer); el.textContent = to.toLocaleString('en-US'); }
    }, 30);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   9. TOAST
   ═══════════════════════════════════════════════════════════════ */
function showToast(msg, color = 'var(--green)') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.color = color;
  t.style.borderColor = color.replace('var(--green)', 'rgba(87,242,135,.4)');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✅ تم النسخ';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
    }
    showToast('✅ تم النسخ بنجاح!');
  });
}

/* ═══════════════════════════════════════════════════════════════
   10. RENDER HERO STATS
   ═══════════════════════════════════════════════════════════════ */
function renderHeroStats() {
  const container = document.getElementById('hero-stats');
  if (!container || !PROFILE) return;
  const stats = PROFILE.stats[Lang.get()];
  container.innerHTML = stats.map(s => `
    <div class="hero-stat">
      <div class="hero-stat-num">${s.number}</div>
      <div class="hero-stat-lbl">${s.label}</div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════════
   11. RENDER SKILLS
   ═══════════════════════════════════════════════════════════════ */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container || !PROFILE) return;
  container.innerHTML = PROFILE.skills.map(s => `
    <div class="skill-badge" style="--skill-color:${s.color}">
      <span>${s.icon}</span>
      <span>${s.name}</span>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════════
   12. RENDER SERVICES
   ═══════════════════════════════════════════════════════════════ */
function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container || !LINKS) return;
  container.innerHTML = LINKS.services.map(s => `
    <div class="service-card reveal" style="--srv-color:${s.color}">
      <span class="srv-icon">${s.icon}</span>
      <div class="srv-title">${Lang.t(s.title)}</div>
      <div class="srv-desc">${Lang.t(s.desc)}</div>
      <div class="srv-price">💰 ${Lang.t(s.price)}</div>
    </div>`).join('');
  observeReveal();
}

/* ═══════════════════════════════════════════════════════════════
   13. RENDER CONTACT
   ═══════════════════════════════════════════════════════════════ */
function renderContact() {
  const container = document.getElementById('contact-grid');
  if (!container || !LINKS) return;
  container.innerHTML = LINKS.contact.map(c => `
    <div class="contact-card reveal" style="--c-color:${c.color}">
      <div class="c-icon">${c.icon}</div>
      <div style="flex:1">
        <div class="c-label">${Lang.t(c.label)}</div>
        <div class="c-value">${c.value}</div>
        ${c.url ? `<div class="c-link" onclick="window.open('${c.url}','_blank')">🔗 ${Lang.get()==='ar'?'فتح الصفحة':'Open Page'}</div>` : ''}
      </div>
      ${c.copyable ? `<button class="copy-btn" onclick="copyText('${c.value}',this)">📋 ${Lang.get()==='ar'?'نسخ':'Copy'}</button>` : ''}
    </div>`).join('');
  observeReveal();
}

/* ═══════════════════════════════════════════════════════════════
   14. RENDER NAV LABELS
   ═══════════════════════════════════════════════════════════════ */
function renderNavLabels() {
  if (!LINKS) return;
  LINKS.nav.forEach(item => {
    const el = document.querySelector(`.sb-item[data-section="${item.id}"] .sb-item-label`);
    if (el) el.textContent = Lang.t(item.label);
    const sbItem = document.querySelector(`.sb-item[data-section="${item.id}"]`);
    if (sbItem) sbItem.dataset.label = Lang.t(item.label);
  });
}

/* ═══════════════════════════════════════════════════════════════
   15. PROJECTS — GitHub API
   ═══════════════════════════════════════════════════════════════ */
const Projects = (() => {
  let allFiles = [];
  let currentView = 'grid';

  const ICONS = {
    family:'👨‍👩‍👧‍👦', system:'⚙️', bot:'🤖', guide:'📖',
    panel:'🗂️', report:'📊', dashboard:'🖥️', default:'📄'
  };

  function getIcon(name) {
    const n = name.toLowerCase();
    for (const [k,v] of Object.entries(ICONS)) if (n.includes(k)) return v;
    return ICONS.default;
  }
  function formatSize(b) {
    if (!b) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
    return (b/(1024*1024)).toFixed(1) + ' MB';
  }
  function formatAge(ts) {
    if (!ts) return '—';
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60)    return Lang.get()==='ar' ? 'الآن'              : 'just now';
    if (diff < 3600)  return Math.floor(diff/60)  + (Lang.get()==='ar' ? ' د' : ' min');
    if (diff < 86400) return Math.floor(diff/3600) + (Lang.get()==='ar' ? ' س' : ' hr');
    return Math.floor(diff/86400)                  + (Lang.get()==='ar' ? ' يوم' : ' d');
  }

  async function load() {
    const grid = document.getElementById('proj-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="proj-loading"><div class="proj-spinner"></div><div style="color:var(--txt3);font-size:14px">${Lang.get()==='ar'?'جاري جلب المشاريع...':'Loading projects...'}</div></div>`;

    try {
      const { owner, repo, branch } = PROFILE.github;
      const res  = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/showcases?ref=${branch}`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();

      allFiles = data.filter(f =>
        f.type === 'file' &&
        f.name.toLowerCase().endsWith('.html')
      );

      // Update stat
      const countEl = document.getElementById('stat-proj-count');
      if (countEl) countEl.textContent = allFiles.length;

      await enrichDates(allFiles);
      render(allFiles);
    } catch (err) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px">
          <div style="font-size:40px;margin-bottom:12px">⚠️</div>
          <div style="font-size:16px;font-weight:700;color:var(--txt2);margin-bottom:8px">${Lang.get()==='ar'?'تعذّر جلب المشاريع':'Failed to load projects'}</div>
          <div style="font-size:12px;color:var(--txt3)">${err.message}</div>
          <button onclick="Projects_load()" class="btn btn-primary btn-sm" style="margin-top:16px">${Lang.get()==='ar'?'إعادة المحاولة':'Retry'}</button>
        </div>`;
    }
  }

  async function enrichDates(files) {
    const { owner, repo } = PROFILE.github;
    for (let i = 0; i < files.length; i += 5) {
      await Promise.all(files.slice(i, i+5).map(async f => {
        try {
          const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(f.path)}&per_page=1`);
          if (!r.ok) return;
          const d = await r.json();
          if (d[0]) f._ts = d[0].commit.author.date;
        } catch {}
      }));
    }
  }

  function render(files) {
    const grid = document.getElementById('proj-grid');
    if (!grid) return;
    if (files.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--txt3)">${Lang.get()==='ar'?'لا توجد مشاريع':'No projects found'}</div>`;
      return;
    }
    const baseUrl = `https://${PROFILE.github.owner}.github.io/${PROFILE.github.repo}/showcases/`;
    grid.innerHTML = files.map((f, i) => {
      const url  = baseUrl + f.name;
      const name = f.name.replace(/\.html$/i,'').replace(/[-_]/g,' ');
      const icon = getIcon(f.name);
      return `
      <div class="proj-card" style="animation-delay:${(i*0.07).toFixed(2)}s">
        <div class="proj-card-top">
          <div class="proj-icon">${icon}</div>
          <div class="proj-status">● ${Lang.get()==='ar'?'نشط':'Live'}</div>
        </div>
        <div class="proj-name">${name}</div>
        <div class="proj-url" title="${url}">${url}</div>
        <div class="proj-meta">
          <span>📄 HTML</span>
          <span>💾 ${formatSize(f.size)}</span>
          <span>🕐 ${formatAge(f._ts)}</span>
        </div>
        <div class="proj-actions">
          <button class="btn btn-secondary btn-sm" onclick="copyText('${url}',this)">📋 ${Lang.get()==='ar'?'نسخ':'Copy'}</button>
          <button class="btn btn-primary btn-sm" onclick="window.open('${url}','_blank')">🚀 ${Lang.get()==='ar'?'فتح':'Open'}</button>
        </div>
      </div>`;
    }).join('');
  }

  function filter(q) {
    const filtered = allFiles.filter(f =>
      f.name.toLowerCase().includes(q.toLowerCase())
    );
    render(filtered);
  }

  function setView(mode) {
    currentView = mode;
    const grid = document.getElementById('proj-grid');
    if (grid) grid.classList.toggle('list', mode === 'list');
    document.querySelectorAll('.vbtn').forEach(b => b.classList.toggle('active', b.dataset.view === mode));
  }

  return { load, filter, setView };
})();

// Expose for inline onclick
window.Projects_load = () => Projects.load();

/* ═══════════════════════════════════════════════════════════════
   16. REVEAL ON SCROLL
   ═══════════════════════════════════════════════════════════════ */
function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   17. HERO COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const text = el.textContent;
      const num  = parseInt(text.replace(/\D/g,''));
      if (isNaN(num) || num === 0) return;
      const suffix = text.replace(/[\d]/g,'');
      let cur = 0;
      const step = num / 40;
      const timer = setInterval(() => {
        cur += step;
        if (cur >= num) { clearInterval(timer); el.textContent = num + suffix; return; }
        el.textContent = Math.floor(cur) + suffix;
      }, 30);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.hero-stat-num').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   18. INIT ALL
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Lang.init();
  Theme.init();
  Cursor.init();
  ScrollProgress.init();
  Particles.init();
  Sidebar.init();
  VisitorCounter.init();
  Typewriter.init();

  // Render dynamic sections
  renderHeroStats();
  renderSkills();
  renderServices();
  renderContact();
  renderNavLabels();
  observeReveal();
  animateCounters();

  // Load projects
  Projects.load();

  // Search input
  const searchInput = document.getElementById('proj-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => Projects.filter(e.target.value));
  }

  // View toggle buttons
  document.querySelectorAll('.vbtn').forEach(btn => {
    btn.addEventListener('click', () => Projects.setView(btn.dataset.view));
  });

  // Lang toggle
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) langBtn.addEventListener('click', Lang.toggle);

  // Theme toggle
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', Theme.toggle);

  // Refresh projects button
  const refreshBtn = document.getElementById('proj-refresh');
  if (refreshBtn) refreshBtn.addEventListener('click', () => Projects.load());

  // Initial lang render
  Lang.render();
});
