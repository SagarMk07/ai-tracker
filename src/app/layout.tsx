import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Focus Guardian AI | Deep Work OS",
    template: "%s | Focus Guardian"
  },
  description: "An intelligent deep-work operating system that protects attention. Align intention with action.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Focus Guardian",
  },
  applicationName: "Focus Guardian",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://focus-guardian.ai",
    title: "Focus Guardian AI",
    description: "Master your attention with AI-powered focus sessions.",
    siteName: "Focus Guardian AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Guardian AI",
    description: "Master your attention with AI-powered focus sessions.",
  },
};

export const viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "bg-background text-foreground antialiased min-h-screen")}>
        {children}
      </body>
    </html>
  );
}
