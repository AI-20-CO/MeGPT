import type { Metadata } from "next";
import { Inter, Syncopate } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ayaan Izhar | Software Engineer",
  description: "Software Engineer crafting scalable solutions and modern experiences. Currently at Experian PLC.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${syncopate.variable}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }} suppressHydrationWarning>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
