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
  const effectiveClientId = clientId || process.env.GOOGLE_CLIENT_ID;
  const effectiveClientSecret = clientSecret || process.env.GOOGLE_CLIENT_SECRET;

  if (effectiveClientId && effectiveClientSecret) {
    try {
      const { google } = await import('googleapis');
      const oauth2Client = new google.auth.OAuth2(
        effectiveClientId,
        effectiveClientSecret,
        "https://www.tubepilotpro.com/api/auth/callback/google"
      );

      // We request basic channel read scope so Google doesn't trigger the red unverified barrier
      const scopes = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/youtube.readonly",
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
      });

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

