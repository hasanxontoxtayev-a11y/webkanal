import { prisma } from '@kanal/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { method, params, id } = body;

    // CheckPerformTransaction or PerformTransaction
    if (method === 'CheckPerformTransaction') {
      return NextResponse.json({
        result: {
          allow: true,
        },
        id,
      });
    }

    if (method === 'PerformTransaction') {
      const userId = params?.account?.user_id;
      if (userId) {
        const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE "User" SET "subscriptionTier" = 'PRO', "subscriptionStatus" = 'ACTIVE', "planPrice" = 19, "currentPeriodEnd" = ? WHERE "id" = ?`,
            periodEnd.toISOString(),
            userId
          );
        } catch {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: 'PRO',
              subscriptionStatus: 'ACTIVE',
            },
          });
        }
      }

      return NextResponse.json({
        result: {
          transaction: params?.id || `payme_${Date.now()}`,
          perform_time: Date.now(),
          state: 2,
        },
        id,
      });
    }

    return NextResponse.json({
      result: {
        success: true,
      },
      id,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: {
        code: -31008,
        message: err.message,
      },
      id: null,
    });
  }
}
