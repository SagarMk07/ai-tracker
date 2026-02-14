import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "AI Tracker | Intelligent Workflow & Tool OS",
    template: "%s | AI Tracker"
  },
  description: "A comprehensive platform to organize your AI toolset and automate workflows with intelligent suggestions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Tracker",
  },
  applicationName: "AI Tracker",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-tracker.app",
    title: "AI Tracker | Deep Work with AI",
    description: "Master your AI toolstack with intelligent organization and automated workflows.",
    siteName: "AI Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tracker",
    description: "Master your AI toolstack with intelligent organization and automated workflows.",
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
