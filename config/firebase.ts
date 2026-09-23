import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { getAuth, type Auth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyA69_MjbZ22YnkFxPqLWOGSOfuJPB44Ni0",
  authDomain: "tradehub-b7b28.firebaseapp.com",
  projectId: "tradehub-b7b28",
  storageBucket: "tradehub-b7b28.firebasestorage.app",
  messagingSenderId: "42547333485",
  appId: "1:42547333485:web:5c4dbbdc1ee9f95cb6b264",
  measurementId: "G-4BWH7SKJQH",
};

/** Checks if core Firebase Auth is configured */
export function isFirebaseAuthConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

/** Checks if Firebase Cloud Messaging is fully configured */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!isFirebaseAuthConfigured()) return null;
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  return getMessaging(app);
}

export const FIREBASE_VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() || "";
