'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Subtitles,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  Eye,
  MessageSquare,
  Activity,
  Flame,
  ArrowRight,
  ShieldCheck,
  Globe,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Chapter {
  start: number;
  end: number;
  title: { uz: string; ru: string; en: string };
  badge: { uz: string; ru: string; en: string };
  icon: any;
  color: string;
}

const CHAPTERS: Chapter[] = [
  {
    start: 0,
    end: 15,
    title: {
      uz: '1-Bosishda Kanalni Ulash & VidIQ Ishchi Maydoni',
      ru: 'Подключение канала в 1 клик & Рабочая область VidIQ',
      en: '1-Click Channel Workspace Sync & Live Header',
    },
    badge: {
      uz: 'Aktiv Sinxronizatsiya',
      ru: 'Живая синхронизация',
      en: 'Active Sync',
    },
    icon: ShieldCheck,
    color: 'from-rose-500 to-pink-600',
  },
  {
    start: 15,
    end: 30,
    title: {
      uz: 'Ko\'p Tilli Izohlar Kopiloti & 1-Bosishda Tasdiqlash',
      ru: 'Мультиязычный автопилот комментариев в 1 клик',
      en: 'Multilingual Comment Copilot & 1-Tap Approval',
    },
    badge: {
      uz: 'Gemini Copilot',
      ru: 'ИИ Копилот',
      en: 'AI Copilot',
    },
    icon: MessageSquare,
    color: 'from-sky-500 to-blue-600',
  },
  {
    start: 30,
    end: 45,
    title: {
      uz: 'Muqova AI Vision Studiyasi & Diqqat Issiqlik Xaritasi',
      ru: 'ИИ-студия обложек & Тепловая карта внимания (CTR)',
      en: 'Gemini Vision Thumbnail Studio & Attention Heatmap',
    },
    badge: {
      uz: 'Multimodal CTR Vision',
      ru: 'Мультимодальный CTR',
      en: 'Multimodal Vision',
    },
    icon: Eye,
    color: 'from-amber-500 to-orange-600',
  },
  {
    start: 45,
    end: 60,
    title: {
      uz: 'Global Kanal Auditi & Hududiy RPM Daromad Kalkulyatori',
      ru: 'Глобальный аудит каналов & Региональный расчет RPM',
      en: 'Global Channel Audit & Regional RPM Revenue Engine',
    },
    badge: {
      uz: 'VidIQ Growth Engine',
      ru: 'Аналитика охватов',
      en: 'VidIQ Competitor Spy',
    },
    icon: Activity,
    color: 'from-emerald-500 to-teal-600',
  },
];

