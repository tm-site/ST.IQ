/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UserCheck, Upload, CheckCircle, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { VendorApplication } from '../types';
import { IRAQI_PROVINCES } from '../mockData';

interface VendorRegisterProps {
  onAddApplication: (app: VendorApplication) => void;
}

export default function VendorRegister({ onAddApplication }: VendorRegisterProps) {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState(IRAQI_PROVINCES[0]);
  const [address, setAddress] = useState('');
  const [idCardPhoto, setIdCardPhoto] = useState<string>('');
  const [fileName, setFileName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded image to base64 for persistent client application review!
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop support
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !businessName || !phone || !address || !idCardPhoto) {
      setError('يرجى ملء جميع الحقول الإلزامية ورفع صورة الهوية التعريفية الخاصة بك.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newApp: VendorApplication = {
        id: `app_${Date.now()}`,
        fullName,
        businessName,
        phone,
        email,
        province,
        address,
        idCardPhoto,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };

      onAddApplication(newApp);
      setSuccess(true);
      
      // Reset
      setFullName('');
      setBusinessName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setIdCardPhoto('');
      setFileName('');
    } catch (err) {
      setError('حدث خطأ أثناء إرسال طلبك. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1e222b] border border-white/10 rounded-2xl p-6 shadow-xl relative" dir="rtl">
      
      <div className="border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-sans">بوابة تسجيل البائعين والمكاتب المحلية</h3>
            <p className="text-slate-400 text-xs mt-0.5">سجل مكتبك الآن لتبدأ بمقارنة الأسعار ونشر قطع الهاردوير لآلاف المشترين</p>
          </div>
        </div>
      </div>

      {success ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-6 text-center py-8">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 stroke-[1.5]" />
          <h4 className="text-lg font-bold text-white">تم إرسال طلب التسجيل الخاص بك بنجاح!</h4>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto line-clamp-3">
            طلبك الآن معلق بانتظار المراجعة والتدقيق اليدوي من قبل إدارة المنصة. سنقوم بالتحقق من معلومات متجرك ومطابقة الهوية التعريفية المرفقة، ثم تفعيل حسابك للنشر الفوري.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-6 px-5 py-2.5 bg-[#0c0e12] hover:bg-white/5 text-white font-medium text-xs rounded-lg transition-all border border-white/5"
          >
            تقديم طلب تسجيل آخر
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm text-rose-200">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم الثلاثي الكامل (كما في الهوية) *</label>
              <input
                type="text"
                required
                placeholder="مثال: سجاد ماهر الخفاجي"
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم المكتب أو النشاط التجاري *</label>
              <input
                type="text"
                required
                placeholder="مثال: مكتب النخبة للهاردوير والقطع"
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الهاتف الفعال (واتساب / تليكرام) *</label>
              <input
                type="tel"
                required
                placeholder="مثال: 9647701234567+"
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                placeholder="مثال: info@elitehardware.com"
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">المحافظة *</label>
              <select
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                {IRAQI_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">العنوان الفعلي التفصيلي للمتجر *</label>
              <input
                type="text"
                required
                placeholder="مثال: شارع الصناعة، بناية الطيف، الطابق الأرضي"
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* DRAG AND DROP MOCK UPLOAD WITH PREVIEW */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              نسخة واضحة من الهوية الرسمية أو البطاقة الموحدة (وجه وخلف) *
            </label>
            
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                dragActive 
                  ? 'border-cyan-500 bg-cyan-500/5' 
                  : idCardPhoto 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-white/10 hover:border-cyan-500/30 bg-[#0c0e12]'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {idCardPhoto ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">تم تحميل الهوية بنجاح</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-sm mx-auto">{fileName || 'id_card_scan.jpg'}</p>
                  <div className="mt-3 inline-block relative border border-white/5 rounded-lg overflow-hidden max-h-32 shadow-inner">
                    <img src={idCardPhoto} alt="ID preview" className="max-h-32 object-contain" />
                  </div>
                  <p className="text-[10px] text-slate-500">انقر لتغيير الصورة</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm text-slate-300 font-medium">سحب وإفلات صورة البطاقة الموحدة هنا أو انقر للتصفح</p>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">PNG, JPG, JPEG (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0c0e12] border border-white/5 rounded-xl p-4 text-xs space-y-2 text-slate-400">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold shrink-0">•</span>
              <p>نحن نتحقق من صحة وصلاحية المستندات لمكافحة الاحتيال وتوفير بيئة تسوق آمنة للمستهلك العراقي.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold shrink-0">•</span>
              <p>سيتم الاحتفاظ بهذه الوثائق بسرية تامة وتشفيرها لغرض التحقق الإداري وحسب.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-5 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:opacity-100 shadow-lg shadow-cyan-600/10 active:scale-[0.98] cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <span>جاري إرسال البيانات...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>تقديم طلب التسجيل للتدقيق</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
