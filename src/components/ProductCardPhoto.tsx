import React from 'react';
import { Product } from '@/types';

interface ProductCardPhotoProps {
  product: Product;
  className?: string;
  showBadge?: boolean;
}

export const ProductCardPhoto: React.FC<ProductCardPhotoProps> = ({
  product,
  className = '',
  showBadge = true,
}) => {
  return (
    <div className={`relative w-full aspect-[4/5] overflow-hidden bg-[#221813] border-b border-[#3f2d23] select-none ${className}`}>
      
      {/* 1. ERKAK KISHI KIYGAN HOLATDAGI TOZA FOTO (Toza, kiyim to'liq ko'rinadigan qilib markazlashtirilgan) */}
      <img
        src={product.image}
        alt={`${product.name} - Erkak kishi kiygan holda`}
        loading="lazy"
        className="w-full h-full object-cover object-center transition-transform duration-500 transform group-hover:scale-105"
      />

      {/* 2. Nozik pastki gradient (faqat matn o'qilishi uchun) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#19120e]/90 via-transparent to-black/20 pointer-events-none" />

      {/* Yuqori chapda: Badge (agar bo'lsa) */}
      {showBadge && product.badge && (
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-cyan-400 text-black rounded-md shadow-[0_0_12px_#00f5ff]">
            {product.badge}
          </span>
        </div>
      )}

      {/* Pastki qism: Erkak model gavdasi ma'lumoti (Xaridor odamda qanday turishini bilishi uchun) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between text-[10px] font-bold text-amber-200 bg-[#1c140f]/90 border border-[#4a3528] px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
        <span className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f5ff] shrink-0" />
          <span className="truncate">{product.modelFit || 'Model: 184 sm • L kiygan'}</span>
        </span>
        <span className="text-cyan-400 font-extrabold uppercase shrink-0 ml-1">Oversize</span>
      </div>

    </div>
  );
};
