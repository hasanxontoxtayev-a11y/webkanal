import React from 'react';
import { Logo } from './Logo';
import { Send, Phone, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#140e0a] text-white pt-16 pb-12 border-t border-[#3b2a21] relative overflow-hidden">
      {/* Jigarrang ambient nur */}
      <div className="absolute top-0 left-1/3 w-64 h-32 bg-amber-600/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2d1f18]">
          
          {/* 1. Brend ustuni */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-zinc-300 max-w-sm leading-relaxed mt-2">
              Faqat erkaklar uchun eng oxirgi rusumdagi zamonaviy oversize streetwear kiyimlari do`koni. 100% og'ir paxta va erkin bichim.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/overdrop_admin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#221813] border border-[#3f2d23] hover:border-cyan-400 text-sky-400 flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="tel:+998901234567"
                className="w-10 h-10 rounded-full bg-[#221813] border border-[#3f2d23] hover:border-emerald-400 text-emerald-400 flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                aria-label="Telefon"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Bo'limlar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Bo`limlar
            </h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>
                <a href="#about" className="hover:text-cyan-300 transition-colors">Do`kon haqida</a>
              </li>
              <li>
                <a href="#products" className="hover:text-cyan-300 transition-colors">Erkaklar kolleksiyasi</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-cyan-300 transition-colors">Mijozlar sharhlari</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-300 transition-colors">Buyurtma anketasi</a>
              </li>
            </ul>
          </div>

          {/* 3. Kategoriyalar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Kolleksiya
            </h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>Erkaklar Futbolkalari</li>
              <li>Erkaklar Xudilari</li>
              <li>Erkaklar Kargo Shimlari</li>
              <li>Erkaklar Bomberlari</li>
              <li>Ko`cha Aksessuarlari</li>
            </ul>
          </div>

          {/* 4. Aloqa */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Aloqa
            </h4>
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-bold text-white text-base">+998 (90) 123-45-67</p>
              <p className="text-cyan-400 text-xs">@overdrop_admin</p>
              <p className="text-xs text-zinc-400 mt-2">O`zbekiston bo`ylab yetkazib berish.</p>
            </div>
          </div>

        </div>

        {/* Pastki qator */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} OVERDROP MEN'S WEAR. Barcha huquqlar himoyalangan.</p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            <span>Yuqoriga qaytish</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </footer>
  );
};
