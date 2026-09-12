import React from 'react';
import { History, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { StudentProfile, ExamResult, Language } from '../types';
import { getT } from '../locales';

interface HistoryScreenProps {
  student: StudentProfile;
  result2026: ExamResult | null;
  onSelectResult: (year: number) => void;
  lang: Language;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  student,
  result2026,
  onSelectResult,
  lang
}) => {
  const t = getT(lang);

  const historyItems = [
    {
      year: 2026,
      examType: 'Bac II (បាក់ឌុប)',
      hasResult: result2026?.isReleased ?? false,
      grade: result2026?.grade || 'B',
      status: result2026?.overallStatus || 'PASS',
      totalScore: result2026?.totalScore ?? 404.50
    },
    {
      year: 2025,
      examType: 'Bac II (បាក់ឌុប)',
      hasResult: false,
      grade: null,
      status: null,
      totalScore: null
    }
  ];

  return (
    <div id="history-screen" className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 text-slate-800">
      {/* Header */}
      <div className="pt-1">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {t.historyTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {t.historyDesc}
        </p>
      </div>

      {/* Candidate Identifier Banner */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block">{t.candidateNumber}</span>
          <span className="text-xs font-mono font-bold text-blue-700">{student.candidateNumber}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">{t.fullNameLatin}</span>
          <span className="text-xs font-bold text-slate-800">{student.fullNameLatin}</span>
        </div>
      </div>

      {/* List of Years */}
      <div className="space-y-3">
        {historyItems.map((item) => (
          <div
            key={item.year}
            id={`history-item-${item.year}`}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs transition-all hover:border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {item.year}
                </span>
                <p className="text-sm font-bold text-slate-800 mt-1.5">
                  {item.examType}
                </p>
              </div>

              {item.hasResult ? (
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 font-bold text-xs">
                    <span>{lang === 'km' ? 'និទ្ទេស' : 'Grade'} {item.grade}</span>
                  </div>
                  <span className="block text-[10px] text-emerald-600 font-bold mt-1">
                    {item.status === 'PASS' ? t.passText : t.failText}
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[11px] font-medium">
                    {t.noResultThisYear}
                  </span>
                </div>
              )}
            </div>

            {item.hasResult && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {t.totalScoreText}: <strong className="text-slate-800">{item.totalScore?.toFixed(2)} / 500</strong>
                </span>
                <button
                  onClick={() => onSelectResult(item.year)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>{t.btnViewResult}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security note */}
      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[10px] text-blue-800 flex items-start gap-2">
        <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
        <span>
          {lang === 'km'
            ? 'មានតែលទ្ធផលដែលជាកម្មសិទ្ធិរបស់បេក្ខជនដែលមានការផ្ទៀងផ្ទាត់គណនីប៉ុណ្ណោះ ដែលអាចមើលឃើញនៅទីនេះ។'
            : 'Only examination results officially belonging to this authenticated candidate are retrieved.'}
        </span>
      </div>
    </div>
  );
};
