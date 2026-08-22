import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="flex items-center gap-2 text-navy" aria-label="VendorHub AI home">
    <span className="grid size-8 place-items-center rounded-lg bg-navy text-white shadow-sm"><Sparkles size={17} /></span>
    <span className={`${compact ? "text-sm" : "text-lg"} font-bold tracking-tight`}>VendorHub AI</span>
  </Link>;
}
