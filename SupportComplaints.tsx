/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vendor, PCPart, Complaint, SupportDonation } from './types';

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vendor_1',
    name: 'Al-Nabaa Computer Technology',
    nameAr: 'مكتب النبأ لتكنولوجيا الكمبيوتر',
    phone: '+964 770 123 4567',
    address: 'شارع الصناعة - مقابل الجامعة التكنولوجية',
    province: 'بغداد (Baghdad)',
    verified: true,
    logoUrl: 'AN',
    bio: 'أكبر مركز متخصص في استيراد وتوزيع قطع الكمبيوتر الأصلية من كبرى الشركات العالمية مثل ASUS, MSI, Gigabyte.',
    idCardPhotoUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
    ratings: [
      {
        id: 'r1',
        raterName: 'سجاد ماهر',
        ratingValue: 5,
        comment: 'أسعار مناسبة جداً وضمان حقيقي، تعامل راقي وسرعة بالرد.',
        date: '2026-05-10'
      },
      {
        id: 'r2',
        raterName: 'أحمد الجبوري',
        ratingValue: 4,
        comment: 'المكتب ممتاز جداً والمواد دائماً أصلية لكن التوصيل يتأخر لليوم التالي.',
        date: '2026-05-18'
      }
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'vendor_2',
    name: 'Vanish Hardware',
    nameAr: 'فانيش هاردوير للألعاب السريعة',
    phone: '+964 750 987 6543',
    address: 'عينكاوة - شارع الألعاب الرئيسي',
    province: 'أربيل (Erbil)',
    verified: true,
    logoUrl: 'VH',
    bio: 'The premium PC store for extreme gaming rigs and water cooling components in Erbil and Northern Iraq.',
    idCardPhotoUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
    ratings: [
      {
        id: 'r3',
        raterName: 'كاروان هوليري',
        ratingValue: 5,
        comment: 'باشترين شوين بو كرينى كومبيوته ر، هه موو شتيك ئوريجيناله',
        date: '2026-04-22'
      }
    ],
    createdAt: '2026-02-10'
  },
  {
    id: 'vendor_3',
    name: 'Aura Gaming Iraq',
    nameAr: 'أورا جيمنج البصرة',
    phone: '+964 781 444 8888',
    address: 'شارع العباسية - قرب بناية مصرف الرافدين',
    province: 'البصرة (Basra)',
    verified: true,
    logoUrl: 'AG',
    bio: 'الوكيل الأول لقطع التبريد المائي الاحترافي وكيسات الكمبيوتر الفاخرة في جنوب العراق.',
    ratings: [
      {
        id: 'r4',
        raterName: 'مصطفى البصراوي',
        ratingValue: 3,
        comment: 'المحل جيد بس ساعات الأسعار تكون أغلى من بغداد، لكن خدمة الصيانة عدهم ممتازة.',
        date: '2026-05-02'
      }
    ],
    createdAt: '2026-03-01'
  },
  {
    id: 'vendor_4',
    name: 'Sinaa Street Tech Union',
    nameAr: 'تجمع الصناعة التقني',
    phone: '+964 790 333 5555',
    address: 'شارع الصناعة - مجمع النعمان التجاري',
    province: 'بغداد (Baghdad)',
    verified: false, // Pending Review by default to demonstrate admin action!
    logoUrl: 'TU',
    bio: 'تجمع لأبرز مهندسي الصيانة وبيع التجميعات الاحترافية بأسعار منافسة تناسب الطلاب والمصممين.',
    idCardPhotoUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
    ratings: [],
    createdAt: '2026-05-20'
  }
];

