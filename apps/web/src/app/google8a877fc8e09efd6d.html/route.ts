import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google8a877fc8e09efd6d.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
