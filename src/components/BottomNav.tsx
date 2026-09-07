import React from 'react';
import { Home, FileText, Bell, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Screen, Language } from '../types';
import { getT } from '../locales';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  unreadNotificationsCount: number;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  unreadNotificationsCount,
  lang
}) => {
  const t = getT(lang);

  const tabs: { id: Screen; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: t.navHome,
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'result',
      label: t.navResult,
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'advisor',
      label: t.navAdvisor,
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'notifications',
      label: t.navNotifications,
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotificationsCount
    },
    {
      id: 'profile',
      label: t.navProfile,
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav 
      id="student-bottom-nav" 
      aria-label="Student Navigation" 
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shrink-0 select-none shadow-[0_-4px_16px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-around h-16 px-3 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => onNavigate(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-1.5 relative transition-all active:scale-95 touch-manipulation focus:outline-none"
            >
              {/* Subtle animated active background pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-x-2 inset-y-1 bg-blue-50/80 rounded-2xl -z-10"
                />
              )}

              <div className={`relative transition-colors duration-200 ${
                isActive ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'
              }`}>
                {tab.icon}
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 font-semibold tracking-tight transition-colors duration-200 ${
                isActive ? 'text-blue-800 font-bold' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>

              {isActive && (
                <motion.span 
                  layoutId="bottomNavDot"
                  className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" 
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
