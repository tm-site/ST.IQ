/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Eye, Settings, Users, AlertCircle, TrendingUp, HandHeart, Check, X, ShieldAlert, Award, RefreshCw } from 'lucide-react';
import { Vendor, VendorApplication, Complaint, SupportDonation } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  applications: VendorApplication[];
  complaints: Complaint[];
  donations: SupportDonation[];
  listingFee: number;
  onUpdateListingFee: (fee: number) => void;
  onApproveApplication: (appId: string) => void;
  onRejectApplication: (appId: string) => void;
  onResolveComplaint: (complaintId: string, status: 'pending' | 'investigating' | 'resolved') => void;
  listingsCount: number;
}

export default function AdminPanel({
  isOpen,
  onClose,
  vendors,
  applications,
  complaints,
  donations,
  listingFee,
  onUpdateListingFee,
  onApproveApplication,
  onRejectApplication,
  onResolveComplaint,
  listingsCount,
}: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Custom Fee Edit State
  const [newFee, setNewFee] = useState(listingFee.toString());
  const [feeSuccess, setFeeSuccess] = useState(false);

  // Active Admin View Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'vendors' | 'complaints' | 'finance'>('overview');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '002006') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('الرمز السري غير صحيح. يرجى إدخال ترخيص الإشراف الصحيح.');
    }
  };

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newFee);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateListingFee(parsed);
      setFeeSuccess(true);
      setTimeout(() => setFeeSuccess(false), 3000);
    }
  };

  const handleClosePanel = () => {
    // Reset authorization state on exit to keep it stealthy
    setIsAuthenticated(false);
    setPasscode('');
    onClose();
  };

  if (!isOpen) return null;

  // Revenue computations
  const totalDonates = donations.reduce((sum, d) => sum + d.amountIQD, 0);
  const totalListingsRevenue = listingsCount * listingFee;
  const totalRevenue = totalDonates + totalListingsRevenue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#1e222b] border border-cyan-500/30 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative" dir="rtl">
        
        {/* Admin Header */}
        <div className="bg-[#0c0e12] border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              لوحة تحكم مدير منصة ستيل | STEEL STAFF GATEWAY
            </h3>
          </div>
          <button
            onClick={handleClosePanel}
            className="text-slate-400 hover:text-white transition-colors text-xs font-bold"
          >
            إغلاق البوابة ✕
          </button>
        </div>

        {!isAuthenticated ? (
          /* PASSCODE INTERACTIVE LOBBY */
          <div className="p-8 max-w-md mx-auto w-full flex flex-col items-center justify-center my-12">
            <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20">
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-xl font-bold text-white text-center font-sans">التحقق من صلاحيات الإشراف</h4>
            <p className="text-slate-400 text-xs text-center mt-1.5 mb-6">
              هذه البوابة مشفرة ومخصصة لإدارة المنصة فقط. يرجى إدخال الرمز السري المكون من 6 أرقام للمتابعة.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              {authError && (
                <div className="bg-red-950/40 border border-red-500/30 rounded-lg p-3 text-xs text-red-200 text-center">
                  {authError}
                </div>
              )}
              
              <div>
                <input
                  type="password"
                  placeholder="أدخل الرمز السري (e.g. 000000)"
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3.5 text-center text-slate-100 text-lg font-mono focus:outline-none focus:border-cyan-500 tracking-widest"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-600/15 cursor-pointer"
              >
                تأكيد ترخيص المرور
              </button>
            </form>
          </div>
        ) : (
          /* ADMIN AUTHENTICATED PANEL */
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar menu */}
            <div className="bg-[#0c0e12] border-l border-white/5 p-4 shrink-0 md:w-56 space-y-1">
              <button
                onClick={() => setAdminTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'overview'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>إحصائيات المنصة العامة</span>
              </button>

              <button
                onClick={() => setAdminTab('vendors')}
                className={`w-full flex items-center justify-between gap-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'vendors'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>تأكيد المكاتب والبائعين</span>
                </div>
                {applications.filter(a => a.status === 'pending').length > 0 && (
                  <span className="bg-cyan-500 text-slate-950 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {applications.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('complaints')}
                className={`w-full flex items-center justify-between gap-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'complaints'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>شكاوى المستهلكين</span>
                </div>
                {complaints.filter(c => c.status === 'pending').length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {complaints.filter(c => c.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('finance')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'finance'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HandHeart className="w-4 h-4" />
                <span>سجل الدعم المالي والترخيص</span>
              </button>

              <div className="pt-6 mt-6 border-t border-white/5">
                <div className="bg-[#16191f] p-3 rounded-xl border border-white/5 text-[11px] text-slate-500">
                  <span className="block font-bold text-slate-400 mb-1">الرسمي لإصدار ستيل</span>
                  <span>الرمز السري: <span className="text-cyan-400 font-bold font-mono">000000</span></span>
                  <span className="block text-[10px] text-cyan-400 font-mono mt-1">● نظام الإشراف مشفر</span>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[70vh] md:max-h-full">
              
              {adminTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">إحصائيات ومؤشرات الأداء لوحدة التحكم</h4>
                    <p className="text-xs text-slate-400">تقييم المبيعات التدفقي، ميزانية التشغيل الحقيقية، والتحقق الشامل للمكاتب العراقية.</p>
                  </div>

                  {/* STATS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#0c0e12] p-4 rounded-xl border border-white/5">
                      <span className="block text-xs text-slate-550 text-slate-400 font-medium">إجمالي التبرعات + رسوم الإدراج</span>
                      <span className="text-xl font-black text-emerald-400 block mt-2">{totalRevenue.toLocaleString('ar-IQ')} د.ع</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">تغطية تكاليف فواتير الخادم</span>
                    </div>

                    <div className="bg-[#0c0e12] p-4 rounded-xl border border-white/5">
                      <span className="block text-xs text-slate-440 text-slate-400 font-medium">رسوم إدراج المنتج الفعالة</span>
                      <span className="text-xl font-black text-cyan-400 block mt-2">{listingFee.toLocaleString('ar-IQ')} د.ع</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">تؤخذ على كل قطعة كمبيوتر تضاف للبائع</span>
                    </div>

                    <div className="bg-[#0c0e12] p-4 rounded-xl border border-white/5">
                      <span className="block text-xs text-slate-440 text-slate-400 font-medium">عدد المكاتب النشطة مع المنصة</span>
                      <span className="text-xl font-black text-white block mt-2">{vendors.filter(v => v.verified).length} مكاتب معتمدة</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">وجاري تدقيق {applications.filter(a => a.status === 'pending').length} مكاتب</span>
                    </div>
                  </div>

                  {/* MONETIZATION EDIT ZONE */}
                  <div className="bg-[#0c0e12] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">تعديل رسوم إدراج القطع بالدينار العراقي (Dynamic Listing Fee)</h5>
                        <p className="text-slate-400 text-xs mt-1">عند إعداد قيمة مخصصة، سيتم قيد الرسوم تلقائياً لمقدمي المكاتب عند إضافتهم قطع كمبيوتر جديدة.</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateFee} className="flex gap-3">
                      <div className="relative flex-1 max-w-xs">
                        <input
                          type="number"
                          className="w-full bg-[#16191f] border border-white/5 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 pl-14 text-right"
                          value={newFee}
                          onChange={(e) => setNewFee(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">د.ع</span>
                      </div>
                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        تحديث الرسم الفوري
                      </button>
                    </form>

                    {feeSuccess && (
                      <p className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>تم تحديث رسوم الإدراج بنجاح إلى {parseFloat(newFee).toLocaleString('ar-IQ')} دينار عراقي!</span>
                      </p>
                    )}
                  </div>

                  {/* QUICK ALERTS COMPLAINTS */}
                  <div className="bg-[#1e141a] border border-red-500/10 rounded-xl p-4">
                    <h5 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>بلاغات معلقة تحتاج لمعالجة فورية</span>
                    </h5>
                    {complaints.filter(c => c.status === 'pending').length === 0 ? (
                      <p className="text-slate-500 text-xs font-normal">لا توجد أي شكاوى قيد التدقيق حالياً. السوق تحت الانضباط!</p>
                    ) : (
                      <div className="space-y-2 mt-2">
                        {complaints.filter(c => c.status === 'pending').map(c => (
                          <div key={c.id} className="bg-[#0c0e12] p-3 rounded-lg border border-white/5 text-xs flex justify-between items-center gap-3">
                            <div>
                              <span className="font-bold text-slate-350 text-slate-200 block">{c.subject}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">مقدم من: {c.fullName} • هاتف: {c.contactInfo}</span>
                            </div>
                            <button
                              onClick={() => { setAdminTab('complaints'); }}
                              className="text-red-450 hover:text-red-400 text-rose-400 font-bold text-[11px] py-1 px-2.5 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 border border-rose-500/15"
                            >
                              عرض البلاغ ومواجهته
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {adminTab === 'vendors' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 font-sans">طلبات المكاتب والبائعين قيد المراجعة</h4>
                    <p className="text-xs text-slate-400">التدقيق الفوي على مستندات الهوية التعريفية الموحدة وتفعيل النشر للبائعين المتقدمين باللغة العربية.</p>
                  </div>

                  {applications.length === 0 ? (
                    <div className="bg-[#0c0e12] border border-white/5 rounded-xl p-8 text-center text-slate-500 text-sm">
                      لا توجد حالياً أي طلبات تسجيل معلقة في طابور الانتظار الإداري.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="bg-[#0c0e12] border border-white/5 rounded-xl overflow-hidden shadow-inner">
                          
                          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{app.businessName}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  app.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-500'
                                    : app.status === 'approved'
                                      ? 'bg-emerald-500/10 text-emerald-500'
                                      : 'bg-rose-500/10 text-rose-500'
                                }`}>
                                  {app.status === 'pending' ? 'بانتظار المراجعة' : app.status === 'approved' ? 'مقبول ونشط' : 'مرفوض'}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs mt-1">المالك: {app.fullName} • هاتف: {app.phone} • المحافظة: {app.province}</p>
                            </div>
                            
                            {app.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onApproveApplication(app.id)}
                                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>قبول وتفعيل</span>
                                </button>
                                <button
                                  onClick={() => onRejectApplication(app.id)}
                                  className="py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>رفض الطلب</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="p-4 bg-black/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="block text-[11px] text-slate-400 font-bold mb-1">بيانات النشاط التفصيلية:</span>
                              <p className="text-xs text-slate-300">العنوان الفعلي: {app.address}</p>
                              <p className="text-xs text-slate-300 mt-1">البريد الإلكتروني للإشعارات: {app.email || 'غير متوفر'}</p>
                              <p className="text-[10px] text-slate-500 mt-2 font-mono">رمز الطلب الفري: {app.id}</p>
                            </div>

                            {/* ID CARD VISUAL PREVIEW */}
                            <div>
                              <span className="block text-[11px] text-slate-400 font-bold mb-1.5">الهوية التعريفية المرفقة (ID Verification):</span>
                              {app.idCardPhoto ? (
                                <div className="border border-white/5 rounded-lg overflow-hidden bg-black/40 p-2 max-h-36 flex items-center justify-center">
                                  <img 
                                    src={app.idCardPhoto} 
                                    alt="Uploaded Official ID Scan" 
                                    className="max-h-32 object-contain rounded"
                                  />
                                </div>
                              ) : (
                                <div className="text-xs text-slate-550 italic text-slate-500">لا توجد وثيقة مرفقة بالطلب.</div>
                              )}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {adminTab === 'complaints' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">جدول شكاوى وبلاغات حماية المستهلك</h4>
                    <p className="text-xs text-slate-400">تابع بلاغات المشتريين وواجه المكاتب المشكو ضدها لضمان نزاهة أسعار قطع الكومبيوتر في العراق.</p>
                  </div>

                  {complaints.length === 0 ? (
                    <div className="bg-[#0c0e12] border border-white/5 rounded-xl p-8 text-center text-slate-500 text-sm">
                      لا توجد شكاوى مسجلة حالياً بالمنصة.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {complaints.map((c) => {
                        const relatedV = vendors.find(v => v.id === c.vendorId);
                        return (
                          <div key={c.id} className="bg-[#0c0e12] border border-white/5 rounded-xl p-4 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-3">
                              <div>
                                <span className="font-bold text-white text-sm block">{c.subject}</span>
                                <span className="text-[11px] text-slate-450 block mt-0.5 mt-1 text-slate-400">
                                  بواسطة: {c.fullName} | هاتف: {c.contactInfo} | التاريخ: {c.createdAt}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.status === 'pending'
                                    ? 'bg-red-500/10 text-red-400'
                                    : c.status === 'investigating'
                                      ? 'bg-amber-500/10 text-amber-500'
                                      : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                  {c.status === 'pending' ? 'قيد الانتظار' : c.status === 'investigating' ? 'جاري التحقيق' : 'تم حلها وتعديل السعر'}
                                </span>

                                <select
                                  className="bg-[#16191f] border border-white/5 rounded-lg py-1 px-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                                  value={c.status}
                                  onChange={(e) => onResolveComplaint(c.id, e.target.value as any)}
                                >
                                  <option value="pending">انتظار</option>
                                  <option value="investigating">تحقيق</option>
                                  <option value="resolved">حل المشكلة</option>
                                </select>
                              </div>
                            </div>

                            <div className="text-xs text-slate-300 leading-relaxed bg-[#16191f]/50 p-3 rounded-lg border border-white/5 font-sans">
                              {c.message}
                            </div>

                            {relatedV && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <span className="font-bold text-slate-400">المكتب المتورط في البلاغ:</span>
                                <span className="text-cyan-400 font-semibold">{relatedV.nameAr || relatedV.name}</span>
                                <span>({relatedV.address})</span>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {adminTab === 'finance' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">دفتر الحسابات والتمويل والدعم</h4>
                    <p className="text-xs text-slate-400">مراقبة التبرعات المرسلة طوعياً وسجل تجميع الإيرادات من رسوم إدراج البائعين.</p>
                  </div>

                  {/* FINANCE LEDGER GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Donations column */}
                    <div className="bg-[#0c0e12] p-4 rounded-xl border border-white/5 space-y-4">
                      <h5 className="text-xs font-bold text-cyan-400 border-b border-white/5 pb-2 flex items-center gap-2">
                        <HandHeart className="w-4 h-4" />
                        <span>سجل دعم الزين كاش والمساهمات</span>
                      </h5>

                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {donations.length === 0 ? (
                          <p className="text-xs text-slate-500 italic p-4 text-center">لا توجد مساهمات لتسجيل الدعم حالياً.</p>
                        ) : (
                          donations.map((d) => (
                            <div key={d.id} className="bg-[#16191f]/50 p-3 rounded-xl border border-white/5 text-xs">
                              <div className="flex justify-between items-center gap-2 font-bold">
                                <span className="text-slate-200">{d.donorName}</span>
                                <span className="text-emerald-400">+{d.amountIQD.toLocaleString('ar-IQ')} د.ع</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 font-mono">المرجع: {d.transferReference} | {d.paymentMethod}</p>
                              {d.message && <p className="text-[11px] text-slate-400 mt-1.5 italic bg-black/15 p-1.5 rounded">"{d.message}"</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Listing Fee Simulator logs */}
                    <div className="bg-[#0c0e12] p-4 rounded-xl border border-white/5 space-y-4">
                      <h5 className="text-xs font-bold text-cyan-400 border-b border-white/5 pb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>محاكاة تحصيل ميزانية رسوم الإدراج</span>
                      </h5>

                      <div className="space-y-3">
                        <div className="bg-[#16191f]/50 p-4 rounded-xl space-y-3 border border-white/5">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>إجمالي القطع في المعرض:</span>
                            <span className="font-bold text-white">{listingsCount} قطع كمبيوتر</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>الرسم الحالي للقطعة:</span>
                            <span className="font-bold text-cyan-400">{listingFee.toLocaleString('ar-IQ')} د.ع</span>
                          </div>
                          <div className="border-t border-white/5 pt-3 flex justify-between text-xs font-bold text-slate-300">
                            <span>إجمالي رسوم الإدراج المحصلة (تقديري):</span>
                            <span className="text-emerald-400">{(listingsCount * listingFee).toLocaleString('ar-IQ')} د.ع</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-[#16191f]/20 rounded-xl border border-white/5 text-[10px] text-slate-400 space-y-1.5 leading-normal">
                          <p className="font-bold text-slate-300">💡 آلية جمع الرسوم:</p>
                          <p>يتم قيد هذه المحاكاة للتأكد من ربحية المنصة ومصداقية القطع المضافة. في السوق الحقيقي، تدفع المكاتب المعتمدة الرسوم دورياً لتوفير التوازن.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
