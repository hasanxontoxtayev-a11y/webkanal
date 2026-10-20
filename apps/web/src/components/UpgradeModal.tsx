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
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: 'FREE' | 'PRO' | 'ELITE';
  onTierUpdated?: (newTier: 'FREE' | 'PRO' | 'ELITE') => void;
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
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectTier = async (tier: 'FREE' | 'PRO' | 'ELITE') => {
    if (tier === currentTier) return;
    setLoadingTier(tier);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
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
        setSuccessMessage(`${tier} ${t('switchSuccess')}`);
        onTierUpdated?.(tier);
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Upgrade error:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-gray-900 via-gray-950 to-black border border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800/60 hover:bg-gray-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          {featureGatedTitle ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-malla-500/10 border border-malla-500/30 text-malla-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-malla-400" />
              {featureGatedTitle}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-malla-500/10 border border-malla-500/30 text-malla-300 text-xs font-semibold mb-3">
              <Crown className="w-3.5 h-3.5 text-malla-400" />
              TubePilot AI VIP Subscription
            </div>
          )}

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
                  ? 'bg-gradient-to-r from-malla-600 to-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-gradient-to-r from-malla-600 to-amber-600 text-white shadow-md'
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                disabled={currentTier === 'FREE' || loadingTier !== null}
                onClick={() => handleSelectTier('FREE')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  currentTier === 'FREE'
                    ? 'bg-gray-800 text-gray-400 cursor-default'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {loadingTier === 'FREE' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentTier === 'FREE' ? (
                  t('currentPlan')
                ) : (
                  t('starter.cta')
                )}
              </button>
            </div>
          </div>

          {/* PRO PLAN (MOST POPULAR) */}
          <div
            className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all scale-[1.02] shadow-xl ${
              currentTier === 'PRO'
                ? 'bg-gradient-to-b from-malla-950/40 via-dark-900 to-dark-950 border-malla-500 ring-2 ring-malla-500/30'
                : 'bg-gradient-to-b from-malla-950/20 via-dark-900 to-dark-950 border-malla-500/50 hover:border-malla-400'
            }`}
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-malla-600 to-amber-600 text-white text-[11px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white" />
              {t('popular')}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-malla-400 uppercase tracking-wider">
                  {t('pro.name')}
                </span>
                {currentTier === 'PRO' && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-malla-500/20 text-malla-300 rounded-full border border-malla-500/30">
                    {t('currentPlan')}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  {isAnnual ? t('pro.priceAnnual') : t('pro.price')}
                </span>
                <span className="text-xs text-gray-400">{t('perMonth')}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {t('pro.desc')}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-malla-400 shrink-0 mt-0.5" />
                  <span className="font-medium">{t('pro.f1')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-malla-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f2')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-malla-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f3')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-malla-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f4')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-malla-400 shrink-0 mt-0.5" />
                  <span>{t('pro.f5')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                disabled={currentTier === 'PRO' || loadingTier !== null}
                onClick={() => handleSelectTier('PRO')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-malla-950/50 ${
                  currentTier === 'PRO'
                    ? 'bg-malla-950/80 text-malla-300 border border-malla-500/40 cursor-default'
                    : 'bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white'
                }`}
              >
                {loadingTier === 'PRO' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentTier === 'PRO' ? (
                  t('currentPlan')
                ) : (
                  <>
                    {t('pro.cta')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ELITE PLAN (MAXIMUM POWER) */}
          <div
            className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${
              currentTier === 'ELITE'
                ? 'bg-gradient-to-b from-purple-950/40 via-gray-900 to-gray-950 border-purple-500 ring-2 ring-purple-500/30 shadow-xl'
                : 'bg-gradient-to-b from-purple-950/20 via-gray-900 to-gray-950 border-purple-500/40 hover:border-purple-400'
            }`}
          >
            {/* Ultimate Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[11px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3 fill-white" />
              {t('ultimate')}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">
                  {t('elite.name')}
                </span>
                {currentTier === 'ELITE' && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    {t('currentPlan')}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  {isAnnual ? t('elite.priceAnnual') : t('elite.price')}
                </span>
                <span className="text-xs text-gray-400">{t('perMonth')}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {t('elite.desc')}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-purple-200">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="font-medium">{t('elite.f1')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-purple-200">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-white">{t('elite.f2')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-purple-200">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{t('elite.f3')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-purple-200">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{t('elite.f4')}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-purple-200">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{t('elite.f5')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                disabled={currentTier === 'ELITE' || loadingTier !== null}
                onClick={() => handleSelectTier('ELITE')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 ${
                  currentTier === 'ELITE'
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30 cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                }`}
              >
                {loadingTier === 'ELITE' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentTier === 'ELITE' ? (
                  t('currentPlan')
                ) : (
                  <>
                    {t('elite.cta')}
                    <ArrowRight className="w-3.5 h-3.5" />
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
            <span>30-kunlik to'liq qaytarish kafolati • Xavfsiz to'lov • Istalgan vaqt bekor qilish</span>
          </div>
          <div className="text-[11px] text-gray-400 bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800">
            {t('instantDevNotice')}
          </div>
        </div>
      </div>
    </div>
  );
}
