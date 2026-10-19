import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* OVERDROP Nomiga mos Neon Tomchi (Neon Drop) Belgisi */}
      <div
        className={`relative ${iconSizes[size]} rounded-2xl bg-zinc-950 flex items-center justify-center p-2 shadow-[0_0_25px_rgba(0,245,255,0.6)] border border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,70,239,0.8)] hover:border-fuchsia-400`}
      >
        <svg
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_0_8px_#00f5ff]"
        >
          <defs>
            <filter id="neonDropGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="neonDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>

          {/* Tashqi Neon Tomchi Naychasi (Drop Contour) */}
          <path
            d="M50 10 C50 10 18 56 18 76 C18 93.6 32.4 106 50 106 C67.6 106 82 93.6 82 76 C82 56 50 10 50 10 Z"
            stroke="url(#neonDropGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonDropGlow)"
          />

          {/* Ichki Tomchi Nur Tomchilari (Streetwear "O" va "D" elementi) */}
          <path
            d="M50 36V76M50 76L38 60M50 76L62 60"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonDropGlow)"
          />

          {/* Yuqori Chiroqli Neon Nuqta */}
          <circle cx="50" cy="22" r="4" fill="#00f5ff" />
        </svg>

        {/* Pulsatsiyalanuvchi neon nur nuqtasi */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-ping opacity-90" />
      </div>

      {/* Tipografik Neon Brend Nomi */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-[0.2em] uppercase font-black">
          <span className={`text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] ${textSizes[size]}`}>
            OVER
          </span>
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-500 drop-shadow-[0_0_16px_rgba(6,182,212,0.85)] ${textSizes[size]}`}
          >
            DROP
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f5ff] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-cyan-400 font-extrabold">
              FAQAT ERKAKLAR KIYIMI
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
