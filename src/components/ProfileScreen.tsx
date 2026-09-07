import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Phone, 
  Mail, 
  School as SchoolIcon, 
  MapPin, 
  Hash, 
  ShieldCheck, 
  Key, 
  BellRing, 
  FileText, 
  LogOut, 
  Edit3, 
  Check, 
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { StudentProfile, Language } from '../types';
import { getT } from '../locales';

interface ProfileScreenProps {
  student: StudentProfile;
  onUpdateContact: (phone: string, email: string) => void;
  onOpenPrivacyModal: (type: 'privacy' | 'terms' | 'password') => void;
  onLogout: () => void;
  onResetApp?: () => void;
  lang: Language;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  student,
  onUpdateContact,
  onOpenPrivacyModal,
  onLogout,
  onResetApp,
  lang
}) => {
  const t = getT(lang);

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [phoneInput, setPhoneInput] = useState(student.phoneNumber);
  const [emailInput, setEmailInput] = useState(student.email || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContact(phoneInput.trim(), emailInput.trim());
    setIsEditingContact(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div id="profile-screen" className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-800">
      {/* Profile Header Avatar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#1E40AF] to-[#1E3A8A] text-white flex items-center justify-center text-lg font-bold shadow-md shadow-blue-900/20">
          {student.fullNameLatin.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-extrabold text-slate-900 truncate">
            {student.fullNameLatin}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {student.fullNameKm}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              ID: {student.candidateNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Locked Examination Information Banner (Crucial Requirement) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-800">
              {t.examInfoTitle}
            </h3>
          </div>
          <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {lang === 'km' ? 'ចាក់សោសុវត្ថិភាព' : 'Locked for Matching'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" />
              {t.candidateNumber}:
            </span>
            <span className="font-mono font-bold text-slate-800">{student.candidateNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <SchoolIcon className="w-3.5 h-3.5" />
              {t.school}:
            </span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[190px]">{student.school}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {t.examCenter}:
            </span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[190px]">{student.examCenter}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">{t.examSession}:</span>
            <span className="font-semibold text-slate-800">{student.examYear}</span>
          </div>
        </div>

        {/* Lock warning text */}
        <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2 text-[10px] text-amber-900 leading-snug">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>{t.lockedInfoWarning}</span>
        </div>
      </div>

      {/* Editable Contact Information */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-800">
            {t.contactInfoTitle}
          </h3>
          {!isEditingContact && (
            <button
              onClick={() => setIsEditingContact(true)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>{t.btnEditProfile}</span>
            </button>
          )}
        </div>

        {isEditingContact ? (
          <form onSubmit={handleSaveContact} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                {t.phone}
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                {t.email}
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingContact(false)}
                className="flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                {t.btnCancel}
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.btnSave}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {t.phone}:
              </span>
              <span className="font-semibold text-slate-800">{student.phoneNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {t.email}:
              </span>
              <span className="font-semibold text-slate-800">{student.email || '-'}</span>
            </div>
          </div>
        )}

        {savedSuccess && (
          <p className="text-[10px] text-emerald-600 font-bold">
            {lang === 'km' ? 'បានរក្សាទុកព័ត៌មានទំនាក់ទំនងជោគជ័យ' : 'Contact updated successfully'}
          </p>
        )}
      </div>

      {/* Account Security & Actions */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs divide-y divide-slate-100">
        <button
          onClick={() => onOpenPrivacyModal('password')}
          className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-slate-400" />
            <span>{t.btnChangePassword}</span>
          </div>
          <span className="text-slate-300">›</span>
        </button>

        <div className="p-3 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-4 h-4 text-slate-400" />
            <span>{t.btnNotificationSettings}</span>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <button
          onClick={() => onOpenPrivacyModal('privacy')}
          className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>{t.btnPrivacyPolicy}</span>
          </div>
          <span className="text-slate-300">›</span>
        </button>

        <button
          onClick={() => onOpenPrivacyModal('terms')}
          className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{t.btnTerms}</span>
          </div>
          <span className="text-slate-300">›</span>
        </button>

        {onResetApp && (
          <button
            id="btn-reset-app"
            onClick={() => {
              const confirmMsg = lang === 'km' 
                ? 'តើអ្នកប្រាកដជាចង់កំណត់កម្មវិធីឡើងវិញទៅសភាពដើមទាំងស្រុងទេ?' 
                : 'Are you sure you want to reset app data to fresh out-of-the-box state?';
              if (window.confirm(confirmMsg)) {
                onResetApp();
              }
            }}
            className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>{lang === 'km' ? 'កំណត់ទិន្នន័យកម្មវិធីឡើងវិញ (Reset App)' : 'Reset App to Fresh State'}</span>
            </div>
            <span className="text-slate-300">›</span>
          </button>
        )}

        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full p-3 flex items-center justify-between text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>{t.btnLogout}</span>
          </div>
          <span className="text-red-300">›</span>
        </button>
      </div>
    </div>
  );
};
