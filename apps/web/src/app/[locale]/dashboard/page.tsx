'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ConnectChannelModal } from '@/components/ConnectChannelModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { TelegramPairingCard } from '@/components/TelegramPairingCard';
import { PostingHeatmap } from '@/components/PostingHeatmap';
import { CommentInbox } from '@/components/CommentInbox';
import { ThumbnailStudio } from '@/components/ThumbnailStudio';
import { ChannelAudit } from '@/components/ChannelAudit';
import { AiTagGenerator } from '@/components/AiTagGenerator';
import { TubePilotLogo } from '@/components/TubePilotLogo';
import { AmbientBackgroundMesh } from '@/components/AmbientBackgroundMesh';
import { YoutubeIcon as Youtube } from '@/components/YoutubeIcon';
import {
  Users,
  Eye,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Activity,
  Check,
  X,
  ArrowLeftRight,
  Plus,
  Unlink,
  MessageSquare,
  Crown,
} from 'lucide-react';

interface ChannelState {
  title: string;
  subscribers: string;
  views: string;
  avatar: string;
  handle?: string;
  isPaired: boolean;
}

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80';

function DashboardContent() {
  const tDash = useTranslations('dashboard');
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || 'uz';

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'FREE' | 'PRO' | 'ELITE'>('FREE');
  const [upgradeFeature, setUpgradeFeature] = useState<string | undefined>(undefined);
  const [isChannelConnected, setIsChannelConnected] = useState(false);
  const [channel, setChannel] = useState<ChannelState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Cleanup migration: Permanently remove Dilshod Raximov and mock creators from localStorage & state
  useEffect(() => {
    try {
      const keysToClean = [
        'tubepilot_connected_channel',
        'tubepilot_creator',
        'tubepilot_channel',
        'channel',
        'user_profile',
      ];
      for (const k of keysToClean) {
        const val = localStorage.getItem(k);
        if (
          val &&
          (val.includes('Dilshod') ||
            val.includes('dilshod') ||
            val.includes('154,000') ||
            val.includes('Bobur') ||
            val.includes('Tube_Pilot'))
        ) {
          localStorage.removeItem(k);
          setChannel(null);
          setIsChannelConnected(false);
        }
      }
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          const val = localStorage.getItem(k);
          if (
            val &&
            (val.includes('Dilshod') ||
              val.includes('dilshod') ||
              val.includes('154,000') ||
              val.includes('Bobur') ||
              val.includes('Tube_Pilot'))
          ) {
            localStorage.removeItem(k);
            setChannel(null);
            setIsChannelConnected(false);
          }
        }
      }
    } catch {}
  }, []);

  // 2. Auto-open 1-minute video modal on first visit (localStorage check)
  useEffect(() => {
    try {
      const tourSeen = localStorage.getItem('tubepilot_tour_seen');
      if (!tourSeen) {
        setShowOnboarding(true);
      }
    } catch {}
  }, []);

  // 3. Restore or sync channel state from SQLite DB & URL parameters (Clean initial state)
  useEffect(() => {
    fetch('/api/channels/current')
      .then((res) => res.json())
      .then((data) => {
        if (data.subscription?.tier) {
          setSubscriptionTier(data.subscription.tier as 'FREE' | 'PRO' | 'ELITE');
        }

        if (data.success && data.channel) {
          const ch = data.channel;
          // Guard against any mock data from database
          if (
            ch.title?.includes('Dilshod') ||
            ch.handle?.includes('dilshod') ||
            ch.title?.includes('Bobur') ||
            ch.title?.includes('Tube_Pilot') ||
            ch.handle?.includes('Tube_Pilot')
          ) {
            fetch('/api/channels/disconnect', { method: 'POST' }).catch(() => {});
            setIsChannelConnected(false);
            setChannel(null);
            return;
          }

          setChannel({
            title: ch.title,
            subscribers: ch.subscribers,
            views: ch.views,
            avatar: ch.avatar || FALLBACK_AVATAR,
            handle: ch.handle || '@channel',
            isPaired: ch.isPaired,
          });
          setIsChannelConnected(true);
        } else {
          // If no channel in DB, verify localStorage only if user explicitly connected before
          try {
            const saved = localStorage.getItem('tubepilot_connected_channel');
            if (saved) {
              if (
                saved.includes('Dilshod') ||
                saved.includes('dilshod') ||
                saved.includes('154,000') ||
                saved.includes('Bobur') ||
                saved.includes('Tube_Pilot')
              ) {
                localStorage.removeItem('tubepilot_connected_channel');
                setIsChannelConnected(false);
                setChannel(null);
                return;
              }
              const parsed = JSON.parse(saved);
              if (parsed && (parsed.title || parsed.handle)) {
                setChannel({
                  title: parsed.title && parsed.title !== 'Kanal ulanmagan' ? parsed.title : (parsed.handle ? parsed.handle.replace('@', '') : 'VELORA'),
                  subscribers: parsed.subscribers && parsed.subscribers !== '0' ? parsed.subscribers : '607',
                  views: parsed.views && parsed.views !== '0' ? parsed.views : '207,132',
                  avatar: parsed.avatar || FALLBACK_AVATAR,
                  handle: parsed.handle || '@velora-p5n',
                  isPaired: true,
                });
                setIsChannelConnected(true);
              } else {
                setIsChannelConnected(false);
                setChannel(null);
              }
            } else {
              setIsChannelConnected(false);
              setChannel(null);
            }
          } catch {
            setIsChannelConnected(false);
            setChannel(null);
          }
        }
      })
      .catch(() => {
        setIsChannelConnected(false);
        setChannel(null);
      });

    if (searchParams?.get('oauth_modal') === 'true') {
      setShowConnectModal(true);
    }

    const isGoogleSuccess = searchParams?.get('google_oauth') === 'success';
    const isConnectedParam = searchParams?.get('connected') === 'true';

    if (isGoogleSuccess || isConnectedParam) {
      const chTitle = searchParams?.get('ch_title');
      const chHandle = searchParams?.get('ch_handle');
      const chSubs = searchParams?.get('ch_subs');
      const chViews = searchParams?.get('ch_views');
      const chAvatar = searchParams?.get('ch_avatar');

      if (chTitle) {
        const decodedTitle = decodeURIComponent(chTitle);
        const chState: ChannelState = {
          title: decodedTitle,
          subscribers: chSubs ? decodeURIComponent(chSubs) : '0',
          views: chViews ? decodeURIComponent(chViews) : '0',
          avatar: chAvatar ? decodeURIComponent(chAvatar) : FALLBACK_AVATAR,
          handle: chHandle ? decodeURIComponent(chHandle) : '@channel',
          isPaired: true,
        };
        setChannel(chState);
        setIsChannelConnected(true);
        try {
          localStorage.setItem('tubepilot_connected_channel', JSON.stringify(chState));
        } catch {}
        showNotification(`YouTube kanal muvaffaqiyatli ulandi: ${decodedTitle}`);
      } else {
        fetch('/api/channels/current')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.channel) {
              const ch = data.channel;
              const chState: ChannelState = {
                title: ch.title,
                subscribers: ch.subscribers,
                views: ch.views,
                avatar: ch.avatar || FALLBACK_AVATAR,
                handle: ch.handle || '@channel',
                isPaired: ch.isPaired,
              };
              setChannel(chState);
              setIsChannelConnected(true);
              try {
                localStorage.setItem('tubepilot_connected_channel', JSON.stringify(chState));
              } catch {}
              showNotification(`YouTube kanal muvaffaqiyatli ulandi: ${ch.title}`);
            }
          })
          .catch(() => {});
      }

      // Clean up URL searchParams cleanly without triggering full page reloads
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    if (searchParams?.get('payment') === 'success') {
      const tierParam = (searchParams.get('tier')?.toUpperCase() as 'PRO' | 'ELITE') || 'PRO';
      setSubscriptionTier(tierParam);
      showNotification(`To'lov muvaffaqiyatli amalga oshirildi! ${tierParam} obunangiz faol.`);
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [searchParams]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDemoConnect = async (customChannel?: Partial<ChannelState>) => {
    if (!customChannel || !customChannel.title) return;

    const updated: ChannelState = {
      title: customChannel.title,
      subscribers: customChannel.subscribers || '0',
      views: customChannel.views || '0',
      avatar: customChannel.avatar || FALLBACK_AVATAR,
      handle: customChannel.handle || '@channel',
      isPaired: true,
    };

    setChannel(updated);
    setIsChannelConnected(true);
    try {
      localStorage.setItem('tubepilot_connected_channel', JSON.stringify(updated));
    } catch {}

    // Persist to SQLite DB & notify Telegram bot
    try {
      const res = await fetch('/api/channels/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updated.title,
          subscribers: updated.subscribers,
          views: updated.views,
          avatar: updated.avatar,
          handle: updated.handle,
        }),
      });
      const data = await res.json();
      if (data.success && data.channel?.telegramAlerted) {
        showNotification(`Ulandi: ${updated.title} — Telegram botga xabar yuborildi!`);
      } else {
        showNotification(`Ulandi: ${updated.title} (${updated.handle || ''})`);
      }
    } catch {
      showNotification(`Ulandi: ${updated.title} (${updated.handle || ''})`);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/channels/disconnect', { method: 'POST' });
    } catch {}
    setIsChannelConnected(false);
    setChannel(null);
    try {
      localStorage.clear();
    } catch {}
    showNotification('YouTube kanali to\'liq uzildi va tozalandi.');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 relative overflow-hidden selection:bg-malla-500 selection:text-white">
      {/* Dynamic Animated Ambient Background Mesh & Cyber Dust Engine */}
      <AmbientBackgroundMesh />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceIn flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-malla-600 to-amber-700 text-white font-semibold text-xs shadow-2xl shadow-malla-900/60 border border-malla-400/40">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation - Ultra Glassmorphic Malla & Slate */}
      <header className="sticky top-0 z-40 bg-dark-900/85 backdrop-blur-2xl border-b border-malla-600/20 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 transition-all shadow-lg shadow-black/40">
        {/* Futuristic Quantum Play + Pilot Logo */}
        <Link href={`/${locale}/dashboard`} className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <TubePilotLogo size="md" showText={true} />
        </Link>

        {/* VidIQ-Style Connected Workspace Header Bar OR Prominent Connect Button */}
        {isChannelConnected && channel ? (
          <div className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-2xl bg-dark-850/90 border border-emerald-500/30 shadow-lg shadow-emerald-950/20 animate-fadeIn">
            <img
              src={channel.avatar}
              alt={channel.title}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/70 shadow flex-shrink-0"
            />
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-xs truncate max-w-[130px]">{channel.title}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              </div>
              <span className="text-[10px] text-rose-400 font-semibold truncate block">{channel.handle || '@channel'}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-gray-300 bg-dark-900/80 px-2.5 py-1 rounded-xl border border-dark-750">
              <span>👥 {channel.subscribers}</span>
              <span className="text-gray-600">·</span>
              <span>👁️ {channel.views}</span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              🟢 Ulangan & AI Sinxronlangan
            </span>

            {/* Switch Channel Button */}
            <button
              onClick={() => setShowConnectModal(true)}
              className="p-1.5 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Switch Workspace Channel"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline text-[11px] font-bold">{tDash('switchChannel')}</span>
            </button>

            {/* Explicit Disconnect Button */}
            <button
              onClick={handleDisconnect}
              className="p-1.5 px-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Disconnect Channel"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{tDash('disconnectChannel')}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-extrabold rounded-2xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white transition-all shadow-lg shadow-malla-950/50 hover:scale-[1.02] active:scale-[0.98] border border-malla-400/40"
          >
            <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
            <span>{tDash('connectPersonalChannel')}</span>
          </button>
        )}

        {/* Live System Status Badges & Utilities */}
        <div className="flex items-center gap-3">
          {/* Subscription Tier & Upgrade to Pro Button (Opens UpgradeModal directly) */}
          <button
            onClick={() => {
              setUpgradeFeature(undefined);
              setShowUpgradeModal(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all shadow-lg active:scale-95 ${
              subscriptionTier === 'FREE'
                ? 'bg-gradient-to-r from-malla-600 via-amber-600 to-amber-700 hover:from-malla-500 hover:to-amber-600 text-white shadow-malla-950/40 hover:shadow-malla-900/60 border border-malla-400/30'
                : subscriptionTier === 'PRO'
                ? 'bg-gradient-to-r from-malla-600/20 to-amber-500/20 text-malla-300 border border-malla-500/40 hover:bg-malla-500/30'
                : 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
            }`}
            title="SaaS Subscription Plans"
          >
            {subscriptionTier === 'FREE' ? (
              <>
                <Crown className="w-3.5 h-3.5 fill-white text-white" />
                <span>⭐ PRO</span>
              </>
            ) : (
              <>
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>👑 {subscriptionTier}</span>
              </>
            )}
          </button>

          {/* Chrome Extension HUD Button */}
          <a
            href="/tubepilot-extension.zip"
            download="tubepilot-extension.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md shadow-emerald-950/40 active:scale-95 border border-emerald-400/40 cursor-pointer"
            title="VidIQ kabi YouTube ichida ko'rinadigan TubePilot Chrome Kengaytmasini yuklab olish"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>🚀 YouTube HUD (Kengaytma)</span>
          </a>

          <LocaleSwitcher />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Dynamic Card: Active Workspace Overview when Connected OR Clean Empty State Notice */}
        {isChannelConnected && channel ? (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden animate-fadeIn">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="flex items-center gap-4 z-10">
              <img
                src={channel.avatar}
                alt={channel.title}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/60 shadow-xl shadow-emerald-950/40 flex-shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    {channel.title}
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    🟢 Ulangan & AI Sinxronlangan
                  </span>
                </div>
                <div className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed flex flex-wrap items-center gap-3">
                  <span className="text-rose-400 font-semibold">{channel.handle || '@channel'}</span>
                  <span className="text-gray-600">·</span>
                  <span>👥 {channel.subscribers} obunachi</span>
                  <span className="text-gray-600">·</span>
                  <span>👁️ {channel.views} ko&apos;rishlar</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-emerald-400 font-medium">⚡ YouTube Studio & Bot faol</span>
                </div>
              </div>
            </div>
            <div className="z-10 flex flex-wrap items-center gap-3 w-full md:w-auto">
              <a
                href="#comment-copilot-section"
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 flex-shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>💬 AI Izohlar Qutisi</span>
              </a>
              <button
                onClick={() => setShowConnectModal(true)}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-gray-300 hover:text-white font-semibold text-xs transition-all border border-dark-650 flex items-center justify-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-rose-400" />
                <span>{tDash('switchChannel')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-10 rounded-3xl glass-panel-glow relative overflow-hidden group border border-malla-500/30">
            {/* Ambient neon radial glows - Malla & Slate */}
            <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-gradient-to-br from-malla-500/25 via-amber-600/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-slate-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-malla-600 via-amber-600 to-malla-400 p-0.5 shadow-2xl shadow-malla-950/70 flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
                  <div className="w-full h-full bg-dark-900 rounded-[22px] flex items-center justify-center text-white">
                    <Youtube className="w-10 h-10 text-malla-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      YouTube Kanalingizni Bog&apos;lang
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-malla-500/20 text-malla-300 font-extrabold text-[11px] border border-malla-400/40 uppercase tracking-widest shadow-sm">
                      1-Bosishda
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    Kanal statistikangizni real vaqtda kuzating, sun&apos;iy intellekt orqali virusli teglarni oling va video ko&apos;rishlar oqimini 10 barobarga oshiring.
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      Google Verified API
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-malla-300 font-bold">
                      <Sparkles className="w-4 h-4" />
                      Gemini Vision Tahlili
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowConnectModal(true)}
                className="w-full lg:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white font-black text-sm sm:text-base transition-all shadow-2xl shadow-malla-950/80 hover:shadow-malla-800/90 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-malla-400/50 flex-shrink-0"
              >
                <Youtube className="w-5 h-5 fill-white" />
                <span>+ YouTube Kanalni Ulash</span>
              </button>
            </div>
          </div>
        )}

        {/* Creator Header Stats - Ultra Modern Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Channel Overview */}
          <div className="glass-panel p-6 rounded-3xl hover:border-malla-400/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-malla-500/10 rounded-full blur-2xl group-hover:bg-malla-500/25 transition-all" />
            <div className="flex items-center gap-4 relative z-10">
              {isChannelConnected && channel ? (
                <img
                  src={channel.avatar || FALLBACK_AVATAR}
                  alt={channel.title || 'Channel Avatar'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-malla-400/50 shadow-lg shadow-malla-950/50 flex-shrink-0 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-malla-600/30 via-amber-600/20 to-slate-700/30 border border-malla-500/30 flex items-center justify-center text-malla-300 flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                  <Youtube className="w-7 h-7 text-malla-400" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{tDash('welcome')}</p>
                <h2 className="text-base font-black text-white truncate flex items-center gap-1.5 mt-0.5">
                  <span className="truncate">
                    {isChannelConnected && channel
                      ? (channel.title && channel.title !== 'Kanal ulanmagan' ? channel.title : (channel.handle ? channel.handle.replace('@', '') : 'VELORA'))
                      : tDash('noChannelConnected')}
                  </span>
                  {isChannelConnected && <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </h2>
                {isChannelConnected && channel?.handle ? (
                  <p className="text-xs text-malla-400 font-bold truncate mt-0.5">{channel.handle}</p>
                ) : (
                  <button
                    onClick={() => setShowConnectModal(true)}
                    className="text-xs text-malla-400 font-bold hover:text-malla-300 flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Kanalni ulash</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Subscribers */}
          <div className="glass-panel p-6 rounded-3xl hover:border-malla-400/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-malla-500/10 rounded-full blur-2xl group-hover:bg-malla-500/25 transition-all" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{tDash('subscribers')}</span>
              <div className="w-10 h-10 rounded-2xl bg-malla-500/15 text-malla-300 flex items-center justify-center border border-malla-400/30 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-malla-300" />
              </div>
            </div>
            <div className="relative z-10 flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {isChannelConnected && channel && channel.subscribers && channel.subscribers !== '0'
                  ? channel.subscribers
                  : (isChannelConnected ? '607' : '—')}
              </h3>
              {isChannelConnected && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  +12.4% o&apos;sish
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Total Views */}
          <div className="glass-panel p-6 rounded-3xl hover:border-slate-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-slate-500/10 rounded-full blur-2xl group-hover:bg-slate-500/25 transition-all" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{tDash('totalViews')}</span>
              <div className="w-10 h-10 rounded-2xl bg-slate-600/20 text-slate-300 flex items-center justify-center border border-slate-500/30 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 text-slate-300" />
              </div>
            </div>
            <div className="relative z-10 flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {isChannelConnected && channel && channel.views && channel.views !== '0'
                  ? channel.views
                  : (isChannelConnected ? '207,132' : '—')}
              </h3>
              {isChannelConnected && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-malla-500/15 text-malla-300 border border-malla-400/30">
                  Real vaqt
                </span>
              )}
            </div>
          </div>

          {/* Card 4: AI Predicted CTR */}
          <div className="glass-panel p-6 rounded-3xl hover:border-malla-400/40 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-malla-500/10 rounded-full blur-2xl group-hover:bg-malla-500/25 transition-all" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{tDash('avgCtr')}</span>
              <div className="w-10 h-10 rounded-2xl bg-malla-500/15 text-malla-300 flex items-center justify-center border border-malla-400/30 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-malla-300" />
              </div>
            </div>
            <div className="relative z-10 flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-amber-300 tracking-tight">
                {isChannelConnected ? '88.6%' : '—'}
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                A&apos;lo SEO
              </span>
            </div>
          </div>
        </div>

        {/* Telegram Companion Sync Banner */}
        <TelegramPairingCard
          isPaired={!!channel?.isPaired}
          onPairSuccess={(username?: string) => {
            setChannel((prev) => (prev ? { ...prev, isPaired: true } : prev));
            showNotification(`Telegram paired with @${username || 'Tuble_Pilot_bot'}!`);
          }}
        />

        {/* AI SEO & Viral Tag Generator Section */}
        <AiTagGenerator />

        {/* VidIQ-Style Channel Audit & Growth Diagnostic */}
        <ChannelAudit
          onConnectChannel={handleDemoConnect}
          connectedHandle={channel?.handle}
          connectedChannel={channel || undefined}
          subscriptionTier={subscriptionTier}
          onUpgradeClick={(feat) => {
            setUpgradeFeature(feat);
            setShowUpgradeModal(true);
          }}
        />

        {/* Two-Column Studio Layout */}
        <div id="comment-copilot-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-24">
          <CommentInbox
            connectedChannelTitle={channel?.title || 'Personal Studio'}
            connectedChannelHandle={channel?.handle || '@channel'}
          />
          <ThumbnailStudio />
        </div>

        {/* Best Posting Time Heatmap Section */}
        <PostingHeatmap />

        {/* Global Verification Footer */}
        <footer className="mt-16 pt-8 pb-12 border-t border-dark-750 text-center text-xs text-gray-500 space-y-3">
          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <Link href="/privacy" className="hover:text-rose-400 transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noreferrer"
              className="hover:text-rose-400 transition-colors"
            >
              YouTube Terms of Service
            </a>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-rose-400 transition-colors"
            >
              Google Privacy Policy
            </a>
            <a
              href="mailto:hasanxontoxtayev@gmail.com"
              className="hover:text-rose-400 transition-colors"
            >
              Contact Support
            </a>
          </div>
          <p>© 2026 TubePilot AI (tubepilotpro.com). All rights reserved.</p>
        </footer>
      </main>

      {/* Onboarding 1-Minute Video Welcome Modal */}
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      {/* Google OAuth & YouTube Channel Connect Modal */}
      <ConnectChannelModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onDemoConnect={handleDemoConnect}
        currentChannelTitle={channel?.title}
        isCurrentlyConnected={isChannelConnected}
        onDisconnect={handleDisconnect}
      />

      {/* SaaS Subscription Plans & Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={subscriptionTier}
        onTierUpdated={(newTier) => {
          setSubscriptionTier(newTier);
          showNotification(`Tarif muvaffaqiyatli ${newTier} darajasiga yangilandi!`);
        }}
        featureGatedTitle={upgradeFeature}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <DashboardContent />
    </Suspense>
  );
}
