'use client';

import React from 'react';
import { ArrowDownRight, UserCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#19120e] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#3b2a21]">
      
      {/* SAYTNING ORQA QISMIDAGI KATTA OVERDROP BREND LOGOTIPI (Website Background Watermark) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center opacity-[0.08]">
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 100 110" className="w-[600px] h-[600px] text-cyan-400 filter drop-shadow-[0_0_60px_#00f5ff]" fill="none">
            <path d="M50 10 C50 10 18 56 18 76 C18 93.6 32.4 106 50 106 C67.6 106 82 93.6 82 76 C82 56 50 10 50 10 Z" stroke="currentColor" strokeWidth="3" />
            <path d="M50 36V76M50 76L38 60M50 76L62 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-7xl sm:text-9xl font-black uppercase tracking-[0.3em] text-cyan-300 drop-shadow-[0_0_30px_#00f5ff] -mt-20">
            OVERDROP
          </span>
        </div>
      </div>

      {/* Jigarrang va Neon Ambient Nurlanishlar */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-amber-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[320px] bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[380px] h-[280px] bg-amber-700/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#00f5ff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Chap ustun: Matn va Ma'lumot */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#251b15] text-cyan-300 text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,245,255,0.3)] border border-cyan-500/40">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f5ff] animate-ping" />
              <span>100% FAQAT ERKAKLAR UCHUN • OVERSIZE STREETWEAR</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase">
              Erkaklar Uchun <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 drop-shadow-[0_0_25px_rgba(0,245,255,0.4)]">
                OVERDROP
              </span> Uslubi
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Do`konimizda <strong className="text-cyan-400 font-bold">faqat erkaklar kiyimi</strong> sotiladi. Barcha mahsulotlar erkak modellar kiygan holda taqdim etilgan — odamga qanday turishini aniq bilishingiz mumkin!
            </p>

            {/* Asosiy tugmalar */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest text-black bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:brightness-110 rounded-full transition-all shadow-[0_0_25px_rgba(0,245,255,0.5)] active:scale-95"
              >
                <span>50 ta Erkaklar Modelini Ko`rish</span>
                <ArrowDownRight className="w-4 h-4 text-black" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#281c15] hover:bg-[#34251c] border border-[#52392b] hover:border-cyan-500/50 rounded-full transition-all shadow-md active:scale-95"
              >
                <span>Murojaat / Buyurtma</span>
              </a>
            </div>

            {/* Tezkor afzalliklar */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-[#3b2a21]">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">100%</span>
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Oversize Streetwear</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Modelda</span>
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Kiyilgan Holda</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Tezkor</span>
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">O`zbekiston Bo`ylab</span>
              </div>
            </div>
          </div>

          {/* O'ng ustun: Toza Erkak model kiygan fotosurat */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden bg-gradient-to-b from-[#241a14] to-[#1c140f] border border-cyan-500/40 shadow-[0_0_35px_rgba(0,245,255,0.25)] p-4 group">
              
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#18110c] border border-[#443126]">
                {/* Toza Erkak kishi kiygan surat (rasm ustida ortiqcha logotipsiz) */}
                <img
                  src="/oversize/white_box_tee_baggy.png"
                  alt="OVERDROP Erkaklar Oversize Futbolka va Baggy Jinsi"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#140e0a] via-transparent to-black/30 pointer-events-none" />

                {/* Model o'lchami belgisi */}
                <div className="absolute bottom-3 left-3 right-3 z-30 p-2.5 rounded-xl bg-[#1c140f]/90 border border-[#4d3628] flex items-center justify-between text-xs font-bold text-amber-200 backdrop-blur-md">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Model: 185 sm • L (Oversize)</span>
                  </span>
                  <span className="text-cyan-400 font-extrabold uppercase text-[10px]">Overdrop Fit</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
