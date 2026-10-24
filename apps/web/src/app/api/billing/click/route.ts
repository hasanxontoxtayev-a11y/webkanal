import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

// 19 USD in UZS (~245,000 UZS)
const DEFAULT_AMOUNT_UZS = 245000;

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

    const serviceId = process.env.CLICK_SERVICE_ID || '32840';
    const merchantId = process.env.CLICK_MERCHANT_ID || '24560';
    const merchantUserId = process.env.CLICK_MERCHANT_USER_ID || '18900';

    const amount = interval === 'annual' ? 245000 * 10 : DEFAULT_AMOUNT_UZS;
    const transactionParam = user.id;

    const origin =
      returnUrl ||
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://www.tubepilotpro.com';
    const returnUrlWithStatus = `${origin}/uz/dashboard?payment=success&provider=click&tier=PRO`;

    // Standard Click Payment Gateway URL format:
    // https://my.click.uz/services/pay?service_id={service_id}&merchant_id={merchant_id}&amount={amount}&transaction_param={param}&return_url={return_url}
    const clickPaymentUrl = `https://my.click.uz/services/pay?service_id=${encodeURIComponent(
      serviceId
    )}&merchant_id=${encodeURIComponent(merchantId)}&amount=${encodeURIComponent(
      amount
    )}&transaction_param=${encodeURIComponent(
      transactionParam
    )}&return_url=${encodeURIComponent(returnUrlWithStatus)}`;

    return NextResponse.json({
      success: true,
      provider: 'click',
      checkoutUrl: clickPaymentUrl,
      amountUzs: amount,
      amountUsd: 19,
      tier: 'PRO',
      userId: user.id,
      note: "Click ilovasi yoki veb orqali 1-bosishda to'lash",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
