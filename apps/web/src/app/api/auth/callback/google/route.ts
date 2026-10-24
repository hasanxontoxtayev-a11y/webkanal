import { google } from 'googleapis';
import { prisma } from '@kanal/db';
import { encryptToken } from '@kanal/youtube';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user profile
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Fetch channel metadata
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelRes = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    });

    const channelItem = channelRes.data.items?.[0];
    if (!channelItem || !channelItem.id) {
      return NextResponse.json({ error: 'No YouTube channel found for this account' }, { status: 404 });
    }

    let activeUserId = req.cookies.get('kanal_user_id')?.value;
    let currentUser = activeUserId ? await prisma.user.findUnique({ where: { id: activeUserId } }) : null;

    try {
      const email = userInfo.data.email || `${channelItem.id}@youtube.placeholder`;
      
      // If user had already clicked telegram pair in this browser, preserve their telegramChatId
      const existingTgChatId = currentUser?.telegramChatId;
      const existingTgUser = currentUser?.telegramUsername;

      currentUser = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          name: userInfo.data.name || channelItem.snippet?.title || 'Creator',
          avatarUrl: userInfo.data.picture || channelItem.snippet?.thumbnails?.default?.url,
          telegramChatId: existingTgChatId || null,
          telegramUsername: existingTgUser || null,
        },
        update: {
          name: userInfo.data.name || channelItem.snippet?.title,
          avatarUrl: userInfo.data.picture || channelItem.snippet?.thumbnails?.default?.url,
          telegramChatId: existingTgChatId || undefined,
          telegramUsername: existingTgUser || undefined,
        },
      });
      activeUserId = currentUser.id;

      await prisma.youTubeChannel.upsert({
        where: { id: channelItem.id },
        create: {
          id: channelItem.id,
          userId: activeUserId,
          title: channelItem.snippet?.title || 'My Channel',
          description: channelItem.snippet?.description,
          customUrl: channelItem.snippet?.customUrl || null,
          thumbnailUrl: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url,
          subscriberCount: BigInt(channelItem.statistics?.subscriberCount || 0),
          videoCount: Number(channelItem.statistics?.videoCount || 0),
          viewCount: BigInt(channelItem.statistics?.viewCount || 0),
          encryptedAccessToken: tokens.access_token ? encryptToken(tokens.access_token) : 'token',
          encryptedRefreshToken: tokens.refresh_token ? encryptToken(tokens.refresh_token) : 'token',
          tokenExpiresAt: new Date(tokens.expiry_date || Date.now() + 3600 * 1000),
          tokenScope: tokens.scope || '',
        },
        update: {
          userId: activeUserId,
          title: channelItem.snippet?.title || undefined,
          customUrl: channelItem.snippet?.customUrl || undefined,
          thumbnailUrl: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url || undefined,
          subscriberCount: BigInt(channelItem.statistics?.subscriberCount || 0),
          videoCount: Number(channelItem.statistics?.videoCount || 0),
          viewCount: BigInt(channelItem.statistics?.viewCount || 0),
          encryptedAccessToken: tokens.access_token ? encryptToken(tokens.access_token) : undefined,
          encryptedRefreshToken: tokens.refresh_token ? encryptToken(tokens.refresh_token) : undefined,
          tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          tokenScope: tokens.scope || undefined,
        },
      });
    } catch (dbErr) {
      console.warn('[OAuth Callback] Database persistence bypassed for serverless:', dbErr);
    }

    const channelData = {
      title: channelItem.snippet?.title || 'YouTube Channel',
      handle: channelItem.snippet?.customUrl || '@channel',
      subscribers: channelItem.statistics?.subscriberCount || '0',
      views: channelItem.statistics?.viewCount || '0',
      avatar: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url || '',
      isPaired: true,
    };

    const targetUrl = new URL('/uz/dashboard?connected=true&google_oauth=success', req.url);
    targetUrl.searchParams.set('ch_title', encodeURIComponent(channelData.title));
    targetUrl.searchParams.set('ch_handle', encodeURIComponent(channelData.handle));
    targetUrl.searchParams.set('ch_subs', encodeURIComponent(channelData.subscribers));
    targetUrl.searchParams.set('ch_views', encodeURIComponent(channelData.views));
    targetUrl.searchParams.set('ch_avatar', encodeURIComponent(channelData.avatar));

    // Send instant Telegram notification to THIS SPECIFIC USER'S telegram bot
    if (currentUser?.telegramChatId) {
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN || '8793624781:AAH2_XewbEEHxkHFRRJ5lM4mvJJlM88gnLk';
        const msg =
          `🚀 **TubePilot: Sizning YouTube Kanalingiz Muvaffaqiyatli Bog'landi!** 📺\n\n` +
          `📌 Kanal: **${channelData.title}** (${channelData.handle})\n` +
          `👥 Obunachilar: **${channelData.subscribers}**\n` +
          `👁️ Jami ko'rishlar: **${channelData.views}**\n\n` +
          `✅ Endi har bir yangi video yuklanganda yoki tomoshalar oshganda sizga ushbu bot orqali tahlillar va maslahatlar kelib turadi!`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: currentUser.telegramChatId.toString(),
            text: msg,
            parse_mode: 'Markdown',
          }),
        });
      } catch (tgNotifyErr) {
        console.warn('[OAuth Callback] Telegram alert skipped:', tgNotifyErr);
      }
    }

    const response = NextResponse.redirect(targetUrl);
    if (activeUserId) {
      response.cookies.set('kanal_user_id', activeUserId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    response.cookies.set('tubepilot_google_connected', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set('tubepilot_connected_channel', JSON.stringify(channelData), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(
      new URL('/uz/dashboard?error=' + encodeURIComponent(error.message || 'OAuth error'), req.url)
    );
  }
}
