import React from 'react';
import { REVIEWS } from '@/data/reviews';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-[#19120e] border-b border-[#3b2a21] scroll-mt-20 relative overflow-hidden">
      {/* Jigarrang ambient nur */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Sarlavha */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-block text-xs font-black uppercase tracking-[0.25em] text-cyan-400 bg-[#251b15] border border-cyan-500/30 px-4 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,245,255,0.2)]">
            Xaridorlar Fikrlari
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Mijozlar <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">OVERDROP</span> Haqida
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Bizdan erkaklar oversize kiyimlarini xarid qilgan erkak xaridorlarning real sharhlari
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="flex text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-black text-white ml-1">4.9 / 5.0</span>
            <span className="text-xs text-zinc-400">(300+ dan ortiq qoniqarli erkak xaridor)</span>
          </div>
        </div>

        {/* Sharhlar gridi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#221813] hover:bg-[#281c16] border border-[#3f2d23] hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(0,245,255,0.2)] transition-all duration-300 relative group backdrop-blur-md"
            >
              <div className="space-y-4">
                {/* Yulduzchalar va sana */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">{review.date}</span>
                </div>

                {/* Sharh matni */}
                <p className="text-sm text-zinc-200 leading-relaxed italic">
                  "{review.comment}"
                </p>

                {/* Xarid qilingan erkaklar kiyimi */}
                <div className="inline-block px-3 py-1 rounded-lg bg-[#19120e] border border-[#3b2a21] text-[11px] font-semibold text-zinc-300">
                  Xarid qilingan: <span className="text-cyan-400 font-bold">{review.purchasedItem}</span>
                </div>
              </div>

              {/* Muallif profili */}
              <div className="mt-6 pt-4 border-t border-[#38281f] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-amber-300 flex items-center justify-center text-black font-black text-sm shadow-[0_0_10px_rgba(0,245,255,0.5)]">
                  {review.author.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{review.author}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-950" />
                  </div>
                  <span className="text-xs text-zinc-400">{review.city} • Erkak xaridor</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
