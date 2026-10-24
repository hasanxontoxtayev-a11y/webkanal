'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { TubePilotLogo } from '@/components/TubePilotLogo';
import { AmbientBackgroundMesh } from '@/components/AmbientBackgroundMesh';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Shield,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Smartphone,
  CreditCard,
} from 'lucide-react';

function PricingContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'uz';
  const t = useTranslations('pricing');
  const tStarter = useTranslations('pricing.starter');
  const tPro = useTranslations('pricing.pro');
  const tNav = useTranslations('nav');

  const [isAnnual, setIsAnnual] = useState(false);
  const [currentTier, setCurrentTier] = useState<'FREE' | 'PRO'>('FREE');
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'click' | 'payme' | 'card'>('click');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/channels/current')
      .then((res) => res.json())
      .then((data) => {
        if (data.subscription?.tier) {
          setCurrentTier(data.subscription.tier === 'FREE' ? 'FREE' : 'PRO');
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectFree = async () => {
    if (currentTier === 'FREE') return;
    setLoadingTier('FREE');
    setToastMessage(null);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'FREE', simulate: true }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentTier('FREE');
        setToastMessage(`Starter ${t('switchSuccess')}`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Error switching to Free:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  const handlePayPro = async (provider: 'click' | 'payme' | 'card') => {
    setLoadingTier('PRO');
    setToastMessage(null);

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
          setCurrentTier('PRO');
          setToastMessage(`PRO ${t('switchSuccess')}`);
          setTimeout(() => setToastMessage(null), 4000);
        }
      }
    } catch (err) {
      console.error('Upgrade error:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-malla-500 selection:text-white relative overflow-hidden">
      {/* Ambient background mesh */}
      <AmbientBackgroundMesh />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-malla-600/20 bg-dark-900/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/dashboard`} className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <TubePilotLogo size="sm" showText={true} />
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-400">
              <Link
                href={`/${locale}/dashboard`}
                className="hover:text-white transition-colors"
              >
                {tNav('dashboard')}
              </Link>
              <span className="text-malla-300 font-bold border-b-2 border-malla-400 pb-0.5">
                {tNav('pricing')}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 hover:border-malla-500/30 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-malla-400" />
              <span className="hidden sm:inline">Panelga qaytish</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            VidIQ & TubeBuddy Alternative — Click &amp; Payme Qo&apos;llab-quvvatlanadi
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {t('title')}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            {t('subtitle')}
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-gray-900 border border-gray-800 rounded-full shadow-inner">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all ${
                !isAnnual
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('annual')}
              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 font-bold">
                {t('savePercent')}
              </span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="max-w-md mx-auto mb-8 p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 shadow-xl animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            {toastMessage}
          </div>
        )}

        {/* 2 Plans Grid: STARTER vs PRO ($19) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20">
          {/* STARTER */}
          <div
            className={`rounded-3xl border p-8 flex flex-col justify-between transition-all backdrop-blur-xl ${
              currentTier === 'FREE'
                ? 'bg-gray-900/80 border-gray-700 shadow-xl ring-1 ring-gray-700'
                : 'bg-gray-950/60 border-gray-850 hover:border-gray-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-200 uppercase tracking-wider">
                  {tStarter('name')}
                </h3>
                {currentTier === 'FREE' && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-800 text-gray-300 rounded-full border border-gray-700">
                    {t('currentPlan')}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white">{tStarter('price')}</span>
                <span className="text-sm text-gray-500">{t('freeForever')}</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                {tStarter('desc')}
              </p>

              <div className="mt-8 space-y-3.5 border-t border-gray-800/80 pt-6">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tStarter('f1')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tStarter('f2')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tStarter('f3')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tStarter('f4')}</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                disabled={currentTier === 'FREE' || loadingTier !== null}
                onClick={handleSelectFree}
                className={`w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  currentTier === 'FREE'
                    ? 'bg-gray-800/80 text-gray-400 cursor-default'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {loadingTier === 'FREE' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentTier === 'FREE' ? (
                  t('currentPlan')
                ) : (
                  tStarter('cta')
                )}
              </button>
            </div>
          </div>

          {/* PRO ALL-INCLUSIVE ($19) */}
          <div
            className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all backdrop-blur-xl md:-translate-y-2 shadow-2xl ${
              currentTier === 'PRO'
                ? 'bg-gradient-to-b from-rose-950/50 via-gray-900 to-black border-rose-500 ring-2 ring-rose-500/40'
                : 'bg-gradient-to-b from-rose-950/30 via-gray-900 to-black border-rose-500/60 hover:border-rose-400'
            }`}
          >
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white text-xs font-black shadow-lg uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-white" />
              {t('popular')} • YAGONA VA TO&apos;LIQ TARIF
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-rose-400" />
                  {tPro('name')}
                </h3>
                {currentTier === 'PRO' && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/40">
                    {t('currentPlan')}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">
                  {isAnnual ? '$15' : '$19'}
                </span>
                <span className="text-sm text-gray-400">{t('perMonth')}</span>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  ~245,000 UZS
                </span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                {tPro('desc')} Barcha Pro va VIP xususiyatlar, jumladan Telegram avtomatlashtirish, CTR Vision va Spy vositalari kiritilgan.
              </p>

              <div className="mt-8 space-y-3.5 border-t border-rose-500/20 pt-6">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">{tPro('f1')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{tPro('f2')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{tPro('f3')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{tPro('f4')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                  <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{tPro('f5')}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="font-semibold">Telegram Bot 24/7 VIP Signallar &amp; Raqobatchilar Spy</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mt-8 p-3.5 bg-gray-950/80 rounded-2xl border border-rose-500/20">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>To&apos;lov usulini tanlang:</span>
                  <span className="text-[10px] text-emerald-400 font-medium">1-bosishda to&apos;lash</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('click')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      paymentProvider === 'click'
                        ? 'bg-blue-600/25 border-blue-500 text-blue-300 shadow-md'
                        : 'bg-dark-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Click</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('payme')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      paymentProvider === 'payme'
                        ? 'bg-cyan-600/25 border-cyan-400 text-cyan-300 shadow-md'
                        : 'bg-dark-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Payme</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentProvider('card')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      paymentProvider === 'card'
                        ? 'bg-purple-600/25 border-purple-400 text-purple-300 shadow-md'
                        : 'bg-dark-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>Karta / Visa</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                disabled={currentTier === 'PRO' || loadingTier !== null}
                onClick={() => handlePayPro(paymentProvider)}
                className={`w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 ${
                  currentTier === 'PRO'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 cursor-default'
                    : 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white'
                }`}
              >
                {loadingTier === 'PRO' ? (
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

        {/* Feature Comparison Matrix */}
        <div className="max-w-4xl mx-auto mb-20 bg-gray-900/40 border border-gray-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">
            VidIQ & TubeBuddy imkoniyatlari taqqoslash
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="py-3 px-4 font-semibold">Funksiya</th>
                  <th className="py-3 px-4 font-semibold text-center">Starter ($0)</th>
                  <th className="py-3 px-4 font-semibold text-center text-rose-400">Pro ($19) — To&apos;liq</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-300">
                <tr>
                  <td className="py-3 px-4 font-medium">Ulangan YouTube kanallar</td>
                  <td className="py-3 px-4 text-center">1 ta</td>
                  <td className="py-3 px-4 text-center text-rose-300 font-semibold">Cheksiz</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Gemini 2.0 Flash Muqova AI Vision</td>
                  <td className="py-3 px-4 text-center text-gray-500">3 marta/kun</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">Cheksiz + Prioritet</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Ko&apos;p tilli Izohlar AI Kopiloti</td>
                  <td className="py-3 px-4 text-center text-gray-500">Oddiy</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">Avtomatik ovoz moslashuvi + Telegram</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Real-time VPH (soatlik tomoshalar)</td>
                  <td className="py-3 px-4 text-center text-gray-500"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-4 text-center text-emerald-400"><Check className="w-4 h-4 mx-auto text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Raqobatchilarni to&apos;liq josuslik qilish (Spy)</td>
                  <td className="py-3 px-4 text-center text-gray-500"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-4 text-center text-emerald-400"><Check className="w-4 h-4 mx-auto text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Telegram VIP Bot signallari va ogohlantirishlar</td>
                  <td className="py-3 px-4 text-center text-gray-500"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-semibold">24/7 VIP Signallar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Guarantees */}
        <div className="max-w-3xl mx-auto text-center border-t border-slate-800 pt-8 text-xs sm:text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Click &amp; Payme orqali xavfsiz to&apos;lov</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-malla-400" />
            <span>Istalgan vaqt 1 bosishda bekor qilish</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Avtomatik hisobga faollashtirish</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950" />}>
      <PricingContent />
    </Suspense>
  );
}
