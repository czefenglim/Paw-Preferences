import type { Metadata } from 'next';
import { Poppins, Quicksand } from 'next/font/google';
import './globals.css';

// Configure fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  title: 'Paws & Preferences - Find Your Favourite Kitty',
  description: 'Swipe through adorable cat images and discover your favorite kitties!',
  keywords: ['cats', 'cute', 'swipe', 'kitty', 'pets', 'animals'],
  authors: [{ name: 'Lim' }],
  creator: 'Lim',
  openGraph: {
    title: 'Paws & Preferences - Find Your Favourite Kitty',
    description: 'Swipe through adorable cat images and discover your favorite kitties!',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paws & Preferences - Find Your Favourite Kitty',
    description: 'Swipe through adorable cat images and discover your favorite kitties!',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐱</text></svg>",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ec4899',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${quicksand.variable}`}>
      <head>
        {/* Preconnect to Cataas API */}
        <link rel="preconnect" href="https://cataas.com" />
        <link rel="dns-prefetch" href="https://cataas.com" />
      </head>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}