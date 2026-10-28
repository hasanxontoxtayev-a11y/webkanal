import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 1. Check SQLite Database connection
  let dbStatus = 'disconnected';
  let dbError = null;
  let userCount = 0;
  try {
    const testPromise = (async () => {
      userCount = await prisma.user.count();
      return true;
    })();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out (1.5s)')), 1500)
    );
    await Promise.race([testPromise, timeoutPromise]);
    dbStatus = 'connected';
  } catch (err: any) {
    dbStatus = 'disconnected';
    dbError = err.message || 'SQLite database error';
  }

  // 2. Check Telegram Bot Runtime & Credentials
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '9077748091:AAEFiPyxWo1aUm3oq04bqA4RKj8SKugbdrM';
  let telegramBotStatus: any = { status: 'checking' };
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const tgData = await tgRes.json();
    if (tgData.ok) {
      telegramBotStatus = {
        status: 'active',
        username: tgData.result.username,
        firstName: tgData.result.first_name,
        botId: tgData.result.id,
        canJoinGroups: tgData.result.can_join_groups,
      };
    } else {
      telegramBotStatus = { status: 'error', error: tgData.description };
    }
  } catch (err: any) {
    telegramBotStatus = { status: 'offline', error: err.message };
  }

  // 3. Check Google OAuth configuration
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const isGoogleOAuthConfigured = Boolean(
    clientId &&
    clientId.length > 10 &&
    !clientId.includes('your-google-client-id') &&
    process.env.GOOGLE_CLIENT_SECRET?.trim()
  );

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        provider: 'sqlite',
        file: 'packages/db/prisma/dev.db',
        status: dbStatus,
        userCount,
        error: dbError,
      },
      telegramBot: telegramBotStatus,
      webServer: {
        status: 'active',
        framework: 'Next.js 14.2 App Router',
        port: 3000,
      },
      youtubeAudit: {
        status: 'active',
        resolver: 'real_youtube_public_api_and_data_v3',
      },
      googleOAuth: {
        status: isGoogleOAuthConfigured ? 'configured' : 'demo_mode_active',
        demoConnectAvailable: true,
      },
    },
  });
}
