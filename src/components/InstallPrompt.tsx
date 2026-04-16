"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Re-show after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-0 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm"
    >
      <div
        className="rounded-xl border shadow-lg p-4 flex items-start gap-3"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: "var(--color-primary-pale)" }}
        >
          <Download size={20} style={{ color: "var(--color-primary)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm"
            style={{ color: "var(--color-text)" }}
          >
            Add to Home Screen
          </p>
          <p
            className="text-xs mt-0.5 leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Install St. Mark&apos;s Flora for offline access to the field guide.
          </p>
          <button
            onClick={handleInstall}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: "var(--color-primary)" }}
          >
            <Download size={14} />
            Install
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} style={{ color: "var(--color-text-muted)" }} />
        </button>
      </div>
    </div>
  );
}
