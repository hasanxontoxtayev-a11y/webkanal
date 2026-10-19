import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('kanal_user_id')?.value;

    let user = null;
    try {
      user = userId
        ? await prisma.user.findUnique({
            where: { id: userId },
            include: { channel: true },
          })
        : await prisma.user.findFirst({
            include: { channel: true },
          });
    } catch (userDbErr) {
      console.warn('User DB query bypassed in /api/channels/current:', userDbErr);
    }

    let ch = user?.channel;
    if (!ch) {
      try {
        ch = await prisma.youTubeChannel.findFirst({
          orderBy: { updatedAt: 'desc' },
        });

        if (user && ch && ch.userId !== user.id) {
          ch = await prisma.youTubeChannel.update({
            where: { id: ch.id },
            data: { userId: user.id },
          });
        }
      } catch (dbErr) {
        console.warn('DB read bypassed in /api/channels/current:', dbErr);
      }
    }

    const subscription = {
      tier: (user?.subscriptionTier as string) || 'PRO',
      status: (user?.subscriptionStatus as string) || 'ACTIVE',
      planPrice: user?.planPrice || 0,
      currentPeriodEnd: user?.currentPeriodEnd || null,
    };

    // If channel cookie exists (from OAuth callback or direct connect)
    const channelCookie = req.cookies.get('tubepilot_connected_channel')?.value;
    if (!ch && channelCookie) {
      try {
        const parsed = JSON.parse(channelCookie);
        if (parsed && parsed.title) {
          return NextResponse.json({
            success: true,
            channel: {
              id: parsed.handle || 'UC_custom',
              title: parsed.title,
              handle: parsed.handle || '@channel',
              avatar: parsed.avatar || null,
              subscribers: parsed.subscribers || '0',
              views: parsed.views || '0',
              videoCount: parsed.videoCount || 0,
              isPaired: true,
            },
            subscription,
          });
        }
      } catch {}
    }

    if (!ch) {
      const response = NextResponse.json({
        success: true,
        channel: null,
        subscription,
      });
      if (user && !userId) {
        response.cookies.set('kanal_user_id', user.id, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
        });
      }
      return response;
    }

    const subCount = Number(ch.subscriberCount || 0);
    const viewCount = Number(ch.viewCount || 0);

    const formattedSubscribers =
      subCount >= 1000000
        ? `${(subCount / 1000000).toFixed(2)}M`
        : subCount >= 1000
        ? `${Math.round(subCount / 1000)}K`
        : String(subCount);

    const formattedViews =
      viewCount >= 1000000000
        ? `${(viewCount / 1000000000).toFixed(2)}B`
        : viewCount >= 1000000
        ? `${(viewCount / 1000000).toFixed(1)}M`
        : String(viewCount);

    const response = NextResponse.json({
      success: true,
      channel: {
        id: ch.id,
        title: ch.title,
        handle: ch.customUrl || '@channel',
        avatar: ch.thumbnailUrl,
        subscribers: formattedSubscribers,
        views: formattedViews,
        videoCount: ch.videoCount,
        isPaired: !!user?.telegramChatId,
      },
      subscription,
    });

    if (user && !userId) {
      response.cookies.set('kanal_user_id', user.id, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
