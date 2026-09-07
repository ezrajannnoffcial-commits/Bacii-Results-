import React, { useState } from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Award, 
  BookOpen, 
  Download, 
  RotateCcw, 
  ArrowRight,
  HeartHandshake,
  Hammer,
  HelpCircle,
  Clock,
  Briefcase,
  ChevronRight,
  School,
  MapPin,
  FileCheck
} from 'lucide-react';
import { 
  StudentProfile, 
  ExamResult, 
  Language, 
  AdvisorAnalysisResponse, 
  SubjectGradeLetter 
} from '../types';
import { getT } from '../locales';
import { generateAdvisorReportPdf } from '../utils/pdfGenerator';

interface AIAdvisorScreenProps {
  student: StudentProfile;
  result: ExamResult | null;
  lang: Language;
  onNavigateHome: () => void;
}

const SCIENCE_SUBJECTS = [
  { id: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', icon: '📐', maxScore: 125 },
  { id: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature', icon: '📜', maxScore: 75 },
  { id: 'physics', nameKm: 'រូបវិទ្យា', nameEn: 'Physics', icon: '⚡', maxScore: 75 },
  { id: 'chemistry', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry', icon: '🧪', maxScore: 75 },
  { id: 'biology', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology', icon: '🧬', maxScore: 75 },
  { id: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', icon: '🏛️', maxScore: 50 },
  { id: 'foreign_lang', nameKm: 'ភាសាបរទេស (English)', nameEn: 'Foreign Language (English)', icon: '🌐', maxScore: 25 }
];

const SOCIAL_SUBJECTS = [
  { id: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature', icon: '📜', maxScore: 125 },
  { id: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', icon: '📐', maxScore: 75 },
  { id: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', icon: '🏛️', maxScore: 75 },
  { id: 'geo', nameKm: 'ភូមិវិទ្យា', nameEn: 'Geography', icon: '🌍', maxScore: 75 },
  { id: 'morals', nameKm: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', nameEn: 'Moral and Civics', icon: '⚖️', maxScore: 75 },
  { id: 'earth', nameKm: 'ផែនដី និងបរិស្ថានវិទ្យា', nameEn: 'Earth Science', icon: '🌱', maxScore: 50 },
  { id: 'foreign_lang', nameKm: 'ភាសាបរទេស (English)', nameEn: 'Foreign Language (English)', icon: '🌐', maxScore: 25 }
];

const GRADE_OPTIONS: SubjectGradeLetter[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export const AIAdvisorScreen: React.FC<AIAdvisorScreenProps> = ({
  student,
  result,
  lang,
  onNavigateHome
}) => {
  const t = getT(lang);

  // Form input states (initialized with logged-in student info if available)
  const [candidateNumber, setCandidateNumber] = useState<string>(student.candidateNumber || '123-456-789');
  const [school, setSchool] = useState<string>(student.school || 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ');
  const [province, setProvince] = useState<string>(student.province || 'រាជធានីភ្នំពេញ');
  const [track, setTrack] = useState<'Science' | 'Social Science'>(student.track || 'Science');

  const currentSubjectList = track === 'Social Science' ? SOCIAL_SUBJECTS : SCIENCE_SUBJECTS;

  // Core subject grades (default realistic sample)
  const [grades, setGrades] = useState<Record<string, SubjectGradeLetter>>(() => {
    // If student has result subject scores, derive initial grades
    if (result && result.subjects && result.subjects.length > 0) {
      const derived: Record<string, SubjectGradeLetter> = {};
      result.subjects.forEach(sub => {
        const letter = (sub.grade as SubjectGradeLetter) || 'B';
        if (sub.nameEn.toLowerCase().includes('math')) derived['math'] = letter;
        else if (sub.nameEn.toLowerCase().includes('khmer')) derived['khmer'] = letter;
        else if (sub.nameEn.toLowerCase().includes('physics')) derived['physics'] = letter;
        else if (sub.nameEn.toLowerCase().includes('chem')) derived['chemistry'] = letter;
        else if (sub.nameEn.toLowerCase().includes('bio')) derived['biology'] = letter;
        else if (sub.nameEn.toLowerCase().includes('hist')) derived['history'] = letter;
        else if (sub.nameEn.toLowerCase().includes('geo')) derived['geo'] = letter;
        else if (sub.nameEn.toLowerCase().includes('moral') || sub.nameEn.toLowerCase().includes('civic')) derived['morals'] = letter;
        else if (sub.nameEn.toLowerCase().includes('earth')) derived['earth'] = letter;
        else if (sub.nameEn.toLowerCase().includes('eng') || sub.nameEn.toLowerCase().includes('foreign')) derived['foreign_lang'] = letter;
      });
      return {
        math: derived['math'] || 'A',
        khmer: derived['khmer'] || 'B',
        physics: derived['physics'] || 'B',
        chemistry: derived['chemistry'] || 'C',
        biology: derived['biology'] || 'B',
        history: derived['history'] || 'B',
        geo: derived['geo'] || 'B',
        morals: derived['morals'] || 'A',
        earth: derived['earth'] || 'B',
        foreign_lang: derived['foreign_lang'] || 'A'
      };
    }
    return {
      math: 'A',
      khmer: 'B',
      physics: 'B',
      chemistry: 'C',
      biology: 'B',
      history: 'B',
      geo: 'B',
      morals: 'A',
      earth: 'B',
      foreign_lang: 'A'
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AdvisorAnalysisResponse | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'score' | 'matchmaker' | 'empathy'>('score');

  // Handle grade change
  const handleGradeChange = (subjectId: string, grade: SubjectGradeLetter) => {
    setGrades(prev => ({
      ...prev,
      [subjectId]: grade
    }));
  };

  // Preset scenarios
  const applyPreset = (type: 'top_stem' | 'social_achiever' | 'borderline') => {
    if (type === 'top_stem') {
      setTrack('Science');
      setGrades(prev => ({
        ...prev,
        math: 'A',
        khmer: 'B',
        physics: 'A',
        chemistry: 'B',
        biology: 'B',
        history: 'C',
        foreign_lang: 'A'
      }));
    } else if (type === 'social_achiever') {
      setTrack('Social Science');
      setGrades(prev => ({
        ...prev,
        khmer: 'A',
        math: 'B',
        history: 'A',
        geo: 'A',
        morals: 'A',
        earth: 'B',
        foreign_lang: 'A'
      }));
    } else {
      // Borderline / Needs Retake or TVET
      setGrades(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          next[k] = (k === 'math' || k === 'khmer') ? 'E' : 'F';
        });
        return next;
      });
    }
  };

  // Submit analysis request to server-side Gemini API
  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      // Map active track subject keys to descriptive names and grades
      const mappedGrades: Record<string, string> = {};
      currentSubjectList.forEach(sub => {
        mappedGrades[`${lang === 'km' ? sub.nameKm : sub.nameEn} (${sub.maxScore} pts)`] = grades[sub.id] || 'C';
      });

      const response = await fetch('/api/ai/advisor-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidateNumber,
          school,
          province,
          track,
          grades: mappedGrades,
          lang
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const data: AdvisorAnalysisResponse = await response.json();
      setAnalysis(data);
      setActiveSubTab('score');
    } catch (err) {
      console.warn('AI analysis request encountered an issue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-advisor-screen" className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-800 pb-20">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Gemini 3.8 AI Counselor
          </span>
          <span className="text-[10px] text-blue-300 font-medium">MoEYS 2026</span>
        </div>

        <h2 className="text-lg font-black tracking-tight text-white">
          {t.advisorTitle}
        </h2>
        <p className="text-xs text-blue-200/90 mt-1 leading-relaxed max-w-sm">
          {t.advisorDesc}
        </p>

        {/* Quick Presets for easy testing */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
            {lang === 'km' ? 'គំរូពិន្ទុរហ័ស:' : 'Quick Presets:'}
          </span>
          <button
            id="preset-stem"
            onClick={() => applyPreset('top_stem')}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold border border-white/15 transition-all"
          >
            🌟 {lang === 'km' ? 'និទ្ទេស A/B (STEM)' : 'Top STEM (A/B)'}
          </button>
          <button
            id="preset-social"
            onClick={() => applyPreset('social_achiever')}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold border border-white/15 transition-all"
          >
            📚 {lang === 'km' ? 'សង្គម/ភាសា' : 'Social Science'}
          </button>
          <button
            id="preset-borderline"
            onClick={() => applyPreset('borderline')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-semibold border border-amber-400/30 transition-all"
          >
            🧭 {lang === 'km' ? 'និទ្ទេស E/F (TVET/Retake)' : 'E/F (TVET / Retake)'}
          </button>
        </div>
      </div>

      {/* Input Form Card: Student Info & Subject Grade Letters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800">
              {lang === 'km' ? 'ព័ត៌មានបេក្ខជន និងមុខវិជ្ជាស្នូល' : 'Candidate Details & Core Subject Grades'}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
            {track === 'Science' ? (lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រ' : 'Science Track') : (lang === 'km' ? 'ថ្នាក់សង្គម' : 'Social Track')}
          </span>
        </div>

        {/* Candidate ID & School Info Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">
              {t.candidateNumber}
            </label>
            <input
              id="input-advisor-candidate-id"
              type="text"
              value={candidateNumber}
              onChange={e => setCandidateNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold focus:outline-blue-500 focus:bg-white text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">
              {t.school}
            </label>
            <input
              id="input-advisor-school"
              type="text"
              value={school}
              onChange={e => setSchool(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-blue-500 focus:bg-white text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">
              {t.province}
            </label>
            <input
              id="input-advisor-province"
              type="text"
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-blue-500 focus:bg-white text-xs"
            />
          </div>
        </div>

        {/* 7 Core Subjects Grade Letters (A-F) */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-2">
            {lang === 'km' 
              ? 'ជ្រើសរើសនិទ្ទេសមុខវិជ្ជាស្នូល (A – F):' 
              : 'Select Raw Grade Letters for Core Subjects (A to F):'}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentSubjectList.map((sub) => {
              const currentGrade = grades[sub.id] || 'C';
              return (
                <div 
                  key={sub.id} 
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sub.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 block">
                          {lang === 'km' ? sub.nameKm : sub.nameEn}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          {sub.maxScore} pts
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400">
                        {lang === 'km' ? sub.nameEn : sub.nameKm}
                      </span>
                    </div>
                  </div>

                  {/* A-F Pills */}
                  <div className="flex items-center gap-1">
                    {GRADE_OPTIONS.map((letter) => {
                      const isSelected = currentGrade === letter;
                      let badgeColor = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100';
                      if (isSelected) {
                        if (letter === 'A' || letter === 'B') badgeColor = 'bg-emerald-600 text-white border-emerald-700 shadow-xs';
                        else if (letter === 'C') badgeColor = 'bg-blue-600 text-white border-blue-700 shadow-xs';
                        else if (letter === 'D') badgeColor = 'bg-amber-600 text-white border-amber-700 shadow-xs';
                        else badgeColor = 'bg-rose-600 text-white border-rose-700 shadow-xs';
                      }

                      return (
                        <button
                          key={letter}
                          type="button"
                          id={`btn-grade-${sub.id}-${letter}`}
                          onClick={() => handleGradeChange(sub.id, letter)}
                          className={`w-7 h-7 rounded-lg text-xs font-black border transition-all active:scale-95 ${badgeColor}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button: Generate Analysis */}
        <button
          id="btn-run-ai-analysis"
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="w-full py-3.5 bg-linear-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 disabled:opacity-75 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-900/15 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <Sparkles className={`w-4 h-4 text-amber-300 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? t.btnAnalyzing : t.btnRunAnalysis}</span>
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div id="ai-analysis-results-container" className="space-y-4">
          {/* Sub-Navigation Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1">
            <button
              id="subtab-score-breakdown"
              onClick={() => setActiveSubTab('score')}
              className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'score' 
                  ? 'bg-white text-blue-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'វិភាគពិន្ទុ' : 'Score Analysis'}</span>
            </button>

            <button
              id="subtab-major-matchmaker"
              onClick={() => setActiveSubTab('matchmaker')}
              className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'matchmaker' 
                  ? 'bg-white text-blue-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'សាកលវិទ្យាល័យ' : 'Universities'}</span>
            </button>

            <button
              id="subtab-empathy-support"
              onClick={() => setActiveSubTab('empathy')}
              className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'empathy' 
                  ? 'bg-white text-blue-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ការណែនាំ TVET' : 'Guidance & TVET'}</span>
            </button>
          </div>

          {/* TAB 1: Score Breakdown & Overall Grade */}
          {activeSubTab === 'score' && (
            <div className="space-y-4">
              {/* Overall Grade Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {lang === 'km' ? 'និទ្ទេសរួមវាយតម្លៃ' : 'Evaluated Mention'}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    analysis.studentSummary.status === 'PASS' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {analysis.studentSummary.status === 'PASS' 
                      ? (lang === 'km' ? 'ជាប់ជាស្ថាពរ (PASS)' : 'PASS')
                      : (lang === 'km' ? 'ធ្លាក់ (FAIL)' : 'FAIL')}
                  </span>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-md ${
                    analysis.studentSummary.overallGrade === 'A' ? 'bg-amber-500' :
                    analysis.studentSummary.overallGrade === 'B' ? 'bg-blue-600' :
                    analysis.studentSummary.overallGrade === 'C' ? 'bg-emerald-600' :
                    analysis.studentSummary.overallGrade === 'D' ? 'bg-indigo-600' :
                    analysis.studentSummary.overallGrade === 'E' ? 'bg-amber-600' : 'bg-rose-600'
                  }`}>
                    <span className="text-[10px] uppercase font-bold opacity-80 leading-none">Grade</span>
                    <span className="text-3xl leading-none font-black">{analysis.studentSummary.overallGrade}</span>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-900">
                      {lang === 'km' ? 'សេចក្តីសង្ខេបពិន្ទុសរុប' : 'Academic Performance Summary'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {analysis.studentSummary.overallAnalysis}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>ID: <strong className="font-mono text-slate-800">{analysis.studentSummary.candidateNumber}</strong></span>
                  <span>{analysis.studentSummary.school}</span>
                </div>
              </div>

              {/* Strongest vs Weakest Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Strongest Subjects */}
                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-black text-emerald-900">
                      {t.strongestTitle}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.studentSummary.strongestSubjects.map((item, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{item.subject}</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black">
                            {item.grade}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weakest Subjects */}
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-black text-amber-900">
                      {t.weakestTitle}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.studentSummary.weakestSubjects.map((item, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{item.subject}</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-black">
                            {item.grade}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Major & University Matchmaker */}
          {activeSubTab === 'matchmaker' && (
            <div className="space-y-4">
              {/* Recommended Majors */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black text-slate-900">
                    {lang === 'km' ? 'ជំនាញសិក្សាដែលត្រូវនឹងសមត្ថភាព' : 'Recommended Higher Education Majors'}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {analysis.universityMatchmaker.recommendedMajors.map((major, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-blue-50/40 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-xs font-bold text-slate-900">{major.majorName}</h5>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          {major.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {major.suitabilityReason}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span><strong>{lang === 'km' ? 'ទីផ្សារការងារ:' : 'Careers:'}</strong> {major.careerProspects}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matching Cambodian Institutions */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-black text-slate-900">
                      {lang === 'km' ? 'គ្រឹះស្ថានឧត្តមសិក្សានៅកម្ពុជា' : 'Matching Cambodian Universities & Institutes'}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400">RUPP, ITC, CADT, NUM, PUC</span>
                </div>

                <div className="space-y-2.5">
                  {analysis.universityMatchmaker.matchingInstitutions.map((inst, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">
                            {lang === 'km' ? inst.nameKm : inst.nameEn}
                          </h5>
                          <span className="text-[10px] text-slate-500">
                            {lang === 'km' ? inst.nameEn : inst.nameKm}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          inst.type === 'Public' ? 'bg-emerald-100 text-emerald-800' :
                          inst.type === 'Institute' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {inst.type}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                        <p><strong>{lang === 'km' ? 'មហាវិទ្យាល័យ:' : 'Faculty:'}</strong> {inst.recommendedFaculty}</p>
                        <p><strong>{lang === 'km' ? 'លក្ខខណ្ឌចូល:' : 'Admission:'}</strong> {inst.admissionRequirement}</p>
                        <p className="text-blue-900 font-medium"><strong>{lang === 'km' ? 'ចំណុចលេចធ្លោ:' : 'Strengths:'}</strong> {inst.notableStrengths}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Scholarship Pathways */}
              <div className="bg-linear-to-br from-amber-50/80 to-yellow-50/50 rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-amber-200/60 pb-2.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-black text-amber-950">
                    {t.scholarshipTitle}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {analysis.universityMatchmaker.scholarshipPathways.map((sch, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/90 border border-amber-200/80 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-amber-950">{sch.title}</h5>
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {sch.applicationWindow}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500"><strong>{lang === 'km' ? 'ស្ថាប័នផ្តល់:' : 'Provider:'}</strong> {sch.provider}</p>
                      <p className="text-[11px] text-slate-700"><strong>{lang === 'km' ? 'លក្ខខណ្ឌ:' : 'Criteria:'}</strong> {sch.criteria}</p>
                      <p className="text-[11px] text-emerald-800 font-semibold"><strong>{lang === 'km' ? 'អត្ថប្រយោជន៍:' : 'Benefits:'}</strong> {sch.benefits}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Empathetic Support & TVET / Retake Guide */}
          {activeSubTab === 'empathy' && (
            <div className="space-y-4">
              {/* Warm Encouragement Message */}
              <div className="bg-linear-to-br from-rose-50/60 to-orange-50/60 rounded-2xl p-4 border border-rose-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-black text-rose-950">
                    {lang === 'km' ? 'សារលើកទឹកចិត្ត និងគន្លឹះអនាគត' : 'Warm Encouragement & Perspectives'}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                  "{analysis.empatheticGuide.encouragingMessage}"
                </p>
              </div>

              {/* Practical Next Steps */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black text-slate-900">
                    {lang === 'km' ? 'ជំហានជាក់ស្តែងដែលត្រូវអនុវត្តបន្ត' : 'Practical Next Steps'}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {analysis.empatheticGuide.practicalNextSteps.map((step) => (
                    <div key={step.stepNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {step.stepNumber}
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-900">{step.title}</h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{step.description}</p>
                        {step.actionableLinkOrContact && (
                          <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {step.actionableLinkOrContact}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TVET Vocational Options */}
              {analysis.empatheticGuide.tvetVocationalOptions && analysis.empatheticGuide.tvetVocationalOptions.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Hammer className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-black text-slate-900">
                        {lang === 'km' ? 'កម្មវិធីជំនាញវិជ្ជាជីវៈ និងបច្ចេកទេស TVET' : 'TVET Vocational & Polytechnic Programs'}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      MLVT 1.5M Plan
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {analysis.empatheticGuide.tvetVocationalOptions.map((prog, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900">{prog.programName}</h5>
                          <span className="text-[10px] font-semibold text-slate-500">{prog.duration}</span>
                        </div>
                        <p className="text-[11px] text-slate-600"><strong>{lang === 'km' ? 'វិទ្យាស្ថាន:' : 'Institute:'}</strong> {prog.institution}</p>
                        <p className="text-[11px] text-emerald-700 font-medium"><strong>{lang === 'km' ? 'អត្ថប្រយោជន៍:' : 'Advantage:'}</strong> {prog.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Retake Strategy if needed */}
              {analysis.empatheticGuide.retakeStrategy && (
                <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <h4 className="text-xs font-black text-blue-950">
                      {lang === 'km' ? 'យុទ្ធសាស្ត្រត្រៀមប្រឡងឡើងវិញ (Retake Plan)' : 'Bac II Retake Strategy & Schedule'}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-1.5 bg-white p-3 rounded-xl border border-blue-100">
                    <p>
                      <strong>{lang === 'km' ? 'មុខវិជ្ជាស្នូលត្រូវផ្តោត:' : 'Target Priority Subjects:'}</strong>{' '}
                      {analysis.empatheticGuide.retakeStrategy.targetSubjects.join(', ')}
                    </p>
                    <p>
                      <strong>{lang === 'km' ? 'កាលវិភាគសិក្សា:' : 'Study Timeline:'}</strong>{' '}
                      {analysis.empatheticGuide.retakeStrategy.studyTimeline}
                    </p>
                    <p className="text-blue-900">
                      <strong>{lang === 'km' ? 'ដំបូន្មានគន្លឹះ:' : 'Key Advice:'}</strong>{' '}
                      {analysis.empatheticGuide.retakeStrategy.keyAdvice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons: Export Roadmap PDF & Adjust */}
          <div className="flex gap-2 pt-2">
            <button
              id="btn-export-roadmap-pdf"
              onClick={() => generateAdvisorReportPdf(analysis, lang)}
              className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.99]"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>{t.btnExportRoadmapPdf}</span>
            </button>

            <button
              id="btn-reanalyze"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.btnReanalyze}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
