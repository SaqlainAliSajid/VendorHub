"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Check, ChevronDown, ExternalLink, FileText, Filter, Globe2, MapPin, MessageSquare, Search, SlidersHorizontal, Sparkles, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getSupplierFilterOptions, searchSuppliers } from "@/lib/api/vendorhub";
import type { SearchFilters, Supplier } from "@/lib/api/types";
import { Modal } from "./ui/modal";
import { SelectInput, TextInput } from "./ui/input";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";


function ScoreRing({ score }: { score: number }) { return <div className="relative grid size-16 place-items-center"><svg viewBox="0 0 36 36" className="size-16 -rotate-90"><path className="text-slate-100" fill="none" stroke="currentColor" strokeWidth="3" d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"/><path className="text-blue" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score},100`} strokeLinecap="round" d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"/></svg><span className="absolute text-xs font-bold text-navy">{score}%</span></div>; }

function SupplierCard({ supplier, top = false }: { supplier: Supplier; top?: boolean }) {
  const [sent, setSent] = useState(false);
  return <article className={`card relative overflow-hidden p-5 ${top ? "border-blue-200" : ""}`}>
    {top && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue via-indigo-400 to-violet-400" />}
    <div className="flex gap-4"><div className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${top ? "from-blue-200 to-indigo-100" : "from-slate-100 to-blue-50"} text-lg font-bold text-navy`}>{supplier.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-lg font-semibold text-navy">{supplier.name}</h2>{supplier.verified && <BadgeCheck className="shrink-0 text-blue" size={18} />}</div><p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin size={14} /> {supplier.location} · {supplier.category}</p></div>{!top && <ScoreRing score={supplier.matchScore} />}</div>{top && <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center"><div><p className="text-lg font-bold text-navy">{supplier.matchScore}%</p><p className="text-[10px] font-bold uppercase tracking-wide text-muted">AI Match</p></div><div className="border-x border-line"><p className="text-lg font-bold text-navy">{supplier.rating}</p><p className="text-[10px] font-bold uppercase tracking-wide text-muted">Rating</p></div><div><p className="text-lg font-bold text-navy">{supplier.leadTime.split(" ")[0]}</p><p className="text-[10px] font-bold uppercase tracking-wide text-muted">Lead Time</p></div></div>}<div className="mt-4 flex flex-wrap gap-2">{supplier.tags.map((tag) => <span key={tag} className="rounded-full bg-lavender px-2.5 py-1 text-xs font-semibold text-slate-600">{tag}</span>)}</div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setSent(true)} className="button-primary !rounded-lg !px-4 !py-2 text-xs">{sent ? <><Check size={15} /> RFQ Sent</> : <><FileText size={15} /> Send RFQ</>}</button><Link href={`/vendors/${supplier.id}`} className="button-secondary !rounded-lg !px-4 !py-2 text-xs">View profile <ArrowRight size={15} /></Link></div></div></div>
  </article>;
}

export function SearchResultsPage() {
  const router = useRouter(); const params = useSearchParams();
  const initialQuery = params.get("q") || "industrial textiles";
  const [query, setQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [draftFilters, setDraftFilters] = useState<SearchFilters>({});
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  const filterOptionsQuery = useQuery({ queryKey: ["supplier-filter-options"], queryFn: getSupplierFilterOptions });
  const suppliersQuery = useQuery({
    queryKey: ["suppliers", initialQuery, filters],
    queryFn: () => searchSuppliers(initialQuery, filters),
  });
  const submit = (event: FormEvent) => { event.preventDefault(); router.push(`/search?q=${encodeURIComponent(query)}`); };
  const suppliers = suppliersQuery.data?.length ? suppliersQuery.data : [];

  return <div className="min-h-screen bg-[#fafbff]"><SiteHeader authenticated />
    <main className="pb-4"><section className="relative overflow-hidden border-b border-line bg-white py-12"><div className="absolute -right-20 -top-24 size-72 rounded-full bg-blue-100/70 blur-3xl" /><div className="page-shell relative"><p className="eyebrow text-blue">AI sourcing assistant</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Find your best-fit suppliers</h1><form onSubmit={submit} className="mt-7 flex max-w-4xl flex-col gap-2 rounded-2xl border border-blue-100 bg-white p-2 shadow-card sm:flex-row"><div className="flex min-w-0 flex-1 items-center gap-3 px-3"><Sparkles className="shrink-0 text-blue" size={20}/><input className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm outline-none sm:text-base" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Describe exactly what you need" /></div><button className="button-primary !rounded-xl !px-6" type="submit"><Search size={17} /> Search</button></form><div className="mt-4 flex flex-wrap gap-2">
  <button type="button" onClick={() => { setDraftFilters(filters); setFiltersOpen(true); }} className="filter-chip flex items-center gap-1.5"><SlidersHorizontal size={15} /> All filters</button>
  {filters.country && <button type="button" onClick={() => setFilters((current) => ({ ...current, country: undefined }))} className="filter-chip border-blue bg-blue text-white">{filters.country} ×</button>}
  {filters.industry && <button type="button" onClick={() => setFilters((current) => ({ ...current, industry: undefined }))} className="filter-chip border-blue bg-blue text-white">{filters.industry} ×</button>}
  {filters.leadTime && <button type="button" onClick={() => setFilters((current) => ({ ...current, leadTime: undefined }))} className="filter-chip border-blue bg-blue text-white">{filters.leadTime} ×</button>}
  {(filters.certifications ?? []).map((cert) => <button type="button" key={cert} onClick={() => setFilters((current) => ({ ...current, certifications: current.certifications?.filter((item) => item !== cert) }))} className="filter-chip border-blue bg-blue text-white">{cert} ×</button>)}
</div></div></section>
      <div className="page-shell grid gap-7 py-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        <section><div className="mb-5 flex items-center justify-between"><div><p className="text-xl font-semibold text-navy">Found {suppliersQuery.isLoading ? "…" : suppliers.length || 24} suppliers</p><p className="mt-1 text-sm text-muted">Ranked by AI match confidence and verified capability.</p></div><button className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy">Sort: Best match <ChevronDown size={16} /></button></div>
          {suppliersQuery.isLoading ? <div className="grid gap-4 sm:grid-cols-2"><div className="h-72 animate-pulse rounded-2xl bg-slate-100 sm:col-span-2" />{[1,2,3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-slate-100" />)}</div> : suppliers.length ? <div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-blue"><Sparkles size={14} /> Top AI Match</div><SupplierCard supplier={suppliers[0]} top /></div>{suppliers.slice(1).map((supplier) => <SupplierCard key={supplier.id} supplier={supplier} />)}</div> : <div className="card grid min-h-64 place-items-center p-8 text-center"><div><Search className="mx-auto text-muted"/><h2 className="mt-4 text-lg font-semibold">No exact matches yet</h2><p className="mt-2 text-sm text-muted">Try broadening your query or removing a filter.</p></div></div>}<button className="button-secondary mx-auto mt-7 flex">Load more suppliers</button></section>
        <aside className="h-fit rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5 shadow-soft lg:sticky lg:top-24"><div className="flex items-center justify-between"><p className="text-sm font-bold uppercase tracking-[.14em] text-blue">AI Analysis</p><Sparkles className="text-blue" size={19}/></div><h2 className="mt-4 text-xl font-semibold text-navy">A strong regional fit</h2><p className="mt-3 text-sm leading-6 text-muted">Your request best matches suppliers with established export history, verified quality standards, and flexible production capacity.</p><div className="mt-5 space-y-3">{[["Price competitive", "12% below category median"], ["Recently audited", "All top matches verified in 90 days"], ["High reliability", "Average 96% on-time delivery"]].map(([title, value]) => <div key={title} className="rounded-xl bg-white p-3"><p className="flex items-center gap-2 text-sm font-semibold text-navy"><Check className="text-green-600" size={16}/>{title}</p><p className="mt-1 pl-6 text-xs text-muted">{value}</p></div>)}</div><div className="mt-6 rounded-xl bg-navy p-4 text-white"><div className="flex items-center gap-2 text-sm font-semibold"><Globe2 size={16}/> Sourcing context</div><p className="mt-2 text-xs leading-5 text-slate-300">Pakistan · Textiles · 24 verified suppliers</p><button className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-200">Open market brief <ExternalLink size={13}/></button></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-navy shadow-sm hover:bg-slate-50"><MessageSquare size={16}/> Ask AI a question</button></aside>
      </div>
    </main>
    <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="All filters">
      <div className="space-y-5">
        <SelectInput label="Country" value={filters.country ?? ""} onChange={(event) => setDraftFilters((current) => ({ ...current, country: event.target.value || undefined }))}>
          <option value="">Any country</option>
          {(filterOptionsQuery.data?.countries ?? []).map((country) => <option key={country} value={country}>{country}</option>)}
        </SelectInput>

        <SelectInput label="Industry" value={filters.industry ?? ""} onChange={(event) => setDraftFilters((current) => ({ ...current, industry: event.target.value || undefined }))}>
          <option value="">Any industry</option>
          {(filterOptionsQuery.data?.industries ?? []).map((industry) => <option key={industry} value={industry}>{industry}</option>)}
        </SelectInput>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Minimum MOQ" type="number" min={0} value={filters.moqMin ?? ""} onChange={(event) => setDraftFilters((current) => ({ ...current, moqMin: event.target.value === "" ? undefined : Number(event.target.value) }))} placeholder="e.g. 500" />
          <TextInput label="Maximum MOQ" type="number" min={0} value={filters.moqMax ?? ""} onChange={(event) => setDraftFilters((current) => ({ ...current, moqMax: event.target.value === "" ? undefined : Number(event.target.value) }))} placeholder="e.g. 5000" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Minimum price" type="number" min={0} value={filters.priceMin ?? ""} onChange={(event) => setDraftFilters((current) => ({ ...current, priceMin: event.target.value === "" ? undefined : Number(event.target.value) }))} placeholder="Minimum" />
          <TextInput label="Maximum price" type="number" min={0} value={filters.priceMax ?? ""} onChange={(event) => setDraftFilters((current) => ({ ...current, priceMax: event.target.value === "" ? undefined : Number(event.target.value) }))} placeholder="Maximum" />
        </div>

        <SelectInput label="Lead time" value={filters.leadTime ?? ""} onChange={(event) => setDraftFilters((current) => ({ ...current, leadTime: event.target.value || undefined }))}>
          <option value="">Any lead time</option>
          {(filterOptionsQuery.data?.leadTimes ?? []).map((leadTime) => <option key={leadTime} value={leadTime}>{leadTime}</option>)}
        </SelectInput>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {(filterOptionsQuery.data?.certifications ?? []).map((certification) => {
              const selected = filters.certifications?.includes(certification) ?? false;
              return <button key={certification} type="button" onClick={() => setDraftFilters((current) => ({ ...current, certifications: selected ? current.certifications?.filter((item) => item !== certification) : [...(current.certifications ?? []), certification] }))} className={`filter-chip ${selected ? "border-blue bg-blue text-white hover:text-white" : ""}`}>{certification}</button>;
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={() => setDraftFilters({})} className="button-secondary flex-1">Clear</button>
          <button type="button" onClick={() => { setFilters(draftFilters); setFiltersOpen(false); }} className="button-primary flex-1">Apply filters</button>
        </div>
      </div>
    </Modal>
    <SiteFooter />
  </div>;
}
