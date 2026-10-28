'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  X,
  Loader2,
  Unlink,
  ShieldCheck,
} from 'lucide-react';
import { YoutubeIcon as Youtube } from '@/components/YoutubeIcon';

interface ConnectChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDemoConnect: (channelInfo: {
    title: string;
    subscribers: string;
    views: string;
    avatar: string;
    handle?: string;
  }) => void;
  currentChannelTitle?: string;
  isCurrentlyConnected?: boolean;
  onDisconnect?: () => void;
}

export function ConnectChannelModal({
  isOpen,
  onClose,
  onDemoConnect,
  currentChannelTitle,
  isCurrentlyConnected,
  onDisconnect,
}: ConnectChannelModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Direct 1-Click Google OAuth flow
  const handleGoogleSignIn = () => {
    setLoading(true);
    // Direct redirect straight to /api/auth/youtube
    window.location.href = '/api/auth/youtube';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-dark-850 border border-dark-650 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/80 transition-colors"
          title="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-900/40 mb-4 animate-scaleUp">
          <Youtube className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <span>YouTube Kanalni Ulash</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
            1-Click
          </span>
        </h3>
        <p className="text-xs text-gray-300 mt-2 mb-6 leading-relaxed max-w-sm mx-auto">
          Google / Gmail hisobingiz orqali 1-bosishda rasmiy YouTube kanalingizni ulang va real tahlillardan foydalaning.
        </p>

        {/* Connected State Banner */}
        {isCurrentlyConnected && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 mb-6 text-xs text-left">
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">
                Ulangan: <strong className="text-white">{currentChannelTitle}</strong>
              </span>
            </div>
            {onDisconnect && (
              <button
                type="button"
                onClick={() => {
                  onDisconnect();
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 transition-all text-[11px] font-bold flex items-center gap-1 flex-shrink-0"
              >
                <Unlink className="w-3 h-3" />
                <span>Kanalni uzish</span>
              </button>
            )}
          </div>
        )}

        {/* Google / Gmail OAuth Direct Button */}
        <div className="space-y-4">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-white/10 hover:shadow-white/20 flex items-center justify-center gap-3 disabled:opacity-80 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-900" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Google / Gmail bilan kirish</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">YOKI DARHOL BOG&apos;LASH</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          {/* Instant Handle / URL Direct Connect */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Kanal havolasi yoki @handle</span>
              <span className="text-[10px] text-malla-400 font-bold">Tekshiruvsiz 1 soniyada</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masalan: @sizning_kanalingiz yoki YouTube URL"
                id="instant_channel_input"
                className="flex-1 bg-dark-900 border border-slate-700 focus:border-malla-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={async () => {
                  const input = document.getElementById('instant_channel_input') as HTMLInputElement;
                  const query = input?.value?.trim();
                  if (!query) {
                    alert("Iltimos, avval YouTube kanalingiz @handle yoki havolasini kiriting.");
                    return;
                  }
                  setLoading(true);
                  try {
                    const res = await fetch(`/api/channels/audit?q=${encodeURIComponent(query)}`);
                    const json = await res.json();
                    if (json.success && json.data) {
                      const d = json.data;
                      const channelPayload = {
                        title: d.channelTitle || query.replace('@', ''),
                        subscribers: d.subscribers || '0',
                        views: d.totalViews || '0',
                        avatar: d.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
                        handle: d.channelHandle || (query.startsWith('@') ? query : `@${query}`),
                        isPaired: true,
                      };
                      await fetch('/api/channels/connect', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(channelPayload),
                      });
                      try {
                        localStorage.setItem('tubepilot_connected_channel', JSON.stringify(channelPayload));
                      } catch {}
                      onDemoConnect(channelPayload);
                      onClose();
                      window.location.reload();
                    }
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-malla-600 to-amber-600 hover:from-malla-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Ulash</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              YouTube kanalingiz havolasini kiritsangiz, Google tasdig&apos;ini kutmasdan real tahlillar ochiladi.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Xavfsiz YouTube API ma&apos;lumotlari</span>
          </div>
        </div>
      </div>
    </div>
  );
}
