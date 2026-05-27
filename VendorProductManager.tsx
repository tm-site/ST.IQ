/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Check, Star } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export default function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedRules, setCheckedRules] = useState({
    pricing: false,
    verification: false,
    ratings: false,
  });

  useEffect(() => {
    const accepted = localStorage.getItem('steel_platform_disclaimer_accepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    if (checkedRules.pricing && checkedRules.verification && checkedRules.ratings) {
      localStorage.setItem('steel_platform_disclaimer_accepted', 'true');
      setIsOpen(false);
      onAccept();
    }
  };

  if (!isOpen) return null;

  const allChecked = checkedRules.pricing && checkedRules.verification && checkedRules.ratings;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#1e222b] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-black p-3 rounded-full shadow-lg">
          <Shield className="w-8 h-8" />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            STEEL PLATFORM
          </h2>
          <p className="text-cyan-400 font-mono text-xs tracking-widest mt-1 uppercase">
            Official Regulatory Notice • إعلان تنظيمي رسمي
          </p>
        </div>

        {/* BILINGUAL LEGAL DISCLAIMER */}
        <div className="mt-6 space-y-4 text-slate-300 text-sm leading-relaxed max-h-[300px] overflow-y-auto pr-2 border-y border-white/10 py-4 custom-scrollbar">
          {/* Arabic Portion */}
          <div className="text-right border-b border-white/5 pb-4" dir="rtl">
            <h3 className="text-base font-bold text-cyan-400 mb-2">إخلاء مسؤولية تنظيمي وقوانين المنصة:</h3>
            <p className="mb-2">
              يرجى قراءة البنود التنظيمية لـ <strong>STEEL PLATFORM (منصة ستيل)</strong> قبل الدخول للخدمات:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 font-sans text-xs">
              <li>المنصة عبارة عن <strong>مجمّع أسعار ومقارنة أسعار أجهزة الكومبيوتر</strong> في العراق فقط، وليست بائعاً مباشراً أو مكاتباً تجارياً.</li>
              <li>الأسعار المعروضة بالدينار العراقي (IQD) يتم تحديثها وإدخالها بواسطة المكاتب والشركات المحلية المسجلة بشكل مستقل.</li>
              <li>المشترون يتحملون كامل المسؤولية لفحص القطع والأجهزة الأصلية والتأكد من توافقية الأرقام التسلسلية والضمانات محلياً قبل إتمام الشراء.</li>
              <li>تتيح المنصة <strong>ميزة تقييم البائع</strong> للجمهور لبناء بيئة ثقة شفافة. نرجو استخدام الميزة بجدية لتقييم المكاتب بعد التعامل الفعلي معها.</li>
            </ul>
          </div>

          {/* English Portion */}
          <div className="text-left select-text">
            <h3 className="text-base font-bold text-cyan-400 mb-2">Platform Rules & General Disclaimer:</h3>
            <p className="mb-2">
              Please read the compliance terms for <strong>STEEL PLATFORM</strong> before browsing the marketplace:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 font-sans text-xs">
              <li>The board is purely a centralized <strong>pricing aggregator and comparison tool</strong> for computer hardware in Iraq, and does not conduct transactions.</li>
              <li>Listed pricing is in Iraqi Dinar (IQD) controlled directly by decentralized independent local offices.</li>
              <li>Tech buyers must review all warranties, hardware legitimacy, and physical condition upon delivery or store pickup directly with the vendor.</li>
              <li>We supply deep <strong>Vendor Rating Features</strong> to reward community transparency. Use feedback mechanics with integrity based on factual interactions.</li>
            </ul>
          </div>
        </div>

        {/* MUST-CHECK INTERACTIVE TERMS */}
        <div className="mt-6 space-y-3" dir="rtl">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-cyan-500 rounded border-white/10 bg-[#0c0e12]"
              checked={checkedRules.pricing}
              onChange={(e) => setCheckedRules({ ...checkedRules, pricing: e.target.checked })}
            />
            <span className="text-xs text-slate-300 leading-normal group-hover:text-white transition-colors">
              أفهم أن الأسعار مدخلة من قبل مكاتب مستقلة وهي بالدينار العراقي (IQD) والمنصة لا تبيع بطريقة مباشرة.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-cyan-500 rounded border-white/10 bg-[#0c0e12]"
              checked={checkedRules.verification}
              onChange={(e) => setCheckedRules({ ...checkedRules, verification: e.target.checked })}
            />
            <span className="text-xs text-slate-300 leading-normal group-hover:text-white transition-colors text-right">
              أوافق على أن جميع البائعين المعتمدين يمرون بعملية رفع الهوية الشخصية ومطابقة البيانات الرسمية قبل منحهم صلاحية النشر الفوري.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-cyan-500 rounded border-white/10 bg-[#0c0e12]"
              checked={checkedRules.ratings}
              onChange={(e) => setCheckedRules({ ...checkedRules, ratings: e.target.checked })}
            />
            <span className="text-xs text-slate-300 leading-normal group-hover:text-white transition-colors text-right">
              أدرك أهمية <strong>ميزة تقييم البائع</strong> وأن التقييمات كاذبة أو المسيئة سيتم مراجعتها وتصفيرها من قبل الإدارة.
            </span>
          </label>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={handleAgree}
            disabled={!allChecked}
            className={`w-full py-4 px-6 rounded-xl font-bold font-sans transition-all duration-300 flex items-center justify-center gap-2 ${
              allChecked
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] cursor-pointer'
                : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'
            }`}
          >
            {allChecked ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>موافق وأفهم الشروط | Agree & Enter Platform</span>
              </>
            ) : (
              <span>يرجى الموافقة على جميع الشروط للمتابعة</span>
            )}
          </button>
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-500 font-mono">STEEL PLATFORM SECURITY POLICY v4.26 • SECURED COMPLIANCE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
