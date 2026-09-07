import React from 'react';
import { Bell, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';

interface PushNotificationToastProps {
  show: boolean;
  onDismiss: () => void;
  onOpenResult: () => void;
  lang: Language;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  show,
  onDismiss,
  onOpenResult,
  lang
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          id="push-notification-toast"
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="absolute top-4 left-3 right-3 z-50 pointer-events-auto"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/70 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MoEYS Bac II Alert
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Just now</span>
              </div>
              <p className="text-xs font-black text-white mt-0.5">
                {lang === 'km' ? 'លទ្ធផលបាក់ឌុបរបស់អ្នករួចរាល់ហើយ' : 'Your Bac II Result Is Ready'}
              </p>
              <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                {lang === 'km' 
                  ? 'លទ្ធផលប្រឡងបាក់ឌុបផ្លូវការរបស់អ្នករួចរាល់ហើយ។ សូមបើកកម្មវិធីដើម្បីពិនិត្យលទ្ធផលដោយសម្ងាត់។' 
                  : 'Your official Bac II examination result is now available. Open the app to view it privately.'}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  id="view-from-notification-btn"
                  onClick={() => {
                    onDismiss();
                    onOpenResult();
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-[11px] font-bold rounded-xl text-white transition-all active:scale-95 shadow-md shadow-blue-600/30 touch-manipulation cursor-pointer"
                >
                  {lang === 'km' ? 'ពិនិត្យលទ្ធផល' : 'View Privately'}
                </button>
                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold rounded-xl text-slate-300 transition-all active:scale-95 touch-manipulation cursor-pointer"
                >
                  {lang === 'km' ? 'បិទ' : 'Dismiss'}
                </button>
              </div>
            </div>
            <button 
              onClick={onDismiss} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
