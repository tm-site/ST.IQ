/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PackageOpen, 
  Coins, 
  CircleCheck, 
  AlertTriangle, 
  Plus, 
  Tag, 
  HelpCircle, 
  HardDrive, 
  Shield, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Lock, 
  Unlock,
  Settings
} from 'lucide-react';
import { Vendor, PCPart, CategoryType, VendorListing } from '../types';

interface VendorProductManagerProps {
  vendors: Vendor[];
  parts: PCPart[];
  onAddListing: (partId: string, listing: VendorListing) => void;
  onAddNewPartAndListing: (newPart: PCPart) => void;
  listingFee: number;
  onUpdateListing?: (partId: string, vendorId: string, updatedFields: Partial<VendorListing>) => void;
  onRemoveListing?: (partId: string, vendorId: string) => void;
  onDeletePart?: (partId: string) => void;
  onUpdatePart?: (partId: string, updatedDetails: Partial<PCPart>) => void;
}

export default function VendorProductManager({
  vendors,
  parts,
  onAddListing,
  onAddNewPartAndListing,
  listingFee,
  onUpdateListing,
  onRemoveListing,
  onDeletePart,
  onUpdatePart,
}: VendorProductManagerProps) {
  // Simulator Login
  const verifiedVendors = vendors.filter((v) => v.verified);
  const [activeVendorId, setActiveVendorId] = useState(verifiedVendors[0]?.id || '');

  // Role Control States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  // Choose Flow: Update existing or add entirely new part
  const [managerFlow, setManagerFlow] = useState<'existing' | 'new'>('existing');

  // Form states for existing part listing
  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.id || '');
  const [priceIQD, setPriceIQD] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [warrantyMonths, setWarrantyMonths] = useState(12);

  // Form states for adding a completely new part (Admin-Only)
  const [newPartName, setNewPartName] = useState('');
  const [newPartBrand, setNewPartBrand] = useState('');
  const [newPartCategory, setNewPartCategory] = useState<CategoryType>('CPU');
  const [newPartSpecs, setNewPartSpecs] = useState(''); // Textarea of format Key:Value
  const [gradientChoice, setGradientChoice] = useState('from-indigo-600 to-indigo-950');

  // Listing Editing state for Vendors
  const [editingListing, setEditingListing] = useState<{
    partId: string;
    priceIQD: string;
    isAvailable: boolean;
    warrantyMonths: number;
  } | null>(null);

  // Part Editing state for Admins
  const [editingPart, setEditingPart] = useState<PCPart | null>(null);
  const [editPartName, setEditPartName] = useState('');
  const [editPartBrand, setEditPartBrand] = useState('');
  const [editPartCategory, setEditPartCategory] = useState<CategoryType>('CPU');
  const [editPartSpecs, setEditPartSpecs] = useState('');
  const [editPartGradient, setEditPartGradient] = useState('');

  // Unified Success/Error notification states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activeVendor = vendors.find((v) => v.id === activeVendorId);

  // Admin Code Validation
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === '002006') {
      setIsAdminVerified(true);
      setPasscodeError('');
      setSuccessMsg('تم التحقق من هوية المشرف بنجاح! تم إلغاء قفل كامل صلاحيات التحكم بالقطع.');
    } else {
      setPasscodeError('رمز المشرف الذي أدخلته غير صحيح، حاول مرة أخرى.');
    }
  };

  const handleAddExistingListing = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!activeVendorId) {
      setErrorMsg('الرجاء اختيار مكتب بائع مسجل ومعتمد للمتابعة.');
      return;
    }

    const price = parseFloat(priceIQD);
    if (isNaN(price) || price <= 0) {
      setErrorMsg('يرجى تحديد سعر بيع حقيقي وصحيح بالدينار العراقي.');
      return;
    }

    // Check if this vendor already has a listing for this part
    const targetPart = parts.find((p) => p.id === selectedPartId);
    if (targetPart) {
      const alreadyHas = targetPart.listings.some((l) => l.vendorId === activeVendorId);
      if (alreadyHas) {
        setErrorMsg('مكتبك لديه سعر مدرج لهذا المعالج أو القطعة بالفعل. يمكنك تحديث أو تعديل السعر من جدول عروضك بالأسفل.');
        return;
      }
    }

    const newListing: VendorListing = {
      vendorId: activeVendorId,
      priceIQD: price,
      isAvailable,
      warrantyMonths,
    };

    onAddListing(selectedPartId, newListing);
    setSuccessMsg(`تم إدراج سعر القطعة بنجاح! تم قيد رسوم نشر المنصة بقيمة ${listingFee.toLocaleString('ar-IQ')} د.ع على حسابك.`);
    setPriceIQD('');
  };

  const handleAddNewPartFlow = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isAdminVerified) {
      setErrorMsg('غير مسموح. هذا الإجراء يتطلب التحقق كمسؤول مالي للمنصة.');
      return;
    }

    if (!newPartName || !newPartBrand || !priceIQD) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية لتسجيل القطعة الجديدة.');
      return;
    }

    const price = parseFloat(priceIQD);
    if (isNaN(price) || price <= 0) {
      setErrorMsg('يرجى كتابة السعر بالدينار العراقي.');
      return;
    }

    // Spec parsing
    const specsObject: { [key: string]: string } = {};
    if (newPartSpecs) {
      const lines = newPartSpecs.split('\n');
      lines.forEach((line) => {
        const pParts = line.split(':');
        if (pParts.length >= 2) {
          specsObject[pParts[0].trim()] = pParts.slice(1).join(':').trim();
        }
      });
    } else {
      specsObject['التفاصيل / الميزات'] = 'دعم التجميعات وبناء الألعاب الممتازة';
    }

    const newPart: PCPart = {
      id: `part_${Date.now()}`,
      name: newPartName,
      brand: newPartBrand,
      category: newPartCategory,
      specs: specsObject,
      imageGradient: gradientChoice,
      listings: [
        {
          vendorId: activeVendorId || verifiedVendors[0]?.id || 'admin',
          priceIQD: price,
          isAvailable,
          warrantyMonths,
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddNewPartAndListing(newPart);
    setSuccessMsg(`تهانينا! تم تسجيل قطع هاردوير جديدة في قاعدة الفهرس العام وإقران البائع الموفر الأول للمنتج. تم قيد رسم الإدراج ${listingFee.toLocaleString('ar-IQ')} د.ع.`);
    
    // Clear Form
    setNewPartName('');
    setNewPartBrand('');
    setNewPartSpecs('');
    setPriceIQD('');
  };

  // Vendor Listing updates
  const handleSaveListingEdit = (partId: string) => {
    if (!editingListing || !onUpdateListing) return;
    const priceVal = parseFloat(editingListing.priceIQD);
    if (isNaN(priceVal) || priceVal <= 0) {
      alert('يرجى كتابة سعر حقيقي وصحيح بالدينار العراقي.');
      return;
    }

    onUpdateListing(partId, activeVendorId, {
      priceIQD: priceVal,
      isAvailable: editingListing.isAvailable,
      warrantyMonths: editingListing.warrantyMonths,
    });

    setSuccessMsg('✓ تم تحديث سعر وضمان وتوفر هذا العرض بنجاح وبشكل فوري للجمهور العراقي.');
    setEditingListing(null);
  };

  // Admin Part Specifications updates
  const handleStartEditPart = (part: PCPart) => {
    setEditingPart(part);
    setEditPartName(part.name);
    setEditPartBrand(part.brand);
    setEditPartCategory(part.category);
    setEditPartGradient(part.imageGradient);

    // Convert specs dictionary back to string format key:value
    const specsStr = Object.entries(part.specs)
      .map(([key, value]) => `${key} : ${value}`)
      .join('\n');
    setEditPartSpecs(specsStr);
  };

  const handleSavePartSpecsEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPart || !onUpdatePart) return;

    // Parse specs back to dictionary
    const specsObject: { [key: string]: string } = {};
    if (editPartSpecs) {
      const lines = editPartSpecs.split('\n');
      lines.forEach((line) => {
        const pParts = line.split(':');
        if (pParts.length >= 2) {
          specsObject[pParts[0].trim()] = pParts.slice(1).join(':').trim();
        }
      });
    }

    onUpdatePart(editingPart.id, {
      name: editPartName,
      brand: editPartBrand,
      category: editPartCategory,
      imageGradient: editPartGradient,
      specs: specsObject,
    });

    setSuccessMsg('✓ تم تعديل بيانات ومواصفات قطعة الهاردوير بالفهرس العام بنجاح.');
    setEditingPart(null);
  };

  const handleDeletePartClick = (partId: string) => {
    if (!onDeletePart) return;
    if (window.confirm('هل أنت متأكد من حذف هذه القطعة بالكامل من قاعدة البيانات؟ سيتم مسح عروض جميع المحلات المرتبطة بها.')) {
      onDeletePart(partId);
      setSuccessMsg('✓ تم حذف القطعة بالكامل من قاعدة بيانات الفهرس العام.');
    }
  };

  // Filter listings belonging to the active logged-in vendor
  const myActiveListings = parts.flatMap((part) => {
    const listing = part.listings.find((l) => l.vendorId === activeVendorId);
    return listing ? [{ part, listing }] : [];
  });

  if (verifiedVendors.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center" dir="rtl">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white">لا توجد مكاتب بائعين معتمدة حالياً</h4>
        <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto">
          يرجى تسجيل الطلب في نموذج التسجيل ثم التوجه لوحدة التحكم المشفرة في فوتر الصفحة لتفويض وقبول طلبك يدوياً لتبدأ بالإشراف.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e222b] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-8" dir="rtl">
      
      {/* Header section with Role Switching portal */}
      <div className="border-b border-white/5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <PackageOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-sans">بوابة إدارة المنتجات وتسعير المكاتب</h3>
              <p className="text-slate-400 text-xs mt-0.5">قم بإدراج أسعار قطع الهاردوير أو تحكم بالمميزات بصفتك بائعاً معتمداً</p>
            </div>
          </div>

          {/* SIMULATED VENDOR LOG-IN */}
          <div className="bg-[#0c0e12] px-3.5 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">مكتبك النشط हालياً:</span>
            <select
              className="bg-[#16191f] border border-white/5 text-xs text-cyan-400 font-bold text-right py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded cursor-pointer"
              value={activeVendorId}
              onChange={(e) => {
                setActiveVendorId(e.target.value);
                setEditingListing(null);
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              {verifiedVendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nameAr || v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AUTHORITY LEVEL SELECTOR */}
      <div className="bg-[#0c0e12] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="block text-xs font-bold text-white mb-0.5">مستوى الصلاحية النشط للوحة التحكم:</span>
          <span className="text-[11px] text-slate-400">
            {isAdminVerified 
              ? 'أنت تعمل الآن بوضع مشرف المنصة (Full Admin) - يمكنك إدراج عناصر جديدة وتعديل مواصفات الفهرس العام.' 
              : 'أنت بوضع البائع المعتمد - يمكنك إدراج أسعار لقطع الكمبيوتر الموجودة وتعديل أسعارك الخاصة فقط.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsAdminMode(false);
              setIsAdminVerified(false);
              setAdminPasscode('');
              setErrorMsg('');
              setSuccessMsg('تم التبديل لوضع البائع المعتمد بنجاح.');
            }}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              !isAdminVerified 
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                : 'bg-transparent border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>بائع معتمد (Vendor)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAdminMode(true);
              setErrorMsg('');
            }}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              isAdminVerified 
                ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                : 'bg-transparent border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>مشرف المنصة (Admin)</span>
          </button>
        </div>
      </div>

      {/* PASSCODE MODAL/FORM FOR ADMIN AUTHENTICATION */}
      {isAdminMode && !isAdminVerified && (
        <form onSubmit={handleVerifyPasscode} className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-xl space-y-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-400">مطلوب التحقق من الرمز السري للمشرفين</h5>
              <p className="text-[11px] text-slate-350 mt-0.5">
                تعديل وتعديل "أزرار الهاردوير" والقطع العامة مقتصر على موظفي الإشراف لمنع التكرار والحفاظ على هيكلية الكتالوج.
              </p>
            </div>
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="password"
              placeholder="الرمز السري (الافتراضي 000000)"
              className="bg-[#0c0e12] border border-white/10 text-xs px-3 py-2 text-slate-100 rounded-lg focus:outline-none focus:border-amber-500 tracking-wider flex-1"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
            />
            <button
              type="submit"
              className="bg-amber-605 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              التحقق والتنشيط
            </button>
          </div>
          {passcodeError && <span className="block text-[10px] text-red-400 font-bold">{passcodeError}</span>}
        </form>
      )}

      {/* Unified feedback banner */}
      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 flex items-start gap-2.5">
          <CircleCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-450 mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Operation selector tabs */}
      <div className="flex border-b border-white/5 text-xs">
        <button
          onClick={() => { setManagerFlow('existing'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`pb-3 px-4 font-bold transition-all relative ${
            managerFlow === 'existing'
              ? 'text-cyan-400 border-b-2 border-cyan-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          إدراج سعر لقطعة هاردوير مسجلة بالفعل بالفهرس
        </button>
        <button
          onClick={() => { setManagerFlow('new'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`pb-3 px-4 font-bold transition-all relative ${
            managerFlow === 'new'
              ? 'text-cyan-400 border-b-2 border-cyan-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          تسجيل قطعة كمبيوتر جديدة بالكامل للجمهور (للمشرفين)
        </button>
      </div>

      {managerFlow === 'existing' ? (
        /* FLOW 1: RE-PRICING OF EXISTING PART */
        <form onSubmit={handleAddExistingListing} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">اختر قطعة الكومبيوتر من القائمة المتاحة بالفهرس *</label>
              <select
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
              >
                {parts.map((part) => (
                  <option key={part.id} value={part.id}>
                    [{part.category}] {part.brand} - {part.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">سعر بيع مكتبك الفعلي (بالدينار العراقي) *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  placeholder="مثال: 580000"
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all pl-14 text-right"
                  value={priceIQD}
                  onChange={(e) => setPriceIQD(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold font-mono">د.ع</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">حالة التوفر بالمحل *</label>
              <select
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                value={isAvailable ? 'true' : 'false'}
                onChange={(e) => setIsAvailable(e.target.value === 'true')}
              >
                <option value="true">متوفر في المخزن والرفوف فوري</option>
                <option value="false">غير متوفر / مسبق الطلب</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">مدة الضمان المحلي الفعال للمستهلك *</label>
              <select
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(parseInt(e.target.value))}
              >
                <option value={0}>بدون ضمان (تشغيلي فقط)</option>
                <option value={3}>شهران إلى 3 أشهر ضمان معملي</option>
                <option value={6}>6 أشهر ضمان حقيقي</option>
                <option value={12}>سنة واحدة (12 شهراً) ضمان كامل</option>
                <option value={24}>سنتان (24 شهراً) ضمان استبدال</option>
                <option value={36}>ثلاث سنوات (36 شهراً) كفالة أصلية</option>
              </select>
            </div>
          </div>

          {/* FEES NOTIFICATION CARD */}
          <div className="bg-[#0c0e12] border border-white/5 rounded-xl p-4 text-xs flex justify-between items-center text-slate-400">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span>عند النشر والموافقة، سيترتب عليك دفع رسوم تفعيل المنصة:</span>
            </div>
            <span className="font-bold text-cyan-400">{listingFee.toLocaleString('ar-IQ')} دينار عراقي</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/10"
          >
            <span>حفظ السعر وإدراج المنتج بالفهرس</span>
          </button>
        </form>
      ) : (
        /* FLOW 2: ADD A BRAND NEW PART AND PRICE LISTING (Admin Locked) */
        <div className="space-y-4">
          {!isAdminVerified ? (
            <div className="bg-amber-950/20 border border-amber-500/20 p-6 rounded-xl text-center space-y-4">
              <Lock className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">صلاحية إدراج وتعديل الأزرار والقطع مغلقة للمشرفين فقط</h4>
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-normal">
                المرشحون والبائعون العاديون ليس لديهم الضوء الأخضر لإدراج قطع هاردوير جديدة في الفهرس العام مباشرة لمنع التخريب العشوائي. يرجى تفعيل وضع المشرف بالرمز السري أولاً.
              </p>
              <div className="max-w-xs mx-auto flex gap-2">
                <input
                  type="password"
                  placeholder="الرمز السري (000000)"
                  className="bg-[#0c0e12] border border-white/10 text-xs px-3 py-2 text-slate-100 rounded-lg focus:outline-none focus:border-amber-500 tracking-wider text-center"
                  onChange={(e) => setAdminPasscode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVerifyPasscode}
                  className="bg-amber-600 text-slate-900 font-bold text-xs py-1.5 px-3 rounded-lg cursor-pointer"
                >
                  التحقق
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddNewPartFlow} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم قطعة الكومبيوتر الجديدة (المعالج/ الكارت) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: AMD Ryzen 9 9950X Extreme CPU"
                    className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all font-sans"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">الشركة المصنعة للعلامة التجارية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: AMD / Intel / NVIDIA / ASUS"
                    className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all font-sans"
                    value={newPartBrand}
                    onChange={(e) => setNewPartBrand(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">تصنيف قطعة الكومبيوتر (Category) *</label>
                  <select
                    className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value as CategoryType)}
                  >
                    <option value="CPU">معالج مركزية (CPU)</option>
                    <option value="GPU">كارت شاشة رسومي (GPU)</option>
                    <option value="Motherboard">مذربورد لوحة الأم (Motherboard)</option>
                    <option value="RAM">ذاكرة عشوائية (RAM)</option>
                    <option value="Storage">وسائط تخزين (Storage)</option>
                    <option value="Power Supply">باور سبلاي طاقة (Power Supply)</option>
                    <option value="Case">كيس كمبيوتر (Case)</option>
                    <option value="Cooling">تبريد مائي/هوائي (Cooling)</option>
                    <option value="Monitor">شاشة عرض (Monitor)</option>
                    <option value="Peripherals">ملحقات وماوس (Peripherals)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">سعر إدراج مكتبك الأولي (بالدينار العراقي) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="مثال: 720000"
                      className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all pl-14 text-right"
                      value={priceIQD}
                      onChange={(e) => setPriceIQD(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold font-mono">د.ع</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <span>المواصفات الفنية للقطعة (كل سطر: ميزة : قيمة)</span>
                    <HelpCircle className="w-3 h-3 text-slate-500" title="مثال: السرعة: 4.8 جيجاهرتز" />
                  </label>
                  <textarea
                    rows={4}
                    placeholder="مثال:&#10;الأنوية والمسارات : 16 نواة / 32 مسار&#10;التردد الأقصى : 5.7 جيجاهرتز&#10;الذاكرة المخبئية : 80 ميجا بايت"
                    className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-all resize-none font-mono"
                    value={newPartSpecs}
                    onChange={(e) => setNewPartSpecs(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">اختر تدرج الألوان للشعار والبطاقة البصرية</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { style: 'from-blue-600 to-indigo-900', label: 'أزرق إنتل' },
                        { style: 'from-orange-600 to-red-800', label: 'أحمر رايزن' },
                        { style: 'from-green-600 to-emerald-950', label: 'أخضر نيفيديا' },
                        { style: 'from-purple-800 to-indigo-950', label: 'ستيل بنفسجي' },
                        { style: 'from-pink-600 to-purple-900', label: 'ساطع النيون' },
                        { style: 'from-slate-700 to-slate-900', label: 'أسود فحمي' },
                      ].map((grad) => (
                        <button
                          key={grad.style}
                          type="button"
                          onClick={() => setGradientChoice(grad.style)}
                          className={`py-2 px-1 text-[10px] text-white rounded-lg bg-gradient-to-br ${grad.style} text-center border font-semibold cursor-pointer ${
                            gradientChoice === grad.style ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-white/5'
                          }`}
                        >
                          {grad.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">المخزن الأساسي</label>
                      <select
                        className="w-full bg-[#0c0e12] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
                        value={isAvailable ? 'true' : 'false'}
                        onChange={(e) => setIsAvailable(e.target.value === 'true')}
                      >
                        <option value="true">متوفر للبيع</option>
                        <option value="false">تحت الطلب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">شهور الضمان</label>
                      <select
                        className="w-full bg-[#0c0e12] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
                        value={warrantyMonths}
                        onChange={(e) => setWarrantyMonths(parseInt(e.target.value))}
                      >
                        <option value={12}>12 شهراً</option>
                        <option value={24}>24 شهراً</option>
                        <option value={36}>36 شهراً</option>
                        <option value={0}>لا يتوافر</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* THE FLAT RATE DYNAMIC LISTING REAFFIRMATION */}
              <div className="bg-[#0c0e12] border border-white/5 rounded-xl p-4 text-xs flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <span>رسوم إنشاء وتسجيل المنتج العام + ميزة إقران السعر:</span>
                </span>
                <span className="font-bold text-cyan-400 font-mono">{listingFee.toLocaleString('ar-IQ')} دينار عراقي</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 bg-gradient-to-l from-amber-500 to-yellow-600 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <span>إنشاء القطعة الجديدة وإرسالها ومطابقة الرسوم</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* SECTION 2: VENDOR'S OWN LISTINGS MANAGER - "يمكن للبائعين فقط النشر والتعديل لما ينشروه هم" */}
      <div className="border-t border-white/10 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-sans">
              إدارة أسعار وعروض مكتبك الحالية ({myActiveListings.length} عروض مدرجة)
            </h4>
          </div>
          <p className="text-[10px] text-slate-500">لا يحق لأي مكتب تعديل أسعار مكتب آخر مطلقاً</p>
        </div>

        {myActiveListings.length === 0 ? (
          <div className="bg-[#0c0e12]/60 border border-white/5 p-6 rounded-xl text-center text-slate-500 text-xs">
            لا توجد لديك أسعار مدرجة للقطع حالياً في هذه المنصة. يمكنك إضافة سعر بالاستعانة بمجمع الأسعار أعلاه.
          </div>
        ) : (
          <div className="space-y-3">
            {myActiveListings.map(({ part, listing }) => (
              <div 
                key={part.id} 
                className="bg-[#0c0e12] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-cyan-900/40 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold">
                      {part.category}
                    </span>
                    <span className="text-xs text-slate-400">{part.brand}</span>
                    <span className="text-xs text-white font-bold">{part.name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span>السعر: <strong className="text-emerald-400">{listing.priceIQD.toLocaleString('ar-IQ')} د.ع</strong></span>
                    <span>•</span>
                    <span>الضمان: <strong>{listing.warrantyMonths === 0 ? 'لا يتوافر' : `${listing.warrantyMonths} أشهر`}</strong></span>
                    <span>•</span>
                    <span>التوفر: <strong className={listing.isAvailable ? 'text-emerald-400' : 'text-rose-400'}>{listing.isAvailable ? 'متوفر' : 'غير متوفر'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  {editingListing?.partId === part.id ? (
                    <div className="bg-[#16191f] border border-white/10 p-3 rounded-xl flex items-center flex-wrap gap-2 text-xs">
                      <div className="relative w-28">
                        <input
                          type="number"
                          className="bg-[#0c0e12] border border-white/5 text-xs px-2 py-1 rounded w-full pr-1 text-right text-slate-100"
                          value={editingListing.priceIQD}
                          onChange={(e) => setEditingListing({ ...editingListing, priceIQD: e.target.value })}
                        />
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-500">د.ع</span>
                      </div>

                      <select
                        className="bg-[#0c0e12] border border-white/5 text-xs px-2 py-1 rounded text-slate-250 text-slate-300"
                        value={editingListing.isAvailable ? 'true' : 'false'}
                        onChange={(e) => setEditingListing({ ...editingListing, isAvailable: e.target.value === 'true' })}
                      >
                        <option value="true">متوفر</option>
                        <option value="false">تحت الطلب</option>
                      </select>

                      <select
                        className="bg-[#0c0e12] border border-white/5 text-xs px-2 py-1 rounded text-slate-300"
                        value={editingListing.warrantyMonths}
                        onChange={(e) => setEditingListing({ ...editingListing, warrantyMonths: parseInt(e.target.value) })}
                      >
                        <option value={0}>بدون ضمان</option>
                        <option value={12}>12 شهراً</option>
                        <option value={24}>24 شهراً</option>
                        <option value={36}>36 شهراً</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleSaveListingEdit(part.id)}
                        className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs px-2 font-bold cursor-pointer"
                        title="حفظ"
                      >
                        <Check className="w-3.5 h-3.5 inline mr-1" /> حفظ
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingListing(null)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs px-2 cursor-pointer"
                        title="إلغاء الإجراء"
                      >
                        <X className="w-3.5 h-3.5 inline mr-1" /> إلغاء
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingListing({
                          partId: part.id,
                          priceIQD: listing.priceIQD.toString(),
                          isAvailable: listing.isAvailable,
                          warrantyMonths: listing.warrantyMonths,
                        })}
                        className="py-1.5 px-3 bg-[#16191f] hover:bg-cyan-550 hover:bg-cyan-600/20 text-cyan-400 border border-white/5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل السعر والضمان</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onRemoveListing && window.confirm('هل أنت متأكد من إلغاء وحذف تسعيرتك لهذه القطعة؟')) {
                            onRemoveListing(part.id, activeVendorId);
                            setSuccessMsg('✓ تم إلغاء سعر القطعة لمكتبك وحذفها من الفهرس للمقارنة.');
                          }
                        }}
                        className="py-1.5 px-3 bg-[#110c0e] hover:bg-rose-950/40 text-rose-450 border border-white/5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف العرض</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: ADMIN'S PCPARTS GENERAL CATALOG SPECIFICATIONS EDITOR */}
      {isAdminVerified && (
        <div className="border-t border-amber-500/20 pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <h4 className="text-sm font-bold text-white font-sans">
              إدارة مواصفات وتصنيف قطع الفهرس العام الأبجدي ({parts.length} قطعة بالمنصة)
            </h4>
          </div>
          <p className="text-[10px] text-slate-500">بصفتك مديراً، يرجى ملء المواصفات والأسماء وصيانة الفهرس لقطع العتاد بدقة.</p>

          {editingPart ? (
            /* SUB-FORM: EDIT SPECIFICATIONS FOR A GENERAL PART */
            <form onSubmit={handleSavePartSpecsEdit} className="bg-[#0c0e12] border border-amber-500/30 p-5 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Edit className="w-4 h-4" />
                <span>تعديل بيانات قطعة الفهرس: {editingPart.brand} - {editingPart.name}</span>
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-300 font-bold mb-1 font-sans">اسم القطعة بالكامل *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#16191f] border border-white/10 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    value={editPartName}
                    onChange={(e) => setEditPartName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 font-bold mb-1 font-sans">العلامة التجارية والبراند *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#16191f] border border-white/10 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    value={editPartBrand}
                    onChange={(e) => setEditPartBrand(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-300 font-bold mb-1 font-sans">تصنيف قطعة الكومبيوتر (Category) *</label>
                  <select
                    className="w-full bg-[#16191f] border border-white/10 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none"
                    value={editPartCategory}
                    onChange={(e) => setEditPartCategory(e.target.value as CategoryType)}
                  >
                    <option value="CPU">معالج مركزية (CPU)</option>
                    <option value="GPU">كارت شاشة رسومي (GPU)</option>
                    <option value="Motherboard">مذربورد لوحة الأم (Motherboard)</option>
                    <option value="RAM">ذاكرة عشوائية (RAM)</option>
                    <option value="Storage">وسائط تخزين (Storage)</option>
                    <option value="Power Supply">باور سبلاي طاقة (Power Supply)</option>
                    <option value="Case">كيس كمبيوتر (Case)</option>
                    <option value="Cooling">تبريد مائي/هوائي (Cooling)</option>
                    <option value="Monitor">شاشة عرض (Monitor)</option>
                    <option value="Peripherals">ملحقات وماوس (Peripherals)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 font-bold mb-1 font-sans">تدرج ألوان البطاقة البصرية</label>
                  <select
                    className="w-full bg-[#16191f] border border-white/10 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none"
                    value={editPartGradient}
                    onChange={(e) => setEditPartGradient(e.target.value)}
                  >
                    <option value="from-blue-600 to-indigo-900">أزرق إنتل</option>
                    <option value="from-orange-600 to-red-800">أحمر رايزن</option>
                    <option value="from-green-600 to-emerald-950">أخضر نيفيديا</option>
                    <option value="from-purple-800 to-indigo-950">ستيل بنفسجي</option>
                    <option value="from-pink-600 to-purple-900">ساطع النيون</option>
                    <option value="from-slate-700 to-slate-900">أسود فحمي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">المواصفات الفنية للقطعة (كل سطر: ميزة : قيمة)</label>
                <textarea
                  rows={4}
                  className="w-full bg-[#16191f] border border-white/10 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  value={editPartSpecs}
                  onChange={(e) => setEditPartSpecs(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 inline mr-1" /> حفظ تعديلات القطعة
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPart(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-4 rounded-lg cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          ) : (
            /* LISTING OF COMPONENT CARDS FOR ADMIN SPEC EDIT & COMPLETE DELETION */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parts.map((part) => (
                <div 
                  key={part.id} 
                  className="bg-[#0c0e12] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-slate-850 bg-slate-800 text-slate-300 px-1.5 rounded font-mono font-bold">
                        {part.category}
                      </span>
                      <strong className="text-white text-xs">{part.brand} - {part.name}</strong>
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-1">تاريخ إدراجها بالمنصة: {part.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditPart(part)}
                      className="py-1 px-2.5 bg-[#16191f] hover:bg-amber-600/20 text-amber-500 border border-white/5 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>تعديل البطاقة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePartClick(part.id)}
                      className="py-1 px-2 bg-[#110c0e] hover:bg-rose-950/40 text-rose-500 border border-white/5 text-[11px] rounded-lg cursor-pointer"
                      title="حذف القطعة بالكامل من الفهرس"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
