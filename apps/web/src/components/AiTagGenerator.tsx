'use client';

import { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Hash,
  Flame,
  Search,
  Loader2,
  Zap,
} from 'lucide-react';

interface TagItem {
  tag: string;
  score: number;
  competition: 'LOW' | 'MEDIUM' | 'HIGH';
  volume: string;
}

export function AiTagGenerator() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tags, setTags] = useState<TagItem[]>([
    { tag: 'youtube growth 2026', score: 94, competition: 'LOW', volume: '142K/oy' },
    { tag: 'how to get more views', score: 88, competition: 'MEDIUM', volume: '310K/oy' },
    { tag: 'youtube algorithm secrets', score: 92, competition: 'LOW', volume: '95K/oy' },
    { tag: 'vidiq best settings', score: 85, competition: 'LOW', volume: '48K/oy' },
    { tag: 'youtube seo tutorial', score: 89, competition: 'MEDIUM', volume: '180K/oy' },
    { tag: 'viral video tips', score: 81, competition: 'HIGH', volume: '520K/oy' },
  ]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    // Dynamic generation simulation or API hook
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const newGenerated: TagItem[] = [
        { tag: `${q} trend 2026`, score: 96, competition: 'LOW', volume: '110K/oy' },
        { tag: `${q} sirlari`, score: 91, competition: 'LOW', volume: '64K/oy' },
        { tag: `${q} tezkor o'sish`, score: 87, competition: 'MEDIUM', volume: '125K/oy' },
        { tag: `${q} haqida to'liq`, score: 84, competition: 'LOW', volume: '45K/oy' },
        { tag: `eng zo'r ${q}`, score: 89, competition: 'LOW', volume: '88K/oy' },
        { tag: `${q} tahlili`, score: 82, competition: 'MEDIUM', volume: '95K/oy' },
      ];
      setTags(newGenerated);
      setLoading(false);
    }, 700);
  };

  const copyAllTags = () => {
    const text = tags.map((t) => t.tag).join(', ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-dark-850 via-dark-900 to-dark-950 border border-dark-650 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-malla-600/15 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-600/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-dark-750">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-malla-600 via-amber-600 to-malla-400 flex items-center justify-center text-white shadow-xl shadow-malla-950/60 animate-float-slow">
            <Hash className="w-6 h-6 text-malla-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                AI SEO &amp; Teglar Generatori
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-malla-500/20 border border-malla-400/40 text-malla-300 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-malla-400" />
                Gemini Pro
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Videongiz mavzusini yozing — sun&apos;iy intellekt eng yuqori qidiriladigan kalit so&apos;zlarni topadi.
            </p>
          </div>
        </div>

        <button
          onClick={copyAllTags}
          className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-malla-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm self-start md:self-auto hover:border-malla-400/50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Nusxalandi!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-malla-400" />
              <span>Barchasini nusxalash</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleGenerate} className="relative z-10 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Video mavzusini kiriting (masalan: Yangi telefon sharhi, YouTube SEO darslari)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-dark-900 border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-malla-400 transition-colors shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-malla-600 via-amber-600 to-malla-500 hover:from-malla-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-malla-950/60 transition-all flex items-center gap-2 disabled:opacity-50 flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
            <span>Generatsiya</span>
          </button>
        </div>
      </form>

      {/* Generated Tags Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tags.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-dark-850/80 hover:bg-dark-800 border border-slate-700/80 hover:border-malla-400/60 transition-all duration-300 group flex items-center justify-between gap-3 shadow-md hover:-translate-y-0.5"
          >
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-malla-300 transition-colors truncate">
                  #{item.tag}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  {item.volume}
                </span>
                <span className="text-slate-600">·</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold ${
                    item.competition === 'LOW'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : item.competition === 'MEDIUM'
                      ? 'text-malla-300 bg-malla-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  Raqobat: {item.competition}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="px-2 py-0.5 rounded-lg bg-malla-500/10 border border-malla-400/30 text-malla-300 font-extrabold text-xs">
                {item.score}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(item.tag);
                }}
                className="p-1.5 rounded-lg bg-dark-750 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors"
                title="Nusxalash"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
