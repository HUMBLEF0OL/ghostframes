"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../theme-context";

const navItems = [
  { href: "/", label: "Showcase", isActive: (pathname: string) => pathname === "/" },
  { href: "/reference", label: "Reference", isActive: (pathname: string) => pathname.startsWith("/reference") },
  { href: "/config-playground", label: "Playground", isActive: (pathname: string) => pathname.startsWith("/config-playground") },
  { href: "/advanced", label: "Advanced", isActive: (pathname: string) => pathname.startsWith("/advanced") },
];

export function MainHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur light:border-zinc-200 light:bg-white/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 rounded-md px-1 py-1 transition-opacity hover:opacity-85">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-violet-600">
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <span className="text-sm font-bold text-white light:text-zinc-900">SkelCore</span>
        </Link>

        <nav aria-label="Primary" className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-1">
          {navItems.map((item) => {
            const active = item.isActive(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-500/20 text-indigo-200 light:bg-indigo-50 light:text-indigo-700"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          suppressHydrationWarning
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 light:border-zinc-300 light:bg-white light:text-zinc-700 light:hover:border-zinc-400"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
