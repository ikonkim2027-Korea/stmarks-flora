import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tiny Worlds Collectibles | Field Guide",
  description:
    "A Field Guide to Plants Within 1km of St. Mark's School, Southborough, MA. Discover native trees, wildflowers, ferns, and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tiny Worlds Collectibles",
  },
};

export const viewport: Viewport = {
  themeColor: "#111816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col" style={{ background: "var(--color-background)", color: "var(--color-text)" }}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <InstallPrompt />
        <ServiceWorkerRegistration />
        <footer className="border-t py-8 text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
          <div className="atlas-shell flex flex-col justify-between gap-3 sm:flex-row">
            <p className="font-bold" style={{ color: "var(--color-text)" }}>
              Tiny Worlds Field Atlas
            </p>
            <p>Educational observation, ethical collection, conservation-aware study.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
