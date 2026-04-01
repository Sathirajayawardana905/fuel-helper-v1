import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; 

// THE VERCEL IMPORTS
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fuel Helper | Sri Lanka",
  description: "Live fuel availability map and digital QR pass for Sri Lanka.",
  metadataBase: new URL('https://fuelhelper.info'),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black antialiased`}>
        {children}
        <Navbar />
        
        {/* VERCEL TOOLS */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}