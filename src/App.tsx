import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Language, 
  Screen, 
  StudentProfile, 
  ExamResult, 
  AppNotification 
} from './types';
import { 
  DEFAULT_STUDENT, 
  DEFAULT_RESULT_2026, 
  DEFAULT_NOTIFICATIONS 
} from './mockData';
import { 
  initializeStorage,
  getStoredActiveSession,
  setStoredActiveSession,
  getStoredExamResult,
  saveStoredExamResult,
  getStoredNotifications,
  saveStoredNotifications,
  saveRegisteredStudent,
  generateResultForProfile,
  resetAppToFresh
} from './utils/storage';
import { MobileFrame } from './components/MobileFrame';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { SignInScreen } from './components/SignInScreen';
import { BottomNav } from './components/BottomNav';
import { PushNotificationToast } from './components/PushNotificationToast';
import { PrivacyModal } from './components/PrivacyModal';

// Lazy load post-auth screens to optimize initial bundle size & load speed
const HomeScreen = lazy(() => import('./components/HomeScreen').then(m => ({ default: m.HomeScreen })));
const ResultScreen = lazy(() => import('./components/ResultScreen').then(m => ({ default: m.ResultScreen })));
const HistoryScreen = lazy(() => import('./components/HistoryScreen').then(m => ({ default: m.HistoryScreen })));
const NotificationsScreen = lazy(() => import('./components/NotificationsScreen').then(m => ({ default: m.NotificationsScreen })));
const ProfileScreen = lazy(() => import('./components/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const AIAdvisorScreen = lazy(() => import('./components/AIAdvisorScreen').then(m => ({ default: m.AIAdvisorScreen })));

function ScreenLoadingFallback() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
      <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-semibold text-slate-500">កំពុងដំណើរការ...</p>
    </div>
  );
}

