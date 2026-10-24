import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

// 19 USD in UZS (~245,000 UZS) -> In Payme tiyin (1 UZS = 100 tiyin)
const DEFAULT_AMOUNT_TIYIN = 245000 * 100;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { interval = 'monthly', returnUrl } = body;

    const userId = req.cookies.get('kanal_user_id')?.value;
    let user = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
        })
      : null;

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'creator@gmail.com',
          name: 'Verified Creator',
          subscriptionTier: 'FREE',
          subscriptionStatus: 'INACTIVE',
        },
      });
    }

    const paymeMerchantId = process.env.PAYME_MERCHANT_ID || '6618d7f2a1b2c3d4e5f60718';
    const amountTiyin = interval === 'annual' ? DEFAULT_AMOUNT_TIYIN * 10 : DEFAULT_AMOUNT_TIYIN;

    const origin =
      returnUrl ||
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://www.tubepilotpro.com';
    const returnUrlWithStatus = `${origin}/uz/dashboard?payment=success&provider=payme&tier=PRO`;

    // Standard Payme base64 encoded checkout parameter:
    // m={merchant_id};ac.user_id={user_id};a={amount_in_tiyin};c={return_url}
    const rawParam = `m=${paymeMerchantId};ac.user_id=${user.id};a=${amountTiyin};c=${returnUrlWithStatus}`;
    const base64Param = Buffer.from(rawParam).toString('base64');
    const paymePaymentUrl = `https://checkout.paycom.uz/${base64Param}`;

    return NextResponse.json({
      success: true,
      provider: 'payme',
      checkoutUrl: paymePaymentUrl,
      amountUzs: amountTiyin / 100,
      amountUsd: 19,
      tier: 'PRO',
      userId: user.id,
      note: "Payme ilovasi yoki veb orqali 1-bosishda to'lash",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
