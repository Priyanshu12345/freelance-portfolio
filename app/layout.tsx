import type {Metadata} from 'next';
import { Libre_Caslon_Text, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const libreCaslon = Libre_Caslon_Text({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Aura & Essence | Luxury Medical Spa',
  description: 'Redefining luxury aesthetics through personalized clinical excellence. Aura & Essence harmonizes clinical precision with artistic subtlety.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${libreCaslon.variable} ${plusJakarta.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="bg-[#fff8f4] text-[#1d1b19] antialiased">{children}</body>
    </html>
  );
}
