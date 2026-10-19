import React from 'react';
import { Layers, Scissors, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Layers,
      title: 'Og`ir va Zich Paxta (300-450 GSM)',
      desc: 'Do`konimizda yupqa matolar yo`q. Faqat qalin va mustahkam zich futer hamda penye paxtadan tikilgan erkaklar kiyimlari.',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      icon: Scissors,
      title: 'Erkaklar Gavdasiga Xos Boxy-Fit',
      desc: 'Erkak kishi kiyganda yelkalari keng, qomati baquvvat ko`rinishi uchun maxsus tushirilgan yelka andazalarida tikilgan.',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      icon: Sparkles,
      title: 'Erkaklar Ko`cha Uslubi va Ranglari',
      desc: 'Marmar acid-wash, chuqur qora, grafit, yer jigarrang tuslari va neon aksentlar — har qanday yigitning didiga mos keladi.',
      color: 'border-sky-500/40 text-sky-400',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#19120e] border-b border-[#3b2a21] relative overflow-hidden scroll-mt-20">
      {/* Jigarrang va neon nur dog'lari */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-700/10 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Sarlavha */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block text-xs font-black uppercase tracking-[0.25em] text-cyan-400 bg-[#251b15] border border-cyan-500/30 px-4 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,245,255,0.2)]">
            100% Erkaklar Do`koni
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Nega Aynan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">OVERDROP</span>?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Bizning do`konimiz faqat erkaklar kiyimlariga ixtisoslashgan. Har bir mahsulot erkaklar kiygan holda va orqa fonda brend logotipi bilan ko`rsatilgan — xaridor kiyim gavdada qanday turishini aniq tasavvur qilishi mumkin.
          </p>
        </div>

        {/* 3 ta jigarrang neon kartochka */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-[#221813] hover:bg-[#281c16] border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,245,255,0.2)] backdrop-blur-md group ${item.color.split(' ')[0]}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#19120e] border border-[#3b2a21] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <Icon className={`w-6 h-6 ${item.color.split(' ')[1]}`} />
                </div>
                <h3 className="text-lg font-black text-white mb-2.5 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Brand promise banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#221813] via-[#2a1e17] to-[#221813] border border-cyan-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_25px_rgba(0,245,255,0.15)]">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              O`lchamingizga mos kelmasa — almashtirib beramiz!
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Buyurtma berganingizda mutaxassisimiz siz bilan bog`lanib, bo`yingiz va vazningizga qarab eng to`g`ri erkaklar oversize razmerini aniqlashga yordam beradi.
            </p>
          </div>
          <a
            href="#contact"
            className="whitespace-nowrap px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-sky-400 text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)] active:scale-95"
          >
            Menejer bilan maslahat
          </a>
        </div>

      </div>
    </section>
  );
};
