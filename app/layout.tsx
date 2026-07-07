import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://typify-seven.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "Typify — Listings de e-commerce con IA",
    template: "%s | Typify",
  },
  description: "Genera títulos, descripciones SEO y bullet points para tus productos en segundos. Empieza gratis.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "Typify — Listings de e-commerce con IA",
    description: "Genera listings completos para tus productos en segundos con IA.",
    url: APP_URL,
    siteName: "Typify",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typify — Listings de e-commerce con IA",
    description: "Genera listings completos para tus productos en segundos con IA.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
