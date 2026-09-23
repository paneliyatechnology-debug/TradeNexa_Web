import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDBF96jQzVSVfw299ZM87zGtmWcKyBqesU",
  authDomain: "tradnexa.firebaseapp.com",
  projectId: "tradnexa",
  storageBucket: "tradnexa.firebasestorage.app",
  messagingSenderId: "632431608578",
  appId: "1:632431608578:web:243ffaf7771f1de193781b",
  measurementId: "G-CNHCQFSR82",
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
