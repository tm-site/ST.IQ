/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 'CPU' | 'GPU' | 'Motherboard' | 'RAM' | 'Storage' | 'Power Supply' | 'Case' | 'Cooling' | 'Peripherals' | 'Monitor';

export interface Rating {
  id: string;
  raterName: string;
  ratingValue: number; // 1-5 stars
  comment: string;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  address: string;
  province: string;
  verified: boolean;
  logoUrl?: string;
  bio?: string;
  idCardPhotoUrl?: string; // Base64 mock or mock url
  ratings: Rating[];
  createdAt: string;
}

export interface VendorListing {
  vendorId: string;
  priceIQD: number;
  isAvailable: boolean;
  warrantyMonths: number;
  url?: string;
}

export interface PCPart {
  id: string;
  name: string;
  brand: string;
  category: CategoryType;
  specs: { [key: string]: string };
  imageGradient: string; // Tailwind gradient colors for visual placeholder
  listings: VendorListing[];
  createdAt: string;
}

export interface VendorApplication {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  province: string;
  address: string;
  idCardPhoto: string; // image placeholder/mock base64
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Complaint {
  id: string;
  fullName: string;
  contactInfo: string;
  vendorId?: string; // Optional related vendor
  subject: string;
  message: string;
  status: 'pending' | 'investigating' | 'resolved';
  createdAt: string;
}

export interface SupportDonation {
  id: string;
  donorName: string;
  amountIQD: number;
  paymentMethod: 'ZainCash' | 'AsiaPay' | 'QiCard' | 'FastPay' | 'CashOnDelivery';
  transferReference: string;
  message?: string;
  createdAt: string;
}

export interface AppConfig {
  listingFeeIQD: number;
}
