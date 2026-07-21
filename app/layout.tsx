import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { FinanceProvider } from "@/lib/financeContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "FinanceOS — Premium Financial Copilot",
  description: "AI-first, voice-first personal and business financial copilot designed for entrepreneurs and couples. Build budgets, track expenses, manage client invoices, and get coaching.",
  keywords: ["FinanceOS", "AI Finance", "Voice Finance", "Couple Budget", "GST Tracker", "Invoice Generator"],
  authors: [{ name: "FinanceOS Team" }],
  openGraph: {
    title: "FinanceOS — Premium Financial Copilot",
    description: "The AI-first, voice-first financial system for entrepreneurs and couples.",
    type: "website",
  }
};

export const viewport: Viewport = {
  themeColor: "#b45309",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          try {
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (_) {}
        `}} />
      </head>
      <body
        className={`${outfit.variable} ${geistMono.variable} ${cormorant.variable} min-h-full font-sans antialiased bg-[#FAF8F5] text-stone-900 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}
