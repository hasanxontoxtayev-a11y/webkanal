import React from 'react';
import { Product } from '@/types';

interface ProductApparelImageProps {
  product: Product;
  className?: string;
}

export const ProductApparelImage: React.FC<ProductApparelImageProps> = ({
  product,
  className = '',
}) => {
  const { category, name, badge } = product;

  // Har bir toifa uchun erkaklarga xos toza va zamonaviy neon grafik illyustratsiya
  const renderApparelGraphic = () => {
    switch (category) {
      case 't-shirts':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full p-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id={`tshirtGrad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e222d" />
                <stop offset="50%" stopColor="#12151c" />
                <stop offset="100%" stopColor="#0a0c10" />
              </linearGradient>
            </defs>
            {/* Erkaklar Oversize Futbolkasi (Keng yelka, Boxy Fit) */}
            <path
              d="M65 30 Q100 45 135 30 L185 65 L165 95 L145 85 L145 190 L55 190 L55 85 L35 95 L15 65 Z"
              fill={`url(#tshirtGrad-${product.id})`}
              stroke="#00f5ff"
              strokeWidth="2.5"
              strokeOpacity="0.6"
            />
            {/* Yoqa chizig'i */}
            <path d="M70 32 Q100 50 130 32" fill="none" stroke="#38bdf8" strokeWidth="3" />
            {/* Ko'krakdagi OVERDROP neon printi */}
            <rect x="75" y="80" width="50" height="20" rx="4" fill="#00f5ff" fillOpacity="0.15" stroke="#00f5ff" strokeWidth="1" />
            <text x="100" y="94" textAnchor="middle" fill="#00f5ff" fontSize="8" fontWeight="900" letterSpacing="2">OVERDROP</text>
            <text x="100" y="140" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">BOXYSILHOUETTE</text>
            <text x="100" y="155" textAnchor="middle" fill="#38bdf8" fontSize="7" letterSpacing="1">HEAVY COTTON 320GSM</text>
          </svg>
        );

      case 'hoodies':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full p-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id={`hoodieGrad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#24142e" />
                <stop offset="50%" stopColor="#160c1d" />
                <stop offset="100%" stopColor="#0c0710" />
              </linearGradient>
            </defs>
            {/* Qalin Xudi (Kapyushon, keng yenglar va cho'ntak) */}
            <path
              d="M70 20 Q100 12 130 20 Q145 45 135 60 L185 85 L165 115 L145 105 L145 195 L55 195 L55 105 L35 115 L15 85 Q55 45 65 60 Z"
              fill={`url(#hoodieGrad-${product.id})`}
              stroke="#d946ef"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />
            {/* Kapyushon ichki qismi */}
            <path d="M78 28 Q100 48 122 28" fill="none" stroke="#d946ef" strokeWidth="2" />
            {/* Xudi keng qorin cho'ntagi (Kangaroo pocket) */}
            <path d="M70 140 L130 140 L138 180 L62 180 Z" fill="#1f1128" stroke="#a855f7" strokeWidth="1.5" />
            <text x="100" y="163" textAnchor="middle" fill="#d946ef" fontSize="8" fontWeight="800">450 GSM HEAVY</text>
            <circle cx="90" cy="55" r="2" fill="#fff" />
            <circle cx="110" cy="55" r="2" fill="#fff" />
            <path d="M90 57 L90 85" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M110 57 L110 85" stroke="#cbd5e1" strokeWidth="1.5" />
          </svg>
        );

      case 'pants':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full p-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id={`pantsGrad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#13232c" />
                <stop offset="50%" stopColor="#0c171e" />
                <stop offset="100%" stopColor="#080e14" />
              </linearGradient>
            </defs>
            {/* Erkaklar Keng Kargo Shimi (Beldan pastga to'g'ri tushuvchi, NO HEELS, NO SHOES) */}
            <path
              d="M60 20 L140 20 L145 200 L110 200 L100 85 L90 200 L55 200 Z"
              fill={`url(#pantsGrad-${product.id})`}
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />
            {/* Belbog' qismi */}
            <rect x="60" y="20" width="80" height="15" fill="#080e14" stroke="#06b6d4" strokeWidth="1.5" />
            {/* 3D Kargo yon cho'ntaklari */}
            <rect x="45" y="90" width="22" height="35" rx="3" fill="#0e1f28" stroke="#00f5ff" strokeWidth="1.5" />
            <rect x="133" y="90" width="22" height="35" rx="3" fill="#0e1f28" stroke="#00f5ff" strokeWidth="1.5" />
            {/* Taktik tasmalar */}
            <line x1="45" y1="100" x2="67" y2="100" stroke="#00f5ff" strokeWidth="2" />
            <line x1="133" y1="100" x2="155" y2="100" stroke="#00f5ff" strokeWidth="2" />
            <text x="100" y="60" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">TACTICAL CARGO</text>
            <text x="100" y="150" textAnchor="middle" fill="#94a3b8" fontSize="7">BAGGY STREETWEAR</text>
          </svg>
        );

      case 'jackets':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full p-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id={`jacketGrad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1f2937" />
                <stop offset="50%" stopColor="#111827" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>
            </defs>
            {/* Erkaklar MA-1 Bomber / Qalin Kurtkasi */}
            <path
              d="M70 25 Q100 35 130 25 L180 60 L160 110 L140 95 L140 190 L60 190 L60 95 L40 110 L20 60 Z"
              fill={`url(#jacketGrad-${product.id})`}
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeOpacity="0.8"
            />
            {/* Markaziy qalin zamok */}
            <line x1="100" y1="30" x2="100" y2="190" stroke="#e0f2fe" strokeWidth="3" strokeDasharray="4 2" />
            {/* Aviator yelkasi va cho'ntaklari */}
            <rect x="68" y="85" width="22" height="28" rx="3" fill="#111827" stroke="#38bdf8" strokeWidth="1" />
            <rect x="110" y="85" width="22" height="28" rx="3" fill="#111827" stroke="#38bdf8" strokeWidth="1" />
            {/* Yengdagi taktik qizil lentali aviator cho'ntak */}
            <rect x="25" y="70" width="12" height="18" fill="#e11d48" rx="2" />
            <text x="100" y="145" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="black" letterSpacing="1">OVERDROP MA-1</text>
            <text x="100" y="160" textAnchor="middle" fill="#94a3b8" fontSize="7">SATIN NYLON 100%</text>
          </svg>
        );

      case 'accessories':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full p-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id={`accGrad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            {/* Erkaklar Streetwear Kepkasi & Aksessuarlari */}
            <path
              d="M40 110 Q100 45 160 110 L195 135 Q145 155 100 135 L40 110 Z"
              fill={`url(#accGrad-${product.id})`}
              stroke="#00f5ff"
              strokeWidth="2.5"
            />
            {/* Kepka soyaboni */}
            <path d="M40 110 Q100 135 195 135" fill="none" stroke="#d946ef" strokeWidth="3" />
            {/* Kepka ustidagi neon logotip */}
            <circle cx="100" cy="85" r="14" fill="#00f5ff" fillOpacity="0.2" stroke="#00f5ff" strokeWidth="1.5" />
            <text x="100" y="89" textAnchor="middle" fill="#00f5ff" fontSize="10" fontWeight="black">OD</text>
            <text x="100" y="175" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">STREET ACCESSORY</text>
            <text x="100" y="190" textAnchor="middle" fill="#94a3b8" fontSize="7">MEN'S EDITION</text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-black flex items-center justify-center overflow-hidden ${className}`}>
      {/* Neon fon nurlanishi */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-transparent to-transparent pointer-events-none" />
      
      {/* Erkaklar kiyimi grafikasi */}
      {renderApparelGraphic()}

      {/* Faqat Erkaklar burchak belgisi */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-[9px] font-black uppercase tracking-wider text-zinc-300">
        Men's Only
      </div>
    </div>
  );
};
