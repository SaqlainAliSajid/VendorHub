import type { CatalogProduct, DashboardSummary, Review, Supplier, VendorProfile } from "./types";

export const suppliers: Supplier[] = [
  { id: "apex", name: "Apex Textiles International", location: "Faisalabad, Pakistan", category: "Industrial Textiles", matchScore: 98, rating: 4.9, reviewCount: 124, leadTime: "14–21 days", minimumOrder: "500 units", verified: true, tags: ["ISO 9001", "OEKO-TEX", "Trade Assured"] },
  { id: "lahore-garments", name: "Lahore Garments Ltd.", location: "Lahore, Pakistan", category: "Apparel Manufacturing", matchScore: 94, rating: 4.8, reviewCount: 87, leadTime: "21–28 days", minimumOrder: "1,000 units", verified: true, tags: ["BSCI", "WRAP", "Custom Labels"] },
  { id: "crescent", name: "Crescent Knits", location: "Karachi, Pakistan", category: "Knitwear & Fabrics", matchScore: 91, rating: 4.7, reviewCount: 65, leadTime: "18–25 days", minimumOrder: "800 units", verified: true, tags: ["GOTS", "Organic Cotton"] },
  { id: "nishat", name: "Nishat Mills Exco", location: "Faisalabad, Pakistan", category: "Home Textiles", matchScore: 89, rating: 4.6, reviewCount: 142, leadTime: "28–35 days", minimumOrder: "1,500 units", verified: true, tags: ["ISO 14001", "Sedex"] },
];

export const dashboardSummary: DashboardSummary = { activeRfqs: 12, rfqChange: "+2 this week", pendingQuotes: 8, spendingYtd: "$1.4M", recommendations: suppliers.slice(0, 3), savedVendors: [
  { ...suppliers[0], name: "Apex Manufacturing Group", category: "Precision Machining", location: "USA", tags: ["ISO 9001", "ITAR"] },
  { ...suppliers[1], name: "Stellar Materials LLC", category: "Raw Alloys", location: "Canada", tags: ["AS9100"] },
  { ...suppliers[2], name: "Quantum Electronics", category: "Semiconductors", location: "Taiwan", tags: ["ISO 14001"] },
  { ...suppliers[3], name: "Nexus Freight Connect", category: "Global Logistics", location: "Germany", tags: ["C-TPAT"] },
],
  orders: [
    { id: "PO-24017", vendorId: "apex", vendorName: "Apex Textiles International", status: "in_production", total: "$48,200", eta: "2026-09-03" },
    { id: "PO-23990", vendorId: "crescent", vendorName: "Crescent Knits", status: "shipped", total: "$22,600", eta: "2026-08-27" },
    { id: "PO-23911", vendorId: "nishat", vendorName: "Nishat Mills Exco", status: "delivered", total: "$71,340", eta: "Delivered 2026-08-16" },
    { id: "PO-23888", vendorId: "lahore-garments", vendorName: "Lahore Garments Ltd.", status: "awaiting_payment", total: "$13,900", eta: "Due 2026-08-25" },
  ],
  recentSearches: ["industrial textiles pakistan", "gots certified knitwear", "bulk uniform suppliers", "oe ko tex home fabrics"],
};

export const catalogProducts: CatalogProduct[] = [
  { id: "cat-1", vendorId: "apex", vendorName: "Apex Textiles International", name: "Heavy-Duty Woven Poly Canvas", category: "Industrial Textiles", priceRange: "$3.90 - $5.10 / m", moq: "500 m", specs: ["ISO 9001", "UV Resistant", "Custom GSM"] },
  { id: "cat-2", vendorId: "lahore-garments", vendorName: "Lahore Garments Ltd.", name: "Workwear Twill Fabric", category: "Apparel Manufacturing", priceRange: "$2.40 - $3.70 / m", moq: "1,000 m", specs: ["WRAP", "BSCI", "Colorfast"] },
  { id: "cat-3", vendorId: "crescent", vendorName: "Crescent Knits", name: "Organic Cotton Rib Knit", category: "Knitwear & Fabrics", priceRange: "$4.20 - $6.40 / kg", moq: "800 kg", specs: ["GOTS", "Organic", "Soft Finish"] },
  { id: "cat-4", vendorId: "nishat", vendorName: "Nishat Mills Exco", name: "Home Linen Blend Set", category: "Home Textiles", priceRange: "$7.90 - $11.20 / set", moq: "1,500 sets", specs: ["Sedex", "ISO 14001", "Reactive Dye"] },
];

export const vendorProfiles: VendorProfile[] = [
  {
    id: "apex",
    name: "Apex Textiles International",
    verified: true,
    rating: 4.9,
    reviewCount: 124,
    location: "Faisalabad, Pakistan",
    category: "Industrial Textiles",
    tags: ["Export Ready", "Private Label", "Trade Assured"],
    description: "Apex Textiles International specializes in large-batch industrial and technical fabrics for global procurement teams. The company supports custom compliance workflows and recurring PO programs.",
    foundedYear: 2008,
    employeeRange: "500-1,000",
    certifications: ["ISO 9001", "OEKO-TEX", "GOTS"],
    gallery: [
      { type: "image", url: "factory-floor-1" },
      { type: "image", url: "fabric-line-2" },
      { type: "video", url: "overview-tour" },
    ],
  },
  {
    id: "lahore-garments",
    name: "Lahore Garments Ltd.",
    verified: true,
    rating: 4.8,
    reviewCount: 87,
    location: "Lahore, Pakistan",
    category: "Apparel Manufacturing",
    tags: ["Full Package", "Fast Sampling", "Custom Labels"],
    description: "Lahore Garments provides end-to-end garment production for private labels and enterprise buyers. Typical engagement includes sample-to-scale production with QA checkpoints.",
    foundedYear: 2011,
    employeeRange: "1,000-2,500",
    certifications: ["BSCI", "WRAP", "Sedex"],
    gallery: [
      { type: "image", url: "sewing-line" },
      { type: "image", url: "qa-station" },
      { type: "video", url: "shipment-process" },
    ],
  },
];

export const reviewsByVendor: Record<string, Review[]> = {
  apex: [
    { id: "rev-1", vendorId: "apex", buyerName: "Northstar Procurement", rating: 5, comment: "Consistent quality and clear milestone reporting.", createdAt: "2026-08-12" },
    { id: "rev-2", vendorId: "apex", buyerName: "Atlas Buying Team", rating: 4, comment: "Reliable lead times, though peak season booking is tight.", createdAt: "2026-07-29" },
  ],
  "lahore-garments": [
    { id: "rev-3", vendorId: "lahore-garments", buyerName: "Elm Procurement", rating: 5, comment: "Great communication and quick sample iterations.", createdAt: "2026-08-03" },
  ],
};

export const filterOptions = {
  countries: ["Pakistan", "USA", "Canada", "Taiwan", "Germany"],
  industries: ["Industrial Textiles", "Apparel Manufacturing", "Knitwear & Fabrics", "Home Textiles", "Precision Machining"],
  leadTimes: ["Under 2 weeks", "2-4 weeks", "4+ weeks"],
  certifications: ["ISO 9001", "OEKO-TEX", "GOTS", "BSCI", "WRAP", "Sedex", "ISO 14001", "AS9100", "ITAR"],
};
