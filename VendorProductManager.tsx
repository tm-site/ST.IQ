/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, HelpCircle, ShieldAlert, Award, ArrowRight, CheckCircle2, DollarSign, ListFilter, MessageSquareWarning, X } from 'lucide-react';
import { Complaint, SupportDonation, Vendor } from '../types';

interface SupportComplaintsProps {
  vendors: Vendor[];
  onAddComplaint: (complaint: Complaint) => void;
  onAddDonation: (donation: SupportDonation) => void;
  initialTab?: 'support' | 'complaints';
  onClose?: () => void;
}

export default function SupportComplaints({ vendors, onAddComplaint, onAddDonation, initialTab, onClose }: SupportComplaintsProps) {
  const [activeTab, setActiveTab] = useState<'support' | 'complaints'>(initialTab || 'support');
  
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Support Form State
  const [donorName, setDonorName] = useState('');
  const [supportAmount, setSupportAmount] = useState<number>(15000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ZainCash' | 'AsiaPay' | 'QiCard' | 'FastPay'>('ZainCash');
  const [transferRef, setTransferRef] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  // Complaints Form State
  const [complaintName, setComplaintName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [subject, setSubject] = useState('');
  const [complaintMsg, setComplaintMsg] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = supportAmount === 0 ? parseFloat(customAmount) : supportAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    const reference = transferRef || `TXN${Math.floor(10000000000 + Math.random() * 90000000000)}`;

    const newDonation: SupportDonation = {
      id: `don_${Date.now()}`,
      donorName: donorName || 'مساهم مجهول',
      amountIQD: finalAmount,
      paymentMethod,
      transferReference: reference,
      message: supportMsg,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddDonation(newDonation);
    setSupportSuccess(true);
    
    // Reset Form
    setDonorName('');
    setSupportAmount(15000);
    setCustomAmount('');
    setTransferRef('');
    setSupportMsg('');
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintName || !contactInfo || !subject || !complaintMsg) return;

    const newComplaint: Complaint = {
      id: `comp_${Date.now()}`,
      fullName: complaintName,
      contactInfo,
      vendorId: selectedVendorId || undefined,
      subject,
      message: complaintMsg,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddComplaint(newComplaint);
    setComplaintSuccess(true);

    // Reset Form
    setComplaintName('');
    setContactInfo('');
    setSelectedVendorId('');
    setSubject('');
    setComplaintMsg('');
  };

  return (
    <div className="bg-[#1e222b] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-xl" id="support-complaints-section">
      
      {/* Tab selection */}
      <div className="flex items-center justify-between border-b border-white/5 p-1 bg-[#0c0e12]" dir="rtl">
        <div className="flex flex-1 items-center">
          <button
            onClick={() => { setActiveTab('support'); setSupportSuccess(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all rounded-xl cursor-pointer ${
              activeTab === 'support'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'support' ? 'fill-cyan-500/35 stroke-[2.5]' : ''}`} />
            <span>تطوير ودعم المنصة (Support Platform)</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('complaints'); setComplaintSuccess(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all rounded-xl cursor-pointer ${
              activeTab === 'complaints'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>تقديم شكوى أو بلاغ (Post Complaint)</span>
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-white transition-colors cursor-pointer mr-2 ml-1"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8" dir="rtl">
        {activeTab === 'support' ? (
          <div>
            {supportSuccess ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">شكراً جزيلاً لدعمك السخي!</h4>
                <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                  تساهم تبرعات المستخدمين في دفع فواتير السيرفرات السحابية ومراقبة الأسعار لمكافحة الاحتكار في سوق الحاسوب العراقي.
                </p>
                <button
                  onClick={() => setSupportSuccess(false)}
                  className="mt-6 text-cyan-400 hover:text-cyan-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>تقديم مساهمة أخرى</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans text-right">دعم الاستدامة المالية للمنصة</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    نحن منصة عراقية مستقلة تماماً لا تتبع لأي مكتب تجاري. نعتمد على رسوم الإدراج الرمزية وتبرعات المحترفين لإبقائها خالية من الإعلانات ومنصفة للجميع.
                  </p>
                </div>

                {/* Preset buttons layout with Iraqi Dinar value */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2.5">اختر قيمة الدعم المالي (بالدينار العراقي):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[5000, 15000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setSupportAmount(amt); setCustomAmount(''); }}
                        className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer ${
                          supportAmount === amt
                            ? 'bg-cyan-950/25 border-cyan-500 text-cyan-300 font-bold'
                            : 'bg-[#0c0e12] border-white/5 text-slate-400 hover:border-cyan-500/40'
                        }`}
                      >
                        {amt.toLocaleString('ar-IQ')} د.ع
                        <span className="block text-[10px] text-slate-500 font-normal font-mono mt-0.5">
                          ~ ${(amt / 1500).toFixed(0)} USD
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSupportAmount(0)}
                      className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer ${
                        supportAmount === 0
                          ? 'bg-cyan-950/25 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#0c0e12] border-white/5 text-slate-400 hover:border-cyan-500/40'
                      }`}
                    >
                      مبلغ مخصص
                    </button>
                  </div>

                  {supportAmount === 0 && (
                    <div className="mt-3 relative">
                      <input
                        type="number"
                        placeholder="أدخل المبلغ المخصص بالدينار العراقي"
                        required
                        className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors pl-14 text-right"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold font-mono">د.ع</span>
                    </div>
                  )}
                </div>

                {/* Payment method choose */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2.5">طريقة التحويل المفضلة في العراق:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'ZainCash', name: 'زين كاش (Zain Cash)', details: 'رقم المحفظة: 5364950152239054 • تحويل فوري محلي' },
                      { id: 'AsiaPay', name: 'آسيا بي (AsiaPay)', details: 'رقم المحفظة: 07501234567 • تحويل فوري وسهل' },
                      { id: 'QiCard', name: 'كي كارد / الماستر كارد', details: 'رقم البطاقة: 07716948525 • مصرف الرافدين' },
                      { id: 'FastPay', name: 'فاست بي (FastPay)', details: 'رقم الدفع: 07509998887 • إقليم كردستان' }
                    ].map((pw) => (
                      <label
                        key={pw.id}
                        className={`border rounded-xl p-3.5 flex flex-col justify-between cursor-pointer select-none transition-all ${
                          paymentMethod === pw.id
                            ? 'bg-[#0f1116] border-cyan-500/50 ring-1 ring-cyan-500'
                            : 'bg-[#0c0e12] border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="payment_method"
                            className="accent-cyan-500"
                            checked={paymentMethod === pw.id}
                            onChange={() => setPaymentMethod(pw.id as any)}
                          />
                          <span className="text-xs font-bold text-white">{pw.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{pw.details}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم الداعم الكريم (تظهر باللوحة)</label>
                    <input
                      type="text"
                      placeholder="مثال: المهندس علي من البصرة"
                      className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5 flex items-center gap-1 text-slate-300">
                      <span>رقم مرجع التحويل أو الإشعار لشحن الرصيد *</span>
                      <HelpCircle className="w-3 h-3 text-slate-500" title="الرمز الذي تحصل عليه من رسالة التحويل النصية لتأكيد العملية" />
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: TXN892014023..."
                      className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-mono text-left"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">رسالة مع الدعم أو اقتراحاتك</label>
                  <textarea
                    rows={2}
                    placeholder="اكتب هنا كلمتك لمطوري المنصة أو التحديثات التي ترغب برؤيتها مستقبلاً..."
                    className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    value={supportMsg}
                    onChange={(e) => setSupportMsg(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-600/15 transition-all cursor-pointer"
                >
                  إرسال تأكيد الدعم لتفعيل الخادم
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {complaintSuccess ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-450 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">تم استلام الشكوى وبدأت عملية التدقيق المالي</h4>
                <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                  تم تسجيل البلاغ وسيقوم المشرفون على المنصة بمطابقة الشكوى والتواصل مع المكتب المعني. في حال ثبوت المخالفة أو التلاعب بالأسعار سيتم تجميد حساب المكتب فوراً.
                </p>
                <button
                  onClick={() => setComplaintSuccess(false)}
                  className="mt-6 text-rose-400 hover:text-rose-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>تقديم بلاغ آخر</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans text-right">قناة متخصصة لتقديم الشكاوى وبلاغات المستهلك</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    هل لاحظت أسعاراً غير مطابقة للواقع؟ أم واجهت تهرباً من شروط الضمان المعروضة على المنصة؟ أرسل بلاغاً مفصلاً لتقوم الإدارة باتخاذ الإجراءات التأديبية وتجميد عضوية المكتب المخالف.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسمك الكامل (المشتكي) *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ياسر يوسف العبادي"
                      className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      value={complaintName}
                      onChange={(e) => setComplaintName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الهاتف أو البريد الإلكتروني للتواصل ومتابعة الشكوى *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 0770xxxxxxx"
                      className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">المكتب المشكو ضده *</label>
                    <select
                      className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                    >
                      <option value="">-- شكوى عامة على السوق العراقي / غير محدد --</option>
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.nameAr || v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">موضوع الشكوى أو المخالفة *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: السعر في المحل أعلى من السعر المعروض بـ 20 ألف"
                      className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">تفاصيل المشكلة والواقعة بالكامل *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="يرجى ذكر تفاصيل المشكلة، تاريخ الزيارة، والقطع التي سعيت لشرائها، والمواصفات المعنية..."
                    className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    value={complaintMsg}
                    onChange={(e) => setComplaintMsg(e.target.value)}
                  />
                </div>

                <div className="bg-[#0c0e12] border border-rose-500/20 rounded-xl p-3.5 text-xs text-rose-300 flex items-start gap-2.5">
                  <MessageSquareWarning className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="leading-normal">
                    <strong>تنبيه المستهلك:</strong> نحن نحقق بجميع البلاغات بجدية بالغة ومطابقة فواتير العملاء. تقديم بلاغات كيدية أو بهتانية متكررة بهدف الإضرار بسمعة المكاتب سيسفر عن حظر آيبي المتصفح الخاص بك بالكامل.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-550 hover:bg-rose-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-600/10 transition-all cursor-pointer"
                >
                  إرسال البلاغ المغلق للمراجعة الفورية
                </button>
              </form>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
