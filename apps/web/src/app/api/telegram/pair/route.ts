import { prisma } from '@kanal/db';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'creator@tubepilot.ai',
            name: 'TubePilot Creator',
            subscriptionTier: 'PRO',
            subscriptionStatus: 'ACTIVE',
            preferredLanguage: 'uz',
          },
        });
      }
      userId = user.id;
    }

    const activeUserId = user.id;

    // Generate 1-time random pairing ticket valid for 30 minutes
    const pairToken = crypto.randomBytes(8).toString('hex');
    const pairTokenExp = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.user.update({
      where: { id: activeUserId },
      data: {
        telegramPairToken: pairToken,
        telegramPairTokenExp: pairTokenExp,
      },
    });

    const rawUsername =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
      process.env.TELEGRAM_BOT_USERNAME ||
      'tubepilotai_bot';
    const botUsername = rawUsername.replace(/^@/, '');
    const deepLink = `https://t.me/${botUsername}?start=link_${pairToken}`;

    const res = NextResponse.json({
      success: true,
      token: pairToken,
      botUsername,
      deepLink,
      expiresAt: pairTokenExp,
    });

    res.cookies.set('kanal_user_id', activeUserId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error: any) {
    console.error('[Telegram Pair] Error generating pairing token:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
