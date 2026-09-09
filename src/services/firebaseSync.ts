import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { StudentProfile, ExamResult, AppNotification } from '../types';

/**
 * Asynchronous Firestore Cloud synchronization.
 * Operates with fire-and-forget resiliency so the UI remains instantaneous and offline-compatible.
 */

export async function syncStudentToCloud(student: StudentProfile): Promise<void> {
  if (!db || !student.candidateNumber) return;
  try {
    const studentDocRef = doc(db, 'students', student.candidateNumber);
    await setDoc(studentDocRef, {
      ...student,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.debug('Cloud sync student profile note (offline/fallback):', err);
  }
}

export async function syncResultToCloud(result: ExamResult): Promise<void> {
  if (!db || !result.candidateNumber) return;
  try {
    const resultDocRef = doc(db, 'examResults', result.candidateNumber);
    await setDoc(resultDocRef, {
      ...result,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.debug('Cloud sync exam result note (offline/fallback):', err);
  }
}

export async function syncNotificationsToCloud(candidateNumber: string, notifs: AppNotification[]): Promise<void> {
  if (!db || !candidateNumber) return;
  try {
    const notifsDocRef = doc(db, 'notifications', candidateNumber);
    await setDoc(notifsDocRef, {
      candidateNumber,
      notifications: notifs,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.debug('Cloud sync notifications note (offline/fallback):', err);
  }
}

export async function fetchStudentFromCloud(candidateNumber: string): Promise<StudentProfile | null> {
  if (!db || !candidateNumber) return null;
  try {
    const studentDocRef = doc(db, 'students', candidateNumber);
    const snap = await getDoc(studentDocRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
  } catch (err) {
    console.debug('Cloud fetch student note (offline/fallback):', err);
  }
  return null;
}

export async function fetchResultFromCloud(candidateNumber: string): Promise<ExamResult | null> {
  if (!db || !candidateNumber) return null;
  try {
    const resultDocRef = doc(db, 'examResults', candidateNumber);
    const snap = await getDoc(resultDocRef);
    if (snap.exists()) {
      return snap.data() as ExamResult;
    }
  } catch (err) {
    console.debug('Cloud fetch exam result note (offline/fallback):', err);
  }
  return null;
}
