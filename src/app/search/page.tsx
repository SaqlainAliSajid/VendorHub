import { Suspense } from "react";
import { SearchResultsPage } from "@/components/search-results-page";

export default function SearchPage() {
  return <Suspense fallback={<div className="min-h-screen bg-canvas" />}><SearchResultsPage /></Suspense>;
}
