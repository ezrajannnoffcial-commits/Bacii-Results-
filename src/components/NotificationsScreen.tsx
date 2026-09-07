import React from 'react';
import { Bell, Check, ShieldCheck, FileText, CheckCheck } from 'lucide-react';
import { AppNotification, Language } from '../types';
import { getT } from '../locales';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onOpenResult: () => void;
  lang: Language;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenResult,
  lang
}) => {
  const t = getT(lang);

  return (
    <div id="notifications-screen" className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {t.notificationsTitle}
          </h2>
        </div>
        <button
          onClick={onMarkAllAsRead}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>{t.markAllAsRead}</span>
        </button>
      </div>

      {/* Screen Preview Privacy Notice */}
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5 text-[11px] text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          {t.notificationPrivacyWarning}
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {t.noNotifications}
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              id={`notif-${notif.id}`}
              className={`p-3.5 rounded-2xl border transition-all ${
                notif.read
                  ? 'bg-white border-slate-200 opacity-80'
                  : 'bg-white border-blue-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'result'
                      ? 'bg-blue-600 text-white'
                      : notif.type === 'schedule'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {notif.type === 'result' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {lang === 'km' ? notif.titleKm : notif.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                      {lang === 'km' ? notif.bodyKm : notif.bodyEn}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    title="Mark as read"
                    className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>

              {notif.type === 'result' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onOpenResult}
                    className="px-3 py-1 bg-[#1E293B] hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg transition-colors"
                  >
                    {t.btnViewResult}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
