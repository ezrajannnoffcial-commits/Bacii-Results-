import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app: any = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  const config = {
    apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined) || firebaseConfig.apiKey,
    authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) || firebaseConfig.authDomain,
    projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined) || firebaseConfig.projectId,
    storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) || firebaseConfig.storageBucket,
    messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined) || firebaseConfig.messagingSenderId,
    appId: (import.meta.env.VITE_FIREBASE_APP_ID as string | undefined) || firebaseConfig.appId,
    firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID as string | undefined) || firebaseConfig.firestoreDatabaseId
  };

  if (config && config.apiKey) {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    if (config.firestoreDatabaseId) {
      db = getFirestore(app, config.firestoreDatabaseId);
    } else {
      db = getFirestore(app);
    }
    auth = getAuth(app);
  }
} catch (err) {
  console.warn('Firebase initialization note:', err);
}

export { app, db, auth };