export const INITIAL_PARTS: PCPart[] = [
  {
    id: 'part_1',
    name: 'Intel Core i9-14900K Processor',
    brand: 'Intel',
    category: 'CPU',
    specs: {
      'Cores / Threads': '24 Cores / 32 Threads',
      'Base Clock': '3.2 GHz',
      'Boost Clock': '6.0 GHz',
      'Socket': 'LGA1700',
      'TDP': '125W',
      'Cache': '36 MB Intel Smart Cache'
    },
    imageGradient: 'from-blue-600 to-indigo-900',
    listings: [
      { vendorId: 'vendor_1', priceIQD: 835000, isAvailable: true, warrantyMonths: 12, url: 'https://example.com/item1' },
      { vendorId: 'vendor_2', priceIQD: 850000, isAvailable: true, warrantyMonths: 24, url: 'https://example.com/item2' },
      { vendorId: 'vendor_3', priceIQD: 865000, isAvailable: false, warrantyMonths: 12, url: 'https://example.com/item3' }
    ],
    createdAt: '2026-01-20'
  },
  {
    id: 'part_2',
    name: 'AMD Ryzen 7 7800X3D CPU',
    brand: 'AMD',
    category: 'CPU',
    specs: {
      'Cores / Threads': '8 Cores / 16 Threads',
      'Base Clock': '4.2 GHz',
      'Boost Clock': '5.0 GHz',
      'Socket': 'AM5',
      'TDP': '120W',
      'Cache': '104 MB (3D V-Cache)'
    },
    imageGradient: 'from-orange-600 to-red-800',
    listings: [
      { vendorId: 'vendor_1', priceIQD: 590000, isAvailable: true, warrantyMonths: 12 },
      { vendorId: 'vendor_2', priceIQD: 575000, isAvailable: true, warrantyMonths: 24 }
    ],
    createdAt: '2026-02-15'
  },
  {
    id: 'part_3',
    name: 'NVIDIA GeForce RTX 4090 24GB GDDR6X',
    brand: 'NVIDIA',
    category: 'GPU',
    specs: {
      'Memory': '24 GB GDDR6X',
      'Max CUDA Cores': '16384',
      'Interface': 'PCIe 4.0 x16',
      'Recommended PSU': '850W+',
      'Power Connector': '1x 16-pin (12VHPWR)'
    },
    imageGradient: 'from-green-600 to-emerald-950',
    listings: [
      { vendorId: 'vendor_1', priceIQD: 2950000, isAvailable: true, warrantyMonths: 12 },
      { vendorId: 'vendor_2', priceIQD: 2990000, isAvailable: true, warrantyMonths: 36 },
      { vendorId: 'vendor_3', priceIQD: 3100000, isAvailable: true, warrantyMonths: 12 }
    ],
    createdAt: '2026-01-22'
  },
  {
    id: 'part_4',
    name: 'ASUS ROG Strix Z790-F Gaming WiFi II',
    brand: 'ASUS',
    category: 'Motherboard',
    specs: {
      'Chipset': 'Intel Z790',
      'Memory Support': 'DDR5 (Up to 8000+ MHz)',
      'Form Factor': 'ATX',
      'M.2 Slots': '5x PCIe M.2 Slots',
      'Built-in WiFi': 'WiFi 7 + Bluetooth 5.4'
    },
    imageGradient: 'from-purple-800 to-indigo-950',
    listings: [
      { vendorId: 'vendor_1', priceIQD: 510000, isAvailable: true, warrantyMonths: 12 },
      { vendorId: 'vendor_2', priceIQD: 525000, isAvailable: true, warrantyMonths: 24 }
    ],
    createdAt: '2026-03-10'
  },
  {
    id: 'part_5',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL30',
    brand: 'Corsair',
    category: 'RAM',
    specs: {
      'Capacity': '32 GB (2 x 16 GB)',
      'Speed': '6000 MHz',
      'Latency': 'CL30 (30-36-36-76)',
      'Voltage': '1.4V',
      'Profile': 'Intel XMP / AMD EXPO Dual-mode'
    },
    imageGradient: 'from-pink-600 to-purple-900',
    listings: [
      { vendorId: 'vendor_1', priceIQD: 185000, isAvailable: true, warrantyMonths: 12 },
      { vendorId: 'vendor_3', priceIQD: 195000, isAvailable: true, warrantyMonths: 12 }
    ],
    createdAt: '2026-02-18'
  },
  {
    id: 'part_6',
    name: 'Samsung 995 PRO 2TB NVMe SSD PCIe 5.0',
    brand: 'Samsung',
    category: 'Storage',
    specs: {
      'Capacity': '2 TB',
      'Sequential Read': 'Up to 14,000 MB/s',
      'Sequential Write': 'Up to 12,000 MB/s',
      'Interface': 'PCIe Gen 5.0 x4',
      'Heatsink': 'Pre-installed custom aluminum shield'
    },
    imageGradient: 'from-slate-700 to-slate-900',
    listings: [
      { vendorId: 'vendor_1', priceIQD: 320000, isAvailable: true, warrantyMonths: 12 },
      { vendorId: 'vendor_2', priceIQD: 340000, isAvailable: true, warrantyMonths: 60 }
    ],
    createdAt: '2026-04-05'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp_1',
    fullName: 'يوسف العبادي',
    contactInfo: '0771239999 / yasser@example.com',
    vendorId: 'vendor_1',
    subject: 'خصم غير معلن وتأخر في الضمان',
    message: 'قمت بشراء معالج آي 9 وتلف بعد أسبوعين وعلمت أن الضمان من مكتب النبأ يستغرق شهراً كاملاً خلافاً لما هو معروض في المنصة وهو 12 شهراً فوري.',
    status: 'pending',
    createdAt: '2026-05-24'
  }
];

export const INITIAL_DONATIONS: SupportDonation[] = [
  {
    id: 'don_1',
    donorName: 'سجاد الخفاجي',
    amountIQD: 100000,
    paymentMethod: 'ZainCash',
    transferReference: 'TXN88910248231',
    message: 'كل الدعم لمنصة STEEL PLATFORM الرائعة التي سهلت حياتنا كعشاق الحاسوب بالعراق وجعلتنا نشتري بأفضل سعر!',
    createdAt: '2026-05-25'
  }
];

export const IRAQI_PROVINCES = [
  'بغداد (Baghdad)',
  'البصرة (Basra)',
  'نينوى (Nineveh)',
  'أربيل (Erbil)',
  'السليمانية (Sulaymaniyah)',
  'بابل (Babylon)',
  'النجف (Najaf)',
  'كربلاء (Karbala)',
  'كركوك (Kirkuk)',
  'الأنبار (Anbar)',
  'ذي قار (Dhi Qar)',
  'ميسان (Maysan)',
  'المثنى (Al-Muthanna)',
  'القادسية (Al-Qadisiyah)',
  'واسط (Wasit)',
  'ديالى (Diyala)',
  'صلاح الدين (Salah al-Din)',
  'دهوك (Duhok)'
];
