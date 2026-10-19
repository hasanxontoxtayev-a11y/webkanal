'use client';

import React, { useState } from 'react';
import { Logo } from './Logo';
import { Phone, Send, Menu, X, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOrderClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Do`kon haqida', href: '#about' },
    { label: 'Erkaklar Kolleksiyasi (50)', href: '#products' },
    { label: 'Sharhlar', href: '#reviews' },
    { label: 'Buyurtma Anketasi', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#19120e]/95 backdrop-blur-md border-b border-[#3b2a21] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Neon Drop Logo */}
        <a href="#" className="hover:opacity-95 transition-opacity">
          <Logo size="md" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-bold text-zinc-300 hover:text-cyan-400 transition-colors uppercase tracking-wider hover:drop-shadow-[0_0_8px_#00f5ff]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://t.me/overdrop_admin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-sky-400 bg-[#251b15] hover:bg-[#32231b] border border-sky-500/30 rounded-full transition-all shadow-[0_0_10px_rgba(56,189,248,0.2)]"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>Telegram</span>
          </a>

          <a
            href="#contact"
            onClick={onOrderClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:brightness-110 rounded-full transition-all shadow-[0_0_20px_rgba(0,245,255,0.5)] active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span>Buyurtma berish</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-cyan-400 hover:bg-[#251b15] rounded-lg transition-colors"
          aria-label="Menyu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3b2a21] bg-[#19120e] px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-200 hover:text-cyan-400 hover:bg-[#251b15] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#3b2a21] flex flex-col gap-2">
            <a
              href="tel:+998901234567"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 bg-[#251b15] border border-[#443126] rounded-xl"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+998 (90) 123-45-67</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-sky-400 rounded-xl shadow-[0_0_15px_rgba(0,245,255,0.4)]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buyurtma berish / Anketa</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
