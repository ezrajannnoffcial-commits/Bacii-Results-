import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileText, 
  Clock, 
  RefreshCw,
  Sparkles,
  Award,
  CheckCircle
} from 'lucide-react';
import { StudentProfile, ExamResult, Language } from '../types';
import { getT } from '../locales';
import { generateResultPdf } from '../utils/pdfGenerator';
import { normalizeExamResult } from '../utils/scoreCalculator';

interface ResultScreenProps {
  student: StudentProfile;
  result: ExamResult | null;
  onSimulateRelease: () => void;
  onNavigateAdvisor?: () => void;
  lang: Language;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  student,
  result: rawResult,
  onSimulateRelease,
  onNavigateAdvisor,
  lang
}) => {
  const t = getT(lang);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Normalize result so that total score and subject max scores follow official MoEYS rules
  const result = useMemo(() => (rawResult ? normalizeExamResult(rawResult) : null), [rawResult]);

  // If result is NOT released yet, show the specified waiting state
  if (!result || !result.isReleased) {
    return (
      <div id="result-screen-unreleased" className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-slate-50 text-slate-800">
        <div className="pt-6 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200 mb-2">
            {t.statusNotReleasedSub}
          </span>

          <h2 className="text-xl font-black text-slate-900">
            {t.statusNotReleasedTitle}
          </h2>

          <p className="text-xs text-slate-500 mt-2 max-w-[280px] leading-relaxed font-medium">
            {lang === 'km'
              ? 'លទ្ធផលប្រឡងបាក់ឌុបរបស់អ្នកមិនទាន់ត្រូវបានប្រកាសជាផ្លូវការនៅឡើយទេ។ យើងនឹងជូនដំណឹងដល់អ្នកភ្លាមៗពេលលទ្ធផលត្រូវបានចេញផ្សាយ។'
              : 'Your Bac II result has not been released yet. We will deliver it privately to your account the moment it is released.'}
          </p>

          <div className="mt-5 w-full p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-left space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t.fullNameLatin}:</span>
              <span className="font-bold text-slate-800">{student.fullNameLatin}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t.candidateNumber}:</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {student.candidateNumber}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t.examSession}:</span>
              <span className="font-bold text-slate-800">{student.examYear}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t.school}:</span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[170px]">{student.school}</span>
            </div>
          </div>
        </div>

        {/* Demo release button */}
        <div className="pb-4 space-y-2">
          <button
            onClick={onSimulateRelease}
            className="w-full h-12 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all active:scale-[0.98] touch-manipulation cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'km' ? 'សាកល្បងទទួលលទ្ធផលឥឡូវ (Demo)' : 'Simulate Result Delivery (Demo)'}</span>
          </button>
        </div>
      </div>
    );
  }

  const isPass = result.overallStatus === 'PASS';

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      generateResultPdf(result);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div id="result-screen" className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 bg-slate-50 text-slate-800">
      {/* Header Section */}
      <div className="text-center pt-1 border-b border-slate-200/80 pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-bold mb-1 shadow-2xs">
          <FileText className="w-3 h-3 text-blue-600" />
          <span>{lang === 'km' ? 'លទ្ធផលផ្លូវការផ្ទាល់ខ្លួន' : 'Official Private Result'}</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 leading-tight">
          {t.resultTitleKhmer}
        </h1>
        <h2 className="text-xs font-semibold text-slate-500 mt-0.5">
          {t.resultTitleEn}
        </h2>
      </div>

      {/* Prominent Overall Result Box */}
      <div 
        id="overall-result-banner" 
        className="bg-linear-to-br from-blue-50 via-white to-blue-50/70 rounded-2xl p-4 sm:p-5 border border-blue-200/90 shadow-sm relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {t.overallResult}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-blue-950 flex items-center gap-1.5">
              <span>{isPass ? t.passText : t.failText}</span>
              {isPass && <CheckCircle className="w-5 h-5 text-emerald-600 inline" />}
            </p>
          </div>
          {result.grade && (
            <div className="bg-linear-to-br from-blue-600 to-blue-800 text-white text-2xl font-black w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30 shrink-0">
              {result.grade}
            </div>
          )}
        </div>

        <div className="flex gap-4 text-xs text-blue-900 font-medium pt-3 border-t border-blue-100/90">
          <p>
            {t.totalScoreText}: <span className="font-black text-blue-950 text-sm">{result.totalScore?.toFixed(2)}</span>
            <span className="text-[10px] text-blue-600 font-normal"> / {result.maxTotalScore || 500}</span>
          </p>
          {result.percentile && (
            <p>
              {t.percentileText}: <span className="font-bold text-blue-950">{result.percentile}%</span>
            </p>
          )}
        </div>
      </div>

      {/* Student Identification Information */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {lang === 'km' ? 'ព័ត៌មានបេក្ខជន' : 'Student Information'}
        </p>
        <div className="grid grid-cols-2 gap-3 py-2 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <p className="text-[10px] text-slate-400">{t.fullNameLatin}</p>
            <p className="text-xs font-bold text-slate-900">{student.fullNameLatin}</p>
            <p className="text-[10px] text-slate-500">{student.fullNameKm}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">{t.candidateNumber}</p>
            <p className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              {student.candidateNumber}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">{t.examSession}</p>
            <p className="text-xs font-semibold text-slate-800">{result.year}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">{t.school}</p>
            <p className="text-xs font-semibold text-slate-800 truncate">{student.school.split(' (')[0]}</p>
          </div>
        </div>
      </div>

      {/* Subject Results Table */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {t.subjectResultsTitle}
          </p>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            {student.track === 'Science' ? t.trackScience : t.trackSocial}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden px-4 py-1.5">
          {result.subjects?.map((sub) => (
            <div key={sub.id} className="flex justify-between items-center py-2.5">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900">
                  {lang === 'km' ? sub.nameKm : sub.nameEn}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang === 'km' ? sub.nameEn : sub.nameKm}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-900 font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {sub.score.toFixed(1)}
                  <span className="text-[10px] text-slate-400 font-normal"> / {sub.maxScore || 100}</span>
                </span>
                {sub.grade && (
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md min-w-6 text-center">
                    {sub.grade}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note about official data */}
      <p className="text-[10px] text-slate-400 text-center leading-relaxed">
        {t.resultOfficialNote}
      </p>

      {/* Button: Download Result PDF */}
      <div className="pt-1 pb-3">
        <button
          id="btn-download-result-pdf"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="w-full h-12 bg-linear-to-r from-slate-900 to-[#1E293B] hover:from-black hover:to-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-70 touch-manipulation cursor-pointer"
        >
          {isDownloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{lang === 'km' ? 'កំពុងបង្កើតឯកសារ...' : 'Generating Official PDF...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{t.btnDownloadPdf}</span>
            </>
          )}
        </button>

        {downloadSuccess && (
          <p className="text-[11px] text-emerald-600 font-bold text-center mt-2 animate-fade-in">
            {lang === 'km' ? 'បានទាញយកសលាកបត្រលទ្ធផលផ្លូវការជោគជ័យ!' : 'Official Result PDF downloaded successfully!'}
          </p>
        )}

        {onNavigateAdvisor && (
          <button
            id="btn-result-to-advisor"
            onClick={onNavigateAdvisor}
            className="w-full mt-2.5 h-11 bg-linear-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{lang === 'km' ? 'វិភាគពិន្ទុ និងផ្គូផ្គងសាកលវិទ្យាល័យដោយ AI' : 'Analyze with AI Major Matchmaker'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
