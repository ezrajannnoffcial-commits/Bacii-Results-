import React from 'react';
import { 
  Award, 
  ArrowRight, 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  BellRing, 
  GraduationCap, 
  CheckCircle2,
  Calendar,
  Globe
} from 'lucide-react';
import { Language } from '../types';
import { getT } from '../locales';

interface WelcomeScreenProps {
  onRegister: () => void;
  onSignIn: () => void;
  onDemoAccess: () => void;
  onToggleLang: () => void;
  lang: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onRegister,
  onSignIn,
  onDemoAccess,
  onToggleLang,
  lang
}) => {
  const t = getT(lang);

  return (
    <div 
      id="welcome-screen" 
      className="flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-y-auto"
    >
      {/* Top Bar with MoEYS Badges & Language Switcher */}
      <div className="p-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-blue-400">
              {lang === 'km' ? 'ក្រសួងអប់រំ យុវជន និងកីឡា' : 'Ministry of Education'}
            </div>
            <div className="text-[9px] text-slate-400 font-medium">
              MoEYS • Cambodia
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all active:scale-95"
          aria-label="Change language"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{lang === 'km' ? 'ខ្មែរ' : 'EN'}</span>
        </button>
      </div>

      {/* Main Hero Section */}
      <div className="px-5 py-4 flex flex-col items-center text-center">
        {/* Official Medal Emblem with Glow */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 blur-xl"></div>
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-2xl border border-blue-400/30">
            <Award className="w-10 h-10 text-amber-300 drop-shadow-md" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] border-2 border-slate-900 shadow-md">
            2026
          </span>
        </div>

        {/* Official Titles */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{lang === 'km' ? 'សម័យប្រឡង៖ ២០២៦' : 'Exam Session: 2026'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">
          {lang === 'km' ? 'លទ្ធផលប្រឡងបាក់ឌុប' : 'Bac II Student Portal'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-[320px] leading-relaxed mb-5">
          {lang === 'km' 
            ? 'ប្រព័ន្ធសុវត្ថិភាពផ្លូវការ សម្រាប់បេក្ខជនប្រឡងមធ្យមសិក្សាទុតិយភូមិ ពិនិត្យលទ្ធផល និងទទួលវិញ្ញាបនបត្រឌីជីថល' 
            : 'Official, secure portal for Cambodian High School Diploma candidates to verify results and download certified slips.'}
        </p>

        {/* Highlights Trio */}
        <div className="w-full grid grid-cols-3 gap-2 mb-4 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <BellRing className="w-4 h-4 text-blue-400 mb-1.5" />
            <div className="text-[11px] font-bold text-white leading-tight">
              {lang === 'km' ? 'លទ្ធផលភ្លាមៗ' : 'Instant Alert'}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">
              {lang === 'km' ? 'ជូនដំណឹងពេលចេញ' : 'Live push alert'}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <QrCode className="w-4 h-4 text-emerald-400 mb-1.5" />
            <div className="text-[11px] font-bold text-white leading-tight">
              {lang === 'km' ? 'កូដ QR' : 'QR Verified'}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">
              {lang === 'km' ? 'វិញ្ញាបនបត្រផ្លូវការ' : 'Official slip'}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5">
            <GraduationCap className="w-4 h-4 text-amber-400 mb-1.5" />
            <div className="text-[11px] font-bold text-white leading-tight">
              {lang === 'km' ? 'ទីប្រឹក្សា AI' : 'AI Advisor'}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-snug">
              {lang === 'km' ? 'ណែនាំសាកលវិទ្យាល័យ' : 'Career guide'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="p-5 pt-0 space-y-2.5">
        {/* Primary CTA: Register */}
        <button
          id="welcome-register-btn"
          type="button"
          onClick={onRegister}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all active:scale-[0.98]"
        >
          <span>{lang === 'km' ? 'ចុះឈ្មោះពិនិត្យលទ្ធផល' : 'Register for Result'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary CTA: Sign In */}
        <button
          id="welcome-signin-btn"
          type="button"
          onClick={onSignIn}
          className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all active:scale-[0.98]"
        >
          <LogIn className="w-4 h-4 text-blue-300" />
          <span>{lang === 'km' ? 'ចូលប្រើប្រាស់គណនី (Sign In)' : 'Sign In to Account'}</span>
        </button>

        {/* Demo Fast Access */}
        <div className="pt-2 text-center">
          <button
            id="welcome-demo-btn"
            type="button"
            onClick={onDemoAccess}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'km' ? 'ចូលមើលគំរូភ្លាមៗ (Try Demo Profile: សុខ សីហា)' : 'Quick Demo: Sok Seiha (Grade A)'}</span>
          </button>
        </div>

        {/* Security & Privacy Badge */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'km' ? 'ប្រព័ន្ធឯកជនភាព និងសុវត្ថិភាព 100%' : '100% Secure & Confidential Student Data'}</span>
        </div>
      </div>
    </div>
  );
};
