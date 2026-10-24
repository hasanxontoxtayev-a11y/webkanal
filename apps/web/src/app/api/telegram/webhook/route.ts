import { bot } from '@kanal/bot';
import { webhookCallback } from 'grammy';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const handler = webhookCallback(bot, 'std/http');

export async function POST(req: NextRequest) {
  try {
    return await handler(req);
  } catch (err: any) {
    console.error('Telegram Webhook error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'TubePilot AI Telegram Webhook is active and listening.',
    timestamp: new Date().toISOString(),
  });
}
