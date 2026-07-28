import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
  themeColor: "#f0f1ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas text-text">
        <Navigation />
        <main className="flex-1">{children}</main>
        <InstallPrompt />
        <ServiceWorkerRegistration />
        <footer className="border-t border-hairline py-8 text-sm text-text-soft">
          <div className="atlas-shell flex flex-col justify-between gap-3 sm:flex-row">
            <p className="font-semibold text-text">
              Tiny Worlds Field Atlas
            </p>
            <p>Educational observation, ethical collection, conservation-aware study.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
