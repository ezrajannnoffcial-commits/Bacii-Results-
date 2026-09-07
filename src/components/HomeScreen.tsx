import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  School as SchoolIcon, 
  MapPin, 
  Hash, 
  Calendar, 
  Sparkles,
  Lock,
  GraduationCap
} from 'lucide-react';
import { StudentProfile, ExamResult, Language } from '../types';
import { getT } from '../locales';

interface HomeScreenProps {
  student: StudentProfile;
  result: ExamResult | null;
  onViewResult: () => void;
  onNavigateAdvisor?: () => void;
  onToggleRelease: () => void;
  lang: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  student,
  result,
  onViewResult,
  onNavigateAdvisor,
  onToggleRelease,
  lang
}) => {
  const t = getT(lang);
  const isReleased = result?.isReleased ?? false;

  return (
    <div id="home-screen" className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-800">
      {/* Student Greeting & Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.homeGreeting}
          </span>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>{lang === 'km' ? student.fullNameKm : student.fullNameLatin}</span>
            <span className="text-xs font-normal text-slate-500">
              ({lang === 'km' ? student.fullNameLatin : student.fullNameKm})
            </span>
          </h2>
        </div>

        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold border border-blue-200">
          {student.fullNameLatin.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Main Status Card */}
      {!isReleased ? (
        /* BEFORE RESULTS RELEASED: Large Status Card */
        <div 
          id="status-card-not-released"
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
              {lang === 'km' ? 'កំពុងរង់ចាំការប្រកាស' : 'Pending Announcement'}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
            {t.statusNotReleasedSub}
          </h3>
          <h4 className="text-sm font-semibold text-slate-600 mt-0.5">
            {t.statusNotReleasedTitle}
          </h4>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {t.statusNotReleasedDesc}
          </p>

          <div className="my-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {t.examYearLabel}:
              </span>
              <span className="font-bold text-slate-800">{student.examYear}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {t.candidateNumber}:
              </span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {student.candidateNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <SchoolIcon className="w-3.5 h-3.5" />
                {t.school}:
              </span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">{student.school}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {t.examCenter}:
              </span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">{student.examCenter}</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2 text-[10px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{t.privacyBadge}</span>
          </div>
        </div>
      ) : (
        /* WHEN RESULTS BECOME AVAILABLE: Large Status Card */
        <div 
          id="status-card-released"
          className="bg-linear-to-br from-blue-50 to-indigo-50/60 rounded-2xl p-5 border border-blue-200 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {lang === 'km' ? 'ចេញជាផ្លូវការហើយ' : 'Officially Released'}
            </span>
            <span className="text-[10px] font-bold text-blue-800">
              {result?.releaseDate}
            </span>
          </div>

          <h3 className="text-xl font-black text-blue-950 leading-tight">
            {t.statusReleasedTitle}
          </h3>
          <h4 className="text-sm font-semibold text-blue-800 mt-0.5">
            {t.statusReleasedSub}
          </h4>

          <p className="text-xs text-blue-900/80 mt-2 leading-relaxed">
            {t.statusReleasedDesc}
          </p>

          {/* Quick Result Preview Pill */}
          <div className="my-4 p-3 bg-white/90 backdrop-blur-xs rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.candidateNumber}
              </span>
              <span className="font-mono text-sm font-bold text-blue-900">
                {student.candidateNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.examYearLabel}
              </span>
              <span className="text-xs font-bold text-slate-800">
                {student.examYear}
              </span>
            </div>
          </div>

          {/* Button: View My Result */}
          <button
            id="btn-home-view-result"
            onClick={onViewResult}
            className="w-full py-3.5 bg-linear-to-r from-[#1E40AF] to-[#1E3A8A] hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>{t.btnViewResult}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Candidate Registration Record Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            {t.candidateCardTitle}
          </h3>
          <span className="text-[10px] font-bold text-slate-400">
            {student.track === 'Science' ? t.trackScience : t.trackSocial}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">{t.fullNameLatin}</span>
            <span className="font-bold text-slate-800">{student.fullNameLatin}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{t.fullNameKm}</span>
            <span className="font-bold text-slate-800">{student.fullNameKm}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{t.candidateNumber}</span>
            <span className="font-mono font-bold text-blue-700">{student.candidateNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">{t.roomAndDesk}</span>
            <span className="font-bold text-slate-800">
              {result?.roomNumber ? `បន្ទប់ ${result.roomNumber}, តុ ${result.deskNumber}` : 'បន្ទប់ 14, តុ 28'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Score Breakdown & University Matchmaker Hero Card */}
      <div 
        id="card-ai-advisor-promo"
        className="bg-linear-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-4 text-white shadow-sm border border-indigo-800/60 relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {lang === 'km' ? 'មុខងារថ្មី (New 2026)' : 'New AI Feature'}
          </span>
          <span className="text-[10px] text-indigo-200">Gemini 3.8 Flash</span>
        </div>

        <h3 className="text-sm font-extrabold text-white leading-snug">
          {lang === 'km' ? 'ទីប្រឹក្សាអប់រំ និងសាកលវិទ្យាល័យ AI' : 'AI Academic & Major Matchmaker'}
        </h3>
        <p className="text-[11px] text-indigo-200/90 mt-1 leading-relaxed">
          {lang === 'km' 
            ? 'វិភាគពិន្ទុបាក់ឌុប រកមុខវិជ្ជាខ្លាំង-ខ្សោយ ណែនាំសាកលវិទ្យាល័យ RUPP, ITC, CADT, NUM, PUC និងអាហារូបករណ៍។' 
            : 'Analyze raw subject grades, evaluate strongest vs. weakest areas, and discover tailored Cambodian university & scholarship pathways.'}
        </p>

        {onNavigateAdvisor && (
          <button
            id="btn-home-launch-advisor"
            onClick={onNavigateAdvisor}
            className="mt-3 w-full py-2.5 bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.99]"
          >
            <GraduationCap className="w-4 h-4 text-indigo-700" />
            <span>{lang === 'km' ? 'ចូលទៅកាន់ទីប្រឹក្សា AI ឥឡូវនេះ' : 'Open AI Score Counselor'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-700 ml-1" />
          </button>
        )}
      </div>

      {/* Official Notice Card */}
      <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/80 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-blue-900 leading-relaxed">
          <p className="font-bold">{t.systemNoticeTitle}</p>
          <p className="text-blue-800/80 mt-0.5">{t.systemNoticeDesc}</p>
        </div>
      </div>

      {/* Demo Simulation Toggle */}
      <div className="p-3 bg-slate-100/90 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-[11px] font-bold text-slate-700">{t.demoToggleTitle}</p>
              <p className="text-[9px] text-slate-500">
                {isReleased 
                  ? (lang === 'km' ? 'បច្ចុប្បន្ន: លទ្ធផលបានចេញហើយ' : 'Current: Result Released')
                  : (lang === 'km' ? 'បច្ចុប្បន្ន: មិនទាន់ចេញ' : 'Current: Result Not Released')}
              </p>
            </div>
          </div>
          <button
            id="toggle-release-state-btn"
            onClick={onToggleRelease}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
              isReleased 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isReleased 
              ? (lang === 'km' ? 'ប្តូរជា «មិនទាន់ចេញ»' : 'Set Not Released')
              : (lang === 'km' ? 'បញ្ចេញលទ្ធផលឥឡូវ' : 'Simulate Release')}
          </button>
        </div>
      </div>
    </div>
  );
};
