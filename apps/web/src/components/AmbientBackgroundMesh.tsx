'use client';

import React, { useEffect, useRef } from 'react';

export function AmbientBackgroundMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating particles (Cyber Gold/Malla Dust)
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle drifting particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.02;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.15;

        // Glow circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 154, 106, ${Math.max(0.05, currentOpacity)})`;
        ctx.shadowColor = '#d49a6a';
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* 1. Large Ambient Aura Spheres (Floating in Malla & Slate) */}
      <div className="absolute top-[-10%] left-[-8%] w-[55vw] h-[55vw] bg-malla-600/18 rounded-full blur-[140px] animate-float-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-malla-500/15 rounded-full blur-[160px] animate-float-delayed" />
      <div className="absolute top-[35%] right-[20%] w-[45vw] h-[45vw] bg-[#1e2330]/40 rounded-full blur-[130px] animate-pulse-slow" />
      <div className="absolute top-[60%] left-[10%] w-[35vw] h-[35vw] bg-malla-700/10 rounded-full blur-[120px] animate-float-slow" />

      {/* 2. Cyber Mesh Grid Line Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #d49a6a 1px, transparent 1px), linear-gradient(to bottom, #d49a6a 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 3. HTML5 Canvas Star / Cyber Dust Particle Engine */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
