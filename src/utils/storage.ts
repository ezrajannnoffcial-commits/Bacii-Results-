import { StudentProfile, ExamResult, AppNotification } from '../types';
import { DEFAULT_STUDENT, DEFAULT_RESULT_2026, DEFAULT_NOTIFICATIONS } from '../mockData';
import { 
  getRealisticScienceSubjects, 
  getRealisticSocialSubjects, 
  calculateOverallGrade, 
  MAX_BACII_TOTAL_SCORE,
  normalizeExamResult 
} from './scoreCalculator';
import { syncStudentToCloud, syncResultToCloud, syncNotificationsToCloud } from '../services/firebaseSync';

const STORAGE_KEYS = {
  REGISTERED_STUDENTS: 'bacii_registered_students_v1',
  ACTIVE_SESSION: 'bacii_active_session_v1',
  STUDENT_RESULTS: 'bacii_student_results_v1',
  STUDENT_NOTIFS: 'bacii_student_notifs_v1',
  USER_PASSWORDS: 'bacii_user_passwords_v1',
  APP_LANGUAGE: 'bacii_app_lang_v1'
};

// Seed default student into storage if not present
export function initializeStorage(): void {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.REGISTERED_STUDENTS);
    if (!existing) {
      const initialList: StudentProfile[] = [DEFAULT_STUDENT];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_STUDENTS, JSON.stringify(initialList));
      
      const passwords: Record<string, string> = {
        [DEFAULT_STUDENT.candidateNumber]: 'secret123',
        [DEFAULT_STUDENT.phoneNumber]: 'secret123'
      };
      localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(passwords));

      const results: Record<string, ExamResult> = {
        [DEFAULT_STUDENT.candidateNumber]: DEFAULT_RESULT_2026
      };
      localStorage.setItem(STORAGE_KEYS.STUDENT_RESULTS, JSON.stringify(results));

      const notifs: Record<string, AppNotification[]> = {
        [DEFAULT_STUDENT.candidateNumber]: DEFAULT_NOTIFICATIONS
      };
      localStorage.setItem(STORAGE_KEYS.STUDENT_NOTIFS, JSON.stringify(notifs));
    } else {
      // Auto-migrate any previously cached results that had inaccurate scores or maxScores
      const rawResults = localStorage.getItem(STORAGE_KEYS.STUDENT_RESULTS);
      if (rawResults) {
        try {
          const resultsMap: Record<string, ExamResult> = JSON.parse(rawResults);
          let updated = false;
          Object.keys(resultsMap).forEach(key => {
            const item = resultsMap[key];
            if (item && (item.totalScore > 500 || item.subjects?.some(s => s.maxScore === 100 && (s.id === 'math' || s.id === 'khmer')))) {
              resultsMap[key] = normalizeExamResult(item);
              updated = true;
            }
          });
          if (updated) {
            localStorage.setItem(STORAGE_KEYS.STUDENT_RESULTS, JSON.stringify(resultsMap));
          }
        } catch (err) {
          console.error('Failed to validate cached results:', err);
        }
      }
    }
  } catch (e) {
    console.error('Failed to initialize local storage:', e);
  }
}

// Generate an authentic result based on student track and profile
export function generateResultForProfile(profile: StudentProfile, isReleased = false): ExamResult {
  const isScience = profile.track === 'Science';
  const subjects = isScience ? getRealisticScienceSubjects() : getRealisticSocialSubjects();
  const totalScore = parseFloat(subjects.reduce((sum, s) => sum + s.score, 0).toFixed(1));
  const grade = calculateOverallGrade(totalScore);

  // Derive random room and desk if not set
  const randomRoom = Math.floor(Math.random() * 20 + 1).toString();
  const randomDesk = Math.floor(Math.random() * 30 + 1).toString();

  // Create clean hash
  const hex = Math.random().toString(16).substring(2, 10).toUpperCase();

  return {
    id: `result-${profile.candidateNumber}`,
    year: profile.examYear,
    candidateNumber: profile.candidateNumber,
    studentNameLatin: profile.fullNameLatin,
    studentNameKm: profile.fullNameKm,
    school: profile.school,
    province: profile.province,
    examCenter: profile.examCenter,
    roomNumber: randomRoom,
    deskNumber: randomDesk,
    isReleased: isReleased,
    releaseDate: isReleased ? new Date().toISOString().split('T')[0] : undefined,
    overallStatus: totalScore >= 237 ? 'PASS' : 'FAIL',
    grade,
    totalScore,
    maxTotalScore: MAX_BACII_TOTAL_SCORE,
    percentile: parseFloat(Math.min(99.5, (totalScore / MAX_BACII_TOTAL_SCORE) * 100 + 1.2).toFixed(2)),
    track: profile.track,
    verificationHash: `MOEYS-BACII-${profile.examYear}-${hex}`,
    subjects
  };
}

// Get all registered students
export function getRegisteredStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_STUDENTS);
    return raw ? JSON.parse(raw) : [DEFAULT_STUDENT];
  } catch {
    return [DEFAULT_STUDENT];
  }
}

