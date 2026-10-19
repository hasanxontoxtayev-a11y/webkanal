'use client';

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '@/types';
import { CATEGORIES, PRODUCTS } from '@/data/products';
import { ProductCardPhoto } from './ProductCardPhoto';
import { Search, ShoppingBag, Star, UserCheck, Tag } from 'lucide-react';

interface ProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  onDirectOrder,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('uz-UZ').format(p) + " so'm";
  };

  return (
    <section id="products" className="py-20 bg-[#19120e] border-b border-[#3b2a21] scroll-mt-20 relative overflow-hidden">
      
      {/* SAYTNING ORQA QISMIDAGI KATTA BREND LOGOTIPI VA NOMI (Website Background Watermark) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center opacity-10">
        <div className="flex flex-col items-center">
          {/* Katta Neon Tomchi Logotipi Sayt Orqa Fonida */}
          <svg viewBox="0 0 100 110" className="w-[500px] h-[500px] text-cyan-400 filter drop-shadow-[0_0_50px_#00f5ff]" fill="none">
            <path d="M50 10 C50 10 18 56 18 76 C18 93.6 32.4 106 50 106 C67.6 106 82 93.6 82 76 C82 56 50 10 50 10 Z" stroke="currentColor" strokeWidth="3" />
            <path d="M50 36V76M50 76L38 60M50 76L62 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-6xl sm:text-8xl font-black uppercase tracking-[0.3em] text-cyan-300 drop-shadow-[0_0_30px_#00f5ff] -mt-16">
            OVERDROP
          </span>
          <span className="text-xl sm:text-2xl font-bold uppercase tracking-[0.4em] text-amber-300 mt-2">
            MEN'S OVERSIZE STUDIOS
          </span>
        </div>
      </div>

      {/* Qo'shimcha fon nur effektlari */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Bo'lim Sarlavhasi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-400 bg-[#251b15] border border-cyan-500/30 px-4 py-1.5 rounded-full mb-3 shadow-[0_0_12px_rgba(0,245,255,0.2)]">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Har Bir Kiyim Nomi va Modeli Bilan (50 ta model)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Erkaklar Oversize <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">Kolleksiyasi</span>
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-2xl">
              Har bir kiyim o`zining aniq nomi, mato tavsifi, narxi va erkak model kiygan fotosurati bilan aniq ko`rsatilgan.
            </p>
          </div>

          <div className="text-xs font-bold text-zinc-300 bg-[#221813] border border-[#443126] px-4 py-2.5 rounded-xl shadow self-start md:self-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Mavjud: <strong className="text-cyan-400">{filteredProducts.length}</strong> ta erkaklar modeli</span>
          </div>
        </div>

        {/* Qidiruv va Saralash paneli */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mahsulot nomi yoki modelini qidiring (masalan: Heavy Acid, Parachute, MA-1 Bomber)..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#221813] border border-[#443126] focus:border-cyan-400 text-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-cyan-400 p-1"
              >
                Tozalash
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#221813] border border-[#443126] text-zinc-200 rounded-2xl px-4 py-3.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm"
            >
              <option value="default">Odatiy tartibda</option>
              <option value="price-asc">Narx: arzonidan boshlab</option>
              <option value="price-desc">Narx: qimmatidan boshlab</option>
              <option value="rating">Reyting bo`yicha</option>
            </select>
          </div>
        </div>

        {/* Kategoriya Tablari */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as ProductCategory)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-black shadow-[0_0_20px_rgba(0,245,255,0.4)] scale-105'
                    : 'bg-[#221813] text-zinc-300 hover:text-white border border-[#3b2a21] hover:border-[#573d2f]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Mahsulotlar Gridi (Katalog) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#221813] rounded-3xl border border-[#3b2a21] p-12 text-center max-w-md mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-2xl bg-[#2c1f18] text-zinc-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Mahsulot topilmadi</h3>
            <p className="text-xs text-zinc-400">
              Boshqa so`z bilan qidirib ko`ring.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-cyan-400 text-black rounded-xl"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-[#221813] hover:bg-[#281c16] border border-[#3f2d23] hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-[0_0_30px_rgba(0,245,255,0.25)] transition-all duration-300"
              >
                {/* Erkak kishi kiygan surat (TOZA, ortiqcha logotipsiz) */}
                <div 
                  className="cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <ProductCardPhoto product={product} />
                </div>

                {/* Tafsilotlar: HAR BIR KIYIM NOMI ANIQ VA RAVSHAN */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Toifa va reyting */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                      <span className="inline-flex items-center gap-1 uppercase font-bold tracking-wider text-cyan-400">
                        <Tag className="w-3 h-3 text-cyan-400" />
                        <span>{product.categoryLabel}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* KIYIMNING ANIQ NOMI (Katta va qalin shrift bilan) */}
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-black text-base text-white group-hover:text-cyan-300 transition-colors cursor-pointer leading-snug line-clamp-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Mato tarkibi */}
                    <p className="text-xs text-amber-200/80 font-medium line-clamp-1 mt-1.5">
                      {product.material}
                    </p>
                  </div>

                  {/* Narx va Tezkor OSON Buyurtma Tugmasi */}
                  <div className="pt-2.5 border-t border-[#38281f] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-black text-white">
                        {formatPrice(product.price)}
                      </div>
                      {product.oldPrice && (
                        <div className="text-[11px] text-zinc-500 line-through">
                          {formatPrice(product.oldPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onDirectOrder(product)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:brightness-110 text-black text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,245,255,0.3)] active:scale-95"
                      title="Ushbu modelga buyurtma berish"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-black" />
                      <span>Buyurtma</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
