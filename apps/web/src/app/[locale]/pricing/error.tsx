'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { TubePilotLogo } from '@/components/TubePilotLogo';
import { AmbientBackgroundMesh } from '@/components/AmbientBackgroundMesh';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function PricingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Pricing page error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AmbientBackgroundMesh />
      <div className="relative z-10 max-w-md w-full text-center p-8 rounded-3xl bg-dark-900/90 border border-malla-600/30 backdrop-blur-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <TubePilotLogo size="md" showText={true} />
        </div>
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sahifani yuklashda xatolik yuz berdi</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Tariflar ma&apos;lumotlarini yangilash uchun quyidagi tugmani bosing yoki boshqaruv paneliga qayting.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-malla-600 to-amber-600 hover:from-malla-500 hover:to-amber-500 text-white flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qayta urinish</span>
          </button>
          <Link
            href="/uz/dashboard"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-slate-300 border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Panelga qaytish</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
