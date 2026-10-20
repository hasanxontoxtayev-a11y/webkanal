import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import '../globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tubepilot.ai';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'TubePilot AI - YouTube SEO, Audit & AI Growth Suite',
      template: '%s | TubePilot AI',
    },
    description:
      'TubePilot AI is the premier AI-powered YouTube growth platform. YouTube SEO, real-time analytics, tag generators, CTR prediction, and AI comment assistant.',
    keywords: [
      'TubePilot',
      'TurboPilot',
      'TubePilot AI',
      'TurboPilot AI',
      'YouTube SEO tool',
      'YouTube AI assistant',
      'VidIQ alternative',
      'TubeBuddy alternative',
      'YouTube Growth Tool',
      'CTR Predictor',
      'Channel Audit',
    ],
    applicationName: 'TubePilot AI',
    authors: [{ name: 'TubePilot AI Team', url: baseUrl }],
    creator: 'TubePilot AI',
    publisher: 'TubePilot AI',
    verification: {
      google: 'google8a877fc8e09efd6d',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ru: `${baseUrl}/ru`,
        uz: `${baseUrl}/uz`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'uz' ? 'uz_UZ' : 'en_US',
      url: `${baseUrl}/${locale}`,
      siteName: 'TubePilot AI',
      title: 'TubePilot AI - YouTube SEO, Audit & AI Growth Suite',
      description:
        'TubePilot AI is the premier AI-powered YouTube growth platform. YouTube SEO, real-time analytics, tag generators, CTR prediction, and AI comment assistant.',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'TubePilot AI - YouTube SEO, Audit & AI Growth Suite',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TubePilot AI - YouTube SEO, Audit & AI Growth Suite',
      description:
        'TubePilot AI is the premier AI-powered YouTube growth platform. YouTube SEO, real-time analytics, tag generators, CTR prediction, and AI comment assistant.',
      images: [`${baseUrl}/og-image.png`],
      creator: '@TubePilotAI',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  // Schema.org SoftwareApplication & Organization JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://tubepilot.ai/#software',
        name: 'TubePilot AI',
        alternateName: ['TurboPilot', 'TurboPilot AI', 'TubePilot'],
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        url: 'https://tubepilot.ai',
        description:
          'TubePilot AI is the premier AI-powered YouTube growth platform. YouTube SEO, real-time analytics, tag generators, CTR prediction, and AI comment assistant.',
        softwareVersion: '2.0',
        offers: [
          {
            '@type': 'Offer',
            name: 'Starter Plan',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free forever plan with 1 YouTube channel and 3 daily AI recommendations.',
          },
          {
            '@type': 'Offer',
            name: 'Pro Plan',
            price: '19',
            priceCurrency: 'USD',
            description: 'Unlimited SEO audit, AI automated tagging, and comment copilot.',
          },
          {
            '@type': 'Offer',
            name: 'Elite Plan',
            price: '49',
            priceCurrency: 'USD',
            description: 'Full competitor spy telemetry, VIP Telegram bot alerts, and predictive CTR models.',
          },
        ],
        featureList: [
          'YouTube Channel Audit & Diagnostic',
          'Gemini 2.0 Flash AI Vision Thumbnail Testing',
          'Multilingual AI Comment Copilot',
          'Best Posting Time Heatmap',
          'Real-time Views Per Hour (VPH) velocity',
          'Competitor Spy Matrix',
        ],
      },
      {
        '@type': 'Organization',
        '@id': 'https://tubepilot.ai/#organization',
        name: 'TubePilot AI',
        alternateName: ['TurboPilot', 'TurboPilot AI'],
        url: 'https://tubepilot.ai',
        logo: 'https://tubepilot.ai/logo.png',
        sameAs: ['https://t.me/Tuble_Pilot_bot'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://tubepilot.ai/#website',
        url: 'https://tubepilot.ai',
        name: 'TubePilot AI',
        alternateName: ['TurboPilot', 'TurboPilot AI'],
        description: 'AI YouTube Growth, SEO and Copilot Platform',
        inLanguage: ['en', 'ru', 'uz'],
      },
    ],
  };

  return (
    <html lang={locale} className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-dark-900 text-gray-100 antialiased selection:bg-rose-500 selection:text-white">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
