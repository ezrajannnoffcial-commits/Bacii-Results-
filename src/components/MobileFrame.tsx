import React from 'react';
import { 
  Award, 
  Globe, 
  Sparkles,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Language, Screen } from '../types';
import { getT } from '../locales';

interface MobileFrameProps {
  children: React.ReactNode;
  lang: Language;
  onToggleLang: () => void;
  currentScreen: Screen;
  isLoggedIn: boolean;
  onQuickSimulateRelease?: () => void;
  isResultReleased?: boolean;
  onNavigateToRegister?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  lang,
  onToggleLang,
  currentScreen,
  isLoggedIn,
  onQuickSimulateRelease,
  isResultReleased,
  onNavigateToRegister
}) => {
  const t = getT(lang);
  const isWelcome = currentScreen === 'welcome';

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col justify-between text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Mobile Web App Container: Centered on desktop, 100% full-width on mobile */}
      <div className="w-full max-w-lg mx-auto min-h-screen bg-slate-50 flex flex-col shadow-xl border-x border-slate-200/80 relative">
        
        {/* Sleek Mobile Web App Header (Hidden on Welcome Screen) */}
        {!isWelcome && (
          <>
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#1E40AF] to-[#1E3A8A] flex items-center justify-center text-white shadow-md shadow-blue-900/20 shrink-0">
                  <Award className="w-5 h-5 text-blue-100" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                      {t.appName}
                    </h1>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" title="MoEYS Online" />
                  </div>
                  <p className="text-[10px] text-blue-700 font-semibold tracking-wide mt-0.5">
                    {t.appSubtitle} • {lang === 'km' ? 'ក្រសួងអប់រំ' : 'MoEYS'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Demo Simulator Toggle */}
                {onQuickSimulateRelease && isLoggedIn && (
                  <button
                    id="header-demo-simulate-btn"
                    onClick={onQuickSimulateRelease}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-800 text-[10px] font-bold transition-all active:scale-95 shadow-2xs"
                    title={isResultReleased ? 'Switch to unreleased state' : 'Switch to released state'}
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>{isResultReleased ? (lang === 'km' ? 'សាកល្បង: មិនទាន់ចេញ' : 'Demo: Pending') : (lang === 'km' ? 'សាកល្បង: ចេញលទ្ធផល' : 'Demo: Release')}</span>
                  </button>
                )}

                {/* Quick Register button if on signin */}
                {onNavigateToRegister && !isLoggedIn && (
                  <button
                    id="header-register-btn"
                    onClick={onNavigateToRegister}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-sm shadow-blue-600/20 transition-all active:scale-95 touch-manipulation"
                    title="Register New Student"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ចុះឈ្មោះ' : 'Register'}</span>
                  </button>
                )}

                {/* Language Switcher Pill */}
                <button
                  id="lang-toggle-btn"
                  onClick={onToggleLang}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/90 text-slate-800 text-xs font-bold transition-all active:scale-95 shadow-2xs touch-manipulation"
                  aria-label="Toggle language"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'km' ? 'ខ្មែរ' : 'EN'}</span>
                </button>
              </div>
            </header>

            {/* Floating Privacy Assurance Ribbon */}
            <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-950 text-white px-4 py-1.5 flex items-center justify-between text-[10px] font-medium tracking-wide shadow-xs">
              <span className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span className="truncate">{lang === 'km' ? t.mottoKhmer : t.mottoEnglish}</span>
              </span>
              <span className="opacity-80 text-[9px] uppercase tracking-wider font-mono shrink-0 ml-2 bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">
                Private 1:1
              </span>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative min-h-0">
          {children}
        </div>

        {/* Web App Footer (Hidden on Welcome Screen) */}
        {!isWelcome && (
          <footer className="px-4 py-3 bg-white border-t border-slate-200/80 text-center text-[10px] text-slate-400 select-none space-y-0.5">
            <p className="font-semibold text-slate-600">
              © {new Date().getFullYear()} {lang === 'km' ? 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' : 'Ministry of Education, Youth and Sport (MoEYS)'}
            </p>
            <p className="text-[9px] text-slate-400">
              {lang === 'km'
                ? 'ប្រព័ន្ធលទ្ធផលបាក់ឌុបផ្ទាល់ខ្លួនសម្រាប់បេក្ខជនម្នាក់ៗ គ្មានការផ្សាយជាសាធារណៈឡើយ'
                : 'Private 1:1 Examination Results Delivery Portal — No public search'}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};