export default function App() {
  // Initialize storage once on boot
  useEffect(() => {
    initializeStorage();
  }, []);

  // Language state (Khmer by default as specified in requirements)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bacii_app_lang_v1');
      return (saved === 'en' || saved === 'km') ? saved : 'km';
    } catch {
      return 'km';
    }
  });

  // Authenticated student state (derived from active session)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!getStoredActiveSession();
  });
  
  const [student, setStudent] = useState<StudentProfile>(() => {
    return getStoredActiveSession() || DEFAULT_STUDENT;
  });

  // Active Screen (defaults to 'home' if already logged in, otherwise 'welcome')
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    return getStoredActiveSession() ? 'home' : 'welcome';
  });

  // Result state
  const [result, setResult] = useState<ExamResult>(() => {
    const active = getStoredActiveSession();
    if (active) {
      const stored = getStoredExamResult(active.candidateNumber);
      return stored || generateResultForProfile(active, false);
    }
    return DEFAULT_RESULT_2026;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const active = getStoredActiveSession();
    if (active) {
      return getStoredNotifications(active.candidateNumber);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [showPushToast, setShowPushToast] = useState<boolean>(false);

  // Modals
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'privacy' | 'terms' | 'password';
  }>({
    isOpen: false,
    type: 'privacy'
  });

  // Toggle Language between Khmer and English
  const handleToggleLang = () => {
    setLang((prev) => {
      const next = prev === 'km' ? 'en' : 'km';
      try {
        localStorage.setItem('bacii_app_lang_v1', next);
      } catch {}
      return next;
    });
  };

  // Toggle release status for demonstration & testing
  const handleToggleRelease = () => {
    const nextReleasedState = !result.isReleased;
    const updatedResult: ExamResult = {
      ...result,
      isReleased: nextReleasedState,
      releaseDate: nextReleasedState ? new Date().toISOString().split('T')[0] : undefined
    };

    setResult(updatedResult);
    saveStoredExamResult(updatedResult);

    if (nextReleasedState) {
      // Trigger the official push notification
      setShowPushToast(true);
      
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'result',
        titleKm: 'លទ្ធផលបាក់ឌុបរបស់អ្នករួចរាល់ហើយ',
        titleEn: 'Your Bac II Result Is Ready',
        bodyKm: 'លទ្ធផលប្រឡងបាក់ឌុបផ្លូវការរបស់អ្នករួចរាល់ហើយ។ សូមបើកកម្មវិធីដើម្បីពិនិត្យលទ្ធផលដោយសម្ងាត់។',
        bodyEn: 'Your official Bac II examination result is now available. Open the app to view it privately.',
        timestamp: 'ទើបតែចេញ (Just now)',
        read: false,
        isSensitive: true
      };

      const nextNotifs = [newNotif, ...notifications.filter(n => n.type !== 'result')];
      setNotifications(nextNotifs);
      saveStoredNotifications(student.candidateNumber, nextNotifs);
    }
  };

  // Complete Registration
  const handleRegisterComplete = (newProfile: StudentProfile, password?: string) => {
    saveRegisteredStudent(newProfile, password);
    setStoredActiveSession(newProfile);

    // Generate initial result for the registered student (pending official release)
    const newResult = generateResultForProfile(newProfile, false);
    saveStoredExamResult(newResult);

    // Customized welcome notification
    const welcomeNotifs: AppNotification[] = [
      {
        id: `notif-reg-${Date.now()}`,
        type: 'schedule',
        titleKm: 'ការចុះឈ្មោះត្រូវបានបញ្ជាក់ជោគជ័យ',
        titleEn: 'Registration Confirmed',
        bodyKm: `លេខសម្គាល់បេក្ខជន ${newProfile.candidateNumber} ត្រូវបានផ្ទៀងផ្ទាត់នៅ ${newProfile.examCenter}។ លទ្ធផលនឹងត្រូវបានជូនដំណឹងដល់អ្នកដោយផ្ទាល់។`,
        bodyEn: `Candidate ID ${newProfile.candidateNumber} verified at ${newProfile.examCenter}. Your results will be delivered directly and privately.`,
        timestamp: 'ទើបតែចុះឈ្មោះ (Just now)',
        read: false
      },
      {
        id: `notif-sec-${Date.now()}`,
        type: 'system',
        titleKm: 'ការការពារឯកជនភាព និងសុវត្ថិភាពត្រូវបានបើក',
        titleEn: 'Privacy & Security Guard Active',
        bodyKm: 'គណនីរបស់អ្នកត្រូវបានភ្ជាប់ដោយសម្ងាត់។ គ្មាននរណាម្នាក់អាចចូលមើលពិន្ទុរបស់អ្នកបានឡើយ។',
        bodyEn: 'Your account is securely bound. No public lists or third-party access are allowed.',
        timestamp: 'ទើបតែចុះឈ្មោះ (Just now)',
        read: true
      }
    ];

    saveStoredNotifications(newProfile.candidateNumber, welcomeNotifs);

    setStudent(newProfile);
    setResult(newResult);
    setNotifications(welcomeNotifs);
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  // Sign In Success with authenticated student profile
  const handleSignInSuccess = (authenticatedStudent: StudentProfile) => {
    setStoredActiveSession(authenticatedStudent);
    setStudent(authenticatedStudent);

    // Retrieve or create result
    let studentResult = getStoredExamResult(authenticatedStudent.candidateNumber);
    if (!studentResult) {
      studentResult = generateResultForProfile(authenticatedStudent, true);
      saveStoredExamResult(studentResult);
    }
    setResult(studentResult);

    // Retrieve notifications
    const studentNotifs = getStoredNotifications(authenticatedStudent.candidateNumber);
    setNotifications(studentNotifs);

    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  // Instant 1-tap demo access for test evaluation
  const handleDemoAccess = () => {
    const demoStudent = DEFAULT_STUDENT;
    setStoredActiveSession(demoStudent);
    setStudent(demoStudent);
    const demoResult = { ...DEFAULT_RESULT_2026, isReleased: true };
    setResult(demoResult);
    saveStoredExamResult(demoResult);
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  // Log Out
  const handleLogout = () => {
    setStoredActiveSession(null);
    setIsLoggedIn(false);
    setCurrentScreen('welcome');
  };

  // Reset App to fresh out-of-the-box state
  const handleResetApp = () => {
    resetAppToFresh();
    setStoredActiveSession(null);
    setStudent(DEFAULT_STUDENT);
    setResult(DEFAULT_RESULT_2026);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setIsLoggedIn(false);
    setCurrentScreen('welcome');
  };

  // Mark notification read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveStoredNotifications(student.candidateNumber, updated);
      return updated;
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveStoredNotifications(student.candidateNumber, updated);
      return updated;
    });
  };

  // Update contact info in profile
  const handleUpdateContact = (phone: string, email: string) => {
    const updatedProfile: StudentProfile = {
      ...student,
      phoneNumber: phone,
      email: email || undefined
    };
    setStudent(updatedProfile);
    saveRegisteredStudent(updatedProfile);
    setStoredActiveSession(updatedProfile);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <MobileFrame
      lang={lang}
      onToggleLang={handleToggleLang}
      currentScreen={currentScreen}
      isLoggedIn={isLoggedIn}
      onQuickSimulateRelease={handleToggleRelease}
      isResultReleased={result.isReleased}
      onNavigateToRegister={!isLoggedIn && currentScreen === 'signin' ? () => {
        setIsLoggedIn(false);
        setCurrentScreen('register');
      } : undefined}
    >
      {/* Push Notification Simulation Banner */}
      <PushNotificationToast
        show={showPushToast}
        onDismiss={() => setShowPushToast(false)}
        onOpenResult={() => {
          setShowPushToast(false);
          setCurrentScreen('result');
        }}
        lang={lang}
      />

      {/* Screen Router with Smooth Mobile Transitions */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={isLoggedIn ? currentScreen : `auth-${currentScreen}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {!isLoggedIn ? (
              <>
                {currentScreen === 'welcome' && (
                  <WelcomeScreen
                    onRegister={() => setCurrentScreen('register')}
                    onSignIn={() => setCurrentScreen('signin')}
                    onDemoAccess={handleDemoAccess}
                    onToggleLang={handleToggleLang}
                    lang={lang}
                  />
                )}
                {currentScreen === 'register' && (
                  <RegisterScreen
                    onRegisterComplete={handleRegisterComplete}
                    onGoToSignIn={() => setCurrentScreen('signin')}
                    onBackToWelcome={() => setCurrentScreen('welcome')}
                    lang={lang}
                  />
                )}
                {currentScreen === 'signin' && (
                  <SignInScreen
                    onSignInSuccess={handleSignInSuccess}
                    onBackToWelcome={() => setCurrentScreen('welcome')}
                    onGoToRegister={() => setCurrentScreen('register')}
                    lang={lang}
                  />
                )}
              </>
            ) : (
              <Suspense fallback={<ScreenLoadingFallback />}>
                {currentScreen === 'home' && (
                  <HomeScreen
                    student={student}
                    result={result}
                    onViewResult={() => setCurrentScreen('result')}
                    onNavigateAdvisor={() => setCurrentScreen('advisor')}
                    onToggleRelease={handleToggleRelease}
                    lang={lang}
                  />
                )}
                {currentScreen === 'result' && (
                  <ResultScreen
                    student={student}
                    result={result}
                    onSimulateRelease={handleToggleRelease}
                    onNavigateAdvisor={() => setCurrentScreen('advisor')}
                    lang={lang}
                  />
                )}
                {currentScreen === 'advisor' && (
                  <AIAdvisorScreen
                    student={student}
                    result={result}
                    lang={lang}
                    onNavigateHome={() => setCurrentScreen('home')}
                  />
                )}
                {currentScreen === 'history' && (
                  <HistoryScreen
                    student={student}
                    result2026={result}
                    onSelectResult={() => setCurrentScreen('result')}
                    lang={lang}
                  />
                )}
                {currentScreen === 'notifications' && (
                  <NotificationsScreen
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onOpenResult={() => setCurrentScreen('result')}
                    lang={lang}
                  />
                )}
                {currentScreen === 'profile' && (
                  <ProfileScreen
                    student={student}
                    onUpdateContact={handleUpdateContact}
                    onOpenPrivacyModal={(type) => setModalState({ isOpen: true, type })}
                    onLogout={handleLogout}
                    onResetApp={handleResetApp}
                    lang={lang}
                  />
                )}
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Navigation when logged in */}
      {isLoggedIn && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          unreadNotificationsCount={unreadCount}
          lang={lang}
        />
      )}

      {/* Privacy, Terms, & Password Modals */}
      <PrivacyModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        candidateNumber={student.candidateNumber}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        lang={lang}
      />
    </MobileFrame>
  );
}
