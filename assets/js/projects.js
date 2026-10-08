/* ═══════════════════════════════════════════════════
   projects.js — GitHub API project fetcher & renderer
   ═══════════════════════════════════════════════════ */
const Projects = (() => {
  let allFiles = [];

  const ICONS = {
    family:'👨‍👩‍👧‍👦', system:'⚙️', bot:'🤖',
    guide:'📖', panel:'🗂️', report:'📊',
    dashboard:'🖥️', showcase:'🎯', default:'📄'
  };

  function _icon(name) {
    const n = name.toLowerCase();
    for (const [k,v] of Object.entries(ICONS)) if (n.includes(k)) return v;
    return ICONS.default;
  }
  function _size(b) {
    if (!b) return '—';
    if (b < 1024) return b + 'B';
    if (b < 1024*1024) return (b/1024).toFixed(1) + 'KB';
    return (b/1024/1024).toFixed(1) + 'MB';
  }
  function _age(ts) {
    if (!ts) return '—';
    const d = Math.floor((Date.now() - new Date(ts)) / 1000);
    const ar = Lang.get() === 'ar';
    if (d < 60)    return ar ? 'الآن'             : 'now';
    if (d < 3600)  return Math.floor(d/60)  + (ar ? 'د'   : 'm');
    if (d < 86400) return Math.floor(d/3600)+ (ar ? 'س'   : 'h');
    return Math.floor(d/86400)              + (ar ? ' يوم' : 'd');
  }

  async function load() {
    const grid = document.getElementById('proj-grid');
    if (!grid) return;
    const ar = Lang.get() === 'ar';
    grid.innerHTML = `<div class="proj-loading"><div class="proj-spinner"></div><div style="color:var(--txt3);font-size:13px">${ar?'جاري الجلب...':'Loading...'}</div></div>`;

    try {
      const { owner, repo, branch, showcasesFolder } = PROFILE.github;
      const folder = showcasesFolder || 'showcases';
      const res    = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=${branch}`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();

      allFiles = data.filter(f => f.type === 'file' && f.name.toLowerCase().endsWith('.html'));

      const countEl = document.getElementById('stat-proj-count');
      if (countEl) countEl.textContent = allFiles.length;

      await _enrichDates(allFiles);
      _render(allFiles);
    } catch (err) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:50px">
          <div style="font-size:36px;margin-bottom:10px">⚠️</div>
          <div style="font-size:15px;font-weight:700;color:var(--txt2);margin-bottom:6px">${Lang.get()==='ar'?'تعذّر جلب المشاريع':'Failed to load'}</div>
          <div style="font-size:11px;color:var(--txt3);margin-bottom:14px">${err.message}</div>
          <button class="btn btn-primary btn-sm" onclick="Projects.load()">↺ ${Lang.get()==='ar'?'إعادة':'Retry'}</button>
        </div>`;
    }
  }

  async function _enrichDates(files) {
    const { owner, repo } = PROFILE.github;
    for (let i = 0; i < files.length; i += 4) {
      await Promise.all(files.slice(i, i+4).map(async f => {
        try {
          const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(f.path)}&per_page=1`);
          if (!r.ok) return;
          const d = await r.json();
          if (d[0]) f._ts = d[0].commit.author.date;
        } catch {}
      }));
    }
  }

  function _render(files) {
    const grid = document.getElementById('proj-grid');
    if (!grid) return;
    const ar      = Lang.get() === 'ar';
    const { owner, repo, showcasesFolder } = PROFILE.github;
    const base    = `https://${owner}.github.io/${repo}/${showcasesFolder || 'showcases'}/`;

    if (files.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--txt3)">${ar?'لا توجد مشاريع':'No projects'}</div>`;
      return;
    }

    grid.innerHTML = files.map((f, i) => {
      const url     = base + f.name;
      const name    = f.name.replace(/\.html$/i,'').replace(/[-_]/g,' ');
      const icon    = _icon(f.name);
      // key للعداد — اسم الملف بدون امتداد
      const cKey    = f.name.replace(/\.html$/i,'').replace(/[^a-z0-9]/gi,'-').toLowerCase();
      const viewsId = `views-${cKey}`;

      return `
      <div class="proj-card" style="animation-delay:${(i*.07).toFixed(2)}s">
        <div class="proj-card-top">
          <div class="proj-icon">${icon}</div>
          <div class="proj-status">● ${ar?'نشط':'Live'}</div>
        </div>
        <div class="proj-name">${name}</div>
        <div class="proj-url" title="${url}">${url}</div>
        <div class="proj-meta">
          <span>HTML</span>
          <span>💾 ${_size(f.size)}</span>
          <span>🕐 ${_age(f._ts)}</span>
          <span>👁️ <span id="${viewsId}" style="color:var(--purple-l);font-weight:700">...</span></span>
        </div>
        <div class="proj-actions">
          <button class="btn btn-secondary btn-sm" onclick="Utils.copy('${url}',this)">📋 ${ar?'نسخ':'Copy'}</button>
          <button class="btn btn-primary btn-sm" onclick="window.open('${url}','_blank')">🚀 ${ar?'فتح':'Open'}</button>
        </div>
      </div>`;
    }).join('');

    // جلب عدد الزوار لكل بطاقة بدون زيادة
    files.forEach(f => {
      const cKey    = f.name.replace(/\.html$/i,'').replace(/[^a-z0-9]/gi,'-').toLowerCase();
      const viewsId = `views-${cKey}`;
      const el      = document.getElementById(viewsId);
      if (el && typeof Visitors !== 'undefined') {
        Visitors.getCount(cKey, el);
      }
    });
  }

  function filter(q) {
    const filtered = q
      ? allFiles.filter(f => f.name.toLowerCase().includes(q.toLowerCase()))
      : allFiles;
    _render(filtered);
  }

  function setView(mode) {
    const grid = document.getElementById('proj-grid');
    if (grid) grid.classList.toggle('list', mode === 'list');
    document.querySelectorAll('.vbtn').forEach(b => b.classList.toggle('active', b.dataset.view === mode));
  }

  return { load, filter, setView };
})();
