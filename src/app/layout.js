import {
  Inter,
  Playfair_Display,
  Roboto,
  Lato,
  Montserrat,
  Poppins,
  Lora,
  Cormorant_Garamond, // Added new font
  DM_Sans,             // Added new font
  Kalam
} from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

// --- FONT DEFINITIONS ---
// --- 2. ADD THIS NEW FONT DEFINITION ---
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ['400', '700'],
  display: 'swap'
});



const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: 'swap' });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ['400', '700'], display: 'swap' });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ['400', '700'], display: 'swap' });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: 'swap' });
const playfair = Playfair_Display({ variable: "--font-playfair-display", subsets: ["latin"], display: 'swap' });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ['400', '700'], display: 'swap' });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], display: 'swap' });

// --- ADDED YOUR REQUESTED FONTS ---
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"] // <-- Change this to an array
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: "400"
});

const boiling = localFont({
  src: '../../public/font/boiling/Boiling-BlackDemo.ttf',
  variable: '--font-boiling'
});
// --- END FONT DEFINITIONS ---

import SupportWidget from '@/components/dashboard/SupportWidget';
import PwaRegistration from '@/components/PwaRegistration';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  title: {
    template: "%s | Bizvistar",
    default: "Bizvistar",
  },
  description: "Empowering Local Businesses to build their online presence.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Bizvistar',
    description: 'Empowering Local Businesses to build their online presence.',
    url: 'https://bizvistar.in',
    siteName: 'Bizvistar',
    images: [
      {
        url: 'https://bizvistar.in/dashboard.png', // Fallback landing page image
        width: 1200,
        height: 630,
        alt: 'Bizvistar Landing Page',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bizvistar',
    description: 'Empowering Local Businesses to build their online presence.',
    images: ['https://bizvistar.in/dashboard.png'],
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.deferredPwaPrompt = null;
            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              window.deferredPwaPrompt = e;
              window.dispatchEvent(new Event('pwa-prompt-ready'));
            });
          `
        }} />
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
            `
          }} />
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${roboto.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} ${lora.variable} ${cormorantGaramond.variable} ${dmSans.variable} ${boiling.variable} antialiased`}
      >
        <PwaRegistration />
        {children}
        <SupportWidget />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}