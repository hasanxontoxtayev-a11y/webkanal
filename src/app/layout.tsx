import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OVERDROP — Erkaklar Uchun Zamonaviy Oversize Kiyimlar Do`koni',
  description: 'Oversize futbolkalar, 450GSM xudilar, kargo shimlar va kurtkalar. O`zbekiston bo`ylab yetkazib berish bilan eng so`nggi streetwear to`plami.',
  keywords: 'overdrop, oversize kiyimlar, erkaklar kiyimi, streetwear toshkent, xudi, kargo shim, erkaklar futbolka, oversize t-shirt',
  openGraph: {
    title: 'OVERDROP — Erkaklar Uchun Zamonaviy Oversize Kiyimlar',
    description: 'Erkinlik va zamonaviy uslub. 50 ga yaqin saralangan mahsulotlar.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#19120e] text-[#f3ece4] selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
