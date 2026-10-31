export interface Product {
  id: string;
  name: string;
  slug: string;
  riplCode: string;
  brand: string;
  category: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  currency: string;
  taxInclusive: boolean;
  stockQuantity: number;
  availability: string;
  images: string[];
  thumbnailImage: string;
  description: string;
  specifications: Record<string, string>;
  brochures: Array<{ language: string; url: string; name: string }>;
  videos: Array<{ title: string; videoUrl: string }>;
  accessories: Array<{ name: string; included: boolean }>;
  spareParts: Array<{ name: string; partNo: string }>;
  sourceUrl?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  sourceUrl?: string;
  imageUrl: string;
  date: string;
  author: string;
  category: string;
  content: string;
}

export interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface EnquiryPayload {
  name: string;
  mobile: string;
  email?: string;
  whatsappNo?: string;
  feedbackType?: string;
  contactType?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  pincode?: string;
  landSize?: string;
  cropName?: string;
  quantity?: number;
  message?: string;
  productId?: string;
  productName?: string;
}
