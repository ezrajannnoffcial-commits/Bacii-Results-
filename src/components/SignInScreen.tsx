import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LogIn, 
  ShieldCheck, 
  Hash, 
  Lock, 
  Eye, 
  EyeOff, 
  Award,
  Sparkles
} from 'lucide-react';
import { Language, StudentProfile } from '../types';
import { getT } from '../locales';
import { verifyCredentials, getRegisteredStudents } from '../utils/storage';

interface SignInScreenProps {
  onSignInSuccess: (student: StudentProfile) => void;
  onBackToWelcome?: () => void;
  onGoToRegister: () => void;
  lang: Language;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSignInSuccess,
  onBackToWelcome,
  onGoToRegister,
  lang
}) => {
  const t = getT(lang);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg(lang === 'km' ? 'សូមបញ្ចូលលេខបេក្ខជន និងពាក្យសម្ងាត់' : 'Please enter candidate number and password');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const student = verifyCredentials(identifier.trim(), password.trim());
      if (student) {
        onSignInSuccess(student);
      } else {
        // Check if identifier exists at all
        const allStudents = getRegisteredStudents();
        const exists = allStudents.some(s => 
          s.candidateNumber === identifier.trim() || 
          s.phoneNumber.replace(/\s+/g, '') === identifier.trim().replace(/\s+/g, '')
        );
        if (exists) {
          setErrorMsg(lang === 'km' ? 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ' : 'Incorrect password');
        } else {
          setErrorMsg(
            lang === 'km' 
              ? 'រកមិនឃើញគណនីនេះទេ។ សូមចុច "ចុះឈ្មោះ" ឬប្រើ "គណនីគំរូ"' 
              : 'Account not found. Please register or click "Use Demo".'
          );
        }
      }
    }, 400);
  };

  const handleUseDemoAccount = () => {
    setIdentifier('123-456-789');
    setPassword('secret123');
    setErrorMsg('');
  };

  return (
    <div id="signin-screen" className="flex-1 flex flex-col justify-between p-6 bg-slate-50 text-slate-800 overflow-y-auto">
      <div>
        {/* Top Back Nav */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToWelcome || onGoToRegister}
            className="p-1 text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.btnBack}</span>
          </button>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {lang === 'km' ? 'ប្រព័ន្ធឯកជន' : 'Private Access'}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1E40AF] to-[#1E3A8A] flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-blue-900/20">
            <Award className="w-6 h-6 text-blue-100" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {t.signInTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
            {t.signInDesc}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-blue-600" />
              {t.candidateNumberOrPhone}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 123-456-789 or 012889977"
              className="w-full px-3 py-2.5 bg-white text-xs font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              {t.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Demo account quick fill button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleUseDemoAccount}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-semibold rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'km' ? 'ប្រើគណនីគំរូ: សុខ សីហា (123-456-789)' : 'Use Demo: Sok Seiha (123-456-789)'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-linear-to-r from-[#1E40AF] to-[#1E3A8A] hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {lang === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying...'}
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t.btnSignIn}</span>
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <div className="mt-6 p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-500 leading-snug">
          <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            {lang === 'km' ? 'ការការពារឯកជនភាព និងសុវត្ថិភាព' : 'Privacy Protection'}
          </p>
          {t.privacyNotice}
        </div>
      </div>

      {/* Footer to Register */}
      <div className="pt-6 pb-2 text-center border-t border-slate-200">
        <p className="text-xs text-slate-500">
          {t.dontHaveAccount}{' '}
          <button
            onClick={onGoToRegister}
            className="font-bold text-blue-600 hover:text-blue-800 underline ml-1"
          >
            {t.btnRegister}
          </button>
        </p>
      </div>
    </div>
  );
};
