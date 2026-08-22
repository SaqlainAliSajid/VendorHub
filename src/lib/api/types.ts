export type ApiEnvelope<T> = { data: T; message?: string };
export type Supplier = { id: string; name: string; location: string; category: string; matchScore: number; rating: number; reviewCount: number; leadTime: string; minimumOrder: string; verified: boolean; tags: string[]; };
export type DashboardOrderStatus = "in_production" | "shipped" | "delivered" | "awaiting_payment";

export type DashboardOrder = {
	id: string;
	vendorId: string;
	vendorName: string;
	status: DashboardOrderStatus;
	total: string;
	eta: string;
};

export type DashboardSummary = {
	activeRfqs: number;
	rfqChange: string;
	pendingQuotes: number;
	spendingYtd: string;
	recommendations: Supplier[];
	savedVendors: Supplier[];
	orders: DashboardOrder[];
	recentSearches: string[];
};

export type AuthPayload = { email: string; password: string; remember: boolean };
export type AuthResponse = { accessToken: string; user: { id: string; name: string; role: "buyer" | "vendor" | "admin" } };

export type AuthProvider = "google" | "microsoft" | "linkedin";

export type SignUpPayload = {
	companyName: string;
	email: string;
	password: string;
	confirmPassword: string;
	acceptedTerms: boolean;
};

export type PasswordResetPayload = {
	email: string;
};

export type VerificationCodePayload = {
	email: string;
	code: string;
};

export type AuthStep = "authenticated" | "verify_2fa";

export type SignInResult = AuthResponse & {
	nextStep?: AuthStep;
};

export type SearchFilters = {
	country?: string;
	industry?: string;
	moqMin?: number;
	moqMax?: number;
	priceMin?: number;
	priceMax?: number;
	certifications?: string[];
	leadTime?: string;
};

export type VendorProfile = {
	id: string;
	name: string;
	verified: boolean;
	rating: number;
	reviewCount: number;
	location: string;
	category: string;
	tags: string[];
	description: string;
	foundedYear: number;
	employeeRange: string;
	certifications: string[];
	gallery: {
		type: "image" | "video";
		url: string;
	}[];
};

export type CatalogProduct = {
	id: string;
	vendorId: string;
	vendorName: string;
	name: string;
	category: string;
	priceRange: string;
	moq: string;
	specs: string[];
};

export type Review = {
	id: string;
	vendorId: string;
	buyerName: string;
	rating: number;
	comment: string;
	createdAt: string;
};

export type ReviewSubmission = {
	rating: number;
	comment: string;
};
