"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./brand";

const links = [
  { href: "/search", label: "Search" }, { href: "/dashboard", label: "RFQs" },
  { href: "/catalog", label: "Catalog" },
  { href: "/dashboard", label: "Orders" }, { href: "/dashboard", label: "Analytics" },
];

export function SiteHeader({ authenticated = false }: { authenticated?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
    <div className="page-shell flex h-16 items-center justify-between gap-6">
      <Brand />
      <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
        {links.map((link) => <Link key={link.label} href={link.href} className={`nav-link ${pathname === link.href ? "nav-link-active" : ""}`}>{link.label}</Link>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        <Link href="/search" className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-navy" aria-label="Search"><Search size={20} /></Link>
        {authenticated ? <div className="grid size-9 place-items-center rounded-full border border-slate-200 bg-gradient-to-br from-blue-100 to-slate-200 text-xs font-bold text-navy">SK</div> : <Link className="button-primary !px-4 !py-2" href="/login">Sign in</Link>}
      </div>
      <button className="grid size-9 place-items-center rounded-lg text-navy md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>
    {open && <nav className="border-t border-line bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
      <div className="mx-auto flex max-w-app flex-col gap-1">
        {links.map((link) => <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-ink hover:bg-slate-50">{link.label}</Link>)}
        <Link href="/login" onClick={() => setOpen(false)} className="button-primary mt-2">Sign in</Link>
      </div>
    </nav>}
  </header>;
}