const NARRATION_SUBTITLES: Record<'uz' | 'ru' | 'en', Array<{ start: number; end: number; text: string }>> = {
  uz: [
    { start: 0, end: 5, text: "TubePilot AI'ga xush kelibsiz! YouTube kanalingizni rivojlantirish uchun to'liq sun'iy intellekt platformasi." },
    { start: 5, end: 10, text: "O'z kanalingizni (@handle yoki havola) orqali 1-bosishda ulang. Barcha ma'lumotlar avtomatik sinxronlanadi." },
    { start: 10, end: 15, text: "Yuqori panelda doimiy obunachilar soni, ko'rishlar va '🟢 Connected & AI Synced' holatini ko'rib turasiz." },
    { start: 15, end: 20, text: "2-bo'lim: Izohlar Kopiloti. Tomoshabinlaringiz qaysi tilda yozmasin, AI darhol munosib javob tayyorlaydi." },
    { start: 20, end: 25, text: "O'zbekcha, Ruscha va Inglizcha javoblar sizning mualliflik uslubingizda generatsiya qilinadi." },
    { start: 25, end: 30, text: "Javobni veb-panelda yoki to'g'ridan-to'g'ri Telegram botimiz (@tubepilotai_bot) orqali 1 ta bosishda tasdiqlang." },
    { start: 30, end: 35, text: "3-bo'lim: Muqova AI Vision Studiyasi. Videoni chiqarishdan oldin uning CTR salohiyatini tekshiring." },
    { start: 35, end: 40, text: "Gemini Vision smartfon ekranlaridagi o'qilishini, kontrastini va diqqat issiqlik xaritasini baholaydi." },
    { start: 40, end: 45, text: "Vaqt belgisi ostida qoladigan xatolarni oldini oling va CTR'ni 15-25% ga oshiring." },
    { start: 45, end: 50, text: "4-bo'lim: Cheklovsiz Global Kanal Auditi. Dunyodagi istalgan YouTube kanalni qidiring va VPH tezligini ko'ring." },
    { start: 50, end: 55, text: "O'zbekiston va MDH uchun real $0.35 - $0.90 RPM asosida AdSense va homiylik daromadini aniq hisoblang." },
    { start: 55, end: 60, text: "TubePilot AI bilan YouTube algoritmlarida yetakchilik qiling. Boshqaruv paneliga xush kelibsiz!" },
  ],
  ru: [
    { start: 0, end: 5, text: "Добро пожаловать в TubePilot AI — передовую платформу для масштабирования YouTube каналов!" },
    { start: 5, end: 10, text: "Подключите ваш личный канал в 1 клик через @handle или ссылку с полной синхронизацией в реальном времени." },
    { start: 10, end: 15, text: "В верхней панели отображается живой статус '🟢 Connected & AI Synced', реальные подписчики и просмотры." },
    { start: 15, end: 20, text: "Раздел 2: Автопилот комментариев. ИИ мгновенно анализирует вопросы зрителей на любом языке." },
    { start: 20, end: 25, text: "Генерирует персонализированные черновики ответов на русском, узбекском и английском языках." },
    { start: 25, end: 30, text: "Одобряйте ответы в 1 клик в дашборде или на ходу через Telegram бота @tubepilotai_bot." },
    { start: 30, end: 35, text: "Раздел 3: ИИ-студия обложек. Проверьте кликабельность (CTR) превью еще до публикации ролика." },
    { start: 35, end: 40, text: "Мультимодальный Gemini Vision строит тепловую карту внимания и проверяет читаемость на смартфонах." },
    { start: 40, end: 45, text: "Устраняйте перекрытие текста таймкодом и увеличивайте CTR на 15–25%." },
    { start: 45, end: 50, text: "Раздел 4: Глобальный аудит каналов и конкурентная разведка по реальным метрикам VPH." },
    { start: 50, end: 55, text: "Точный региональный калькулятор RPM ($0.35–$0.90 для СНГ vs $2.00–$4.00 для США) с разбивкой AdSense и спонсорства." },
    { start: 55, end: 60, text: "Управляйте ростом вашего канала как профессионал с TubePilot AI. Приятной работы!" },
  ],
  en: [
    { start: 0, end: 5, text: "Welcome to TubePilot AI — the definitive multimodal AI growth platform for modern YouTube creators!" },
    { start: 5, end: 10, text: "Connect your channel seamlessly via @handle or URL with persistent real-time workspace synchronization." },
    { start: 10, end: 15, text: "Your top header permanently displays live subscribers, total views, and the '🟢 Connected & AI Synced' badge." },
    { start: 15, end: 20, text: "Pillar 2: Multilingual Comment Copilot. Detects any viewer language and crafts creator-voiced reply drafts." },
    { start: 20, end: 25, text: "Personalized replies in English, Russian, and Uzbek, ready for 1-tap approval." },
    { start: 25, end: 30, text: "Approve replies from your web workspace or instantly mobile via Telegram bot @tubepilotai_bot." },
    { start: 30, end: 35, text: "Pillar 3: AI Thumbnail Studio. Audit CTR clickability, contrast, and visual hierarchy before posting." },
    { start: 35, end: 40, text: "Gemini Vision generates eye-tracking attention heatmaps and mobile feed layout simulations." },
    { start: 40, end: 45, text: "Avoid timestamp overlap and boost browse click-through rates by up to 25%." },
    { start: 45, end: 50, text: "Pillar 4: Unrestricted Global Channel Audit. Search any channel worldwide to inspect real-time VPH velocity." },
    { start: 50, end: 55, text: "Realistic localized RPM engine: accurate CIS ($0.35–$0.90) vs US/EU ($2.00–$4.00) revenue breakdowns." },
    { start: 55, end: 60, text: "Dominate YouTube algorithmic recommendations with TubePilot AI. Welcome aboard!" },
  ],
};

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const siteLocale = useLocale() as 'uz' | 'ru' | 'en';
  const [selectedLang, setSelectedLang] = useState<'uz' | 'ru' | 'en'>(siteLocale || 'uz');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const progressRef = useRef<HTMLDivElement>(null);

  // Sync language with site locale and reset when modal opens
  useEffect(() => {
    if (isOpen) {
      if (siteLocale && ['uz', 'ru', 'en'].includes(siteLocale)) {
        setSelectedLang(siteLocale);
      }
      setIsPlaying(true);
    }
  }, [isOpen, siteLocale]);

  const handleClose = () => {
    try {
      localStorage.setItem('tubepilot_tour_seen', 'true');
    } catch {}
    onClose();
  };

  // Auto-play timer loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return Math.min(duration, prev + 0.25 * playbackSpeed);
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, duration, playbackSpeed]);

  if (!isOpen) return null;

  const currentChapter =
    CHAPTERS.find((ch) => currentTime >= ch.start && currentTime <= ch.end) || CHAPTERS[0];
  const ChapterIcon = currentChapter.icon;

  const subtitlesList = NARRATION_SUBTITLES[selectedLang] || NARRATION_SUBTITLES.en;
  const activeSubtitle =
    subtitlesList.find((s) => currentTime >= s.start && currentTime < s.end)?.text || '';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(percentage * duration);
  };

  const jumpToChapter = (startSec: number) => {
    setCurrentTime(startSec);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-dark-900 border border-dark-600 rounded-3xl max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-dark-700/80 flex items-center justify-between gap-4 bg-dark-850/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-900/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Discover TubePilot AI in 60 Seconds</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Interactive Video Tour
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Complete VidIQ-Killer Creator Platform Walkthrough</p>
            </div>
          </div>

          {/* Language Switcher Inside Player */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-dark-700 text-xs">
              {(['uz', 'ru', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLang(l)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                    selectedLang === l
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {l === 'uz' ? '🇺🇿 UZ' : l === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
                </button>
              ))}
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cinematic Video Player Screen (16:9 Canvas) */}
        <div className="relative aspect-video w-full bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-hidden flex flex-col justify-between p-6 sm:p-8 select-none">
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-600/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20 animate-pulse" />

          {/* Top Video Metadata Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${currentChapter.color} shadow-lg flex items-center gap-1.5`}>
                <ChapterIcon className="w-3.5 h-3.5" />
                <span>{currentChapter.badge[selectedLang]}</span>
              </span>
              <span className="text-xs text-gray-400 font-mono bg-dark-900/80 px-2 py-0.5 rounded-lg border border-dark-700">
                Chapter {CHAPTERS.indexOf(currentChapter) + 1} of 4
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE AI ENGINE DEMO</span>
            </div>
          </div>

          {/* Central Animated Visual Mockup Canvas */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-4">
            {currentTime < 15 ? (
              /* Chapter 1 Visual: Connected Workspace Header */
              <div className="w-full p-4 rounded-2xl bg-dark-850/90 border border-dark-700/80 shadow-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Avatar"
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500/60 shadow-lg"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white">YouTube Creator Studio</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-xs text-rose-400 font-semibold">@creator_studio</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected & AI Synced
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dark-700/80 text-left text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Subscribers</span>
                    <strong className="text-white text-sm">3.07M</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Lifetime Views</span>
                    <strong className="text-white text-sm">1.97B</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">VPH Velocity</span>
                    <strong className="text-sky-400 text-sm">28,400 VPH</strong>
                  </div>
                </div>
              </div>
            ) : currentTime < 30 ? (
              /* Chapter 2 Visual: Multilingual Comment Copilot */
              <div className="w-full p-4 rounded-2xl bg-dark-850/90 border border-sky-500/30 shadow-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Pierre Dubois</span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px]">
                      🌐 French Detected
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">Just now</span>
                </div>
                <p className="text-xs text-gray-300 italic text-left bg-dark-900/60 p-2 rounded-lg border border-dark-800">
                  "Super vidéo! Quel micro utilises-tu pour enregistrer le son?"
                </p>
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/30 to-pink-950/20 border border-rose-500/30 text-left space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-rose-400 font-bold">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Contextual Reply (French)</span>
                    <span className="text-emerald-400 font-semibold">1-Tap Approve</span>
                  </div>
                  <p className="text-xs text-white">
                    "Merci beaucoup Pierre! J'utilise le Shure SM7B avec préampli Cloudlifter. Très content que la vidéo t'ait plu!"
                  </p>
                </div>
              </div>
            ) : currentTime < 45 ? (
              /* Chapter 3 Visual: Thumbnail Vision & Attention Heatmap */
              <div className="w-full p-4 rounded-2xl bg-dark-850/90 border border-amber-500/30 shadow-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    Gemini Multimodal Vision Analysis
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs">
                    CTR 86% · EXCELLENT
                  </span>
                </div>
                <div className="relative aspect-video max-w-sm mx-auto rounded-xl overflow-hidden border border-dark-700 bg-dark-950 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=80"
                    alt="Thumbnail demo"
                    className="w-full h-full object-cover opacity-85"
                  />
                  {/* Heatmap overlay glow simulation */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/40 via-yellow-400/30 to-transparent pointer-events-none mix-blend-color-dodge animate-pulse" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-yellow-300 font-bold">
                    🔥 Eye-Gaze Focus: 78% Head & Subject
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    12:45
                  </div>
                </div>
              </div>
            ) : (
              /* Chapter 4 Visual: Global Channel Audit & Realistic Regional RPM */
              <div className="w-full p-4 rounded-2xl bg-dark-850/90 border border-emerald-500/30 shadow-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    VidIQ Localized Revenue Diagnostic
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    🇺🇿 Uzbekistan & CIS ($0.35 – $0.90 RPM)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-left text-xs">
                  <div className="p-2 rounded-xl bg-dark-900 border border-dark-750">
                    <span className="text-gray-400 block text-[10px]">Monthly AdSense</span>
                    <strong className="text-emerald-400 font-bold text-sm">$3,431 – $5,085</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-dark-900 border border-dark-750">
                    <span className="text-gray-400 block text-[10px]">Shorts vs Long-form</span>
                    <strong className="text-white font-bold text-xs">$261 <span className="text-gray-500">/</span> $3,170</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-dark-900 border border-dark-750">
                    <span className="text-gray-400 block text-[10px]">Sponsorship Potential</span>
                    <strong className="text-pink-400 font-bold text-xs">$2,500 – $6,000 / deal</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Synchronized Title */}
            <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              {currentChapter.title[selectedLang]}
            </h4>
          </div>

          {/* Subtitles Overlay Bar */}
          {showCaptions && activeSubtitle && (
            <div className="relative z-10 max-w-2xl mx-auto w-full text-center px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-dark-700/80 shadow-2xl text-xs sm:text-sm text-yellow-300 font-medium leading-relaxed animate-fadeIn">
              {activeSubtitle}
            </div>
          )}

          {/* Bottom Player Controls Container */}
          <div className="relative z-10 space-y-2.5 pt-3">
            {/* Scrubber Timeline Bar */}
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="relative w-full h-2 rounded-full bg-dark-800 cursor-pointer overflow-hidden group transition-all"
            >
              {/* Chapter markers */}
              {CHAPTERS.map((ch, idx) => (
                <div
                  key={idx}
                  style={{ left: `${(ch.start / duration) * 100}%` }}
                  className="absolute top-0 bottom-0 w-0.5 bg-dark-600 z-10"
                />
              ))}

              {/* Progress bar */}
              <div
                style={{ width: `${(currentTime / duration) * 100}%` }}
                className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 rounded-full transition-all"
              />
            </div>

            {/* Player Buttons Row */}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md shadow-rose-900/30"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-800 transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="font-mono text-[11px] text-gray-400">
                  <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                  <span> / {formatTime(duration)}</span>
                </div>
              </div>

              {/* Quick Chapter Selector Pills */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px]">
                {CHAPTERS.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToChapter(ch.start)}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      currentTime >= ch.start && currentTime <= ch.end
                        ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold'
                        : 'bg-dark-850 text-gray-400 hover:text-white border border-dark-750'
                    }`}
                  >
                    Ch.{idx + 1}
                  </button>
                ))}
              </div>

              {/* Utility Controls */}
              <div className="flex items-center gap-2">
                {/* Speed toggle */}
                <button
                  onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                  className="px-2 py-0.5 rounded-lg bg-dark-800 text-[10px] font-mono text-gray-300 hover:text-white border border-dark-700"
                >
                  {playbackSpeed}x
                </button>

                {/* Subtitles CC toggle */}
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    showCaptions
                      ? 'bg-rose-600/20 text-rose-300 border-rose-500/40'
                      : 'bg-dark-800 text-gray-400 border-dark-700 hover:text-white'
                  }`}
                  title="Toggle Subtitles"
                >
                  <Subtitles className="w-3.5 h-3.5" />
                </button>

                {/* Mute toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-dark-800 text-gray-400 hover:text-white border border-dark-700"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="px-6 py-4 bg-dark-850/90 border-t border-dark-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Ready to transform your YouTube channel with multimodal AI automation.</span>
          </div>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2"
          >
            <span>Start Exploring Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
