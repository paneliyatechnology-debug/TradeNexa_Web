import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { getAuth, type Auth } from "firebase/auth";

// Firebase configuration loaded from environment variables (.env / .env.local)
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  try {
    if (appInstance) return appInstance;
    const existingApps = getApps();
    if (existingApps.length > 0) {
      appInstance = existingApps[0]!;
      return appInstance;
    }
    appInstance = initializeApp(firebaseConfig);
    return appInstance;
  } catch (err) {
    console.error("[Firebase] Error initializing Firebase app:", err);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  try {
    if (authInstance) return authInstance;
    const app = getFirebaseApp();
    if (!app) {
      console.warn("[Firebase] Cannot initialize Auth: Firebase app is null.");
      return null;
    }
    authInstance = getAuth(app);
    return authInstance;
  } catch (err) {
    console.error("[Firebase] Error obtaining Firebase Auth instance:", err);
    return null;
  }
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;

  try {
    const supported = await isSupported().catch(() => false);
    if (!supported) return null;

    const app = getFirebaseApp();
    if (!app) return null;

    return getMessaging(app);
  } catch (err) {
    console.error("[Firebase] Error obtaining Firebase Messaging instance:", err);
    return null;
  }
}

export const FIREBASE_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

