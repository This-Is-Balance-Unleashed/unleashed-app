import type { Metadata } from "next";
import { Inter_Tight, } from "next/font/google";
import localFont from "next/font/local"
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  display: "swap",
  subsets: ["latin"],
});

const meloDrama = localFont({
  src: "./fonts/Melodrama-Variable.ttf",
  display: "swap",
  variable: "--font-melo",
  weight: "200, 400, 600, 900"
})

export const metadata: Metadata = {
  title: "Career + Wellness Summit 2026",
  description: "Rooted in purpose, insights from industry leaders, and all round growth for a sustainable and impactful life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${meloDrama.variable} antialiased flex min-h-full flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
