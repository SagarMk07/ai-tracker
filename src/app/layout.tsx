import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import { validateEnv } from "@/lib/env";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Focus Guardian AI",
    template: "%s | Focus Guardian AI",
  },
  description: "AI-powered deep work accountability and cognitive optimization.",
  applicationName: "Focus Guardian AI",
};

validateEnv();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
