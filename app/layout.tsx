import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhruv | Full Stack Developer",
  description: "Full Stack Developer specializing in high-performance web applications. Portfolio built as a Hyprland-style tiling window manager.",
  keywords: ["developer", "portfolio", "full stack", "react", "next.js", "typescript"],
  authors: [{ name: "Dhruv" }],
  openGraph: {
    title: "Dhruv | Full Stack Developer",
    description: "Interactive portfolio with tiling window manager UI",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0f18",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
