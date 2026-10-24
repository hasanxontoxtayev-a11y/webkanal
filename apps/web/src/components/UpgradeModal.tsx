'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  X,
  Check,
  Sparkles,
  Zap,
  Crown,
  Shield,
  Loader2,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: 'FREE' | 'PRO';
  onTierUpdated?: (newTier: 'FREE' | 'PRO') => void;
  featureGatedTitle?: string;
  featureGatedDesc?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentTier = 'FREE',
  onTierUpdated,
  featureGatedTitle,
  featureGatedDesc,
}: UpgradeModalProps) {
  const t = useTranslations('pricing');
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<'click' | 'payme' | 'card'>('click');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayPro = async (provider: 'click' | 'payme' | 'card') => {
    setLoading(true);
    setSuccessMessage(null);

    try {
      if (provider === 'click') {
        const res = await fetch('/api/billing/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interval: isAnnual ? 'annual' : 'monthly' }),
        });
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
      } else if (provider === 'payme') {
        const res = await fetch('/api/billing/payme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interval: isAnnual ? 'annual' : 'monthly' }),
        });
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
      } else {
        // Lemon Squeezy (International card)
        const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: 'PRO',
            interval: isAnnual ? 'annual' : 'monthly',
            simulate: false,
          }),
        });
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
        if (data.success) {
          setSuccessMessage(`PRO ${t('switchSuccess')}`);
          onTierUpdated?.('PRO');
          setTimeout(() => {
            setSuccessMessage(null);
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFree = async () => {
    if (currentTier === 'FREE') return;
    setLoading(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'FREE', simulate: true }),
      });
      const data = await res.json();
      if (data.success) {
        onTierUpdated?.('FREE');
        onClose();
      }
    } catch (err) {
      console.error('Error switching to Free:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900 via-gray-950 to-black border border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800/60 hover:bg-gray-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            TubePilot AI Pro — Yagona va To&apos;liq Tarif ($19/oy)
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {featureGatedTitle ? t('gateTitle') : t('title')}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {featureGatedDesc || t('subtitle')}
          </p>

          {/* Billing Interval Toggle */}
          <div className="mt-5 inline-flex items-center p-1 bg-dark-900 border border-slate-800 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                !isAnnual
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('annual')}
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 font-semibold">
                {t('savePercent')}
              </span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 max-w-md mx-auto p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* 2-Column Cards Grid: STARTER vs PRO ($19) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* STARTER PLAN */}
          <div
            className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${
              currentTier === 'FREE'
                ? 'bg-gray-900/80 border-gray-700 shadow-lg ring-1 ring-gray-700'
                : 'bg-gray-900/40 border-gray-800/80 hover:border-gray-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  {t('starter.name')}
                </span>
                {currentTier === 'FREE' && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-800 text-gray-300 rounded-full border border-gray-700">
                    {t('currentPlan')}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{t('starter.price')}</span>
                <span className="text-xs text-gray-500">{t('freeForever')}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {t('starter.desc')}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('starter.f1')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('starter.f2')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('starter.f3')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('starter.f4')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                disabled={currentTier === 'FREE' || loading}
                onClick={handleSelectFree}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  currentTier === 'FREE'
                    ? 'bg-gray-800 text-gray-400 cursor-default'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {currentTier === 'FREE' ? t('currentPlan') : t('starter.cta')}
              </button>
            </div>
          </div>

          {/* ALL-IN-ONE PRO PLAN ($19) WITH CLICK / PAYME / CARD INTEGRATION */}
          <div
            className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all scale-[1.01] shadow-2xl ${
              currentTier === 'PRO'
                ? 'bg-gradient-to-b from-rose-950/40 via-dark-900 to-dark-950 border-rose-500 ring-2 ring-rose-500/40'
                : 'bg-gradient-to-b from-rose-950/30 via-dark-900 to-dark-950 border-rose-500/60 hover:border-rose-400'
            }`}
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white text-[11px] font-black shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-white" />
              {t('popular')} • TO&apos;LIQ IMKONIYAT
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-rose-400" />
                  {t('pro.name')}
                </span>
                {currentTier === 'PRO' && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                    {t('currentPlan')}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {isAnnual ? '$15' : '$19'}
                </span>
                <span className="text-xs text-gray-400">{t('perMonth')}</span>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ~245,000 UZS
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                {t('pro.desc')} Barcha VIP imkoniyatlar, Telegram avtomatizatsiya va cheksiz AI vositalari kiritilgan.
              </p>

              {/* Feature list */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">{t('pro.f1')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f2')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f3')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f4')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f5')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-amber-300 font-semibold">Telegram Bot VIP signallar &amp; Raqobatchilar Spy</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mt-6 p-3 bg-dark-950/80 rounded-2xl border border-rose-500/20">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>To&apos;lov tizimini tanlang:</span>
                  <span className="text-[10px] text-emerald-400 font-medium">1-bosishda to&apos;lash</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Click */}
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('click')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      paymentProvider === 'click'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                        : 'bg-dark-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Click</span>
                  </button>

                  {/* Payme */}
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('payme')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      paymentProvider === 'payme'
                        ? 'bg-cyan-600/20 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-dark-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Payme</span>
                  </button>

                  {/* Card (Lemon Squeezy) */}
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('card')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      paymentProvider === 'card'
                        ? 'bg-purple-600/20 border-purple-400 text-purple-300 shadow-sm'
                        : 'bg-dark-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>Karta / Visa</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                disabled={currentTier === 'PRO' || loading}
                onClick={() => handlePayPro(paymentProvider)}
                className={`w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 ${
                  currentTier === 'PRO'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 cursor-default'
                    : 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentTier === 'PRO' ? (
                  t('currentPlan')
                ) : (
                  <>
                    <span>
                      {paymentProvider === 'click' && "Click orqali to'lash (245,000 UZS)"}
                      {paymentProvider === 'payme' && "Payme orqali to'lash (245,000 UZS)"}
                      {paymentProvider === 'card' && "Xalqaro karta orqali ($19)"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer info badge */}
        <div className="mt-8 pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Xavfsiz to&apos;lov (Click, Payme, Visa/Mastercard) • Istalgan vaqt bekor qilish imkoniyati</span>
          </div>
          <div className="text-[11px] text-gray-400 bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800">
            {t('instantDevNotice')}
          </div>
        </div>
      </div>
    </div>
  );
}
