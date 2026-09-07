import React from 'react';
import { Shield, Lock, Award, ArrowRight, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../locales';

interface WelcomeScreenProps {
  onRegister: () => void;
  onSignIn: () => void;
  lang: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onRegister,
  onSignIn,
  lang
}) => {
  const t = getT(lang);

  return (
    <div 
      id="welcome-screen" 
      className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-linear-to-b from-white via-slate-50 to-blue-50/50 text-slate-800 overflow-y-auto"
    >
      {/* Top Emblem & Header */}
      <div className="pt-2 sm:pt-4 flex flex-col items-center text-center">
        {/* Emblem with soft elevation */}
        <div className="relative mb-4 sm:mb-5">
          <div className="absolute -inset-1.5 bg-blue-600/20 rounded-3xl blur-md pointer-events-none" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#1E40AF] to-[#1E3A8A] flex items-center justify-center text-white shadow-xl shadow-blue-900/20 border border-blue-400/30">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-blue-100" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-bold mb-3 shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'km' ? 'ប្រព័ន្ធផ្ទាល់ខ្លួនរបស់សិស្ស' : 'Official Student Portal'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {t.welcomeSub}
        </h1>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-600 mt-1">
          {t.welcomeHeader}
        </h2>

        <p className="mt-3 text-xs leading-relaxed text-slate-500 max-w-[290px] font-medium">
          “{lang === 'km' ? t.mottoKhmer : t.mottoEnglish}”
        </p>
      </div>

      {/* Trust & Privacy Card */}
      <div className="my-5 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 border border-blue-100">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {lang === 'km' ? 'ឯកជនភាពដាច់ខាត' : 'Guaranteed Privacy'}
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              {lang === 'km' 
                ? 'គ្មានការផ្សាយបញ្ជីសាធារណៈ គ្មានចំណាត់ថ្នាក់។ មានតែអ្នកប៉ុណ្ណោះដែលអាចមើលឃើញលទ្ធផល។' 
                : 'No public lists, no peer rankings. You are the only person who can view your result.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {lang === 'km' ? 'ផ្គូផ្គងលេខសម្គាល់បេក្ខជន' : 'Candidate Number Matching'}
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
              {lang === 'km'
                ? 'លទ្ធផលនឹងត្រូវបានផ្ញើជូនស្វ័យប្រវត្តិ ពេលក្រសួងអប់រំប្រកាសជាផ្លូវការ។'
                : 'Results are automatically delivered once published by MoEYS.'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions & Privacy Statement */}
      <div className="space-y-2.5 pb-2">
        <button
          id="btn-welcome-register"
          onClick={onRegister}
          className="w-full h-12 bg-linear-to-r from-[#1E40AF] to-[#1E3A8A] hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] touch-manipulation cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.btnRegister}</span>
          <ArrowRight className="w-4 h-4 opacity-70 ml-1" />
        </button>

        <button
          id="btn-welcome-signin"
          onClick={onSignIn}
          className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/90 rounded-xl font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] touch-manipulation cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-blue-700" />
          <span>{t.btnSignIn}</span>
        </button>

        {/* Privacy statement */}
        <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200/60 mt-2 text-center">
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            {t.privacyNotice}
          </p>
        </div>
      </div>
    </div>
  );
};
