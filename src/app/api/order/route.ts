import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, productName, size, message } = body;

    // Tekshirish
    if (!fullName || !phone) {
      return NextResponse.json(
        { ok: false, error: 'Ism va telefon raqami kiritilishi shart' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Agar env o'zgaruvchilari kiritilmagan bo'lsa
    if (!botToken || !chatId) {
      console.warn('TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID .env faylida topilmadi!');
      return NextResponse.json(
        {
          ok: false,
          error: "Telegram sozlamalari (.env.local) to'ldirilmagan. Iltimos, TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni kiriting.",
        },
        { status: 500 }
      );
    }

    // Telegram uchun chiroyli formatdagi xabar (HTML formati)
    const now = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

    const text = `
🔥 <b>YANGI BUYURTMA (OVERDROP Erkaklar Kiyimlari)</b>

👤 <b>Mijoz:</b> ${escapeHtml(fullName)}
📞 <b>Telefon:</b> ${escapeHtml(phone)}
👕 <b>Mahsulot:</b> ${escapeHtml(productName || "Katalogdan umumiy tanlov")}
📐 <b>O'lchami:</b> ${escapeHtml(size || 'L (Oversize)')}
💬 <b>Izoh / Manzil:</b> ${escapeHtml(message || "Izoh qoldirilmadi")}

🕒 <b>Vaqt:</b> ${now}
🌐 <b>Manba:</b> OVERDROP Rasmiy Vebsayti
`.trim();

    // Telegram Bot API orqali yuborish
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { ok: false, error: data.description || "Telegramga jo'natishda xatolik yuz berdi" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, message: 'Buyurtma muvaffaqiyatli qabul qilindi' });
  } catch (err: any) {
    console.error('Order API error:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Serverda xatolik' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
