/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Heart, CheckCircle, Flame, Plus, Settings, Users, ArrowUpDown, Coins, UserCheck, HelpCircle, X } from 'lucide-react';
import { Vendor, PCPart, VendorApplication, Complaint, SupportDonation, Rating, VendorListing } from './types';
import { INITIAL_VENDORS, INITIAL_PARTS, INITIAL_COMPLAINTS, INITIAL_DONATIONS } from './mockData';
import DisclaimerModal from './components/DisclaimerModal';
import PartsAggregator from './components/PartsAggregator';
import VendorRegister from './components/VendorRegister';
import VendorProductManager from './components/VendorProductManager';
import SupportComplaints from './components/SupportComplaints';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // ---- STATE DECLARATION (with LocalStorage Sync) ----
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [parts, setParts] = useState<PCPart[]>([]);
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [donations, setDonations] = useState<SupportDonation[]>([]);
  const [listingFee, setListingFee] = useState<number>(15000); // strictly set to 15,000 IQD default

  // Navigation & Interactive views state
  const [activeTab, setActiveTab] = useState<'buyer' | 'register_vendor' | 'manage_products'>('buyer');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportInitialTab, setSupportInitialTab] = useState<'support' | 'complaints'>('support');

  // Load initial states
  useEffect(() => {
    const savedVendors = localStorage.getItem('steel_vendors');
    const savedParts = localStorage.getItem('steel_parts');
    const savedApps = localStorage.getItem('steel_apps');
    const savedComplaints = localStorage.getItem('steel_complaints');
    const savedDonations = localStorage.getItem('steel_donations');
    const savedFee = localStorage.getItem('steel_listing_fee');

    if (savedVendors) setVendors(JSON.parse(savedVendors));
    else setVendors(INITIAL_VENDORS);

    if (savedParts) setParts(JSON.parse(savedParts));
    else setParts(INITIAL_PARTS);

    if (savedApps) setApplications(JSON.parse(savedApps));
    else setApplications([]);

    if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
    else setComplaints(INITIAL_COMPLAINTS);

    if (savedDonations) setDonations(JSON.parse(savedDonations));
    else setDonations(INITIAL_DONATIONS);

    if (savedFee) setListingFee(parseFloat(savedFee));
  }, []);

  // Save states helper
  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // ---- APP MUTATIONS ----
  const handleAddApplication = (newApp: VendorApplication) => {
    const updated = [newApp, ...applications];
    setApplications(updated);
    saveToLocal('steel_apps', updated);
  };

  const handleAddComplaint = (newComp: Complaint) => {
    const updated = [newComp, ...complaints];
    setComplaints(updated);
    saveToLocal('steel_complaints', updated);
  };

  const handleAddDonation = (newDon: SupportDonation) => {
    const updated = [newDon, ...donations];
    setDonations(updated);
    saveToLocal('steel_donations', updated);
  };

  const handleUpdateListingFee = (fee: number) => {
    setListingFee(fee);
    localStorage.setItem('steel_listing_fee', fee.toString());
  };

  // Admin approvals
  const handleApproveApplication = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    // 1. Move app status to approved
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status: 'approved' as const } : a);
    setApplications(updatedApps);
    saveToLocal('steel_apps', updatedApps);

    // 2. Add approved applicant, verified as Vendor
    const newVendor: Vendor = {
      id: `vendor_${Date.now()}`,
      name: app.businessName,
      nameAr: app.businessName,
      phone: app.phone,
      address: app.address,
      province: app.province,
      verified: true,
      logoUrl: app.businessName.substring(0, 2).toUpperCase(),
      bio: `مكتب معتمد مسجل عبر البوابة الإدارية لمقر المحافظة: ${app.province}`,
      idCardPhotoUrl: app.idCardPhoto,
      ratings: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedVendors = [...vendors, newVendor];
    setVendors(updatedVendors);
    saveToLocal('steel_vendors', updatedVendors);
  };

  const handleRejectApplication = (appId: string) => {
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status: 'rejected' as const } : a);
    setApplications(updatedApps);
    saveToLocal('steel_apps', updatedApps);
  };

  const handleResolveComplaint = (complaintId: string, status: 'pending' | 'investigating' | 'resolved') => {
    const updatedComplaints = complaints.map(c => c.id === complaintId ? { ...c, status } : c);
    setComplaints(updatedComplaints);
    saveToLocal('steel_complaints', updatedComplaints);
  };

  // Vendor lists updating
  const handleAddListing = (partId: string, newListing: VendorListing) => {
    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        return {
          ...part,
          listings: [...part.listings, newListing]
        };
      }
      return part;
    });
    setParts(updatedParts);
    saveToLocal('steel_parts', updatedParts);
  };

  const handleAddNewPartAndListing = (newPart: PCPart) => {
    const updatedParts = [newPart, ...parts];
    setParts(updatedParts);
    saveToLocal('steel_parts', updatedParts);
  };

  const handleUpdateListing = (partId: string, vendorId: string, updatedFields: Partial<VendorListing>) => {
    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        return {
          ...part,
          listings: part.listings.map((l) =>
            l.vendorId === vendorId ? { ...l, ...updatedFields } : l
          ),
        };
      }
      return part;
    });
    setParts(updatedParts);
    saveToLocal('steel_parts', updatedParts);
  };

  const handleRemoveListing = (partId: string, vendorId: string) => {
    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        return {
          ...part,
          listings: part.listings.filter((l) => l.vendorId !== vendorId),
        };
      }
      return part;
    });
    setParts(updatedParts);
    saveToLocal('steel_parts', updatedParts);
  };

  const handleDeletePart = (partId: string) => {
    const updatedParts = parts.filter((part) => part.id !== partId);
    setParts(updatedParts);
    saveToLocal('steel_parts', updatedParts);
  };

  const handleUpdatePart = (partId: string, updatedDetails: Partial<PCPart>) => {
    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        return {
          ...part,
          ...updatedDetails,
        };
      }
      return part;
    });
    setParts(updatedParts);
    saveToLocal('steel_parts', updatedParts);
  };

  // Submit buyer rating feedback for vendor
  const handleAddRating = (vendorId: string, newRating: Rating) => {
    const updatedVendors = vendors.map((v) => {
      if (v.id === vendorId) {
        const revisedRatings = [newRating, ...(v.ratings || [])];
        return {
          ...v,
          ratings: revisedRatings
        };
      }
      return v;
    });
    setVendors(updatedVendors);
    saveToLocal('steel_vendors', updatedVendors);
  };

  // Compute stats for Admin Panel
  const totalListingsCount = parts.reduce((sum, part) => sum + part.listings.length, 0);

  // Open Support or Complaints Modal
  const handleOpenSupport = (tab: 'support' | 'complaints') => {
    setSupportInitialTab(tab);
    setIsSupportOpen(true);
  };

  return (
    <div className="bg-[#0f1115] min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Obligatory introductory regulatory notice */}
      <DisclaimerModal onAccept={() => {}} />

      {/* TOP DECORATIVE BANNER */}
      <div className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 py-1.5 px-4 text-black font-sans text-center text-xs font-black shadow-inner flex items-center justify-center gap-2">
        <span className="animate-pulse text-xs">●</span>
        <span>مقارنة وتحليل الأسعار بالدينار العراقي (IQD) لمنع الاحتكار وتعزيز شفافية قطع الهاردوير</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">STEEL PLATFORM - IRAQI FIRST PC HUB</span>
      </div>

      {/* PRIMARY HEADER NAVBAR */}
      <header className="border-b border-white/10 bg-[#16191f]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Quick Support & Complaints clear buttons in header */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenSupport('support')}
              className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500/35" />
              <span>دعم المنصة</span>
            </button>
            <button
              onClick={() => handleOpenSupport('complaints')}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/20 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>تقديم شكوى</span>
            </button>
          </div>

          {/* Central responsive navigation tabs */}
          <nav className="hidden md:flex bg-[#0c0e12] p-1 rounded-xl border border-white/5" dir="rtl">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-2 px-5 rounded-lg text-xs font-black transition-all ${
                activeTab === 'buyer'
                  ? 'bg-cyan-650 text-white shadow-md bg-cyan-600'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              مقارنة الأسعار الذكية
            </button>

            <button
              onClick={() => setActiveTab('register_vendor')}
              className={`py-2 px-5 rounded-lg text-xs font-black transition-all ${
                activeTab === 'register_vendor'
                  ? 'bg-cyan-650 text-white shadow-md bg-cyan-600'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تسجيل بائع / مكتب جديد (عربي)
            </button>

            <button
              onClick={() => setActiveTab('manage_products')}
              className={`py-2 px-5 rounded-lg text-xs font-black transition-all ${
                activeTab === 'manage_products'
                  ? 'bg-cyan-650 text-white shadow-md bg-cyan-600'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              لوحة إدراج وتعديل الأسعار
            </button>
          </nav>

          {/* Branded Title Logo */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h1 className="text-xl font-black text-white tracking-tight leading-none font-sans italic">
                STEEL<span className="text-cyan-500 font-sans tracking-tight leading-none text-xl font-black not-italic">PLATFORM</span>
              </h1>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5 block font-mono">
                منصة ستيل للعتاد
              </span>
            </div>
            <div className="w-10 h-10 bg-cyan-550 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/10 border border-cyan-400 bg-cyan-500">
              <Cpu className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
          </div>

        </div>
      </header>

      {/* MOBILE NAV STRIP */}
      <div className="md:hidden bg-[#16191f] border-b border-white/10 p-2 flex gap-1 items-center justify-around" dir="rtl">
        <button
          onClick={() => setActiveTab('buyer')}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
            activeTab === 'buyer' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          مقارنة الأسعار
        </button>
        <button
          onClick={() => setActiveTab('register_vendor')}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
            activeTab === 'register_vendor' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          تسجيل بائع جديد
        </button>
        <button
          onClick={() => setActiveTab('manage_products')}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center ${
            activeTab === 'manage_products' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          لوحة الأسعار
        </button>
      </div>

      {/* CORE BODY HERO GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* PLATFORM HEADER MOTTO (Shown only on catalog home) */}
        {activeTab === 'buyer' && (
          <div className="bg-[#1e222b] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="text-center sm:text-right" dir="rtl">
              <div className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-bold mb-3">
                <Flame className="w-3.5 h-3.5 fill-cyan-500/25 text-cyan-500" />
                <span>أكبر حلقة وصل مرنة لشراء هاردوير الألعاب وصناعة المحتوى</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-sans">
                وداعاً للدوران المجهد بين مكاتب الحواسيب!
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-2xl">
                نحن مجمّع ومقارن أسعار مفتوح للألعاب وقطع الهاردوير في العراق. يمكنك مراجعة الأسعار الصادرة عن البائعين والمكاتب المعتمدة في بغداد وباقي المحافظات، ومقارنة الضمان والتوفر لمضاعفة توفيرك المالي.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-[#0c0e12] border border-cyan-500/20 p-4 rounded-xl">
              <Coins className="w-10 h-10 text-cyan-400 shrink-0" />
              <div className="text-right" dir="rtl">
                <span className="text-[10px] text-slate-500 block leading-none">ميزانية رسوم الإدراج:</span>
                <span className="text-base font-bold text-white font-sans block mt-1">{listingFee.toLocaleString('ar-IQ')} د.ع</span>
                <span className="text-[9px] text-slate-400">قيمة رمزية لحسابات النشر</span>
              </div>
            </div>
          </div>
        )}

        {/* DETAILED VIEWS */}
        <div>
          {activeTab === 'buyer' && (
            <PartsAggregator 
              parts={parts} 
              vendors={vendors} 
              onAddRating={handleAddRating} 
            />
          )}

          {activeTab === 'register_vendor' && (
            <div className="max-w-3xl mx-auto">
              <VendorRegister onAddApplication={handleAddApplication} />
            </div>
          )}

          {activeTab === 'manage_products' && (
            <VendorProductManager
              vendors={vendors}
              parts={parts}
              onAddListing={handleAddListing}
              onAddNewPartAndListing={handleAddNewPartAndListing}
              listingFee={listingFee}
              onUpdateListing={handleUpdateListing}
              onRemoveListing={handleRemoveListing}
              onDeletePart={handleDeletePart}
              onUpdatePart={handleUpdatePart}
            />
          )}
        </div>

      </main>

      {/* SUPPORT & COMPLAINTS MODAL OVERLAY */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-4xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <SupportComplaints 
              vendors={vendors} 
              onAddComplaint={handleAddComplaint} 
              onAddDonation={handleAddDonation} 
              initialTab={supportInitialTab}
              onClose={() => setIsSupportOpen(false)}
            />
          </div>
        </div>
      )}

      {/* CORE FOOTER SECTION */}
      <footer className="border-t border-white/5 bg-[#0c0e12] py-8 px-4 mt-20 text-center text-slate-500 text-xs text-right">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4" dir="rtl">
          <div>
            <span className="font-bold text-slate-300 block uppercase italic tracking-wider">STEEL PLATFORM - IQ HARDWARE AGGREGATOR © 2026</span>
            <span className="text-[10px] text-slate-500 mt-1 block">الحق التنظيمي لمقارنة الأسعار وسرية وثائق البائعين مكفولة بالمنصة ومحمية بسلطة الكلمات الحرة.</span>
          </div>

          {/* ACCESSIBLE STEALTH ADMINISTRATOR ACCESS: 000000 */}
          <div>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3.5 py-1.5 bg-[#1e222b] hover:bg-[#16191f] border border-white/10 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-inner"
              id="stealth-admin-gate"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-500" />
              <span>بوابة الإشراف والتحكم المشفرة (Admin Portal)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ACTIVE ADMIN DRAWER CONTROL (Locked via Passcode verification 000000 inside component) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        vendors={vendors}
        applications={applications}
        complaints={complaints}
        donations={donations}
        listingFee={listingFee}
        onUpdateListingFee={handleUpdateListingFee}
        onApproveApplication={handleApproveApplication}
        onRejectApplication={handleRejectApplication}
        onResolveComplaint={handleResolveComplaint}
        listingsCount={totalListingsCount}
      />

    </div>
  );
}
