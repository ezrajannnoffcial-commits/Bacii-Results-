import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../locales';
import { updateStudentPassword } from '../utils/storage';

interface PrivacyModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | 'password';
  onClose: () => void;
  lang: Language;
  candidateNumber?: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  type,
  onClose,
  lang,
  candidateNumber
}) => {
  const t = getT(lang);
  const [currentPw, setCurrentPw] = React.useState('');
  const [newPw, setNewPw] = React.useState('');
  const [confirmPw, setConfirmPw] = React.useState('');
  const [pwSaved, setPwSaved] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) {
      setError(lang === 'km' ? 'សូមបំពេញព័ត៌មានទាំងអស់' : 'Please fill in all fields');
      return;
    }
    if (newPw.length < 6) {
      setError(lang === 'km' ? 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' : 'Password must be at least 6 characters');
      return;
    }
    if (newPw !== confirmPw) {
      setError(lang === 'km' ? 'ពាក្យសម្ងាត់បញ្ជាក់មិនត្រូវគ្នាទេ' : 'Passwords do not match');
      return;
    }

    if (candidateNumber) {
      updateStudentPassword(candidateNumber, newPw);
    }

    setError('');
    setPwSaved(true);
    setTimeout(() => {
      setPwSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      id="privacy-modal-backdrop" 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div 
        id="privacy-modal-card" 
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              {type === 'privacy' && (lang === 'km' ? 'គោលការណ៍ឯកជនភាព' : 'Privacy Policy')}
              {type === 'terms' && (lang === 'km' ? 'លក្ខខណ្ឌនៃការប្រើប្រាស់' : 'Terms of Service')}
              {type === 'password' && (lang === 'km' ? 'ប្តូរពាក្យសម្ងាត់' : 'Change Password')}
            </h3>
          </div>
          <button 
            id="close-modal-btn" 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto text-xs text-slate-600 leading-relaxed space-y-3">
          {type === 'privacy' && (
            <>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 font-medium text-[11px]">
                {t.mottoKhmer}
                <div className="text-[10px] text-blue-700 mt-0.5">{t.mottoEnglish}</div>
              </div>
              <p className="font-semibold text-slate-800">
                {lang === 'km' ? '១. ការការពារទិន្នន័យផ្ទាល់ខ្លួន' : '1. Personal Data Protection'}
              </p>
              <p>
                {lang === 'km'
                  ? 'កម្មវិធីនេះត្រូវបានបង្កើតឡើងសម្រាប់បេក្ខជនម្នាក់ៗពិនិត្យលទ្ធផលរបស់ខ្លួនដោយសម្ងាត់។ គ្មានការផ្សាយបញ្ជីសាធារណៈ គ្មានការប្រៀបធៀប ឬចំណាត់ថ្នាក់សាលារៀនឡើយ។'
                  : 'This application is dedicated strictly to individual students. There are no public lists, no peer comparisons, and no school rankings.'}
              </p>
              <p className="font-semibold text-slate-800">
                {lang === 'km' ? '២. ការរក្សាទុក និងសុវត្ថិភាព' : '2. Storage & Security'}
              </p>
              <p>
                {lang === 'km'
                  ? 'ពាក្យសម្ងាត់របស់អ្នកត្រូវបានការពារដោយបច្ចេកវិទ្យា Hash encryption និងប្រព័ន្ធ HTTPS។ ព័ត៌មានប្រឡងត្រូវបានចាក់សោសុវត្ថិភាពដើម្បីការពារការក្លែងបន្លំ។'
                  : 'Your credentials are encrypted using industry-standard hashing. All data transmits over encrypted HTTPS channels.'}
              </p>
              <p className="font-semibold text-slate-800">
                {lang === 'km' ? '៣. ការជូនដំណឹងលើអេក្រង់' : '3. Screen Preview Privacy'}
              </p>
              <p>
                {lang === 'km'
                  ? 'ការជូនដំណឹងដែលផ្ញើទៅកាន់ទូរស័ព្ទរបស់អ្នក នឹងមិនមានពិន្ទុ ឬនិទ្ទេសឡើយ ដើម្បីការពារកុំឱ្យអ្នកដទៃមើលឃើញនៅលើអេក្រង់ចាក់សោ (Lock Screen)។'
                  : 'Push notifications intentionally omit scores and grades to prevent sensitive disclosure on locked screens.'}
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="font-semibold text-slate-800">
                {lang === 'km' ? '១. សិទ្ធិប្រើប្រាស់គណនី' : '1. Authorized Account Access'}
              </p>
              <p>
                {lang === 'km'
                  ? 'គណនីនីមួយៗត្រូវប្រើប្រាស់ដោយបេក្ខជនផ្ទាល់តែប៉ុណ្ណោះ។ ការប្រើលេខសម្គាល់បេក្ខជនរបស់អ្នកដទៃត្រូវបានហាមឃាត់ដាច់ខាត។'
                  : 'Each account must be accessed solely by the registered candidate. Using another candidate’s examination number is strictly prohibited.'}
              </p>
              <p className="font-semibold text-slate-800">
                {lang === 'km' ? '២. ភាពត្រឹមត្រូវនៃលទ្ធផល' : '2. Official Result Integrity'}
              </p>
              <p>
                {lang === 'km'
                  ? 'លទ្ធផលដែលបង្ហាញក្នុងកម្មវិធីនេះ ត្រូវបានផ្គូផ្គងផ្ទាល់ពីទិន្នន័យប្រឡងផ្លូវការរបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)។'
                  : 'Results presented inside the student portal are officially synchronized with MoEYS examination databases.'}
              </p>
              <p className="font-semibold text-slate-800">
                {lang === 'km' ? '៣. ការកែប្រែព័ត៌មានប្រឡង' : '3. Locked Information'}
              </p>
              <p>
                {lang === 'km'
                  ? 'ព័ត៌មានប្រឡងត្រូវបានចាក់សោរឹងមាំក្រោយការចុះឈ្មោះ។ ប្រសិនបើមានកំហុសអក្ខរាវិរុទ្ធ សូមទាក់ទងគណៈកម្មការប្រឡង ឬមន្ទីរអប់រំខេត្ត។'
                  : 'Candidate details are locked post-registration. Contact your school administration or provincial education department for corrections.'}
              </p>
            </>
          )}

          {type === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-1">
              {pwSaved ? (
                <div className="py-6 flex flex-col items-center text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
                  <p className="text-sm font-bold text-slate-800">
                    {lang === 'km' ? 'ពាក្យសម្ងាត់បានផ្លាស់ប្តូរដោយជោគជ័យ!' : 'Password updated successfully!'}
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {lang === 'km' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' : 'Current Password'}
                    </label>
                    <input
                      type="password"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {lang === 'km' ? 'ពាក្យសម្ងាត់ថ្មី' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {lang === 'km' ? 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-[#1E293B] hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {t.btnSave}
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {type !== 'password' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {lang === 'km' ? 'យល់ព្រម' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
