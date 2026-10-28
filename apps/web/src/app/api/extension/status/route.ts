import { NextRequest, NextResponse } from 'next/server';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest) {
  try {
    // 1. Check cookies first (reliable on Vercel serverless)
    const channelCookie = req.cookies.get('tubepilot_connected_channel')?.value;
    if (channelCookie) {
      try {
        const parsed = JSON.parse(channelCookie);
        if (parsed && (parsed.title || parsed.handle)) {
          return NextResponse.json(
            {
              success: true,
              connected: true,
              channel: {
                id: parsed.handle || 'UC_custom',
                title: parsed.title || 'YouTube Channel',
                handle: parsed.handle || '@channel',
                avatar: parsed.avatar || '',
                subscribers: parsed.subscribers || '0',
                rawSubscribers: 0,
                views: parsed.views || '0',
                rawViews: 0,
                videoCount: parsed.videoCount || 0,
                isPaired: true,
              },
              token: 'tp_extension_bridge_v1',
              dashboardUrl: 'https://www.tubepilotpro.com/uz/dashboard',
            },
            { headers: corsHeaders() }
          );
        }
      } catch {}
    }

    // 2. Database read safely wrapped
    let channel: any = null;
    let user: any = null;
    try {
      const { prisma } = await import('@kanal/db');
      const userId = req.cookies.get('kanal_user_id')?.value;
      if (userId) {
        user = await prisma.user.findUnique({
          where: { id: userId },
          include: { channel: true },
        });
      }
      if (!user) {
        user = await prisma.user.findFirst({
          include: { channel: true },
        });
      }
      channel = user?.channel || (await prisma.youTubeChannel.findFirst({ orderBy: { updatedAt: 'desc' } }));
    } catch (dbErr) {
      // Serverless expected fallback
    }

    if (channel) {
      const subNum = Number(channel.subscriberCount || 0);
      const viewNum = Number(channel.viewCount || 0);

      const formattedSubscribers =
        subNum >= 1000000
          ? `${(subNum / 1000000).toFixed(2)}M`
          : subNum >= 1000
          ? `${Math.round(subNum / 1000)}K`
          : String(subNum);

      const formattedViews =
        viewNum >= 1000000000
          ? `${(viewNum / 1000000000).toFixed(2)}B`
          : viewNum >= 1000000
          ? `${(viewNum / 1000000).toFixed(1)}M`
          : String(viewNum);

      return NextResponse.json(
        {
          success: true,
          connected: true,
          channel: {
            id: channel.id,
            title: channel.title,
            handle: channel.customUrl || '@channel',
            avatar: channel.thumbnailUrl,
            subscribers: formattedSubscribers,
            rawSubscribers: subNum,
            views: formattedViews,
            rawViews: viewNum,
            videoCount: channel.videoCount,
            isPaired: !!user?.telegramChatId,
          },
          token: 'tp_extension_bridge_v1',
          dashboardUrl: 'https://www.tubepilotpro.com/uz/dashboard',
        },
        { headers: corsHeaders() }
      );
    }

    // Clean disconnected state if no channel attached
    return NextResponse.json(
      {
        success: true,
        connected: false,
        channel: null,
        token: 'tp_extension_bridge_v1',
        dashboardUrl: 'https://www.tubepilotpro.com/uz/dashboard',
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: true,
        connected: false,
        channel: null,
        dashboardUrl: 'https://www.tubepilotpro.com/uz/dashboard',
      },
      { headers: corsHeaders() }
    );
  }
}
