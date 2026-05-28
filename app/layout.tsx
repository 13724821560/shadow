import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CommandMenu } from "@/components/command-menu";
import { mockShadowingLessons } from "@/lib/mock-shadowing";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://echoloop.vercel.app"),
  title: {
    default: "EchoLoop — 英语影子跟读",
    template: "%s · EchoLoop",
  },
  description: "一句一句听，一句一句跟读，轻松练英语开口。",
  applicationName: "EchoLoop",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "EchoLoop — 英语影子跟读",
    description: "一句一句听，一句一句跟读，轻松练英语开口。",
    siteName: "EchoLoop",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/social-preview.svg",
        width: 1200,
        height: 630,
        alt: "EchoLoop preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoLoop — 英语影子跟读",
    description: "一句一句听，一句一句跟读，轻松练英语开口。",
    images: ["/social-preview.svg"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <CommandMenu lessons={mockShadowingLessons} />
      </body>
    </html>
  );
}
