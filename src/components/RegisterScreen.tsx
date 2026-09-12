import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  BookOpen, 
  Lock, 
  Calendar, 
  School as SchoolIcon, 
  MapPin, 
  Hash, 
  Phone, 
  Mail,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';
import { StudentProfile, Language } from '../types';
import { getT } from '../locales';
import { 
  CAMBODIAN_PROVINCES, 
  getSchoolsForProvince, 
  OTHER_SCHOOL_OPTION 
} from '../mockData';

interface RegisterScreenProps {
  onRegisterComplete: (profile: StudentProfile, password?: string) => void;
  onGoToSignIn?: () => void;
  onBackToWelcome?: () => void;
  lang: Language;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterComplete,
  onGoToSignIn,
  onBackToWelcome,
  lang
}) => {
  const t = getT(lang);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Information
  const [fullNameLatin, setFullNameLatin] = useState('');
  const [fullNameKm, setFullNameKm] = useState('');
  const [dob, setDob] = useState('2008-05-12');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Step 2: Examination Information - dynamic province to school linkage
  const [candidateNumber, setCandidateNumber] = useState('');
  const [province, setProvince] = useState(CAMBODIAN_PROVINCES[0]);
  const initialSchools = getSchoolsForProvince(CAMBODIAN_PROVINCES[0]);
  const [school, setSchool] = useState(initialSchools[0]);
  const [customSchool, setCustomSchool] = useState('');
  const [examCenter, setExamCenter] = useState(`មណ្ឌល${initialSchools[0].split(' (')[0]}`);
  const [examYear, setExamYear] = useState<number>(2026);
  const [track, setTrack] = useState<'Science' | 'Social Science'>('Science');

  // Available schools for currently selected province
  const availableSchools = getSchoolsForProvince(province);

  // Step 3: Account Security
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handler when user changes Province: dynamically updates school list & exam center
  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    const schoolsInNewProvince = getSchoolsForProvince(newProvince);
    const firstSchool = schoolsInNewProvince[0];
    setSchool(firstSchool);
    setCustomSchool('');
    const cleanSchoolName = firstSchool.split(' (')[0];
    setExamCenter(`មណ្ឌល${cleanSchoolName}`);
  };

  // Handler when user changes High School
  const handleSchoolChange = (newSchool: string) => {
    setSchool(newSchool);
    if (newSchool !== OTHER_SCHOOL_OPTION) {
      setCustomSchool('');
      const cleanSchoolName = newSchool.split(' (')[0];
      setExamCenter(`មណ្ឌល${cleanSchoolName}`);
    } else {
      setExamCenter('');
    }
  };

  // Effective school string (either selected or typed custom)
  const effectiveSchool = school === OTHER_SCHOOL_OPTION ? customSchool.trim() : school.trim();

  // Quick fill sample data button for effortless testing
  const handleFillDemoData = () => {
    setFullNameLatin('Sok Seiha');
    setFullNameKm('សុខ សីហា');
    setDob('2008-04-18');
    setGender('male');
    setPhoneNumber('012 889 977');
    setEmail('sok.seiha@student.edu.kh');
    setCandidateNumber('123-456-789');
    setProvince('រាជធានីភ្នំពេញ (Phnom Penh)');
    setSchool('វិទ្យាល័យ បាក់ទូក (Bak Touk High School)');
    setCustomSchool('');
    setExamCenter('មណ្ឌលវិទ្យាល័យបាក់ទូក (បន្ទប់ 14)');
    setExamYear(2026);
    setTrack('Science');
    setPassword('secret123');
    setConfirmPassword('secret123');
    setAgreedTerms(true);
    setErrorMsg('');
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameLatin.trim() || !fullNameKm.trim() || !phoneNumber.trim()) {
      setErrorMsg(lang === 'km' ? 'សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់' : 'Please fill in all required personal fields');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateNumber.trim() || !effectiveSchool || !examCenter.trim()) {
      setErrorMsg(
        lang === 'km' 
          ? 'សូមបំពេញលេខសម្គាល់បេក្ខជន វិទ្យាល័យ និងមណ្ឌលប្រឡង' 
          : 'Please fill in candidate number, high school, and exam center'
      );
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setErrorMsg(lang === 'km' ? 'សូមបញ្ចូលពាក្យសម្ងាត់' : 'Please enter your password');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(lang === 'km' ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' : 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(lang === 'km' ? 'ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ' : 'Passwords do not match');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg(lang === 'km' ? 'សូមយល់ព្រមតាមលក្ខខណ្ឌ និងគោលការណ៍ឯកជនភាព' : 'Please agree to the privacy policy and terms');
      return;
    }

    setErrorMsg('');
    setStep(4); // Show Registration Complete view
  };

  const handleFinish = () => {
    const newProfile: StudentProfile = {
      id: `student-${Date.now()}`,
      fullNameLatin: fullNameLatin.trim(),
      fullNameKm: fullNameKm.trim(),
      dob,
      gender,
      phoneNumber: phoneNumber.trim(),
      email: email.trim() || undefined,
      candidateNumber: candidateNumber.trim(),
      school: effectiveSchool,
      province,
      examCenter: examCenter.trim(),
      examYear,
      track,
      registeredAt: new Date().toISOString().split('T')[0],
      isExamLocked: true
    };
    onRegisterComplete(newProfile, password);
  };

  // STEP 4: Registration Complete
  if (step === 4) {
    return (
      <div 
        id="registration-complete-view"
        className="flex-1 flex flex-col justify-between p-6 bg-linear-to-b from-slate-50 via-white to-blue-50 text-slate-800"
      >
        <div className="pt-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10 mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
            {lang === 'km' ? 'បានផ្ទៀងផ្ទាត់ជោគជ័យ' : 'Successfully Verified'}
          </span>

          <h2 className="text-2xl font-black text-slate-900">
            {t.regSuccessTitle}
          </h2>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {t.regSuccessSub}
          </p>

          <div className="my-6 w-full p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-left space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">{t.fullNameLatin}:</span>
              <span className="font-bold text-slate-800">{fullNameLatin} ({fullNameKm})</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">{t.candidateNumber}:</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {candidateNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">{t.province}:</span>
              <span className="font-bold text-slate-800">{province.split(' (')[0]}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">{t.school}:</span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">{effectiveSchool.split(' (')[0]}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">{t.examSession}:</span>
              <span className="font-bold text-slate-800">{examYear}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">{t.examCenter}:</span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">{examCenter}</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              {t.regSuccessDesc}
            </p>
          </div>
        </div>

        <div className="pb-4">
          <button
            id="btn-reg-go-home"
            onClick={handleFinish}
            className="w-full py-3.5 bg-linear-to-r from-[#1E40AF] to-[#1E3A8A] hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>{t.btnGoHome}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="register-screen" className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Bar with Step Indicators */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between mb-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="p-1 text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.btnBack}</span>
            </button>
          ) : onGoToSignIn ? (
            <button
              type="button"
              onClick={onGoToSignIn}
              className="p-1 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-bold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ចូលគណនី' : 'Sign In'}</span>
            </button>
          ) : (
            <div className="w-12" />
          )}
          <span className="text-xs font-bold text-slate-700">
            {lang === 'km' ? 'ចុះឈ្មោះបេក្ខជន' : 'Candidate Registration'}
          </span>
          <button
            type="button"
            onClick={handleFillDemoData}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline bg-blue-50 px-2 py-1 rounded-md"
          >
            {lang === 'km' ? 'បំពេញគំរូ' : 'Auto Fill'}
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div 
                className={`h-1.5 rounded-full transition-all ${
                  step >= s ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
              <span className={`block text-[9px] mt-1 font-bold ${
                step === s ? 'text-blue-700' : 'text-slate-400'
              }`}>
                {s === 1 && (lang === 'km' ? 'ព័ត៌មានផ្ទាល់ខ្លួន' : 'Personal')}
                {s === 2 && (lang === 'km' ? 'ព័ត៌មានប្រឡង' : 'Exam')}
                {s === 3 && (lang === 'km' ? 'សុវត្ថិភាព' : 'Security')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-3.5">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                {t.regStep1Title}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'km' ? 'ព័ត៌មានត្រូវតែត្រូវគ្នានឹងសំបុត្រកំណើត ឬអត្តសញ្ញាណប័ណ្ណ' : 'Ensure details match your national examination identity.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fullNameLatin} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullNameLatin}
                onChange={(e) => setFullNameLatin(e.target.value)}
                placeholder="e.g. SOK SEIHA"
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 uppercase font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fullNameKm} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullNameKm}
                onChange={(e) => setFullNameKm(e.target.value)}
                placeholder="ឧ. សុខ សីហា"
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {t.dob}
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.gender}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 text-xs rounded-xl font-semibold border transition-all ${
                      gender === 'male'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {t.genderMale}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 text-xs rounded-xl font-semibold border transition-all ${
                      gender === 'female'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {t.genderFemale}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {t.phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="012 889 977"
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sok.seiha@student.edu.kh"
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#1E293B] hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>{t.btnNext}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onGoToSignIn && (
              <div className="pt-3 text-center border-t border-slate-200/80">
                <p className="text-xs text-slate-500 mb-1.5">
                  {lang === 'km' ? 'បានចុះឈ្មោះរួចហើយ?' : 'Already registered your candidate ID?'}
                </p>
                <button
                  type="button"
                  onClick={onGoToSignIn}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs border border-blue-200 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ចូលប្រើប្រាស់គណនី (Sign In)' : 'Sign In to View Result'}</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* STEP 2: Examination Information */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-3.5">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                {t.regStep2Title}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'km' 
                  ? 'លេខសម្គាល់បេក្ខជន គឺជាអត្តសញ្ញាណសំខាន់បំផុតសម្រាប់ផ្គូផ្គងលទ្ធផល' 
                  : 'Candidate number is the primary identifier for official result delivery.'}
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <label className="block text-xs font-bold text-blue-950 mb-1 flex items-center gap-1">
                <Hash className="w-4 h-4 text-blue-600" />
                {t.candidateNumber} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={candidateNumber}
                onChange={(e) => setCandidateNumber(e.target.value)}
                placeholder="123-456-789"
                className="w-full px-3 py-2 bg-white text-sm font-mono font-bold text-blue-900 rounded-lg border border-blue-200 focus:outline-hidden focus:border-blue-600 tracking-wider"
                required
              />
              <span className="text-[10px] text-blue-700 mt-1 block">
                {lang === 'km' ? 'សូមបញ្ចូលតាមទម្រង់លើសលាកបត្រចូលប្រឡង' : 'Enter as shown on your examination entrance slip'}
              </span>
            </div>

            {/* 1. Examination Province */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {t.province} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-blue-600 font-medium">
                  {lang === 'km' ? 'ប្តូរខេត្តនឹងធ្វើបច្ចុប្បន្នភាពវិទ្យាល័យ' : 'Changes high school list'}
                </span>
              </div>
              <select
                id="select-province"
                value={province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-semibold text-slate-900 shadow-2xs cursor-pointer"
              >
                {CAMBODIAN_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* 2. High School (Dynamically filtered by selected province) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <SchoolIcon className="w-3.5 h-3.5 text-blue-600" />
                  {t.school} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                  {availableSchools.length - 1} {lang === 'km' ? 'វិទ្យាល័យក្នុងខេត្ត' : 'schools in province'}
                </span>
              </div>
              <select
                id="select-school"
                value={school}
                onChange={(e) => handleSchoolChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-medium text-slate-900 shadow-2xs cursor-pointer"
              >
                {availableSchools.map((sch) => (
                  <option key={sch} value={sch}>{sch}</option>
                ))}
              </select>

              {/* If "Other High School..." selected, provide text input */}
              {school === OTHER_SCHOOL_OPTION && (
                <div className="mt-2 p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1.5">
                  <label className="block text-xs font-bold text-amber-900">
                    {lang === 'km' ? 'សូមបញ្ចូលឈ្មោះវិទ្យាល័យរបស់អ្នក' : 'Please specify your high school name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-custom-school"
                    type="text"
                    value={customSchool}
                    onChange={(e) => {
                      setCustomSchool(e.target.value);
                      if (e.target.value.trim()) {
                        const clean = e.target.value.trim();
                        setExamCenter(`មណ្ឌល${clean.startsWith('វិទ្យាល័យ') ? clean : 'វិទ្យាល័យ ' + clean}`);
                      }
                    }}
                    placeholder={lang === 'km' ? 'ឧ. វិទ្យាល័យ ហ៊ុន សែន ...' : 'e.g. Hun Sen High School...'}
                    className="w-full px-3 py-2 bg-white text-xs rounded-lg border border-amber-300 focus:outline-hidden focus:border-amber-600 font-medium text-slate-900 shadow-2xs"
                    required
                  />
                </div>
              )}
            </div>

            {/* 3. Examination Center */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.examCenter} <span className="text-red-500">*</span>
              </label>
              <input
                id="input-exam-center"
                type="text"
                value={examCenter}
                onChange={(e) => setExamCenter(e.target.value)}
                placeholder="មណ្ឌលវិទ្យាល័យ... (បន្ទប់ 14)"
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-medium text-slate-900 shadow-2xs"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {lang === 'km' 
                  ? 'ធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិតាមវិទ្យាល័យ និងអាចបញ្ចូលលេខបន្ទប់បាន' 
                  : 'Auto-synced with high school and can be tailored with room number'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.examSession}
                </label>
                <input
                  type="number"
                  value={examYear}
                  onChange={(e) => setExamYear(Number(e.target.value))}
                  min={2024}
                  max={2030}
                  className="w-full px-3 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.track}
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as 'Science' | 'Social Science')}
                  className="w-full px-2 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-medium"
                >
                  <option value="Science">{t.trackScience}</option>
                  <option value="Social Science">{t.trackSocial}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs"
              >
                {t.btnBack}
              </button>
              <button
                type="submit"
                className="flex-2 py-3 bg-[#1E293B] hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <span>{t.btnNext}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Account Security */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                {t.regStep3Title}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'km' 
                  ? 'បង្កើតពាក្យសម្ងាត់សុវត្ថិភាពដើម្បីការពារលទ្ធផលប្រឡងផ្ទាល់ខ្លួនរបស់អ្នក' 
                  : 'Create a password to ensure only you can access your result.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.password} <span className="text-red-500">*</span>
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.confirmPassword} <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                required
              />
            </div>

            {/* Terms & Privacy Agreement */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  {t.agreeTerms}
                </span>
              </label>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2 text-[10px] text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                {lang === 'km'
                  ? 'គណនីរបស់អ្នកនឹងត្រូវបានភ្ជាប់ទៅកាន់ទិន្នន័យផ្លូវការរបស់ក្រសួងអប់រំតាមរយៈលេខសម្គាល់បេក្ខជន។'
                  : 'Your account is linked to official MoEYS records via your unique candidate number.'}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs"
              >
                {t.btnBack}
              </button>
              <button
                type="submit"
                className="flex-2 py-3.5 bg-linear-to-r from-[#1E40AF] to-[#1E3A8A] hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <span>{t.btnSubmit}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
