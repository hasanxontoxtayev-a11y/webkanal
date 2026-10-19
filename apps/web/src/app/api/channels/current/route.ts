import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const subscription = {
      tier: 'PRO',
      status: 'ACTIVE',
      planPrice: 19,
      currentPeriodEnd: null,
    };

    // 1. First priority on serverless: read channel from cookie
    const channelCookie = req.cookies.get('tubepilot_connected_channel')?.value;
    if (channelCookie) {
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

    // 2. Safe database read if database exists
    let ch = null;
    try {
      const { prisma } = await import('@kanal/db');
      ch = await prisma.youTubeChannel.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
    } catch (dbErr) {
      // Serverless without SQLite file - expected, gracefully fallback
    }

    if (ch) {
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

      return NextResponse.json({
        success: true,
        channel: {
          id: ch.id,
          title: ch.title,
          handle: ch.customUrl || '@channel',
          avatar: ch.thumbnailUrl,
          subscribers: formattedSubscribers,
          views: formattedViews,
          videoCount: ch.videoCount,
          isPaired: true,
        },
        subscription,
      });
    }

    // Default clean state if nothing connected
    return NextResponse.json({
      success: true,
      channel: null,
      subscription,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      channel: null,
      subscription: { tier: 'PRO', status: 'ACTIVE' },
    });
  }
}
