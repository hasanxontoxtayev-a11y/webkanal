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

        {/* 1. Primary: Direct 1-Click Search & Connect Form */}
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem('channelQuery') as HTMLInputElement;
              const val = input?.value?.trim();
              if (!val) return;
              setLoading(true);
              try {
                const res = await fetch(`/api/channels/audit?q=${encodeURIComponent(val)}`);
                const data = await res.json();
                if (data.success && data.data) {
                  onDemoConnect({
                    title: data.data.channelTitle,
                    subscribers: data.data.subscribers,
                    views: data.data.totalViews,
                    avatar: data.data.avatarUrl,
                    handle: data.data.channelHandle,
                  });
                  onClose();
                } else {
                  alert("Kanal topilmadi. Kanal nomi yoki @handle'ni tekshirib ko'ring (masalan: @TaoroGamesRu)");
                }
              } catch (err) {
                console.error("Direct channel connect error:", err);
                alert("Ulanishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
              } finally {
                setLoading(false);
              }
            }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <input
                name="channelQuery"
                type="text"
                required
                defaultValue="@TaoroGamesRu"
                placeholder="Kanal nomi yoki @handle (masalan: @TaoroGamesRu)..."
                className="flex-1 px-4 py-3.5 rounded-2xl bg-dark-900 border border-dark-650 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Ulash</span>}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Parolsiz xavfsiz ulanish
              </span>
              <span>1 soniyada tayyor</span>
            </div>
          </form>

          {/* Quick Connect suggestions */}
          <div className="pt-2">
            <p className="text-[11px] text-gray-500 text-left mb-2 font-medium">Tezkor namunalar:</p>
            <div className="flex flex-wrap gap-1.5">
              {['@TaoroGamesRu', '@kunuz', '@Subyektivist'].map((h) => (
                <button
                  key={h}
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch(`/api/channels/audit?q=${encodeURIComponent(h)}`);
                      const data = await res.json();
                      if (data.success && data.data) {
                        onDemoConnect({
                          title: data.data.channelTitle,
                          subscribers: data.data.subscribers,
                          views: data.data.totalViews,
                          avatar: data.data.avatarUrl,
                          handle: data.data.channelHandle,
                        });
                        onClose();
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-dark-750 hover:bg-dark-700 text-gray-300 hover:text-white border border-dark-650 text-[11px] transition-colors"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-dark-700"></div>
            <span className="flex-shrink mx-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              yoki Google OAuth orqali
            </span>
            <div className="flex-grow border-t border-dark-700"></div>
          </div>

          {/* 2. Secondary: Google OAuth Flow */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-5 rounded-2xl bg-dark-900 hover:bg-dark-800 text-gray-200 hover:text-white font-bold text-xs transition-all border border-dark-700 flex items-center justify-center gap-2.5 disabled:opacity-80"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
            <span>Google orqali rasmiy kirish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
