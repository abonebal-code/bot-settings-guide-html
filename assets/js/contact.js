/* ═══════════════════════════════════════════════════
   contact.js — Contact Panel: Lanyard + GitHub + Modal
   ═══════════════════════════════════════════════════ */
const Contact = (() => {

  // ── Cached data ───────────────────────────────────
  let _discord = null;
  let _github  = null;

  // ── Discord badge map (public_flags bits) ─────────
  const DISCORD_BADGES = [
    { bit: 1 << 0,  icon: '👑', label: 'Discord Staff'            },
    { bit: 1 << 1,  icon: '🤝', label: 'Discord Partner'          },
    { bit: 1 << 2,  icon: '🎉', label: 'HypeSquad Events'         },
    { bit: 1 << 3,  icon: '🐛', label: 'Bug Hunter Level 1'       },
    { bit: 1 << 6,  icon: '🏠', label: 'HypeSquad Bravery'        },
    { bit: 1 << 7,  icon: '🏠', label: 'HypeSquad Brilliance'     },
    { bit: 1 << 8,  icon: '🏠', label: 'HypeSquad Balance'        },
    { bit: 1 << 9,  icon: '⭐', label: 'Early Supporter'          },
    { bit: 1 << 14, icon: '🐛', label: 'Bug Hunter Level 2'       },
    { bit: 1 << 17, icon: '🤖', label: 'Verified Bot Developer'   },
    { bit: 1 << 18, icon: '📚', label: 'Early Verified Developer' },
    { bit: 1 << 22, icon: '🔨', label: 'Moderator Alumni'         },
    { bit: 1 << 6,  icon: '🧪', label: 'Active Developer'         },
  ];
  // Active Developer flag (256 = 1<<8 conflicts, Discord uses specific value)
  const ACTIVE_DEV_FLAG = 256;

  // ── Status helpers ────────────────────────────────
  function _statusLabel(s) {
    return { online:'متصل', idle:'بعيد', dnd:'لا تزعج', offline:'غير متصل' }[s] || s;
  }
  function _statusLabelEn(s) {
    return { online:'Online', idle:'Idle', dnd:'Do Not Disturb', offline:'Offline' }[s] || s;
  }
  function _discordAvatarUrl(id, hash) {
    if (!hash) return null;
    const ext = hash.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=256`;
  }
  function _discordCreatedAt(userId) {
    // Discord snowflake → timestamp
    const ms = (BigInt(userId) >> 22n) + 1420070400000n;
    const d = new Date(Number(ms));
    return d.toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' });
  }
  function _getBadges(flags) {
    const badges = [];
    if (flags & ACTIVE_DEV_FLAG) badges.push({ icon: '💻', label: 'Active Developer' });
    for (const b of DISCORD_BADGES) {
      if ((flags & b.bit) && b.label !== 'Active Developer') badges.push(b);
    }
    return badges;
  }
  function _getActivityImage(activity) {
    if (!activity?.assets?.large_image) return null;
    const img = activity.assets.large_image;
    if (img.startsWith('mp:external/')) {
      return 'https://media.discordapp.net/' + img.replace('mp:', '');
    }
    if (img.startsWith('spotify:')) {
      return `https://i.scdn.co/image/${img.replace('spotify:','')}`;
    }
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }

  // ── Fetch Lanyard ─────────────────────────────────
  async function _fetchDiscord() {
    try {
      const id  = PROFILE.discord?.userId;
      if (!id) return null;
      const res = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
      if (!res.ok) return null;
      const { data } = await res.json();
      return data;
    } catch { return null; }
  }

  // ── Fetch GitHub ──────────────────────────────────
  async function _fetchGitHub() {
    try {
      const user = PROFILE.github?.username;
      if (!user) return null;
      const [uRes, rRes] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`)
      ]);
      const userData = uRes.ok ? await uRes.json() : null;
      const reposData = rRes.ok ? await rRes.json() : [];
      const totalStars = Array.isArray(reposData)
        ? reposData.reduce((s, r) => s + (r.stargazers_count || 0), 0)
        : 0;
      return { ...userData, totalStars, repoCount: Array.isArray(reposData) ? reposData.length : 0 };
    } catch { return null; }
  }

  // ── Build Discord card ────────────────────────────
  function _buildDiscordCard(data) {
    const user      = data?.discord_user;
    const status    = data?.discord_status || 'offline';
    const avatarUrl = user?.avatar
      ? _discordAvatarUrl(user.id, user.avatar)
      : (PROFILE.discord?.avatarUrl || null);
    const bannerUrl = PROFILE.discord?.bannerUrl || '';
    const isOnline  = status !== 'offline';
    const custom    = data?.activities?.find(a => a.type === 4);
    const activity  = data?.activities?.find(a => a.type !== 4 && a.type !== 3)
                   || data?.activities?.find(a => a.type === 3);
    const actImg    = activity ? _getActivityImage(activity) : null;

    const statusColors = {
      online:'#57f287', idle:'#f0a500', dnd:'#ed4245', offline:'#747f8d'
    };
    const statusColor = statusColors[status] || '#747f8d';

    const avatarHtml = avatarUrl
      ? `<img class="ccard-avatar" src="${avatarUrl}" alt="avatar" />`
      : `<div class="ccard-avatar ccard-avatar-placeholder">⚔️</div>`;

    const bannerHtml = bannerUrl
      ? `<div class="ccard-banner"><img src="${bannerUrl}" alt="" /></div>`
      : `<div class="ccard-banner ccard-banner-placeholder" style="background:linear-gradient(135deg,rgba(88,101,242,.5),rgba(138,43,226,.35))"></div>`;

    const actHtml = activity ? `
      <div class="ccard-activity">
        ${actImg ? `<img class="ccard-activity-img" src="${actImg}" alt="" onerror="this.style.display='none'"/>` : '<div class="ccard-activity-img" style="background:rgba(88,101,242,.3);display:flex;align-items:center;justify-content:center;font-size:14px">🎵</div>'}
        <div class="ccard-activity-info">
          <div class="ccard-activity-name">${activity.name}</div>
          <div class="ccard-activity-detail">${activity.details || activity.state || ''}</div>
        </div>
      </div>` : '';

    return `
    <div class="ccard ccard-wide" id="ccard-discord"
      style="--ccard-color:rgba(88,101,242,0.15);--ccard-glow:rgba(88,101,242,0.3);--ccard-accent:#8891f5;"
      onclick="Contact.openModal('discord')" role="button" tabindex="0">

      ${bannerHtml}

      <div class="ccard-head">
        <div class="ccard-avatar-wrap">
          ${avatarHtml}
          <div class="ccard-status-dot" style="background:${statusColor};box-shadow:0 0 8px ${statusColor}"></div>
        </div>
        <div class="ccard-platform-tag">Discord</div>
        ${isOnline ? `<div class="ccard-live"><div class="ccard-live-dot"></div>Live</div>` : ''}
      </div>

      <div class="ccard-body">
        <div class="ccard-name">${user?.global_name || user?.username || 'Abonebal'}</div>
        <div class="ccard-sub">@${user?.username || 'abonebal'}</div>
        ${custom?.state ? `<div class="ccard-custom-status">${custom.state}</div>` : ''}
        ${actHtml}
      </div>
    </div>`;
  }

  // ── Build GitHub card ─────────────────────────────
  function _buildGitHubCard(gh) {
    const repos     = gh?.repoCount   || gh?.public_repos || 0;
    const stars     = gh?.totalStars  || 0;
    const follow    = gh?.followers   || 0;
    const avatarUrl = gh?.avatar_url  || null;
    const name      = gh?.name        || PROFILE.github?.username || 'abonebal-code';
    const bio       = gh?.bio         || '';
    const user      = PROFILE.github?.username || 'abonebal-code';

    const avatarHtml = avatarUrl
      ? `<img class="ccard-avatar" src="${avatarUrl}" alt="avatar" />`
      : `<div class="ccard-avatar ccard-avatar-placeholder">🐙</div>`;

    return `
    <div class="ccard ccard-wide" id="ccard-github"
      style="--ccard-color:rgba(240,165,0,0.12);--ccard-glow:rgba(240,165,0,0.25);--ccard-accent:#f0a500;"
      onclick="Contact.openModal('github')" role="button" tabindex="0">

      <!-- Banner placeholder with GitHub feel -->
      <div class="ccard-banner ccard-banner-placeholder"
        style="background:linear-gradient(135deg,rgba(36,41,46,0.9),rgba(88,101,242,.25))">
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.08;font-size:64px">🐙</div>
        ${avatarUrl ? `<img src="${avatarUrl}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.15"/>` : ''}
      </div>

      <div class="ccard-head">
        <div class="ccard-avatar-wrap">
          ${avatarHtml}
        </div>
        <div class="ccard-platform-tag">GitHub</div>
      </div>

      <div class="ccard-body">
        <div class="ccard-name">${name}</div>
        <div class="ccard-sub">@${user}</div>
        ${bio ? `<div class="ccard-custom-status">${bio}</div>` : ''}
        <div class="ccard-stats">
          <div class="ccard-stat">
            <div class="ccard-stat-num" style="color:#f0a500">${repos}</div>
            <div class="ccard-stat-lbl">Repos</div>
          </div>
          <div class="ccard-stat">
            <div class="ccard-stat-num" style="color:#f0a500">${stars}</div>
            <div class="ccard-stat-lbl">Stars</div>
          </div>
          <div class="ccard-stat">
            <div class="ccard-stat-num" style="color:#f0a500">${follow}</div>
            <div class="ccard-stat-lbl">Followers</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  // ── Render hero (banner + avatar) ─────────────────
  function _renderHero(discordData) {
    const heroEl = document.getElementById('contact-hero');
    if (!heroEl) return;

    const user      = discordData?.discord_user;
    const status    = discordData?.discord_status || 'offline';
    const avatarUrl = user?.avatar
      ? _discordAvatarUrl(user.id, user.avatar)
      : (PROFILE.discord?.avatarUrl || null);
    const bannerUrl = PROFILE.discord?.bannerUrl || '';

    const bannerHtml = bannerUrl
      ? `<img class="contact-banner" src="${bannerUrl}" alt="banner" onerror="this.parentElement.innerHTML='<div class=contact-banner-placeholder></div>'" />`
      : `<div class="contact-banner-placeholder"></div>`;

    const avatarHtml = avatarUrl
      ? `<img class="contact-avatar" src="${avatarUrl}" alt="avatar" />`
      : `<div class="contact-avatar-placeholder">⚔️</div>`;

    heroEl.innerHTML = `
      ${bannerHtml}
      <div class="contact-avatar-wrap">
        ${avatarHtml}
        <div class="contact-status-dot ${status}"></div>
      </div>`;
  }

  // ── Render profile info ───────────────────────────
  function _renderProfileInfo(discordData) {
    const el = document.getElementById('contact-profile-info');
    if (!el) return;

    const user    = discordData?.discord_user;
    const flags   = user?.public_flags || 0;
    const badges  = _getBadges(flags);
    const custom  = discordData?.activities?.find(a => a.type === 4);
    const ar      = typeof Lang !== 'undefined' ? Lang.get() === 'ar' : true;
    const status  = discordData?.discord_status || 'offline';

    const badgesHtml = badges.map(b =>
      `<div class="contact-badge"><span class="badge-icon">${b.icon}</span>${b.label}</div>`
    ).join('');

    el.innerHTML = `
      <div class="contact-profile-names">
        <div class="contact-display-name">${user?.global_name || user?.username || 'Abonebal'}</div>
        <div class="contact-username">@${user?.username || 'abonebal'} · ${ar ? _statusLabel(status) : _statusLabelEn(status)}</div>
        ${custom?.state ? `<div class="contact-custom-status">${custom.state}</div>` : ''}
        ${badgesHtml ? `<div class="contact-badges">${badgesHtml}</div>` : ''}
      </div>`;
  }

  // ── Render cards ──────────────────────────────────
  function _renderCards() {
    const el = document.getElementById('contact-cards');
    if (!el) return;
    let html = '';
    html += _buildDiscordCard(_discord || {});
    html += _buildGitHubCard(_github   || { username: PROFILE.github?.username });
    el.innerHTML = html;
  }

  // ── Open Modal ────────────────────────────────────
  function openModal(type) {
    const overlay = document.getElementById('contact-modal-overlay');
    const body    = document.getElementById('contact-modal-body');
    if (!overlay || !body) return;

    if (type === 'discord') _buildDiscordModal(body);
    if (type === 'github')  _buildGitHubModal(body);

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('contact-modal-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Discord Modal ─────────────────────────────────
  function _buildDiscordModal(body) {
    const data    = _discord;
    const user    = data?.discord_user;
    const status  = data?.discord_status || 'offline';
    const id      = PROFILE.discord?.userId || '';
    const avatarUrl = user?.avatar
      ? _discordAvatarUrl(user.id, user.avatar)
      : (PROFILE.discord?.avatarUrl || null);
    const bannerUrl = PROFILE.discord?.bannerUrl || '';
    const flags   = user?.public_flags || 0;
    const badges  = _getBadges(flags);
    const custom  = data?.activities?.find(a => a.type === 4);
    const activity= data?.activities?.find(a => a.type !== 4 && a.type !== 3)
                 || data?.activities?.find(a => a.type === 3);
    const actImg  = activity ? _getActivityImage(activity) : null;
    const created = id ? _discordCreatedAt(id) : '—';
    const ar = typeof Lang !== 'undefined' ? Lang.get() === 'ar' : true;

    // Discord deep link: tries app first, falls back to web
    const discordLink = `discord://discord.com/users/${id}`;
    const discordWeb  = `https://discord.com/users/${id}`;

    const bannerHtml = bannerUrl
      ? `<img class="modal-banner" src="${bannerUrl}" alt="" />`
      : `<div class="modal-banner-placeholder" style="--modal-color1:rgba(88,101,242,.45);--modal-color2:rgba(138,43,226,.3)"></div>`;

    const avatarHtml = avatarUrl
      ? `<img class="modal-avatar" src="${avatarUrl}" alt="avatar" />`
      : `<div class="modal-avatar-placeholder">⚔️</div>`;

    const badgesHtml = badges.map(b =>
      `<div class="modal-badge"><span>${b.icon}</span>${b.label}</div>`
    ).join('');

    const actHtml = activity ? `
      <div class="modal-activity">
        ${actImg ? `<img class="modal-activity-img" src="${actImg}" alt="" onerror="this.style.display='none'" />` : ''}
        <div>
          <div class="modal-activity-name">${activity.name}</div>
          <div class="modal-activity-detail">${activity.details || ''}</div>
          <div class="modal-activity-detail">${activity.state  || ''}</div>
        </div>
      </div>` : '';

    body.innerHTML = `
      <div class="contact-modal" style="--modal-glow:rgba(88,101,242,0.2)">
        <button class="modal-close-btn" onclick="Contact.closeModal()">✕</button>
        ${bannerHtml}
        <div class="modal-avatar-wrap" style="margin:0 0 0 24px;transform:translateY(-40px)">
          ${avatarHtml}
          <div class="modal-status-dot ${status}"></div>
        </div>
        <div class="modal-body" style="padding-top:0">
          <div class="modal-display-name">${user?.global_name || user?.username || 'Abonebal'}</div>
          <div class="modal-username">@${user?.username || 'abonebal'}</div>
          ${custom?.state ? `<div class="modal-custom-status">${custom.state}</div>` : ''}
          ${badgesHtml ? `<div class="modal-badges">${badgesHtml}</div>` : ''}
          <div class="modal-divider"></div>
          <div class="modal-info-row">
            <span class="modal-info-icon">🆔</span>
            <div>
              <div class="modal-info-label">User ID</div>
              <div class="modal-info-value" style="font-family:var(--font-mono);font-size:12px">${id}</div>
            </div>
          </div>
          <div class="modal-info-row">
            <span class="modal-info-icon">📅</span>
            <div>
              <div class="modal-info-label">${ar ? 'تاريخ الإنشاء' : 'Member Since'}</div>
              <div class="modal-info-value">${created}</div>
            </div>
          </div>
          <div class="modal-info-row">
            <span class="modal-info-icon">📡</span>
            <div>
              <div class="modal-info-label">${ar ? 'الحالة' : 'Status'}</div>
              <div class="modal-info-value">${ar ? _statusLabel(status) : _statusLabelEn(status)}</div>
            </div>
          </div>
          ${actHtml}
          <div class="modal-divider"></div>
          <button class="modal-cta"
            style="--cta-bg:linear-gradient(135deg,#5865f2,#8a2be2);--cta-shadow:rgba(88,101,242,0.45)"
            onclick="window.location.href='${discordLink}'; setTimeout(()=>window.open('${discordWeb}','_blank'),500)">
            🎮 ${ar ? 'تواصل عبر Discord' : 'Open in Discord'}
          </button>
        </div>
      </div>`;
  }

  // ── GitHub Modal ──────────────────────────────────
  function _buildGitHubModal(body) {
    const gh      = _github;
    const user    = PROFILE.github?.username || 'abonebal-code';
    const ar      = typeof Lang !== 'undefined' ? Lang.get() === 'ar' : true;
    const avatarUrl = gh?.avatar_url || null;
    const repos   = gh?.repoCount || gh?.public_repos || 0;
    const stars   = gh?.totalStars || 0;
    const follow  = gh?.followers  || 0;
    const bio     = gh?.bio || '';
    const created = gh?.created_at
      ? new Date(gh.created_at).toLocaleDateString('ar-EG', { year:'numeric', month:'long' })
      : '—';

    const avatarHtml = avatarUrl
      ? `<img class="modal-avatar" src="${avatarUrl}" alt="avatar" style="border:3px solid rgba(10,10,24,.9);box-shadow:0 0 20px rgba(240,165,0,.4)"/>`
      : `<div class="modal-avatar-placeholder">🐙</div>`;

    body.innerHTML = `
      <div class="contact-modal" style="--modal-glow:rgba(240,165,0,0.2)">
        <button class="modal-close-btn" onclick="Contact.closeModal()">✕</button>

        <!-- Banner with avatar blurred in background -->
        <div class="modal-banner-placeholder" style="
          background:linear-gradient(135deg,rgba(36,41,46,.95),rgba(88,101,242,.2));
          position:relative;overflow:hidden;">
          ${avatarUrl ? `<img src="${avatarUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.12;filter:blur(8px);transform:scale(1.1)"/>` : ''}
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.06;font-size:80px">🐙</div>
        </div>

        <div style="display:flex;align-items:flex-end;padding:0 24px;margin-top:-40px;margin-bottom:12px;gap:12px;position:relative;z-index:2">
          ${avatarHtml}
          <div style="padding-bottom:6px">
            <div style="font-size:18px;font-weight:900;color:var(--txt)">${gh?.name || user}</div>
            <div style="font-size:12px;color:var(--txt3);font-family:var(--font-mono)">@${user}</div>
          </div>
        </div>

        <div class="modal-body" style="padding-top:0">
          ${bio ? `<div class="modal-custom-status" style="margin-bottom:14px">${bio}</div>` : ''}
          <div class="modal-divider"></div>
          <div class="modal-gh-stats">
            <div class="modal-gh-stat" style="--cta-color:#f0a500">
              <div class="modal-gh-stat-num">${repos}</div>
              <div class="modal-gh-stat-lbl">${ar ? 'مشروع' : 'Repos'}</div>
            </div>
            <div class="modal-gh-stat" style="--cta-color:#f0a500">
              <div class="modal-gh-stat-num">${stars}</div>
              <div class="modal-gh-stat-lbl">${ar ? 'نجمة' : 'Stars'}</div>
            </div>
            <div class="modal-gh-stat" style="--cta-color:#f0a500">
              <div class="modal-gh-stat-num">${follow}</div>
              <div class="modal-gh-stat-lbl">${ar ? 'متابع' : 'Followers'}</div>
            </div>
          </div>
          <div class="modal-info-row">
            <span class="modal-info-icon">📅</span>
            <div>
              <div class="modal-info-label">${ar ? 'عضو منذ' : 'Member Since'}</div>
              <div class="modal-info-value">${created}</div>
            </div>
          </div>
          <div class="modal-divider"></div>
          <a class="modal-cta"
            href="https://github.com/${user}" target="_blank" rel="noopener"
            style="--cta-bg:linear-gradient(135deg,#1a1f24,#2d333b);--cta-shadow:rgba(0,0,0,0.6);border:1px solid rgba(240,165,0,.25)">
            🐙 ${ar ? 'فتح GitHub' : 'Open GitHub'}
          </a>
        </div>
      </div>`;
  }

  // ── Init ──────────────────────────────────────────
  async function init() {
    // Render skeleton immediately
    _renderCards();

    // Fetch in parallel
    [_discord, _github] = await Promise.all([
      _fetchDiscord(),
      _fetchGitHub()
    ]);

    // Render with real data
    _renderHero(_discord);
    _renderProfileInfo(_discord);
    _renderCards();

    // Close modal on overlay click
    const overlay = document.getElementById('contact-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
      });
    }

    // Keyboard close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    // Live update every 30s via Lanyard
    setInterval(async () => {
      const fresh = await _fetchDiscord();
      if (fresh) {
        _discord = fresh;
        _renderHero(fresh);
        _renderProfileInfo(fresh);
        const dc = document.getElementById('ccard-discord');
        if (dc) dc.outerHTML = _buildDiscordCard(fresh);
      }
    }, 30000);
  }

  return { init, openModal, closeModal };
})();
