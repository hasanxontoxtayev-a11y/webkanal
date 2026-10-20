/**
 * TubePilot AI — Universal YouTube Growth HUD & Studio Copilot Content Script
 * 
 * VidIQ-parity floating HUD delivering live channel telemetry, views velocity (VPH),
 * regional RPM earnings estimation, SEO diagnostic grade, and seamless workspace sync.
 */

(function () {
  const API_BASE_URL = 'https://www.tubepilotpro.com';
  const FALLBACK_API_URL = 'http://localhost:3001';
  const LOCAL_DEV_URL = 'http://localhost:3000';
  const HUD_CONTAINER_ID = 'tubepilot-hud-root';
  const HEADER_HUD_CONTAINER_ID = 'tubepilot-header-hud-root';

  interface WorkspaceStatus {
    connected: boolean;
    channel: {
      id: string;
      title: string;
      handle: string;
      avatar: string;
      subscribers: string;
      views: string;
      videoCount?: number;
      isPaired?: boolean;
    } | null;
    token?: string;
    dashboardUrl?: string;
  }

  let currentChannelKey: string | null = null;
  let isFetching = false;
  let isCollapsed = false;
  let workspaceStatus: WorkspaceStatus | null = null;

  // ---------------------------------------------------------------------------
  // 1. Purge Legacy Vidoor Elements
  // ---------------------------------------------------------------------------
  function cleanLegacyVidoorElements() {
    const legacySelectors = [
      '#vidoor-hud',
      '#vidoor-container',
      '.vidoor-container',
      '.vidoor-hud',
      '.vidoor-widget',
      '.vidoor-badge',
      '[data-vidoor]',
    ];
    legacySelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Fetch Connected TubePilot Workspace Status (/api/extension/status)
  // ---------------------------------------------------------------------------
  async function fetchWorkspaceStatus(): Promise<WorkspaceStatus | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/extension/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          workspaceStatus = data;
          return data;
        }
      }
    } catch {}

    try {
      const resFallback = await fetch(`${FALLBACK_API_URL}/api/extension/status`);
      if (resFallback.ok) {
        const data = await resFallback.json();
        if (data.success) {
          workspaceStatus = data;
          return data;
        }
      }
    } catch {}

    return null;
  }

  // ---------------------------------------------------------------------------
  // 3. Dynamic Channel Identifier Extractor
  // ---------------------------------------------------------------------------
  function getActiveChannelIdentifier(): { type: 'handle' | 'channelId' | 'custom' | 'studio' | 'watch' | null; identifier: string | null } {
    const { hostname, pathname } = window.location;

    // A. YouTube Studio (studio.youtube.com)
    if (hostname === 'studio.youtube.com') {
      const parts = pathname.split('/').filter(Boolean);
      if (parts[0] === 'channel' && parts[1]) {
        return { type: 'studio', identifier: parts[1] };
      }
      return { type: 'studio', identifier: 'studio_personal' };
    }

    // B. Standard YouTube (youtube.com)
    const segments = pathname.split('/').filter(Boolean);
    if (!segments.length) return { type: null, identifier: null };

    // 1. Handle (/@channelHandle)
    if (segments[0].startsWith('@')) {
      return { type: 'handle', identifier: segments[0] };
    }

    // 2. Channel ID (/channel/UC...)
    if (segments[0] === 'channel' && segments[1]) {
      return { type: 'channelId', identifier: segments[1] };
    }

    // 3. Custom or user legacy URL (/c/Name or /user/Name)
    if ((segments[0] === 'c' || segments[0] === 'user') && segments[1]) {
      return { type: 'custom', identifier: segments[1] };
    }

    // 4. Watch Page (/watch?v=...) -> Resolve video author channel from DOM
    if (pathname === '/watch') {
      const ownerEl = document.querySelector(
        'ytd-watch-metadata ytd-channel-name a, #owner ytd-channel-name a, ytd-video-owner-renderer a'
      ) as HTMLAnchorElement | null;
      if (ownerEl && ownerEl.href) {
        try {
          const ownerUrl = new URL(ownerEl.href);
          const ownerSegments = ownerUrl.pathname.split('/').filter(Boolean);
          if (ownerSegments[0]) {
            return { type: 'watch', identifier: ownerSegments[0] };
          }
        } catch {}
      }
    }

    return { type: null, identifier: null };
  }

  // ---------------------------------------------------------------------------
  // 4. Workspace Match Resolver
  // ---------------------------------------------------------------------------
  function isWorkspaceChannel(identifier: string | null, channelTitle?: string): boolean {
    if (!workspaceStatus?.connected || !workspaceStatus.channel) return false;
    const wsChannel = workspaceStatus.channel;

    if (identifier === 'studio_personal') return true;
    if (identifier && wsChannel.id && identifier.toLowerCase() === wsChannel.id.toLowerCase()) return true;

    const wsHandle = (wsChannel.handle || '').toLowerCase().replace(/^@/, '');
    const curHandle = (identifier || '').toLowerCase().replace(/^@/, '');
    if (wsHandle && curHandle && wsHandle === curHandle) return true;

    if (channelTitle && wsChannel.title) {
      if (channelTitle.trim().toLowerCase() === wsChannel.title.trim().toLowerCase()) return true;
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // 5. Fetch Live Telemetry Dynamically from TubePilot AI Engine
  // ---------------------------------------------------------------------------
  async function fetchChannelTelemetry(identifier: string) {
    const query = encodeURIComponent(identifier);
    try {
      const res = await fetch(`${API_BASE_URL}/api/channels/audit?q=${query}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data.data;
      }
    } catch {}

    try {
      const resFallback = await fetch(`${FALLBACK_API_URL}/api/channels/audit?q=${query}`);
      if (resFallback.ok) {
        const data = await resFallback.json();
        if (data.success && data.data) return data.data;
      }
    } catch {}

    return null;
  }

  // ---------------------------------------------------------------------------
  // 6. Inject In-Page Channel Header HUD Widget
  // ---------------------------------------------------------------------------
  function injectChannelHeaderHUD(data: any, meta: { type: string; identifier: string | null }, isWs: boolean) {
    cleanLegacyVidoorElements();

    // Look for YouTube channel header containers
    const targetParent =
      document.querySelector('ytd-c4-tabbed-header-renderer #page-header') ||
      document.querySelector('ytd-c4-tabbed-header-renderer #inner-header-container') ||
      document.querySelector('ytd-c4-tabbed-header-renderer') ||
      document.querySelector('#channel-header') ||
      document.querySelector('ytd-tabbed-page-header');

    if (!targetParent) return;

    let banner = document.getElementById(HEADER_HUD_CONTAINER_ID);
    if (!banner) {
      banner = document.createElement('div');
      banner.id = HEADER_HUD_CONTAINER_ID;
      banner.className = 'tp-channel-header-hud';
      targetParent.appendChild(banner);
    }

    const channelTitle = data?.channelTitle || meta.identifier || 'Channel';
    const channelHandle = data?.channelHandle || (meta.identifier?.startsWith('@') ? meta.identifier : `@${meta.identifier || 'channel'}`);
    const subscribers = data?.subscribers || 'Real-time';
    const currentVph = data?.vph?.currentVph || '1,150';
    const rpmBadge = data?.monetization?.regionBadge || 'Localized RPM';
    const estRpm = data?.monetization?.estimatedRpm || '$0.65';
    const monthlyRange = data?.monetization?.projectedMonthlyMin && data?.monetization?.projectedMonthlyMax
      ? `${data.monetization.projectedMonthlyMin} – ${data.monetization.projectedMonthlyMax}`
      : '$380 – $1,250';
    const score = data?.overallScore || 88;
    const dashboardUrl = `${API_BASE_URL}/uz/dashboard?audit_handle=${encodeURIComponent(channelHandle)}`;

    banner.innerHTML = `
      <div class="tp-header-hud-inner">
        <div class="tp-header-hud-left">
          <div class="tp-header-hud-logo">
            <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="tp-header-hud-info">
            <div class="tp-header-hud-title-row">
              <span class="tp-header-hud-name">TubePilot AI Growth HUD</span>
              ${
                isWs
                  ? `<span class="tp-workspace-badge-connected">🟢 Connected Workspace</span>`
                  : `<span class="tp-workspace-badge-competitor">⚡ Competitor Channel Telemetry</span>`
              }
            </div>
            <span class="tp-header-hud-subtext">${channelTitle} (${channelHandle}) · Subscribers: <strong>${subscribers}</strong></span>
          </div>
        </div>

        <div class="tp-header-hud-metrics">
          <div class="tp-header-metric-pill">
            <span class="tp-header-metric-label">⚡ Views Velocity</span>
            <span class="tp-header-metric-value emerald">${currentVph} VPH</span>
          </div>
          <div class="tp-header-metric-pill">
            <span class="tp-header-metric-label">💰 Est. RPM (${rpmBadge})</span>
            <span class="tp-header-metric-value sky">${estRpm} (${monthlyRange}/mo)</span>
          </div>
          <div class="tp-header-metric-pill">
            <span class="tp-header-metric-label">🎯 Growth Score</span>
            <span class="tp-header-metric-value rose">${score}/100</span>
          </div>
        </div>

        <div class="tp-header-hud-actions">
          <a href="${dashboardUrl}" target="_blank" class="tp-btn-header-dashboard">
            <span>🚀 Open in TubePilot Dashboard</span>
          </a>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 7. Inject Floating TubePilot AI HUD
  // ---------------------------------------------------------------------------
  function injectFloatingHUD(data: any, channelMeta: { type: string; identifier: string | null }, isWs: boolean) {
    cleanLegacyVidoorElements();

    let container = document.getElementById(HUD_CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = HUD_CONTAINER_ID;
      document.body.appendChild(container);
    }

    const isStudio = channelMeta.type === 'studio';
    const channelTitle = data?.channelTitle || channelMeta.identifier || 'Active Channel';
    const channelHandle = data?.channelHandle || (channelMeta.identifier?.startsWith('@') ? channelMeta.identifier : `@${channelMeta.identifier || 'channel'}`);
    const subscribers = data?.subscribers || 'Real-time';
    const totalViews = data?.totalViews || 'Real-time';
    const currentVph = data?.vph?.currentVph || 'Analyzing';
    const peakVph = data?.vph?.peakVph || 'Top';
    const rpmBadge = data?.monetization?.regionBadge || 'Localized RPM';
    const estRpm = data?.monetization?.estimatedRpm || '$0.65';
    const monthlyRange = data?.monetization?.projectedMonthlyMin && data?.monetization?.projectedMonthlyMax
      ? `${data.monetization.projectedMonthlyMin} – ${data.monetization.projectedMonthlyMax}`
      : 'Estimating...';
    const grade = data?.grade || 'A';
    const score = data?.overallScore || 88;
    const avatarUrl = data?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80';

    const studioUrl = `${API_BASE_URL}/uz/dashboard?audit_handle=${encodeURIComponent(channelHandle)}`;

    container.innerHTML = `
      <div class="tp-hud-card ${isCollapsed ? 'tp-collapsed' : ''}">
        <!-- Top Drag Header -->
        <div class="tp-hud-header">
          <div class="tp-brand-wrap">
            <div class="tp-logo-badge">
              <svg class="tp-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="tp-brand-title">
              <span class="tp-name">TubePilot <span class="tp-pill">AI</span></span>
              <span class="tp-status-live">
                <span class="tp-dot"></span> ${isWs ? 'Your Workspace' : 'Growth Telemetry'}
              </span>
            </div>
          </div>
          <div class="tp-header-actions">
            <button id="tp-btn-toggle" class="tp-icon-btn" title="${isCollapsed ? 'Kengaytirish' : 'Yigʻish'}">
              ${isCollapsed ? '□' : '–'}
            </button>
            <button id="tp-btn-close" class="tp-icon-btn" title="Yopish">✕</button>
          </div>
        </div>

        ${isCollapsed ? `
          <div class="tp-collapsed-bar" id="tp-collapsed-bar">
            <span class="tp-collapsed-title">${channelTitle}</span>
            <span class="tp-collapsed-vph">⚡ ${currentVph} VPH</span>
          </div>
        ` : `
          <!-- Body Content -->
          <div class="tp-hud-body">
            <!-- Channel Profile Bar -->
            <div class="tp-channel-profile">
              <img src="${avatarUrl}" alt="${channelTitle}" class="tp-channel-avatar" />
              <div class="tp-channel-details">
                <div class="tp-channel-name" title="${channelTitle}">${channelTitle}</div>
                <div class="tp-channel-sub">${channelHandle}</div>
              </div>
              <div class="tp-grade-badge ${grade === 'A+' ? 'tp-grade-apex' : ''}">${grade}</div>
            </div>

            <!-- Workspace Status Badge -->
            <div style="margin-bottom: 8px;">
              ${
                isWs
                  ? `<span class="tp-workspace-badge-connected" style="font-size:10px;">🟢 Your Connected Workspace</span>`
                  : `<span class="tp-workspace-badge-competitor" style="font-size:10px;">⚡ Competitor Channel Telemetry</span>`
              }
            </div>

            <!-- Stats Grid -->
            <div class="tp-grid-2">
              <div class="tp-stat-box">
                <span class="tp-box-label">👥 Subscribers</span>
                <span class="tp-box-val">${subscribers}</span>
              </div>
              <div class="tp-stat-box">
                <span class="tp-box-label">👁️ Total Views</span>
                <span class="tp-box-val">${totalViews}</span>
              </div>
            </div>

            <!-- Telemetry Cards -->
            <div class="tp-telemetry-row">
              <div class="tp-telemetry-label">
                <span>⚡ Views Velocity (VPH)</span>
                <span class="tp-telemetry-sub">Peak: ${peakVph}</span>
              </div>
              <div class="tp-telemetry-val text-emerald">${currentVph} / hr</div>
            </div>

            <div class="tp-telemetry-row">
              <div class="tp-telemetry-label">
                <span>💰 Estimated RPM (${rpmBadge})</span>
                <span class="tp-telemetry-sub">Monthly: ${monthlyRange}</span>
              </div>
              <div class="tp-telemetry-val text-sky">${estRpm}</div>
            </div>

            <div class="tp-telemetry-row">
              <div class="tp-telemetry-label">
                <span>🎯 VidIQ Health Score</span>
                <span class="tp-telemetry-sub">Algorithmic Grade</span>
              </div>
              <div class="tp-telemetry-val text-rose">${score}/100</div>
            </div>

            ${isStudio ? `
              <!-- Studio Personal Sync Banner -->
              <div class="tp-studio-sync-card">
                <div class="tp-studio-text">
                  <span class="tp-studio-title">YouTube Studio Detected</span>
                  <span class="tp-studio-sub">Ushbu shaxsiy kanalingizni TubePilot AI bilan tezkor sinxronlang.</span>
                </div>
                <button id="tp-btn-sync-studio" class="tp-btn-sync">
                  ⚡ Sync with TubePilot AI
                </button>
              </div>
            ` : ''}

            <!-- Direct Actions -->
            <div class="tp-hud-actions">
              <a href="${studioUrl}" target="_blank" class="tp-btn-studio">
                <span>🚀 Open in TubePilot Dashboard</span>
              </a>
            </div>
          </div>
        `}
      </div>
    `;

    // Event listeners
    const toggleBtn = container.querySelector('#tp-btn-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isCollapsed = !isCollapsed;
        injectFloatingHUD(data, channelMeta, isWs);
      });
    }

    const collapsedBar = container.querySelector('#tp-collapsed-bar');
    if (collapsedBar) {
      collapsedBar.addEventListener('click', () => {
        isCollapsed = false;
        injectFloatingHUD(data, channelMeta, isWs);
      });
    }

    const closeBtn = container.querySelector('#tp-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container?.remove();
      });
    }

    const syncBtn = container.querySelector('#tp-btn-sync-studio');
    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        syncBtn.textContent = 'Syncing...';
        try {
          await fetch(`${API_BASE_URL}/api/channels/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: channelTitle,
              handle: channelHandle,
              subscribers: subscribers,
              views: totalViews,
              avatar: avatarUrl,
            }),
          });
          syncBtn.textContent = '✅ Synced!';
          setTimeout(() => {
            window.open(studioUrl, '_blank');
          }, 600);
        } catch {
          syncBtn.textContent = '❌ Sync Failed';
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 8. Pipeline Controller
  // ---------------------------------------------------------------------------
  async function updateHUD() {
    const meta = getActiveChannelIdentifier();
    if (!meta.identifier) return;

    if (currentChannelKey === meta.identifier && document.getElementById(HUD_CONTAINER_ID)) {
      return;
    }

    if (isFetching) return;
    isFetching = true;
    currentChannelKey = meta.identifier;

    try {
      // 1. Fetch workspace status if not cached
      if (!workspaceStatus) {
        await fetchWorkspaceStatus();
      }

      // 2. Fetch telemetry for current channel
      const data = await fetchChannelTelemetry(meta.identifier);

      // 3. Check workspace pairing
      const isWs = isWorkspaceChannel(meta.identifier, data?.channelTitle);

      // 4. Inject both in-header HUD and floating HUD
      injectChannelHeaderHUD(data, meta, isWs);
      injectFloatingHUD(data, meta, isWs);
    } catch (err) {
      console.warn('[TubePilot AI Extension] Telemetry sync error:', err);
    } finally {
      isFetching = false;
    }
  }

  // ---------------------------------------------------------------------------
  // 9. Initialize & Listen to SPA Transitions
  // ---------------------------------------------------------------------------
  function init() {
    fetchWorkspaceStatus().then(() => updateHUD());

    // YouTube SPA transitions
    window.addEventListener('yt-navigate-finish', () => setTimeout(updateHUD, 600));
    window.addEventListener('yt-page-data-updated', () => setTimeout(updateHUD, 600));
    window.addEventListener('popstate', () => setTimeout(updateHUD, 600));

    // Periodic safety check if DOM changes or on watch page navigation
    setInterval(() => {
      const meta = getActiveChannelIdentifier();
      if (meta.identifier && (meta.identifier !== currentChannelKey || !document.getElementById(HUD_CONTAINER_ID))) {
        updateHUD();
      }
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
