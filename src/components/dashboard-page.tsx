"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bot, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, FileText, MoreVertical, PackageCheck, Search, Sparkles, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getDashboard } from "@/lib/api/vendorhub";
import { Badge } from "./ui/badge";
import type { Supplier } from "@/lib/api/types";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

function Sparkline({ area = false }: { area?: boolean }) { return <svg className="h-full w-full text-blue" viewBox="0 0 200 60" preserveAspectRatio="none"><defs><linearGradient id={area ? "spend-gradient" : "rfq-gradient"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity=".22"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><path d="M0 52 Q18 40 35 46 T72 30 T112 36 T154 9 T200 19 L200 60 L0 60Z" fill={`url(#${area ? "spend-gradient" : "rfq-gradient"})`}/><path d="M0 52 Q18 40 35 46 T72 30 T112 36 T154 9 T200 19" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>; }
function MatchRing({ score }: { score: number }) { return <div className="relative grid size-12 place-items-center"><svg className="size-12 -rotate-90" viewBox="0 0 36 36"><path className="text-slate-200" d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="currentColor" strokeWidth="3"/><path className="text-blue" d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${score},100`}/></svg><span className="absolute text-[10px] font-bold text-navy">{score}%</span></div>; }
function VendorCard({ vendor }: { vendor: Supplier }) { return <Link href={`/vendors/${vendor.id}`} className="block"><article className="group min-w-[275px] overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"><div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-700 to-blue-900"><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,197,253,.65),transparent_18%),linear-gradient(130deg,transparent_36%,rgba(255,255,255,.14)_37%,transparent_38%)]"/><div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-950/40 px-2 py-1 text-xs font-semibold text-white backdrop-blur"><PackageCheck size={13} className="text-blue-200"/> Verified</div></div><div className="p-4"><h3 className="truncate font-semibold text-navy group-hover:text-blue">{vendor.name}</h3><p className="mt-1 truncate text-sm text-muted">{vendor.category} · {vendor.location}</p><div className="mt-3 flex gap-2">{vendor.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{tag}</span>)}</div></div></article></Link>; }

export function DashboardPage() {
  const dashboard = useQuery({ queryKey: ["buyer-dashboard"], queryFn: getDashboard });
  if (dashboard.isLoading || !dashboard.data) return <div className="min-h-screen bg-canvas"><SiteHeader authenticated /><div className="page-shell py-10"><div className="h-9 w-64 animate-pulse rounded bg-slate-200"/><div className="mt-8 grid gap-5 lg:grid-cols-4"><div className="h-60 animate-pulse rounded-2xl bg-slate-200 lg:col-span-2"/><div className="h-60 animate-pulse rounded-2xl bg-slate-200"/><div className="h-60 animate-pulse rounded-2xl bg-slate-200"/></div></div></div>;
  const data = dashboard.data;
  return <div className="min-h-screen bg-canvas"><SiteHeader authenticated />
    <main className="page-shell py-9 sm:py-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-blue">Buyer workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Dashboard</h1><p className="mt-2 text-sm text-muted">Your live sourcing overview, all in one place.</p></div><Link href="/search" className="button-primary"><Search size={17}/> Find suppliers</Link></div>
      <div className="mt-8 grid auto-rows-[230px] gap-5 lg:grid-cols-4">
        <article className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft"><div className="absolute -bottom-9 -right-8 size-32 rounded-full bg-blue/5 blur-2xl"/><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><div><p className="eyebrow !tracking-[.12em]">Active RFQs</p><div className="mt-2 flex items-baseline gap-2"><strong className="text-5xl font-semibold tracking-tight text-navy">{data.activeRfqs}</strong><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">{data.rfqChange}</span></div></div><FileText className="text-slate-300" size={23}/></div><div className="h-16"><Sparkline /></div></div></article>
        <article className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft"><div className="absolute -left-7 -top-7 size-28 rounded-full bg-blue/5 blur-2xl"/><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><div><p className="eyebrow !tracking-[.12em]">Pending Quotes</p><strong className="mt-2 block text-5xl font-semibold tracking-tight text-navy">{data.pendingQuotes}</strong></div><Clock3 className="text-slate-300" size={23}/></div><div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-lavender px-3 py-2 text-xs font-semibold text-slate-700"><Sparkles size={15} className="animate-pulse text-blue"/>AI reviewing 3 quotes</div></div></article>
        <article className="relative row-span-2 overflow-hidden rounded-2xl bg-white p-6 shadow-soft lg:col-span-1"><div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-violet-50"/><div className="relative flex h-full flex-col"><div className="flex items-center justify-between"><p className="eyebrow !tracking-[.12em]">AI Recommendations</p><Sparkles className="text-blue" size={20}/></div><div className="mt-5 flex flex-1 flex-col gap-2">{data.recommendations.map((supplier) => <div key={supplier.id} className="flex items-center justify-between gap-2 rounded-xl p-2 transition hover:bg-slate-50"><div className="flex min-w-0 items-center gap-2"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{supplier.name.split(" ").slice(0,2).map((part) => part[0]).join("")}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-navy">{supplier.name}</p><p className="truncate text-xs text-muted">{supplier.category}</p></div></div><MatchRing score={supplier.matchScore}/></div>)}</div><Link href="/search" className="mt-3 rounded-xl py-2.5 text-center text-sm font-semibold text-blue transition hover:bg-lavender">View all matches</Link></div></article>
        <article className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft lg:col-span-2"><div className="relative flex h-full flex-col"><div className="flex items-start justify-between"><div><p className="eyebrow !tracking-[.12em]">Spending Summary (YTD)</p><strong className="mt-2 block text-4xl font-semibold tracking-tight text-navy">{data.spendingYtd}</strong></div><button className="grid size-8 place-items-center rounded-lg text-muted hover:bg-slate-100"><MoreVertical size={19}/></button></div><div className="relative mt-2 min-h-0 flex-1"><Sparkline area/><div className="absolute -bottom-1 inset-x-0 flex justify-between px-1 text-[10px] text-muted"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div></div></div></article>
      </div>
      <section className="mt-10"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-semibold tracking-tight text-navy">Saved Vendors</h2><p className="mt-1 text-sm text-muted">Your shortlisted suppliers and partners.</p></div><div className="flex gap-2"><button className="grid size-9 place-items-center rounded-full border border-line bg-white text-navy hover:bg-slate-50" aria-label="Previous vendors"><ChevronLeft size={18}/></button><button className="grid size-9 place-items-center rounded-full border border-line bg-white text-navy hover:bg-slate-50" aria-label="Next vendors"><ChevronRight size={18}/></button></div></div><div className="mt-5 flex snap-x gap-5 overflow-x-auto pb-4">{data.savedVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor}/>)}</div></section>
      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-navy">Orders</h2>
          <p className="mt-1 text-sm text-muted">Track your latest supplier orders.</p>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="divide-y divide-line">
            {data.orders.map((order) => {
              const intent: "success" | "warning" | "info" = order.status === "delivered" ? "success" : order.status === "shipped" ? "info" : order.status === "awaiting_payment" ? "warning" : "info";
              return (
                <Link key={order.id} href={`/vendors/${order.vendorId}`} className="flex flex-col gap-3 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-navy">{order.vendorName}</p>
                    <p className="mt-1 text-xs text-muted">Order {order.id} · ETA {order.eta}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <Badge intent={intent}>{order.status.replaceAll("_", " ")}</Badge>
                    <span className="font-semibold text-navy">{order.total}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-navy">Recent Searches</h2>
          <p className="mt-1 text-sm text-muted">Jump back into searches you've made recently.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {data.recentSearches.map((term) => (
            <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="filter-chip">
              {term}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3"><article className="card p-5"><CircleDollarSign className="text-blue" size={23}/><h2 className="mt-4 font-semibold text-navy">Spend smarter</h2><p className="mt-2 text-sm leading-6 text-muted">Find cost-saving opportunities across comparable quotes.</p></article><article className="card p-5"><TrendingUp className="text-blue" size={23}/><h2 className="mt-4 font-semibold text-navy">Track progress</h2><p className="mt-2 text-sm leading-6 text-muted">Keep RFQs, negotiations, and orders on schedule.</p></article><article className="card p-5"><Bot className="text-blue" size={23}/><h2 className="mt-4 font-semibold text-navy">Ask VendorHub AI</h2><p className="mt-2 text-sm leading-6 text-muted">Get sourcing analysis without leaving your workflow.</p></article></section>
    </main><SiteFooter />
  </div>;
}
