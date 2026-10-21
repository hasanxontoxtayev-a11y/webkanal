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
        const prompt = `You are YouTube creator ${channelTitle}. Reply to this viewer comment kindly and authentically in ${langName}:
Viewer Name: "${name}"
Comment: "${commentText}"

Reply rules:
1. Address them by name.
2. Thank them warmly and respond directly to their specific point.
3. Keep it within 1-2 friendly sentences.
4. Add 1 appropriate emoji.`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
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
          if (text) {
            draft = text.trim();
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini comment generation error, using smart fallback');
      }
    }

    if (!draft) {
      if (language === 'uz') {
        draft = `Assalomu alaykum ${name}! Fikringiz uchun katta rahmat! Aynan shu mavzuda yangi video ustida ishlayapmiz, kuzatib boring! 🚀`;
      } else if (language === 'ru') {
        draft = `Привет, ${name}! Огромное спасибо за поддержку и отзыв! Очень приятно читать такие комментарии. Оставайтесь на связи! 👍`;
      } else {
        draft = `Hey ${name}! Thanks so much for watching and for your awesome feedback! More exciting uploads coming soon. Stay tuned! 🚀`;
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
