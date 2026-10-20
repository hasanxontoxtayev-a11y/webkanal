'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function TubePilotLogo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 32, text: 'text-base', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { box: 'w-11 h-11', icon: 44, text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { box: 'w-16 h-16', icon: 64, text: 'text-3xl', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* 3D Futuristic Holographic Logo Symbol */}
      <div className={`relative ${currentSize.box} flex items-center justify-center flex-shrink-0`}>
        {/* Ambient Outer Malla Glow Aura */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-malla-500/40 via-amber-500/30 to-malla-300/40 blur-md group-hover:blur-lg transition-all duration-500 opacity-80 group-hover:opacity-100 animate-pulse-slow" />

        {/* Orbiting Cyber Ring (Rotating continuously) */}
        <div className="absolute -inset-1 rounded-2xl border border-malla-400/30 border-dashed animate-[spin_12s_linear_infinite] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Core Container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-dark-850 via-dark-900 to-[#1e1610] p-[1.5px] shadow-2xl shadow-malla-950/80 border border-malla-500/40 group-hover:border-malla-400 transition-all duration-300 overflow-hidden">
          {/* Inner Shimmer Reflection Sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

          {/* SVG: Quantum Play Triangle + Pilot Jet Wings */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1.5 drop-shadow-[0_2px_8px_rgba(212,154,106,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Malla Gold Jet Gradient */}
              <linearGradient id="jetGrad" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#fcead2" />
                <stop offset="40%" stopColor="#d49a6a" />
                <stop offset="100%" stopColor="#8a562e" />
              </linearGradient>

              {/* Quantum Play Core Gradient */}
              <linearGradient id="coreGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#ffd8a8" />
                <stop offset="100%" stopColor="#d49a6a" />
              </linearGradient>

              {/* Cyber Wing Gradient */}
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d49a6a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2b1e14" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Jet Wing Left (Pilot Aerodynamic Flare) */}
            <path
              d="M 50 16 L 22 58 C 20 62 25 66 30 64 L 46 58 Z"
              fill="url(#wingGrad)"
              stroke="#d49a6a"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="group-hover:opacity-90 transition-opacity"
            />

            {/* Jet Wing Right (Pilot Aerodynamic Flare) */}
            <path
              d="M 50 16 L 78 58 C 80 62 75 66 70 64 L 54 58 Z"
              fill="url(#wingGrad)"
              stroke="#d49a6a"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="group-hover:opacity-90 transition-opacity"
            />

            {/* Central Supersonic Jet Fuselage & YouTube Play Core */}
            <path
              d="M 50 12 L 68 50 L 50 86 L 32 50 Z"
              fill="url(#jetGrad)"
              className="filter drop-shadow-[0_0_6px_rgba(212,154,106,0.8)]"
            />

            {/* YouTube Play Icon Embedded in Cockpit / Quantum Core */}
            <polygon
              points="45,40 45,60 62,50"
              fill="url(#coreGrad)"
              className="drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] group-hover:scale-110 origin-center transition-transform"
            />

            {/* Trailing Quantum Thruster Particles */}
            <circle cx="50" cy="88" r="2.5" fill="#f5dcb8" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="50" cy="94" r="1.5" fill="#d49a6a" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight ${currentSize.text} leading-none`}>
              <span className="text-white drop-shadow-sm font-extrabold tracking-tight">Tube</span>
              <span className="text-gradient-malla font-black tracking-tight ml-0.5">Pilot</span>
            </span>
            <span
              className={`rounded-full bg-gradient-to-r from-malla-500/25 to-amber-500/20 text-malla-200 font-black border border-malla-400/40 uppercase tracking-widest shadow-sm ${currentSize.badge} flex items-center gap-1`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-malla-300 animate-pulse" />
              AI PRO
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5 hidden sm:block">
            YouTube Growth Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
