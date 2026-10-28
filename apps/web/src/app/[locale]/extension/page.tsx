'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TubePilotLogo } from '@/components/TubePilotLogo';
import { AmbientBackgroundMesh } from '@/components/AmbientBackgroundMesh';
import { 
  Download, 
  CheckCircle2, 
  Chrome, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Layers, 
  Copy, 
  Check 
} from 'lucide-react';

export default function ExtensionInstallPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'uz';
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 relative overflow-hidden selection:bg-malla-500 selection:text-white">
      <AmbientBackgroundMesh />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-dark-900/85 backdrop-blur-2xl border-b border-malla-600/20 px-6 py-4 flex items-center justify-between">
        <Link href={`/${locale}/dashboard`}>
          <TubePilotLogo size="md" showText={true} />
        </Link>
        <Link
          href={`/${locale}/dashboard`}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 transition-all"
        >
          ← Dashboardga qaytish
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>TubePilot AI Kengaytmasi — 100% Bepul va Rasmiy O'rnatish</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            TubePilot AI Kengaytmasini <br />
            <span className="bg-gradient-to-r from-malla-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              1 Daqiqada O'rnatish
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            YouTube sahifasiga kirganingizda jonli tahlillar (VPH tezligi, haftalik ko'rishlar, oylik daromad va AI yordamchi) avtomatik chiqishi uchun ushbu kengaytmani brauzeringizga qo'shing.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/api/extension/download"
              download="tubepilot-extension.zip"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Kengaytmani Yuklab Olish (.ZIP)</span>
            </a>
          </div>
          <p className="text-[11px] text-gray-500">Hajmi: 28 KB • Barcha Chromium brauzerlar (Chrome, Brave, Edge, Opera) uchun mos</p>
        </div>

        {/* 3 Oddiy Qadam */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-700/80 space-y-4 relative group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl font-black border border-emerald-500/20">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Yuklab oling va oching</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Yuqoridagi yashil tugmani bosing va yuklangan <code className="text-emerald-400 bg-dark-800 px-1.5 py-0.5 rounded">tubepilot-extension.zip</code> faylini arxivdan chiqaring (Extract).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-700/80 space-y-4 relative group hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl font-black border border-amber-500/20">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Extensions sahifasini oching</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Brauzeringizning qidiruv satriga quyidagi manzilni yozing:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-800 border border-dark-600 text-xs font-mono text-amber-300">
              <span>chrome://extensions</span>
              <button
                onClick={handleCopyLink}
                className="p-1 rounded hover:bg-dark-700 text-gray-400 hover:text-white"
                title="Nusxa olish"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-500">O'ng burchakdagi "Developer mode" (Dasturchi rejimi) tugmasini yoqing.</p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-dark-900/90 border border-dark-700/80 space-y-4 relative group hover:border-malla-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-malla-500/10 text-malla-400 flex items-center justify-center text-xl font-black border border-malla-500/20">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Yuklang (Load unpacked)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Chap yuqoridagi <strong>"Load unpacked"</strong> tugmasini bosib, 1-qadamda arxivdan chiqarilgan papkani tanlang (yoki papkani to'g'ridan-to'g'ri brauzerga tashlang).
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Tayyor! YouTube'ni oching va rohatlaning.</span>
            </div>
          </div>
        </div>

        {/* Video / Visual Feature Showcase */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-700 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Nega TubePilot Extension zarur?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            <div className="p-4 rounded-2xl bg-dark-800/60 border border-dark-700/60 space-y-2">
              <span className="text-emerald-400 text-lg">⚡</span>
              <h4 className="font-bold text-white text-xs">Jonli VPH Tezligi</h4>
              <p className="text-[11px] text-gray-400">Har bir video qancha tez ko'rish yig'ayotganini real vaqtda ko'ring.</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-800/60 border border-dark-700/60 space-y-2">
              <span className="text-amber-400 text-lg">💰</span>
              <h4 className="font-bold text-white text-xs">Hududiy RPM Hisoblagich</h4>
              <p className="text-[11px] text-gray-400">O'zbekiston va MDH kanallari uchun AdSense daromadini aniq prognoz qiladi.</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-800/60 border border-dark-700/60 space-y-2">
              <span className="text-rose-400 text-lg">💬</span>
              <h4 className="font-bold text-white text-xs">AI Izohlar Kopiloti</h4>
              <p className="text-[11px] text-gray-400">Tomoshabinlar savollariga 1 ta bosishda o'zbek, rus va ingliz tillarida javob bering.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