// Save a newly registered or updated student
export function saveRegisteredStudent(student: StudentProfile, password?: string): void {
  try {
    const students = getRegisteredStudents();
    const existingIndex = students.findIndex(s => s.candidateNumber === student.candidateNumber);
    if (existingIndex >= 0) {
      students[existingIndex] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.REGISTERED_STUDENTS, JSON.stringify(students));

    // Cloud firestore sync
    syncStudentToCloud(student);

    if (password) {
      const rawPw = localStorage.getItem(STORAGE_KEYS.USER_PASSWORDS);
      const pwMap: Record<string, string> = rawPw ? JSON.parse(rawPw) : {};
      pwMap[student.candidateNumber] = password;
      pwMap[student.phoneNumber] = password;
      localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(pwMap));
    }
  } catch (e) {
    console.error('Failed to save student:', e);
  }
}

// Check password
export function verifyCredentials(identifier: string, pass: string): StudentProfile | null {
  const cleanId = identifier.trim();
  if (!cleanId) return null;

  const cleanLower = cleanId.toLowerCase();
  const digitsOnly = cleanId.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();

  const students = getRegisteredStudents();
  const matched = students.find(s => {
    const candExact = s.candidateNumber.trim();
    const candLower = candExact.toLowerCase();
    const candDigits = candExact.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();

    const phoneRaw = s.phoneNumber.replace(/\s+/g, '');
    const phoneDigits = phoneRaw.replace(/[^0-9]/g, '');

    return (
      candExact === cleanId ||
      candLower === cleanLower ||
      (digitsOnly.length >= 4 && candDigits === digitsOnly) ||
      phoneRaw === cleanId.replace(/\s+/g, '') ||
      (digitsOnly.length >= 7 && phoneDigits === digitsOnly)
    );
  });

  if (!matched) return null;

  try {
    const rawPw = localStorage.getItem(STORAGE_KEYS.USER_PASSWORDS);
    const pwMap: Record<string, string> = rawPw ? JSON.parse(rawPw) : {};
    const expected = pwMap[matched.candidateNumber] || pwMap[matched.phoneNumber] || 'secret123';
    if (expected === pass) {
      return matched;
    }
  } catch {
    // If error, permit default demo password
    if (pass === 'secret123') return matched;
  }
  return null;
}

// Update password
export function updateStudentPassword(candidateNumber: string, newPass: string): void {
  try {
    const rawPw = localStorage.getItem(STORAGE_KEYS.USER_PASSWORDS);
    const pwMap: Record<string, string> = rawPw ? JSON.parse(rawPw) : {};
    pwMap[candidateNumber] = newPass;
    localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(pwMap));
  } catch (e) {
    console.error('Failed to update password:', e);
  }
}

// Active session storage
export function getStoredActiveSession(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredActiveSession(student: StudentProfile | null): void {
  try {
    if (student) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(student));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  } catch (e) {
    console.error('Failed to set active session:', e);
  }
}

// Exam result retrieval / saving
export function getStoredExamResult(candidateNumber: string): ExamResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_RESULTS);
    const map: Record<string, ExamResult> = raw ? JSON.parse(raw) : {};
    const item = map[candidateNumber];
    if (!item) return null;

    // Ensure mathematical consistency (total <= 500, track-specific max scores)
    const normalized = normalizeExamResult(item);
    if (normalized.totalScore !== item.totalScore || normalized.maxTotalScore !== item.maxTotalScore) {
      map[candidateNumber] = normalized;
      localStorage.setItem(STORAGE_KEYS.STUDENT_RESULTS, JSON.stringify(map));
    }
    return normalized;
  } catch {
    return null;
  }
}

export function saveStoredExamResult(result: ExamResult): void {
  try {
    const normalized = normalizeExamResult(result);
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_RESULTS);
    const map: Record<string, ExamResult> = raw ? JSON.parse(raw) : {};
    map[normalized.candidateNumber] = normalized;
    localStorage.setItem(STORAGE_KEYS.STUDENT_RESULTS, JSON.stringify(map));

    // Cloud firestore sync
    syncResultToCloud(normalized);
  } catch (e) {
    console.error('Failed to save exam result:', e);
  }
}

// Stored notifications
export function getStoredNotifications(candidateNumber: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_NOTIFS);
    const map: Record<string, AppNotification[]> = raw ? JSON.parse(raw) : {};
    return map[candidateNumber] || DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(candidateNumber: string, notifs: AppNotification[]): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_NOTIFS);
    const map: Record<string, AppNotification[]> = raw ? JSON.parse(raw) : {};
    map[candidateNumber] = notifs;
    localStorage.setItem(STORAGE_KEYS.STUDENT_NOTIFS, JSON.stringify(map));

    // Cloud firestore sync
    syncNotificationsToCloud(candidateNumber, notifs);
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

// Reset all storage to freshly installed state
export function resetAppToFresh(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.REGISTERED_STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_NOTIFS);
    localStorage.removeItem(STORAGE_KEYS.USER_PASSWORDS);
    initializeStorage();
  } catch (e) {
    console.error('Failed to reset app storage:', e);
  }
}
