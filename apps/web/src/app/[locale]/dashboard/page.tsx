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
              if (parsed && parsed.title && parsed.isPaired) {
                setChannel(parsed);
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
    <div className="min-h-screen bg-dark-900 text-gray-100 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceIn flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-xs shadow-2xl shadow-emerald-950/60">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              TubePilot <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">AI</span>
            </h1>
          </div>
        </div>

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
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-extrabold rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white transition-all shadow-lg shadow-rose-900/40 hover:scale-[1.02] active:scale-[0.98] border border-rose-400/40"
          >
            <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
            <span>{tDash('connectPersonalChannel')}</span>
          </button>
        )}

        {/* Live System Status Badges & Utilities */}
        <div className="flex items-center gap-3">
          <div className="hidden 2xl:flex items-center gap-2 text-[11px] font-semibold text-gray-400 bg-dark-850 px-3 py-1.5 rounded-full border border-dark-700">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Next.js :3001
            </span>
            <span className="text-gray-600">·</span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <Bot className="w-3.5 h-3.5" />
              @Tuble_Pilot_bot Active
            </span>
            <span className="text-gray-600">·</span>
            <span className="flex items-center gap-1.5 text-emerald-400" title="Local file-based SQLite database active">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              SQLite dev.db
            </span>
          </div>

          {/* Subscription Tier & Upgrade to Pro Button */}
          <button
            onClick={() => {
              setUpgradeFeature(undefined);
              setShowUpgradeModal(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all shadow-md ${
              subscriptionTier === 'FREE'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white shadow-rose-950/40'
                : subscriptionTier === 'PRO'
                ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
            }`}
            title="SaaS Subscription Plans"
          >
            {subscriptionTier === 'FREE' ? (
              <>
                <Crown className="w-3.5 h-3.5 fill-white text-white" />
                <span>⭐ Upgrade to Pro</span>
              </>
            ) : (
              <>
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>👑 {subscriptionTier}</span>
              </>
            )}
          </button>

          <Link
            href={`/${locale}/pricing`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-600 transition-colors shadow-sm"
          >
            <span>Tariflar</span>
          </Link>

          {/* 60s Tour Button (Allows re-opening anytime) */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white rounded-xl bg-dark-800 border border-dark-600 transition-colors shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>60s Tour</span>
          </button>

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
          <div className="p-6 rounded-3xl bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 border border-rose-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="flex items-center gap-4 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-rose-900/40 flex-shrink-0">
                <Youtube className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>{tDash('noChannelConnected')}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                    Oflayn
                  </span>
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                  {tDash('noChannelPrompt')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowConnectModal(true)}
              className="z-10 w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-rose-900/40 flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Youtube className="w-4 h-4" />
              <span>{tDash('connectPersonalChannel')}</span>
            </button>
          </div>
        )}

        {/* Creator Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600 flex items-center gap-4">
            {isChannelConnected && channel ? (
              <img
                src={channel.avatar}
                alt="Channel Avatar"
                className="w-12 h-12 rounded-xl object-cover border border-dark-500 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                <Youtube className="w-6 h-6" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400">{tDash('welcome')}</p>
              <h2 className="text-base font-bold text-white truncate flex items-center gap-1.5">
                <span>{isChannelConnected && channel ? channel.title : tDash('noChannelConnected')}</span>
                {isChannelConnected && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
              </h2>
              {isChannelConnected && channel?.handle ? (
                <p className="text-[11px] text-rose-400 font-semibold truncate">{channel.handle}</p>
              ) : (
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="text-[11px] text-rose-400 font-semibold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Kanalni ulash</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{tDash('subscribers')}</p>
              <h3 className="text-lg font-extrabold text-white">
                {isChannelConnected && channel ? channel.subscribers : '—'}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{tDash('totalViews')}</p>
              <h3 className="text-lg font-extrabold text-white">
                {isChannelConnected && channel ? channel.views : '—'}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{tDash('avgCtr')}</p>
              <h3 className="text-lg font-extrabold text-white">
                {isChannelConnected ? '84.2%' : '—'}
              </h3>
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
