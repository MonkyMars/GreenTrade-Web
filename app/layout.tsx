import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/UI/Navigation";
import Footer from "./components/UI/Footer";
import { AuthProvider } from "@/lib/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenTrade - Sustainable Trading Solutions",
  description: "GreenTrade offers eco-friendly trading solutions focused on sustainability and environmental responsibility.",
  keywords: ["green trading", "sustainable finance", "eco-friendly investments", "environmental markets"],
  authors: [{ name: "GreenTrade Team" }],
  creator: "GreenTrade",
  publisher: "GreenTrade EU",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "16x16" },
      { url: "/icon.png", sizes: "32x32" }
    ],
    // apple: { url: "/apple-touch-icon.png" },
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg" },
      { rel: "msapplication-TileImage", url: "/mstile-150x150.png" }
    ],
  },
  openGraph: {
    title: "GreenTrade - Sustainable Trading Solutions",
    description: "Eco-friendly trading platform for environmentally conscious investors",
    url: "https://greentrade.eu",
    siteName: "GreenTrade",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenTrade - Sustainable Trading Solutions",
    description: "Eco-friendly trading platform for environmentally conscious investors",
  },
  robots: "index, follow",
};

export const viewport: Viewport = { 
  width: "device-width", 
  initialScale: 1, 
  minimumScale: 1, 
  maximumScale: 1, 
  userScalable: false, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navigation/>
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
