import { catalogProducts, dashboardSummary, filterOptions, reviewsByVendor, suppliers, vendorProfiles } from "./mock-data";
import type {
  AuthPayload,
  AuthProvider,
  AuthResponse,
  CatalogProduct,
  DashboardSummary,
  Review,
  ReviewSubmission,
  SearchFilters,
  SignInResult,
  SignUpPayload,
  Supplier,
  VendorProfile,
  VerificationCodePayload,
} from "./types";

const usingMocks = !process.env.NEXT_PUBLIC_API_BASE_URL;
const wait = () => new Promise((resolve) => setTimeout(resolve, 300));

export async function searchSuppliers(query: string, filters: SearchFilters = {}): Promise<Supplier[]> {
  if (usingMocks) {
    await wait();
    const q = query.trim().toLowerCase();
    return suppliers.filter((supplier) => {
      const matchQuery = q.length < 3 || `${supplier.name} ${supplier.category} ${supplier.location}`.toLowerCase().includes(q);
      const matchCountry = !filters.country || supplier.location.toLowerCase().includes(filters.country.toLowerCase());
      const matchIndustry = !filters.industry || supplier.category === filters.industry;
      const moqDigits = Number.parseInt(supplier.minimumOrder.replace(/[^\d]/g, ""), 10) || 0;
      const matchMoqMin = typeof filters.moqMin !== "number" || moqDigits >= filters.moqMin;
      const matchMoqMax = typeof filters.moqMax !== "number" || moqDigits <= filters.moqMax;
      const matchCerts = !filters.certifications?.length || filters.certifications.every((cert) => supplier.tags.includes(cert));
      const leadDays = Number.parseInt(supplier.leadTime.replace(/[^\d]/g, ""), 10) || 0;
      const matchLeadTime = !filters.leadTime
        || (filters.leadTime === "Under 2 weeks" && leadDays < 14)
        || (filters.leadTime === "2-4 weeks" && leadDays >= 14 && leadDays <= 28)
        || (filters.leadTime === "4+ weeks" && leadDays > 28);
      return matchQuery && matchCountry && matchIndustry && matchMoqMin && matchMoqMax && matchCerts && matchLeadTime;
    });
  }
  const { apiClient } = await import("./client");
  const searchParams = new URLSearchParams({ q: query });
  if (filters.country) searchParams.set("country", filters.country);
  if (filters.industry) searchParams.set("industry", filters.industry);
  if (typeof filters.moqMin === "number") searchParams.set("moqMin", String(filters.moqMin));
  if (typeof filters.moqMax === "number") searchParams.set("moqMax", String(filters.moqMax));
  if (typeof filters.priceMin === "number") searchParams.set("priceMin", String(filters.priceMin));
  if (typeof filters.priceMax === "number") searchParams.set("priceMax", String(filters.priceMax));
  if (filters.leadTime) searchParams.set("leadTime", filters.leadTime);
  if (filters.certifications?.length) searchParams.set("certifications", filters.certifications.join(","));
  return apiClient<Supplier[]>(`/v1/suppliers/search?${searchParams.toString()}`);
}
export async function getDashboard(): Promise<DashboardSummary> {
  if (usingMocks) { await wait(); return dashboardSummary; }
  const { apiClient } = await import("./client"); return apiClient<DashboardSummary>("/v1/buyer/dashboard");
}
export async function signIn(payload: AuthPayload): Promise<SignInResult> {
  if (usingMocks) {
    await wait();
    if (payload.email.toLowerCase().includes("2fa")) {
      return {
        accessToken: "pending-2fa-token",
        user: { id: "buyer-1", name: "Saqlain", role: "buyer" },
        nextStep: "verify_2fa",
      };
    }
    return {
      accessToken: "demo-access-token",
      user: { id: "buyer-1", name: "Saqlain", role: "buyer" },
      nextStep: "authenticated",
    };
  }
  const { apiClient } = await import("./client"); return apiClient<AuthResponse>("/v1/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  if (usingMocks) {
    await wait();
    return { accessToken: "signup-token", user: { id: "buyer-2", name: payload.companyName, role: "buyer" } };
  }
  const { apiClient } = await import("./client");
  return apiClient<AuthResponse>("/v1/auth/signup", { method: "POST", body: JSON.stringify(payload) });
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean }> {
  if (usingMocks) {
    await wait();
    return { success: true };
  }
  const { apiClient } = await import("./client");
  return apiClient<{ success: boolean }>("/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyEmailCode(payload: VerificationCodePayload): Promise<{ verified: boolean }> {
  if (usingMocks) {
    await wait();
    return { verified: payload.code.length === 6 };
  }
  const { apiClient } = await import("./client");
  return apiClient<{ verified: boolean }>("/v1/auth/verify-email", { method: "POST", body: JSON.stringify(payload) });
}

export async function verifyTwoFactorCode(payload: VerificationCodePayload): Promise<AuthResponse> {
  if (usingMocks) {
    await wait();
    return { accessToken: "2fa-complete-token", user: { id: "buyer-1", name: "Saqlain", role: "buyer" } };
  }
  const { apiClient } = await import("./client");
  return apiClient<AuthResponse>("/v1/auth/verify-2fa", { method: "POST", body: JSON.stringify(payload) });
}

export async function signInWithProvider(provider: AuthProvider): Promise<AuthResponse> {
  if (usingMocks) {
    await wait();
    return {
      accessToken: `${provider}-oauth-token`,
      user: { id: "buyer-oauth", name: "OAuth Buyer", role: "buyer" },
    };
  }
  const { apiClient } = await import("./client");
  return apiClient<AuthResponse>(`/v1/auth/oauth/${provider}`, { method: "POST" });
}

export async function getVendorProfile(id: string): Promise<VendorProfile> {
  if (usingMocks) {
    await wait();
    const profile = vendorProfiles.find((item) => item.id === id);
    if (profile) return profile;
    return {
      id,
      name: "Unknown Vendor",
      verified: false,
      rating: 0,
      reviewCount: 0,
      location: "Unknown",
      category: "Unknown",
      tags: [],
      description: "No vendor information is available yet.",
      foundedYear: 0,
      employeeRange: "N/A",
      certifications: [],
      gallery: [],
    };
  }
  const { apiClient } = await import("./client");
  return apiClient<VendorProfile>(`/v1/vendors/${id}`);
}

export async function getCatalog(query = ""): Promise<CatalogProduct[]> {
  if (usingMocks) {
    await wait();
    const q = query.toLowerCase().trim();
    if (!q) return catalogProducts;
    return catalogProducts.filter((item) => `${item.name} ${item.category} ${item.vendorName}`.toLowerCase().includes(q));
  }
  const { apiClient } = await import("./client");
  return apiClient<CatalogProduct[]>(`/v1/catalog?q=${encodeURIComponent(query)}`);
}

export async function getVendorReviews(vendorId: string): Promise<Review[]> {
  if (usingMocks) {
    await wait();
    return reviewsByVendor[vendorId] ?? [];
  }
  const { apiClient } = await import("./client");
  return apiClient<Review[]>(`/v1/vendors/${vendorId}/reviews`);
}

export async function submitReview(vendorId: string, payload: ReviewSubmission): Promise<Review> {
  if (usingMocks) {
    await wait();
    const review: Review = {
      id: `rev-${Date.now()}`,
      vendorId,
      buyerName: "You",
      rating: payload.rating,
      comment: payload.comment,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    return review;
  }
  const { apiClient } = await import("./client");
  return apiClient<Review>(`/v1/vendors/${vendorId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSupplierFilterOptions(): Promise<typeof filterOptions> {
  if (usingMocks) {
    await wait();
    return filterOptions;
  }
  const { apiClient } = await import("./client");
  return apiClient<typeof filterOptions>("/v1/suppliers/filter-options");
}
