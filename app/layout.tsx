import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
