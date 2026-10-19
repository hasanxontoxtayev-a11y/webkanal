'use client';

import React, { useState, useEffect } from 'react';
import { Send, Phone, MapPin, Clock, CheckCircle2, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '@/types';

interface ContactSectionProps {
  selectedProductForOrder: Product | null;
  selectedSizeForOrder?: string;
  onClearSelectedProduct: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  selectedProductForOrder,
  selectedSizeForOrder,
  onClearSelectedProduct,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [productName, setProductName] = useState('');
  const [size, setSize] = useState('L (Oversize)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedProductForOrder) {
      setProductName(selectedProductForOrder.name);
      if (selectedSizeForOrder) {
        setSize(selectedSizeForOrder);
      }
    }
  }, [selectedProductForOrder, selectedSizeForOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || phone.trim().length < 9) {
      setErrorMessage("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phone,
          productName: productName || 'Katalogdan umumiy tanlov',
          size,
          message,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setIsSubmitted(true);
      } else {
        // Agar Telegram bot sozlamalari hali .env.local ga kiritilmagan bo'lsa
        setErrorMessage(
          result.error || "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
        );
      }
    } catch (err: any) {
      setErrorMessage("Internet yoki server bilan aloqada xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#19120e] border-b border-[#3b2a21] scroll-mt-20 relative overflow-hidden">
      {/* Jigarrang va neon nur */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-700/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Chap ustun: Ma'lumot va aloqa kontaktlari */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-block text-xs font-black uppercase tracking-[0.25em] text-cyan-400 bg-[#251b15] border border-cyan-500/30 px-4 py-1.5 rounded-full mb-3 shadow-[0_0_12px_rgba(0,245,255,0.2)]">
                Tezkor Buyurtma
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                Murojaat & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">Anketa</span>
              </h2>
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                Erkaklar kiyimini tanlash, o`lchamni maslahatlashish yoki buyurtma berish uchun anketani to`ldiring. Menejerimiz 10 daqiqa ichida siz bilan bog`lanadi.
              </p>
            </div>

            {/* Aloqa kartochkalari */}
            <div className="space-y-4">
              <a
                href="tel:+998901234567"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#221813] border border-[#3f2d23] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#19120e] border border-[#3b2a21] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_#10b981]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Telefon orqali bog`lanish
                  </span>
                  <span className="text-base font-black text-white">
                    +998 (90) 123-45-67
                  </span>
                </div>
              </a>

              <a
                href="https://t.me/overdrop_admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#221813] border border-[#3f2d23] hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#19120e] border border-sky-500/40 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Send className="w-5 h-5 drop-shadow-[0_0_8px_#38bdf8]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Telegram orqali yozish
                  </span>
                  <span className="text-base font-black text-white">
                    @overdrop_admin
                  </span>
                </div>
              </a>

              <div className="p-5 rounded-2xl bg-[#221813] border border-[#3b2a21] space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Ish vaqti: Har kuni <strong className="text-white">09:00 — 22:00</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Yetkazib berish: Butun O`zbekiston bo`ylab 1-2 kunda</span>
                </div>
              </div>
            </div>

          </div>

          {/* O'ng ustun: Oddiy va Oson Anketa Formasi */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-b from-[#221813] to-[#1a120d] rounded-3xl border border-cyan-500/30 shadow-[0_0_35px_rgba(0,245,255,0.2)] p-6 sm:p-10 relative">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Rahmat, arizangiz qabul qilindi!
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto">
                    Menejerimiz qisqa vaqt ichida sizga qo`ng`iroq qilib, buyurtmani tasdiqlaydi va kerakli erkaklar oversize razmerini aniqlashga yordam beradi.
                  </p>
                  
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="https://t.me/overdrop_admin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-sky-400 hover:bg-sky-300 text-black transition-all shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Telegramda xabar berish</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        onClearSelectedProduct();
                        setProductName('');
                        setMessage('');
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2d1f18] hover:bg-[#3d2b22] text-white border border-[#4d372a] transition-all"
                    >
                      Yangi buyurtma qoldirish
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-[#3b2a21] pb-4">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      Oson va Tezkor Buyurtma
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Telefoningizni qoldiring, biz sizga qayta qo`ng`iroq qilamiz.
                    </p>
                  </div>

                  {/* Tanlangan mahsulot xabari */}
                  {selectedProductForOrder && (
                    <div className="p-3.5 rounded-2xl bg-[#281c15] border border-cyan-500/40 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,245,255,0.15)]">
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-white">
                          Tanlangan model: <strong className="text-cyan-300">{selectedProductForOrder.name}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onClearSelectedProduct}
                        className="text-[11px] text-cyan-400 hover:text-white font-bold underline"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Ism */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Ismingiz *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masalan: Jasur"
                        className="w-full px-4 py-3.5 bg-[#19120e] border border-[#3f2d23] focus:border-cyan-400 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-semibold"
                      />
                    </div>

                    {/* Telefon */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Telefon raqamingiz *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998 (90) 123-45-67"
                        className="w-full px-4 py-3.5 bg-[#19120e] border border-[#3f2d23] focus:border-cyan-400 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Mahsulot nomi */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Qiziqqan erkaklar kiyimi
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Futbolka, xudi, kargo shim..."
                        className="w-full px-4 py-3.5 bg-[#19120e] border border-[#3f2d23] focus:border-cyan-400 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                      />
                    </div>

                    {/* O'lcham */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Erkaklar o`lchami
                      </label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-4 py-3.5 bg-[#19120e] border border-[#3f2d23] focus:border-cyan-400 text-cyan-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all cursor-pointer font-bold"
                      >
                        <option value="M (Oversize)">M (Oversize)</option>
                        <option value="L (Oversize)">L (Oversize)</option>
                        <option value="XL (Oversize)">XL (Oversize)</option>
                        <option value="XXL (Oversize)">XXL (Oversize)</option>
                        <option value="Maslahat kerak">Maslahat kerak</option>
                      </select>
                    </div>
                  </div>

                  {/* Izoh */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Qo`shimcha savol yoki yetkazish manzili
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Bo`yingiz, vazningiz yoki yetkazish manzilingiz..."
                      className="w-full px-4 py-3 bg-[#19120e] border border-[#3f2d23] focus:border-cyan-400 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
                    />
                  </div>

                  {/* Xatolik yuz berganda xabar */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-rose-200">Xatolik:</strong>
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Katta Yuborish Tugmasi */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(0,245,255,0.6)] active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 text-black animate-spin" />
                        <span>Telegramga Yuborilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Buyurtma Berish (Telegram Botga Yuborish)</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-zinc-400">
                    🔒 Ma`lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga berilmaydi.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
