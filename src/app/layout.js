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
// --- END FONT DEFINITIONS ---

import SupportWidget from '@/components/dashboard/SupportWidget';

export const metadata = {
  title: "BizVistaar",
  description: "Empowering Local Businesses",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${roboto.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} ${lora.variable} ${cormorantGaramond.variable} ${dmSans.variable} antialiased`}
      >
        {children}
        <SupportWidget />
      </body>
    </html>
  );
}