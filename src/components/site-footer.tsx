import { Globe2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";

const columns = [
  { title: "Platform", links: ["RFQs", "Vendors", "Analytics"] },
  { title: "Company", links: ["About Us", "Careers", "Resources"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Compliance"] },
];

export function SiteFooter() {
  return <footer className="mt-20 border-t border-line bg-slate-50 py-14">
    <div className="page-shell">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2"><Brand compact /><p className="max-w-sm text-sm leading-6 text-muted">Revolutionizing B2B procurement with intelligent sourcing and real-time vendor analytics. Built for precision.</p><div><p className="mb-2 text-sm font-semibold">Join our newsletter</p><div className="flex max-w-sm gap-2"><input className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none ring-blue focus:ring-2" placeholder="Enter your email" type="email" /><button className="button-primary !rounded-xl !px-4 !py-2">Subscribe</button></div></div></div>
        {columns.map((column) => <div key={column.title}><h2 className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-navy">{column.title}</h2><ul className="space-y-2.5">{column.links.map((link) => <li key={link}><Link href="#" className="text-sm text-muted transition hover:text-navy">{link}</Link></li>)}</ul></div>)}
      </div>
      <div className="mt-12 flex flex-col justify-between gap-4 border-t border-line pt-7 text-sm text-muted sm:flex-row"><p>© 2026 VendorHub AI. All rights reserved.</p><div className="flex gap-5"><Globe2 size={18} /><HelpCircle size={18} /></div></div>
    </div>
  </footer>;
}
