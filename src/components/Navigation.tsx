"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, Sprout } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plants", label: "Browse" },
  { href: "/calendar", label: "Calendar" },
  { href: "/habitats", label: "Habitats" },
  { href: "/map", label: "Map" },
];

const linkBase = "rounded-full px-4 py-2 text-sm font-medium transition-colors";
const linkActive = "bg-ink text-white";
const linkIdle = "text-text-soft hover:bg-tint";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/plants?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-canvas/85 backdrop-blur-xl">
      <div className="atlas-shell">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-moss text-white">
              <Sprout size={16} strokeWidth={1.8} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight text-text">
                Tiny Worlds
              </span>
              <span className="mt-1 text-[10px] text-text-soft">Field Atlas</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 rounded-full bg-surface p-1 shadow-card md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`${linkBase} ${isActive(link.href) ? linkActive : linkIdle}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: search + hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full bg-surface p-2.5 text-text shadow-card transition-colors hover:bg-tint"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button
              className="rounded-full bg-surface p-2.5 text-text shadow-card transition-colors hover:bg-tint md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
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
                className="flex-1 rounded-full bg-surface px-5 py-3 text-sm text-text shadow-card focus:outline-none focus:ring-2 focus:ring-sage"
              />
              <button type="submit" className="btn-ink">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mt-1 flex flex-col gap-1 border-t border-hairline pb-3 pt-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`${linkBase} ${isActive(link.href) ? linkActive : linkIdle}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
