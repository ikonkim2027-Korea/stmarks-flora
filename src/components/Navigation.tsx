"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Sprout } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plants", label: "Browse" },
  { href: "/calendar", label: "Calendar" },
  { href: "/habitats", label: "Habitats" },
  { href: "/map", label: "Map" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/plants?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        background: "color-mix(in srgb, var(--color-card) 88%, transparent)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="atlas-shell">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg border"
              style={{
                background: "var(--color-ink)",
                borderColor: "var(--color-ink)",
                color: "var(--color-card)",
              }}
            >
              <Sprout size={17} strokeWidth={1.8} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight" style={{ color: "var(--color-text)" }}>
                Tiny Worlds
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-text-muted)" }}>
                Field Atlas
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "text-white"
                      : "hover:bg-black/[0.04]"
                  }`}
                  style={
                    active
                      ? { background: "var(--color-ink)" }
                      : { color: "var(--color-text-muted)" }
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: search + hamburger */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-lg border p-2 transition-colors hover:bg-black/[0.04]"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Mobile hamburger */}
            <button
              className="rounded-lg border p-2 transition-colors hover:bg-black/[0.04] md:hidden"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plants by name, family, habitat, or trait..."
                className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
                style={{
                  background: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
              <button
                type="submit"
                className="atlas-button-primary min-h-0 py-2"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mt-1 flex flex-col gap-1 border-t pb-3 pt-3 md:hidden" style={{ borderColor: "var(--color-border)" }}>
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "text-white"
                      : "hover:bg-black/[0.04]"
                  }`}
                  style={
                    active
                      ? { background: "var(--color-ink)" }
                      : { color: "var(--color-text-muted)" }
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
