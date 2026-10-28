'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2, Copy, ExternalLink, Loader2, QrCode, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface TelegramPairingProps {
  isPaired: boolean;
  telegramUsername?: string | null;
  onPairSuccess?: (username?: string) => void;
}

export function TelegramPairingCard({ isPaired: initialPaired, telegramUsername: initialUsername, onPairSuccess }: TelegramPairingProps) {
  const [loading, setLoading] = useState(false);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [paired, setPaired] = useState(initialPaired);
  const [username, setUsername] = useState<string | null>(initialUsername || null);

  useEffect(() => {
    setPaired(initialPaired);
  }, [initialPaired]);

  useEffect(() => {
    if (initialUsername) setUsername(initialUsername);
  }, [initialUsername]);

  // Poll pairing status periodically when ticket is active or checking initial status
  useEffect(() => {
    let interval: any = null;

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/telegram/status');
        const data = await res.json();
        if (data.paired) {
          setPaired(true);
          if (data.telegramUsername) setUsername(data.telegramUsername);
          if (onPairSuccess) onPairSuccess(data.telegramUsername);
          if (interval) clearInterval(interval);
        }
      } catch (err) {
        // silent fail
      }
    };

    if (!paired) {
      checkStatus();
      if (deepLink) {
        interval = setInterval(checkStatus, 3000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [deepLink, paired, onPairSuccess]);

  const generateLink = async () => {
    setLoading(true);
    setPopupBlocked(false);
    try {
      const res = await fetch('/api/telegram/pair', { method: 'POST' });
      const data = await res.json();
      if (data.deepLink) {
        setDeepLink(data.deepLink);

        // Immediately attempt to open Telegram deep link
        try {
          const win = window.open(data.deepLink, '_blank', 'noopener,noreferrer');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            setPopupBlocked(true);
          }
        } catch {
          setPopupBlocked(true);
        }
      }
    } catch (err) {
      console.error('Pairing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (deepLink) {
      navigator.clipboard.writeText(deepLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden shadow-xl border border-malla-500/25 group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-malla-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-malla-500/20 transition-all duration-700" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-malla-600 via-amber-600 to-malla-400 text-white flex items-center justify-center border border-malla-400/40 shadow-xl shadow-malla-950/50">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-base font-black text-white flex items-center gap-2">
              Telegram Companion Sync
              <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-malla-500/20 text-malla-300 border border-malla-400/30">
                1-Click Auth
              </span>
            </h4>
            <p className="text-xs text-slate-300">1-bosishda izoh tasdiqlash, tahlillar va kanal hisobotlarini Telegramda oling</p>
          </div>
        </div>

        {paired ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            Ulangan: {username ? `@${username}` : '@tubepilotai_bot'}
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-malla-500/15 text-malla-300 border border-malla-400/30">
            Ulanmagan
          </span>
        )}
      </div>

      {!paired && (
        <div className="mt-4 pt-4 border-t border-slate-700/60 relative z-10">
          {!deepLink ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-300 max-w-md">
                Tugmani bosing va Telegramdagi <span className="text-malla-300 font-bold">@tubepilotai_bot</span> bilan YouTube kanalingizni 1 soniyada bog&apos;lang.
              </p>
              <button
                onClick={generateLink}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white text-xs sm:text-sm font-extrabold transition-all shadow-xl shadow-malla-950/60 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                1-Bosishda Bog&apos;lash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {popupBlocked && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Click the <strong>Open in Telegram</strong> button below or scan the QR code to finish pairing!</span>
                </div>
              )}

              {/* Direct Clickable Link Card & QR Code Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-2xl bg-dark-900/90 border border-slate-700/80">
                {/* QR Code Column */}
                <div className="flex flex-col items-center justify-center p-3 bg-dark-800 rounded-xl border border-slate-700/60">
                  <div className="p-2 bg-white rounded-lg shadow-inner">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(deepLink)}&margin=4`}
                      alt="Telegram Pairing QR Code"
                      className="w-32 h-32 rounded object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-bold text-malla-300">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Kamera orqali skanerlang</span>
                  </div>
                </div>

                {/* Direct Actions Column */}
                <div className="md:col-span-2 flex flex-col justify-center space-y-3">
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>@tubepilotai_bot ga ulanishga tayyor</span>
                      <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Kutilmoqda...</span>
                    </h5>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Pastdagi tugmani bosing va Telegram ochiladi. Bot tilingizni tanlashni so&apos;raydi va 1 soniyada ulaydi.
                    </p>
                  </div>

                  {/* Direct Clickable Button & Copy */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href={deepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white text-xs font-black transition-all shadow-xl shadow-malla-950/60 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Telegramda Ochish (@tubepilotai_bot)</span>
                    </a>

                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 hover:border-malla-500/30 text-xs font-semibold transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-malla-400" />
                      <span>{copied ? 'Nusxalandi!' : 'Linkni nusxalash'}</span>
                    </button>

                    <button
                      onClick={generateLink}
                      disabled={loading}
                      title="Yangi havola yaratish"
                      className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-white border border-slate-700 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Full URL snippet */}
                  <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800 text-[11px] font-mono text-slate-400 break-all select-all">
                    {deepLink}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
