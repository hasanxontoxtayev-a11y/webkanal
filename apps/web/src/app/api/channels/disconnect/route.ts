import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

    if (!user) {
      user = await prisma.user.findFirst();
      if (user) userId = user.id;
    }

    // Completely flush connected YouTube channels from SQLite database
    await prisma.youTubeChannel.deleteMany({});

    if (userId) {
      // Reset user title/avatar
      await prisma.user.updateMany({
        where: { id: userId },
        data: {
          name: null,
          avatarUrl: null,
        },
      });

      // If Telegram bot is paired, send a notification
      if (user?.telegramChatId) {
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN || '8793624781:AAH2_XewbEEHxkHFRRJ5lM4mvJJlM88gnLk';
          const msg =
            `ℹ️ **YouTube Ishchi Maydoni Uzildi / Workspace Disconnected**\n\n` +
            `Kanalingiz muvaffaqiyatli uzildi. Yangi shaxsiy kanalingizni ulash uchun boshqaruv paneliga kiring:\n` +
            `👉 http://localhost:3001/uz/dashboard`;

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: user.telegramChatId.toString(),
              text: msg,
              parse_mode: 'Markdown',
            }),
          });
        } catch {}
      }
    }

    const response = NextResponse.json({ success: true, message: 'YouTube channel disconnected successfully' });
    response.cookies.delete('kanal_user_id');
    response.cookies.delete('tubepilot_google_connected');
    return response;
  } catch (error: any) {
    console.error('Failed to disconnect channel:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
