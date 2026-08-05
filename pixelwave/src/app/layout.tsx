import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

export const metadata: Metadata = {
  title: "Pixelwave",
  description: "Music streaming platform fused with r/place canvas mechanics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${vt323.variable} ${pressStart2P.variable} antialiased`}
      >
        <div className="scanline" />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
