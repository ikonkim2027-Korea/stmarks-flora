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
  title: "St. Mark's Flora | Field Guide",
  description:
    "A Field Guide to Plants Within 1km of St. Mark's School, Southborough, MA. Discover native trees, wildflowers, ferns, and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "St. Mark's Flora",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D5016",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--color-background)", color: "var(--color-text)" }}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <InstallPrompt />
        <ServiceWorkerRegistration />
        <footer className="border-t py-6 text-center text-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
          <p>St. Mark&apos;s Flora &mdash; A Field Guide to Plants Within 1km of St. Mark&apos;s School, Southborough, MA</p>
          <p className="mt-1">For educational and scientific specimen collection purposes only.</p>
        </footer>
      </body>
    </html>
  );
}
