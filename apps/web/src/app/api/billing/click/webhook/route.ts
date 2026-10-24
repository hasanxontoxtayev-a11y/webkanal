import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('application/json')) {
      body = await req.json().catch(() => ({}));
    } else {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        body = Object.fromEntries(formData.entries());
      }
    }

    // Click sends action=0 (Prepare) and action=1 (Complete)
    const {
      click_trans_id,
      service_id,
      merchant_trans_id,
      amount,
      action,
      error,
      error_note,
      sign_time,
      sign_string,
    } = body;

    const userId = merchant_trans_id;

    if (error && Number(error) < 0) {
      return NextResponse.json({
        error: -1,
        error_note: 'Transaction error reported by Click',
      });
    }

    // Locate user
    const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

    if (action === '0' || action === 0) {
      // PREPARE stage
      return NextResponse.json({
        click_trans_id,
        merchant_trans_id: userId,
        merchant_prepare_id: Date.now(),
        error: 0,
        error_note: 'Success',
      });
    }

    if (action === '1' || action === 1) {
      // COMPLETE stage - Activate PRO subscription
      if (user) {
        const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE "User" SET "subscriptionTier" = 'PRO', "subscriptionStatus" = 'ACTIVE', "planPrice" = 19, "currentPeriodEnd" = ? WHERE "id" = ?`,
            periodEnd.toISOString(),
            user.id
          );
        } catch {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionTier: 'PRO',
              subscriptionStatus: 'ACTIVE',
            },
          });
        }
      }

      return NextResponse.json({
        click_trans_id,
        merchant_trans_id: userId,
        merchant_confirm_id: Date.now(),
        error: 0,
        error_note: 'Success',
      });
    }

    return NextResponse.json({
      error: 0,
      error_note: 'Success',
    });
  } catch (err: any) {
    return NextResponse.json({ error: -8, error_note: err.message }, { status: 500 });
  }
}
