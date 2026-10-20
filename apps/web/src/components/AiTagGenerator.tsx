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
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-dark-750">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-950/50">
            <Hash className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                AI SEO &amp; Teglar Generatori
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-500/30 text-rose-300 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                Gemini Pro
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Videongiz mavzusini yozing — sun&apos;iy intellekt eng yuqori qidiriladigan kalit so&apos;zlarni topadi.
            </p>
          </div>
        </div>

        <button
          onClick={copyAllTags}
          className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-200 hover:text-white border border-dark-700 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm self-start md:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Nusxalandi!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-rose-400" />
              <span>Barchasini nusxalash</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleGenerate} className="relative z-10 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Video mavzusini kiriting (masalan: Yangi telefon sharhi, YouTube SEO darslari)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-dark-900 border border-dark-650 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-950/40 transition-all flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
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
            className="p-3.5 rounded-2xl bg-dark-850/80 hover:bg-dark-800 border border-dark-700/80 hover:border-rose-500/40 transition-all group flex items-center justify-between gap-3 shadow-md"
          >
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                  #{item.tag}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-medium">
                <span className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  {item.volume}
                </span>
                <span className="text-gray-600">·</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold ${
                    item.competition === 'LOW'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : item.competition === 'MEDIUM'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  Raqobat: {item.competition}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-xs">
                {item.score}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(item.tag);
                }}
                className="p-1.5 rounded-lg bg-dark-750 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors"
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
