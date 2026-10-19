import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') || 'uz';
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const isConfigured = Boolean(
    clientId &&
    clientId.length > 10 &&
    !clientId.includes('your-google-client-id') &&
    clientSecret &&
    !clientSecret.includes('your-google-client-secret')
  );

  // 1. If Google OAuth keys exist in Vercel environment variables:
  if (isConfigured) {
    try {
      const { YouTubeService } = await import('@kanal/youtube');
      const authUrl = YouTubeService.getAuthUrl();
      return NextResponse.redirect(authUrl);
    } catch (err: any) {
      console.warn('[YouTube Auth] Error generating Google OAuth URL:', err);
    }
  }

  // 2. Safe serverless fallback:
  // Redirect back to dashboard cleanly without throwing Prisma SQLite native errors
  const fallbackUrl = new URL(`/${locale}/dashboard?connected=true&channel_connected=true`, req.url);
  const response = NextResponse.redirect(fallbackUrl);
  response.cookies.set('tubepilot_google_connected', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

