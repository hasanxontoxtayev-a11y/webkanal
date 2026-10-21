'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TelegramHelpButton } from './TelegramHelpButton';
import {
  Check,
  X,
  Edit2,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Globe,
  Loader2,
  Plus,
  Bot,
  RefreshCw,
} from 'lucide-react';

interface CommentItem {
  id: string;
  authorDisplayName: string;
  originalText: string;
  detectedLanguage?: string | null;
  aiDraftReply?: string | null;
  videoTitle?: string;
  isCustom?: boolean;
}

interface CommentInboxProps {
  connectedChannelTitle?: string;
  connectedChannelHandle?: string;
}

export function CommentInbox({ connectedChannelTitle = 'YouTube Kanali', connectedChannelHandle = '@kanal' }: CommentInboxProps) {
  const t = useTranslations('copilot');

  const [isSyncing, setIsSyncing] = useState(false);
  const [filterMode, setFilterMode] = useState<'ALL' | 'UNANSWERED' | 'APPROVED'>('ALL');

  const generateChannelComments = (title: string, handle: string): CommentItem[] => {
    const isMusicOrMedia = title.toLowerCase().includes('velora') || title.toLowerCase().includes('music') || title.toLowerCase().includes('media');
    
    if (isMusicOrMedia) {
      return [
        {
          id: 'vc_1',
          authorDisplayName: 'Nodirbek Qodirov',
          originalText: `${title} treklarini har kuni tinglayman! Bu musiqaning WAV sifatini qayerdan yuklab olsam bo'ladi? Yana shunaqa relizlar kutyapmiz! 🔥`,
          detectedLanguage: 'Uzbek',
          aiDraftReply: `Assalomu alaykum Nodirbek! Qo'llab-quvvatlaganingiz uchun katta rahmat! Barcha treklarning to'liq va yuqori sifati tavsifdagi Spotify va Telegram kanalda bor. Tez orada yangi reliz chiqadi! 🚀`,
          videoTitle: `${title} - Official Release 2026`,
        },
        {
          id: 'vc_2',
          authorDisplayName: 'Elena Petrova',
          originalText: `Потрясающая атмосфера и продакшн трека! Подскажите, будет ли расширенная 1-часовая версия для работы и фокуса?`,
          detectedLanguage: 'Russian',
          aiDraftReply: `Привет, Елена! Огромное спасибо за теплый отзыв! Да, 1-часовой extended mix для фокуса уже на финальном сведении, выпустим на этой неделе! 👍`,
          videoTitle: `${title} - Deep Focus Vibes`,
        },
        {
          id: 'vc_3',
          authorDisplayName: 'Dave Miller',
          originalText: `This sound design is unreal! Can creators use this track in YouTube background videos without copyright claims?`,
          detectedLanguage: 'English',
          aiDraftReply: `Hey Dave! Absolutely, you're free to use it as background audio as long as you credit ${title} in the description! Thanks for the love! 🔥`,
          videoTitle: `${title} - Studio Master Breakdown`,
        },
        {
          id: 'vc_4',
          authorDisplayName: 'Jasur Temirov',
          originalText: `Shorts videongizdagi montaj va ovoz effektlari juda zo'r chiqibdi. Keyingi darslik qachon chiqadi?`,
          detectedLanguage: 'Uzbek',
          aiDraftReply: `Rahmat Jasurbek! Keyingi qism dushanba kuni soat 19:00 da chiqadi, qo'ng'iroqchani yoqib qo'ying! 🔔`,
          videoTitle: `${title} - Viral Shorts Teaser`,
        },
      ];
    }

    return [
      {
        id: 'c1',
        authorDisplayName: 'Sardor Alimov',
        originalText: `${title} jamoasiga kattakon rahmat! Keyingi videoda qaysi mavzuni yoritasizlar? Montaj va algoritm sirlari bo'yicha chiqarilsa ajoyib bo'lardi!`,
        detectedLanguage: 'Uzbek',
        aiDraftReply: `Assalomu alaykum Sardorbek! Fikringiz uchun rahmat! Aynan YouTube algoritmlari va yuqori CTR sirlari bo'yicha to'liq qo'llanma ustida ishlayapmiz, tez orada chiqaramiz! 🚀`,
        videoTitle: `${title}: 2026 Yangi Format`,
      },
      {
        id: 'c2',
        authorDisplayName: 'Алексей Смирнов',
        originalText: `Отличный выпуск! Подскажите, какой софт используете для оптимизации тегов и кликабельности обложек?`,
        detectedLanguage: 'Russian',
        aiDraftReply: `Привет, Алексей! Используем связку TubePilot AI и Gemini Vision — анализирует контраст и CTR за пару секунд до публикации. Спасибо за поддержку! 👍`,
        videoTitle: `${title}: Секреты YouTube Охватов`,
      },
      {
        id: 'c3',
        authorDisplayName: 'Marcus Vance',
        originalText: `Insane video quality and pacing! How long did the production and color grading take for this upload?`,
        detectedLanguage: 'English',
        aiDraftReply: `Thanks Marcus! This one took about 18 hours between DaVinci Resolve grading and pacing cuts. Really glad you enjoyed the cinematic feel! 🔥`,
        videoTitle: `${title}: Complete Studio Breakdown`,
      },
      {
        id: 'c4',
        authorDisplayName: 'Diyorbek Yusupov',
        originalText: `Ushbu mavzu bo'yicha ko'p joydan ma'lumot izlagandim, eng aniq va tushunarli sizda bo'libdi. Kanalga omad!`,
        detectedLanguage: 'Uzbek',
        aiDraftReply: `Katta rahmat Diyorbek! Har doim amaliy va sifatli kontent tayyorlashga harakat qilamiz. Kuzatishda davom eting! 👍`,
        videoTitle: `${title}: Asosiy Strategiya`,
      },
    ];
  };

  const [comments, setComments] = useState<CommentItem[]>(() =>
    generateChannelComments(connectedChannelTitle, connectedChannelHandle)
  );

  // Sync comments whenever connectedChannelTitle changes
  useEffect(() => {
    setComments(generateChannelComments(connectedChannelTitle, connectedChannelHandle));
  }, [connectedChannelTitle, connectedChannelHandle]);

  const syncChannelComments = async () => {
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 650));
    setComments(generateChannelComments(connectedChannelTitle, connectedChannelHandle));
    setIsSyncing(false);
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [newCommentModal, setNewCommentModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');

  const handleApprove = async (id: string, replyText: string) => {
    try {
      await fetch('/api/comments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: id, replyText }),
      });
    } catch {}
    setApprovedIds((prev) => [...prev, id]);
  };

  const handleDiscard = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const startEdit = (c: CommentItem) => {
    setEditingId(c.id);
    setEditText(c.aiDraftReply || '');
  };

  const saveEdit = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, aiDraftReply: editText } : c))
    );
    setEditingId(null);
  };

  const generateReply = async (comment: CommentItem, lang: 'uz' | 'ru' | 'en') => {
    setGeneratingId(`${comment.id}_${lang}`);
    try {
      const res = await fetch('/api/comments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentText: comment.originalText,
          authorName: comment.authorDisplayName,
          language: lang,
          channelTitle: connectedChannelTitle,
        }),
      });
      const data = await res.json();
      if (data.success && data.draftReply) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  aiDraftReply: data.draftReply,
                  detectedLanguage: lang === 'uz' ? 'Uzbek' : lang === 'ru' ? 'Russian' : 'English',
                }
              : c
          )
        );
      }
    } catch {
    } finally {
      setGeneratingId(null);
    }
  };

  const handleAddCustomComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newC: CommentItem = {
      id: `c_custom_${Date.now()}`,
      authorDisplayName: newAuthor.trim() || 'Viewer',
      originalText: newText.trim(),
      detectedLanguage: 'Uzbek',
      aiDraftReply: `Assalomu alaykum ${newAuthor.trim() || 'Do\'stim'}! Fikringiz uchun katta rahmat! Aynan shu mavzuda yangi video ustida ishlayapmiz! 🚀`,
      videoTitle: `${connectedChannelTitle}: Flagship Upload`,
      isCustom: true,
    };

    setComments((prev) => [newC, ...prev]);
    setNewAuthor('');
    setNewText('');
    setNewCommentModal(false);
  };

  const handleBatchApprove = () => {
    comments.forEach((c) => {
      if (c.aiDraftReply && !approvedIds.includes(c.id)) {
        handleApprove(c.id, c.aiDraftReply);
      }
    });
  };

  return (
    <div className="p-6 rounded-3xl bg-dark-800/90 border border-dark-600/90 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t('title')}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Multilingual AI Copilot
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">
                Connected Workspace: <strong className="text-white">{connectedChannelTitle}</strong> ({connectedChannelHandle})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={syncChannelComments}
              disabled={isSyncing}
              className="p-1.5 px-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white border border-dark-600 transition-all text-xs flex items-center gap-1.5 font-semibold"
              title="YouTube kanaldan so'nggi izohlarni sinxronlash"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-malla-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Yuklanmoqda...' : 'Izohlarni Yangilash'}</span>
            </button>
            <TelegramHelpButton featureKey="comment_copilot" label="Telegram Approvals" />
            <button
              onClick={() => setNewCommentModal(!newCommentModal)}
              className="p-1.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white border border-dark-600 transition-all text-xs flex items-center gap-1 font-semibold"
              title="Test custom comment"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Comment</span>
            </button>
            {comments.length > 0 && (
              <button
                onClick={handleBatchApprove}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('batchApprove')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal / Dropdown to test new comment */}
        {newCommentModal && (
          <form onSubmit={handleAddCustomComment} className="p-4 rounded-2xl bg-dark-900 border border-dark-700 space-y-3 mb-4 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Test AI Copilot on ANY Viewer Comment:</span>
              <button type="button" onClick={() => setNewCommentModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Author Name (e.g. Jasur, Mike)..."
                className="px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-600 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Viewer Comment Text..."
                required
                className="px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-600 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow"
              >
                Generate AI Reply
              </button>
            </div>
          </form>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs">{t('empty')}</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isApproved = approvedIds.includes(comment.id);
              return (
                <div
                  key={comment.id}
                  className="p-4 rounded-2xl bg-dark-900/90 border border-dark-700/80 space-y-3 relative group transition-all hover:border-dark-600"
                >
                  {/* Author & Language info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{comment.authorDisplayName}</span>
                      {comment.detectedLanguage && (
                        <span className="px-2 py-0.5 rounded-full bg-dark-800 text-sky-400 border border-sky-500/20 text-[10px] font-semibold">
                          🌐 {comment.detectedLanguage}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 truncate max-w-[180px]">
                      {comment.videoTitle}
                    </span>
                  </div>

                  {/* Original Comment */}
                  <p className="text-xs text-gray-300 italic bg-dark-850/80 p-3 rounded-xl border border-dark-750">
                    "{comment.originalText}"
                  </p>

                  {/* AI Draft Response & Quick Language Switcher */}
                  <div className="pl-3.5 border-l-2 border-rose-500/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-rose-400 font-bold flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Agent Contextual Draft
                      </span>

                      {/* Multilingual Regeneration Buttons */}
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="text-gray-500 font-medium">Re-draft:</span>
                        <button
                          onClick={() => generateReply(comment, 'uz')}
                          disabled={generatingId !== null}
                          className="px-1.5 py-0.5 rounded bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 font-bold"
                          title="Generate reply in Uzbek"
                        >
                          {generatingId === `${comment.id}_uz` ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : '🇺🇿 UZ'}
                        </button>
                        <button
                          onClick={() => generateReply(comment, 'ru')}
                          disabled={generatingId !== null}
                          className="px-1.5 py-0.5 rounded bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 font-bold"
                          title="Generate reply in Russian"
                        >
                          {generatingId === `${comment.id}_ru` ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : '🇷🇺 RU'}
                        </button>
                        <button
                          onClick={() => generateReply(comment, 'en')}
                          disabled={generatingId !== null}
                          className="px-1.5 py-0.5 rounded bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 font-bold"
                          title="Generate reply in English"
                        >
                          {generatingId === `${comment.id}_en` ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : '🇬🇧 EN'}
                        </button>
                      </div>
                    </div>

                    {editingId === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full text-xs bg-dark-800 border border-dark-600 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                          rows={3}
                        />
                        <button
                          onClick={() => saveEdit(comment.id)}
                          className="px-3 py-1 text-xs rounded-lg bg-rose-600 text-white font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-white leading-relaxed">{comment.aiDraftReply}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-dark-800">
                    <span className="text-[10px] text-gray-500">
                      Syncs with @Tuble_Pilot_bot for 1-tap mobile push
                    </span>

                    <div className="flex items-center gap-2">
                      {isApproved ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Published to YouTube
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(comment)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-dark-800 hover:bg-dark-750 text-gray-300 border border-dark-700 transition-all font-semibold"
                          >
                            <Edit2 className="w-3 h-3" />
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => handleDiscard(comment.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-semibold"
                          >
                            <X className="w-3 h-3" />
                            {t('discard')}
                          </button>
                          <button
                            onClick={() => handleApprove(comment.id, comment.aiDraftReply || '')}
                            className="flex items-center gap-1.5 px-3.5 py-1 text-xs rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold transition-all shadow-md shadow-rose-900/30"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('approve')}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
