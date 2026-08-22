"use client";

import { ArrowRight, BadgeCheck, BarChart3, Bot, Check, FileText, Globe2, Network, Search, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const examples = ["Eco-friendly packaging", "CNC machining Europe", "Bulk industrial textiles"];
const steps = [
  { icon: Search, number: "01", title: "Describe Needs", text: "Use natural language to detail exactly what you're looking for, no complex filters required." },
  { icon: Network, number: "02", title: "AI Matches", text: "Our engine instantly cross-references global databases to find pre-vetted vendors that fit." },
  { icon: BarChart3, number: "03", title: "Compare & Order", text: "Review AI-generated comparison matrices and initiate RFQs with a single click." },
];

export function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); router.push(`/search?q=${encodeURIComponent(query || "industrial textiles")}`); };

  return <div className="overflow-hidden"><SiteHeader />
    <main>
      <section className="relative isolate flex min-h-[760px] items-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-canvas py-24">
        <div className="absolute inset-0 -z-10 grid-dots opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="hero-orb absolute -left-20 top-28 -z-10 size-72 rounded-full bg-blue-200/70" /><div className="hero-orb hero-orb-delayed absolute right-0 top-16 -z-10 size-80 rounded-full bg-violet-200/60" />
        <div className="page-shell flex flex-col items-center text-center">
          <span className="rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-slate-700 shadow-sm backdrop-blur">The New Standard in Sourcing</span>
          <h1 className="mt-7 max-w-4xl text-5xl font-bold tracking-[-.055em] text-navy sm:text-6xl lg:text-7xl">Find the Right Supplier.<br /><span className="text-blue">Faster. Smarter.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">Harness the power of artificial intelligence to instantly discover, vet, and connect with top-tier vendors globally. Stop searching, start sourcing.</p>
          <form onSubmit={submit} className="group relative mt-12 w-full max-w-3xl text-left">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue/20 via-indigo-200 to-blue/20 blur-xl transition group-hover:opacity-90" />
            <div className="relative flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-card sm:flex-row"><div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3"><WandSparkles className="shrink-0 text-blue" size={22} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400 sm:text-base" placeholder="e.g. Looking for ISO-certified aluminum manufacturers in Southeast Asia" /></div><button className="button-primary shrink-0 !rounded-xl !px-7" type="submit">Search with AI <ArrowRight size={18} /></button></div>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted"><span>Try:</span>{examples.map((example, index) => <button key={example} onClick={() => { setQuery(example); router.push(`/search?q=${encodeURIComponent(example)}`); }} className="underline decoration-blue/30 underline-offset-4 transition hover:text-blue">{example}{index !== examples.length - 1 && <span className="ml-3 no-underline text-slate-300">•</span>}</button>)}</div>
        </div>
      </section>
      <section className="border-y border-line bg-white/70 py-14"><div className="page-shell"><p className="text-center text-xs font-bold uppercase tracking-[.16em] text-muted">Trusted by 50,000+ global enterprises</p><div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-xl font-bold text-slate-400 grayscale sm:gap-x-16"><span>↻ AcmeCorp</span><span>∞ Globex</span><span>△ Initech</span><span>✦ Soylent</span><span>▦ Stark Ind.</span></div></div></section>
      <section className="page-shell py-24 sm:py-32"><div className="mx-auto max-w-2xl text-center"><h2 className="section-title">Intelligence at Every Step</h2><p className="mt-4 text-muted">Our proprietary AI models analyze millions of data points to streamline your procurement workflow from initial query to final order.</p></div><div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8"><div className="absolute left-[17%] right-[17%] top-10 hidden h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent md:block" />{steps.map((step, index) => <div key={step.title} className="relative flex flex-col items-center text-center"><div className={`grid size-20 place-items-center rounded-full border border-line shadow-soft ${index === 1 ? "bg-navy text-white" : "bg-white text-navy"}`}><step.icon size={30} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.15em] text-blue">Step {step.number}</p><h3 className="mt-2 text-xl font-semibold">{step.title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-muted">{step.text}</p></div>)}</div></section>
      <section className="bg-white py-24 sm:py-32"><div className="page-shell"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-2xl"><h2 className="section-title">Precision Engineered for Scale</h2><p className="mt-4 text-muted">Everything you need to build a resilient supply chain, elegantly packaged in a unified platform.</p></div><button className="button-secondary">View All Features <ArrowRight size={16} /></button></div><div className="mt-12 grid auto-rows-[210px] gap-5 md:grid-cols-4">
        <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-navy to-blue p-8 text-white md:col-span-2 md:row-span-2"><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(96,165,250,.5),transparent_30%),radial-gradient(circle_at_30%_80%,rgba(59,130,246,.4),transparent_35%)]" /><Globe2 className="absolute right-7 top-7 text-blue-200" size={36} /><div className="relative flex h-full max-w-sm flex-col justify-end"><span className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-blue-200"><i className="size-2 rounded-full bg-green-300" /> Live Tracking</span><h3 className="text-3xl font-semibold">Global Network</h3><p className="mt-3 text-sm leading-6 text-slate-300">Tap into our real-time database of over 2.5 million verified manufacturing facilities worldwide.</p></div></article>
        <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue to-indigo-700 p-7 text-white md:col-span-2"><FileText className="absolute right-7 top-7 opacity-35" size={70} /><div className="relative"><p className="text-xs font-bold uppercase tracking-[.15em] text-blue-100">AI-Powered Documents</p><h3 className="mt-3 text-2xl font-semibold">Generative RFQs</h3><p className="mt-2 max-w-sm text-sm text-blue-100">Create production-ready requests in seconds, with every detail included.</p></div></article>
        <article className="rounded-3xl bg-slate-100 p-7"><ShieldCheck className="text-blue" size={28} /><h3 className="mt-7 text-xl font-semibold text-navy">Deep Vetting</h3><p className="mt-2 text-sm leading-6 text-muted">Get a complete view of certifications, compliance, and supplier risk.</p></article>
        <article className="rounded-3xl border border-blue-100 bg-lavender p-7"><BarChart3 className="text-blue" size={28} /><h3 className="mt-7 text-xl font-semibold text-navy">Matrix View</h3><p className="mt-2 text-sm leading-6 text-muted">Make confident decisions with AI-generated comparison grids.</p></article>
      </div></div></section>
      <section className="page-shell pb-16"><div className="overflow-hidden rounded-3xl bg-navy px-7 py-12 text-center text-white sm:px-14 sm:py-16"><Bot className="mx-auto text-blue-200" size={38} /><h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Your next great supplier is one search away.</h2><p className="mx-auto mt-4 max-w-xl text-slate-300">Turn a complicated sourcing process into a simple conversation with VendorHub AI.</p><button onClick={() => router.push("/login")} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:bg-blue-50">Start sourcing smarter <ArrowRight size={17} /></button></div></section>
    </main><SiteFooter />
  </div>;
}
