'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { ProductCardPhoto } from './ProductCardPhoto';
import { X, Star, ShoppingBag, ShieldCheck, Truck, UserCheck } from 'lucide-react';

interface ModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderProduct: (product: Product, size: string) => void;
}

export const ProductQuickViewModal: React.FC<ModalProps> = ({
  product,
  onClose,
  onOrderProduct,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('uz-UZ').format(p) + " so'm";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Jigarrang Neon Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#1c140f] border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,245,255,0.3)] overflow-hidden z-10 max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#2a1e16] border border-[#4a3527] hover:border-cyan-400 text-zinc-300 hover:text-white flex items-center justify-center transition-all"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Chap qism: Erkak model kiygan fotosurat + orqa fondagi OVERDROP logotipi */}
        <div className="w-full md:w-1/2 relative bg-[#140e0a] min-h-[320px] md:min-h-full flex items-center justify-center border-b md:border-b-0 md:border-r border-[#3a291f]">
          <ProductCardPhoto product={product} />
        </div>

        {/* O'ng qism: Tafsilotlar va o'lchamlar */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {product.categoryLabel} • Erkaklar Kolleksiyasi
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
                {product.name}
              </h3>
            </div>

            {/* Model ma'lumoti */}
            <div className="p-2.5 rounded-xl bg-[#281c15] border border-[#4d3628] flex items-center gap-2 text-xs text-amber-200">
              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{product.modelFit || 'Model bo`yi 184 sm • L (Oversize) kiygan'}</span>
            </div>

            {/* Reyting */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="ml-1 text-sm font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-xs text-zinc-400">({product.reviewsCount} ta erkak xaridor bahosi)</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                Omborda mavjud
              </span>
            </div>

            {/* Narx */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Tavsif */}
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Material */}
            <div className="p-3 rounded-xl bg-[#251a14] border border-[#3f2c22] text-xs text-zinc-300">
              <strong className="text-cyan-400 block mb-0.5">Mato tarkibi:</strong>
              {product.material}
            </div>

            {/* Ranglar */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Rang: <span className="text-white font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      selectedColor === c
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.4)]'
                        : 'border-[#443126] bg-[#221813] text-zinc-400 hover:border-[#604434]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Erkaklar Oversize o'lchami */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Erkaklar O`lchami (Oversize):
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === s
                        ? 'border-cyan-400 bg-cyan-400 text-black font-black shadow-[0_0_12px_rgba(0,245,255,0.5)]'
                        : 'border-[#443126] bg-[#221813] text-zinc-300 hover:border-[#604434]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buyurtma berish tugmasi */}
          <div className="space-y-3 pt-4 border-t border-[#3b2a20]">
            <button
              onClick={() => {
                onOrderProduct(product, selectedSize);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:brightness-110 text-black font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,245,255,0.5)] active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>Shu modelga buyurtma berish</span>
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-cyan-400" /> Butun O`zbekistonga yetkazish
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> O`lcham almashtirish kafolati
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
