"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf, Search } from "lucide-react";

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
      className="sticky top-0 z-50 border-b shadow-sm"
      style={{
        background: "var(--color-primary)",
        borderColor: "var(--color-primary-light)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Leaf
              className="text-green-300 group-hover:text-green-200 transition-colors"
              size={22}
            />
            <span className="font-semibold text-white text-lg tracking-tight leading-none">
              St. Mark&apos;s Flora
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
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-green-100 hover:bg-white/10 hover:text-white"
                  }`}
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
              className="p-2 rounded text-green-100 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded text-green-100 hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plants by name, family..."
                className="flex-1 px-3 py-2 rounded text-sm bg-white/10 text-white placeholder-green-200 border border-white/20 focus:outline-none focus:border-white/60"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded text-sm bg-white/20 text-white hover:bg-white/30 transition-colors font-medium"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-white/10 mt-1 pt-3 flex flex-col gap-1">
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
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-green-100 hover:bg-white/10 hover:text-white"
                  }`}
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
