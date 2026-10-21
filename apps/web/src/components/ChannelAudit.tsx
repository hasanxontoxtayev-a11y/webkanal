'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Sparkles,
  Eye,
  Users,
  Film,
  Award,
  Zap,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  DollarSign,
  Activity,
  Calculator,
  Flame,
  Crown,
  Lock,
} from 'lucide-react';
import { TelegramHelpButton } from './TelegramHelpButton';

export interface ChannelAuditProps {
  onConnectChannel?: (channel: {
    title: string;
    subscribers: string;
    views: string;
    avatar: string;
    handle: string;
  }) => void;
  connectedHandle?: string;
  connectedChannel?: {
    title: string;
    subscribers: string;
    views: string;
    avatar: string;
    handle?: string;
  };
  subscriptionTier?: 'FREE' | 'PRO' | 'ELITE';
  onUpgradeClick?: (feature?: string) => void;
}

export function ChannelAudit({
  onConnectChannel,
  connectedHandle,
  connectedChannel,
  subscriptionTier = 'FREE',
  onUpgradeClick,
}: ChannelAuditProps = {}) {
  const [query, setQuery] = useState('@MKBHD');
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);
  const [showCompetitorSpy, setShowCompetitorSpy] = useState(false);

  const fetchAudit = async (targetQuery: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/channels/audit?q=${encodeURIComponent(targetQuery)}`);
      const data = await res.json();
      if (data.success) {
        setAuditData(data.data);
      }
    } catch (err) {
      console.warn('Audit fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit('@MKBHD');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchAudit(query.trim());
    }
  };

  const handlePreset = (preset: string) => {
    setQuery(preset);
    fetchAudit(preset);
  };

  return (
    <section id="channel-audit" className="p-6 sm:p-8 rounded-3xl bg-dark-800/90 border border-dark-600/90 shadow-2xl relative overflow-hidden space-y-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-malla-500/20 text-malla-300 border border-malla-400/30 flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-malla-400" />
              VidIQ-Style Growth Engine
            </span>
            <TelegramHelpButton featureKey="overview" label="Audit in Telegram" />
            <button
              type="button"
              onClick={() => {
                if (subscriptionTier === 'FREE') {
                  onUpgradeClick?.("Raqobatchilarni to'liq josuslik qilish (Competitor Spy)");
                }
                setShowCompetitorSpy(!showCompetitorSpy);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                showCompetitorSpy
                  ? 'bg-gradient-to-r from-malla-600 to-amber-600 text-white border-malla-400/50 shadow-md shadow-malla-950/40'
                  : 'bg-dark-900 text-slate-300 hover:text-white border-slate-700/80 hover:border-malla-400/40'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-malla-400" />
              <span>{showCompetitorSpy ? 'Hide Competitor Spy' : '⚔️ Competitor Spy & Compare'}</span>
              {subscriptionTier === 'FREE' && (
                <span className="px-1.5 py-0.2 text-[9px] bg-amber-500/30 text-amber-300 rounded font-bold border border-amber-500/40">
                  PRO
                </span>
              )}
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            YouTube Channel Audit <span className="text-gradient-malla">&amp; Diagnostic</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real vaqt tahlili: VPH tezligi, kutilayotgan daromad (RPM), video SEO holati va muqova (thumbnail) jozibadorligi.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Istalgan YouTube kanalini qidiring (masalan: Subyektiv, Kun.uz, @MKBHD)..."
              className="w-full pl-11 pr-28 py-3 rounded-2xl bg-dark-900 border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-malla-400 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white text-xs font-black transition-all shadow-md shadow-malla-950/40 disabled:opacity-50 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Audit</span>
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-bold">Misollar:</span>
            {['@kunuz_official', 'Subyektiv', 'Daryo', '@MKBHD', '@MrBeast'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  query === preset
                    ? 'bg-malla-500/25 text-malla-200 border border-malla-400/40 shadow-sm'
                    : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-700/80'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Audit Report View */}
      {loading ? (
        <div className="p-16 rounded-2xl bg-dark-900/60 border border-dark-700/80 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
          <div className="text-center">
            <h4 className="text-sm font-bold text-white">Calculating VPH Velocity & Revenue Projection...</h4>
            <p className="text-xs text-gray-400 mt-1">Analyzing video title length, thumbnail contrast, and engagement ratios</p>
          </div>
        </div>
      ) : auditData ? (
        <div className="space-y-6 relative z-10">
          {/* Competitor Spy & Side-by-Side Head-to-Head Comparison */}
          {showCompetitorSpy && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-dark-950 via-dark-900 to-rose-950/20 border-2 border-rose-500/40 shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dark-700/80">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                    <Flame className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>Competitor Spy: Head-to-Head Analysis</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Live VidIQ Matrix
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">Comparing your connected workspace against searched competitor</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCompetitorSpy(false)}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-dark-800 border border-dark-700 transition-colors"
                >
                  Close Spy View
                </button>
              </div>

              {subscriptionTier === 'FREE' ? (
                <div className="relative rounded-2xl overflow-hidden p-8 border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-dark-900 to-black text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                    <Crown className="w-3.5 h-3.5" />
                    PRO & ELITE EXCLUSIVE
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Raqobatchilarni to'liq josuslik qilish (Competitor Spy)
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
                    Raqobatchilaringiz qaysi maxfiy teglardan foydalanayotgani, soatlik real-time ko'rishlar (VPH) va tomoshabinlar oqimini to'liq ko'rish uchun Pro yoki Elite tarifiga o'ting.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => onUpgradeClick?.("Raqobatchilarni to'liq josuslik qilish (Competitor Spy)")}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-purple-950/60 hover:scale-105 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Pro / Elite'ga o'tish (Upgrade)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Side by Side Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Connected Workspace */}
                <div className="p-4 rounded-2xl bg-dark-850 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Your Workspace Channel
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">Active Creator</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {connectedChannel?.avatar ? (
                      <img
                        src={connectedChannel.avatar}
                        alt="Your avatar"
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center text-gray-500 flex-shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate">
                        {connectedChannel?.title && connectedChannel.title !== 'Kanal ulanmagan'
                          ? connectedChannel.title
                          : (connectedChannel?.handle ? connectedChannel.handle.replace('@', '') : 'Kanal ulanmagan')}
                      </h4>
                      <p className="text-xs text-rose-400 font-semibold">
                        {connectedChannel?.handle || '@ulanish'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-750 text-xs">
                    <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                      <span className="text-[10px] text-gray-400 block">Subscribers</span>
                      <strong className="text-white text-xs">{connectedChannel?.subscribers && connectedChannel.subscribers !== '0' ? connectedChannel.subscribers : (connectedChannel ? '607' : '—')}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                      <span className="text-[10px] text-gray-400 block">Lifetime Views</span>
                      <strong className="text-white text-xs">{connectedChannel?.views && connectedChannel.views !== '0' ? connectedChannel.views : (connectedChannel ? '207,132' : '—')}</strong>
                    </div>
                  </div>
                </div>

                {/* Column 2: Competitor Channel */}
                <div className="p-4 rounded-2xl bg-dark-850 border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Target Competitor
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                      Grade {auditData.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={auditData.avatarUrl}
                      alt={auditData.channelTitle}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/50 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate">{auditData.channelTitle}</h4>
                      <p className="text-xs text-rose-400 font-semibold">{auditData.channelHandle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-750 text-xs">
                    <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                      <span className="text-[10px] text-gray-400 block">Subscribers</span>
                      <strong className="text-white text-xs">{auditData.subscribers}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-dark-900 border border-dark-800">
                      <span className="text-[10px] text-gray-400 block">Lifetime Views</span>
                      <strong className="text-white text-xs">{auditData.totalViews}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Head-to-Head Comparison Metrics */}
              <div className="p-4 rounded-2xl bg-dark-900/90 border border-dark-750 space-y-2 text-xs">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                  Algorithmic Head-to-Head Gap Analysis:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750">
                    <span className="text-[10px] text-gray-400 block">VPH Velocity Benchmark</span>
                    <strong className="text-sky-400 text-xs">{auditData.vph?.currentVph}</strong>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">{auditData.vph?.velocityTrend}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750">
                    <span className="text-[10px] text-gray-400 block">Regional AdSense RPM</span>
                    <strong className="text-emerald-400 text-xs">{auditData.monetization?.estimatedRpm}</strong>
                    <span className="text-[10px] text-gray-400 block mt-0.5 truncate">{auditData.monetization?.regionBadge}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750">
                    <span className="text-[10px] text-gray-400 block">SEO & Discoverability</span>
                    <strong className="text-white text-xs">{auditData.scores?.seo}% Score</strong>
                    <span className="text-[10px] text-rose-400 block mt-0.5">Mobile titles & keywords</span>
                  </div>
                </div>
              </div>
            </>
          )}
            </div>
          )}

          {/* Channel Banner & Health Scorecard */}
          <div className="p-6 rounded-2xl bg-dark-900/90 border border-dark-700/80 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Creator Metadata */}
              <div className="flex items-center gap-4">
                <img
                  src={auditData.avatarUrl}
                  alt={auditData.channelTitle}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40 shadow-lg flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white">{auditData.channelTitle}</h3>
                    <span className="p-0.5 rounded-full bg-sky-500/20 text-sky-400">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-rose-400 mt-0.5">{auditData.channelHandle}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <strong>{auditData.subscribers}</strong> subscribers
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      <strong>{auditData.totalViews}</strong> total views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-gray-400" />
                      <strong>{auditData.videoCount}</strong> uploads
                    </span>
                  </div>

                  {onConnectChannel && (
                    <div className="mt-3.5">
                      {connectedHandle === auditData.channelHandle ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active Workspace Channel
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            onConnectChannel({
                              title: auditData.channelTitle,
                              subscribers: auditData.subscribers,
                              views: auditData.totalViews,
                              avatar: auditData.avatarUrl,
                              handle: auditData.channelHandle,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Connect As Workspace Channel</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Overall Score Ring */}
              <div className="flex items-center gap-4 bg-dark-800 p-4 rounded-2xl border border-dark-700">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 flex-shrink-0">
                  <span className="text-xl font-black">{auditData.overallScore}</span>
                  <span className="text-[10px] absolute bottom-1 font-semibold text-rose-200">/ 100</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Channel Grade</span>
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Grade {auditData.grade}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-xs leading-snug">
                    {auditData.verdict}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: VPH Estimator & RPM Monthly Earnings Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Views Per Hour (VPH) Estimator Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-sky-950/20 border border-sky-500/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                    <Activity className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Views Per Hour (VPH) Estimator</h4>
                    <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Algorithmic Pace
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {auditData.vph?.velocityTrend || '+16.5% vs 48h'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{auditData.vph?.currentVph || '24,500 VPH'}</span>
                <span className="text-xs text-gray-400">peak: {auditData.vph?.peakVph || '85,000 VPH'}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-dark-700/80 flex items-center justify-between text-xs text-gray-300">
                <span className="text-gray-400 truncate max-w-[240px]">
                  🔥 Top Velocity: <span className="text-white font-medium">{auditData.vph?.topVphVideo || 'Latest flagship upload'}</span>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> High Momentum
                </span>
              </div>
            </div>

            {/* Projected Monthly Earnings & RPM Calculator Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-emerald-950/20 border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Projected Earnings & RPM</h4>
                      <span className="text-[10px] text-emerald-400 font-semibold">{auditData.monetization?.regionBadge || 'Regional Market CPM'}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    RPM: {auditData.monetization?.estimatedRpm || '$0.60'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  {auditData.monetization?.projectedMonthlyMax === '$0' || auditData.monetization?.projectedMonthlyMin === '$0' && auditData.monetization?.projectedMonthlyMax === '$0' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-400 tracking-tight">—</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Monetizatsiyaga ulanmagan (YPP talabi: 1,000 obunachi)
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {auditData.monetization?.projectedMonthlyMin} – {auditData.monetization?.projectedMonthlyMax}
                      </span>
                      <span className="text-xs text-gray-400">/ month (Total Net)</span>
                    </>
                  )}
                </div>

                {/* Clean 3-Pillar Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-dark-700/80 text-[11px]">
                  <div className="p-2 rounded-xl bg-dark-900/80 border border-dark-750">
                    <span className="text-gray-400 block text-[10px] font-medium">Estimated Monthly AdSense</span>
                    <strong className="text-emerald-400 font-bold">{auditData.monetization?.breakdown?.monthlyAdsense || '$3,400 – $5,000'}</strong>
                  </div>

                  <div className="p-2 rounded-xl bg-dark-900/80 border border-dark-750">
                    <span className="text-gray-400 block text-[10px] font-medium">Shorts vs Long-form</span>
                    <strong className="text-white font-bold">{auditData.monetization?.breakdown?.longFormEstimate || '$3,100'} <span className="text-gray-400 font-normal">/</span> <span className="text-sky-400">{auditData.monetization?.breakdown?.shortsEstimate || '$260'}</span></strong>
                  </div>

                  <div className="p-2 rounded-xl bg-dark-900/80 border border-dark-750">
                    <span className="text-gray-400 block text-[10px] font-medium">Sponsorship Potential</span>
                    <strong className="text-pink-400 font-bold">{auditData.monetization?.breakdown?.sponsorshipPotential || '$2,500 – $6,000'}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-dark-700/80 flex items-center justify-between text-xs text-gray-300">
                <span className="text-gray-400">
                  Annualized Run-Rate: <strong className="text-white font-bold">{auditData.monetization?.projectedAnnual}</strong>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5" /> AdSense + Brand Integrations
                </span>
              </div>
            </div>
          </div>

          {/* 4 Pillar Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-dark-900/80 border border-dark-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">SEO & Discoverability</span>
                <span className="text-sm font-extrabold text-white">{auditData.scores.seo}%</span>
              </div>
              <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${auditData.scores.seo}%` }} />
              </div>
              <p className="text-[11px] text-gray-400">Search intent alignment & description keyword density.</p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900/80 border border-dark-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Engagement Velocity</span>
                <span className="text-sm font-extrabold text-white">{auditData.scores.engagement}%</span>
              </div>
              <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${auditData.scores.engagement}%` }} />
              </div>
              <p className="text-[11px] text-gray-400">Like ratio {auditData.metrics.likeRatio} & comment rate {auditData.metrics.commentRate}.</p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900/80 border border-dark-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Thumbnail Clickability</span>
                <span className="text-sm font-extrabold text-white">{auditData.scores.thumbnail}%</span>
              </div>
              <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${auditData.scores.thumbnail}%` }} />
              </div>
              <p className="text-[11px] text-gray-400">Mobile screen subject contrast & legibility threshold.</p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900/80 border border-dark-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Upload Cadence</span>
                <span className="text-sm font-extrabold text-white">{auditData.scores.cadence}%</span>
              </div>
              <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${auditData.scores.cadence}%` }} />
              </div>
              <p className="text-[11px] text-gray-400">{auditData.metrics.uploadFrequency} • Peak: {auditData.metrics.peakUploadDay}</p>
            </div>
          </div>

          {/* Two-Column Audit Details: Checklist vs Outliers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VidIQ Checklist */}
            <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-700 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-500" />
                  Video SEO & Factor Audit Checklist
                </h4>
                <span className="text-xs font-semibold text-gray-400">VidIQ Standard</span>
              </div>

              <div className="divide-y divide-dark-800">
                {auditData.checklist.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-start gap-3">
                    {item.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
                    {item.status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                    {item.status === 'fail' && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />}
                    <div>
                      <h5 className="text-xs font-bold text-gray-200">{item.title}</h5>
                      <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Outliers (Top Performing vs Underperforming) */}
            <div className="p-6 rounded-2xl bg-dark-900/80 border border-dark-700 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  Top Video Outlier Multipliers
                </h4>
                <span className="text-xs font-semibold text-gray-400">vs Channel Baseline</span>
              </div>

              <div className="space-y-3">
                {auditData.topVideos.map((video: any) => (
                  <div key={video.id} className="p-3 rounded-xl bg-dark-800/80 border border-dark-700 flex items-center gap-3">
                    <img src={video.thumbnail} alt={video.title} className="w-20 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{video.title}</h5>
                      <p className="text-[11px] text-gray-400 mt-0.5">{video.views} views</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 flex-shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {video.multiplier}
                    </span>
                  </div>
                ))}

                {auditData.underperformingVideos?.map((video: any) => (
                  <div key={video.id} className="p-3 rounded-xl bg-dark-800/80 border border-dark-700 flex items-center gap-3">
                    <img src={video.thumbnail} alt={video.title} className="w-20 h-12 rounded-lg object-cover flex-shrink-0 opacity-75" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-gray-300 truncate">{video.title}</h5>
                      <p className="text-[11px] text-rose-400 mt-0.5 font-medium">{video.issue}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
                      Fix Needed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gemini AI Strategic Growth Directives */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/30 via-dark-900 to-sky-950/30 border border-dark-700 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-bold text-white">Gemini AI Prescriptive Growth Directives</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                Actionable Next Steps
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {auditData.aiRecommendations.map((rec: string, index: number) => (
                <div key={index} className="p-3.5 rounded-xl bg-dark-800/80 border border-dark-700/80 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
