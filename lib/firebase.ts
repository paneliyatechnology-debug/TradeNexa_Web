import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
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

/**
 * Returns whether all essential Firebase Client config variables are provided.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

/**
 * Singleton FirebaseApp initializer using the modular SDK.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) {
    console.warn("[Firebase] Client environment variables (NEXT_PUBLIC_FIREBASE_*) are not fully configured.");
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

/**
 * Returns the modular Firebase Auth instance.
 */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

export const app = typeof window !== "undefined" ? getFirebaseApp() : null;
export const auth = typeof window !== "undefined" ? getFirebaseAuth() : null;
