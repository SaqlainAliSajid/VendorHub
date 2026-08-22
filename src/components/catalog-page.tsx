"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCatalog } from "@/lib/api/vendorhub";
import type { CatalogProduct } from "@/lib/api/types";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Badge } from "./ui/badge";
import { TextInput } from "./ui/input";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-700 to-blue-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,197,253,.65),transparent_18%),linear-gradient(130deg,transparent_36%,rgba(255,255,255,.14)_37%,transparent_38%)]" />
        <div className="absolute bottom-3 left-3 rounded-full bg-slate-950/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          {product.category}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-navy">{product.name}</h3>
        <Link href={`/vendors/${product.vendorId}`} className="mt-1 block text-sm font-medium text-blue hover:underline">
          {product.vendorName}
        </Link>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Price range</p>
            <p className="mt-1 font-semibold text-navy">{product.priceRange}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">MOQ</p>
            <p className="mt-1 font-semibold text-navy">{product.moq}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.specs.map((spec) => (
            <Badge key={spec}>{spec}</Badge>
          ))}
        </div>
      </div>
    </article>
  );
}

export function CatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const catalogQuery = useQuery({
    queryKey: ["catalog", query],
    queryFn: () => getCatalog(query),
  });

  const products = catalogQuery.data ?? [];
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const visibleProducts =
    category === "All" ? products : products.filter((product) => product.category === category);

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader authenticated />
      <main className="page-shell py-9 sm:py-12">
        <div>
          <p className="eyebrow text-blue">Supplier marketplace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Product Catalog</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Browse products from verified suppliers and open a supplier profile for more details.
          </p>
        </div>

        <div className="mt-7 max-w-3xl">
          <TextInput
            label="Search catalog"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, categories, or suppliers"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`filter-chip ${category === item ? "border-blue bg-blue text-white hover:text-white" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>

        {catalogQuery.isLoading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : catalogQuery.isError ? (
          <div className="card mt-8 p-8 text-center text-sm text-red-700">Unable to load the catalog. Please try again.</div>
        ) : visibleProducts.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="card mt-8 p-10 text-center">
            <h2 className="font-semibold text-navy">No products found</h2>
            <p className="mt-2 text-sm text-muted">Try a different search or category.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
