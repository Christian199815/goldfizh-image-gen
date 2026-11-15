import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/providers/AppProviders";
import { getImageGeneratorPageTitle } from "@/lib/client-config";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await getImageGeneratorPageTitle(),
    description:
      "Generate brand-consistent marketing images with Goldfizh Content OS.",
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans text-gf-text lg:h-full lg:min-h-0 lg:overflow-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
