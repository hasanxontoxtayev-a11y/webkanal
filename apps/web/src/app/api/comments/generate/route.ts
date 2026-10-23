import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { commentText, authorName, language = 'uz', channelTitle = 'TubePilot Studio' } = await req.json();

    if (!commentText) {
      return NextResponse.json({ success: false, error: 'commentText is required' }, { status: 400 });
    }

    const name = authorName || 'Do\'stim';
    let draft = '';

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const langName = language === 'ru' ? 'Russian' : language === 'en' ? 'English' : 'Uzbek';
        const prompt = `You are YouTube creator "${channelTitle}". Reply to this viewer comment kindly, warmly, and authentically in ${langName}:
Viewer Name: "${name}"
Comment: "${commentText}"

Rules:
1. Address them kindly by name.
2. Thank them warmly and respond directly to their specific point.
3. Keep it within 1-2 friendly sentences.
4. Add 1 appropriate emoji.`;

        const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
        for (const model of candidateModels) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { maxOutputTokens: 150, temperature: 0.7 },
                }),
              }
            );
            clearTimeout(timeoutId);

            if (res.ok) {
              const json = await res.json();
              const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text && text.trim().length > 0) {
                draft = text.trim();
                break;
              }
            }
          } catch {}
        }
      } catch (geminiErr) {
        console.warn('Gemini comment generation error, using smart fallback');
      }
    }

    if (!draft) {
      // Smart contextual fallback based on comment text
      const lower = commentText.toLowerCase();
      if (language === 'uz') {
        if (lower.includes('rahmat') || lower.includes('zo\'r') || lower.includes('zor') || lower.includes('gap yo')) {
          draft = `Assalomu alaykum ${name}! Katta rahmat, doimiy e'tiboringiz va qo'llab-quvvatlashingiz bizga yangi kuch beradi! 🚀`;
        } else if (lower.includes('qachon') || lower.includes('qayerdan') || lower.includes('?')) {
          draft = `Assalomu alaykum ${name}! Qiziqarli savol uchun rahmat. Aynan shu mavzuni keyingi yangi sonimizda to'liq yoritib beramiz, kuzatib boring! 💡`;
        } else {
          draft = `Assalomu alaykum ${name}! Fikringiz uchun katta rahmat! Aynan shu mavzuda yangi video ustida ishlayapmiz, biz bilan qoling! 🚀`;
        }
      } else if (language === 'ru') {
        if (lower.includes('спасибо') || lower.includes('круто') || lower.includes('топ')) {
          draft = `Привет, ${name}! Огромное спасибо за поддержку! Очень приятно видеть такой живой отклик от аудитории. Дальше будет еще интереснее! 👍`;
        } else if (lower.includes('когда') || lower.includes('где') || lower.includes('?')) {
          draft = `Привет, ${name}! Отличный вопрос! Мы как раз готовим разбор этой темы в одном из ближайших роликов. Оставайтесь на связи! 💡`;
        } else {
          draft = `Привет, ${name}! Большое спасибо за отзыв! Ваше мнение очень ценно для развития нашего канала. 👍`;
        }
      } else {
        if (lower.includes('thank') || lower.includes('great') || lower.includes('awesome') || lower.includes('best')) {
          draft = `Hey ${name}! Thank you so much for the incredible support! It truly motivates us to produce higher quality content for you. 🚀`;
        } else {
          draft = `Hey ${name}! Thanks so much for watching and for your awesome feedback! More exciting uploads coming soon. Stay tuned! 🚀`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      draftReply: draft,
      language,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
