import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { getAuth, type Auth } from "firebase/auth";

// Direct Firebase configuration — no dependence on process.env
export const firebaseConfig = {
  apiKey: "AIzaSyA69_MjbZ22YnkFxPqLWOGSOfuJPB44Ni0",
  authDomain: "tradehub-b7b28.firebaseapp.com",
  projectId: "tradehub-b7b28",
  storageBucket: "tradehub-b7b28.firebasestorage.app",
  messagingSenderId: "42547333485",
  appId: "1:42547333485:web:5c4dbbdc1ee9f95cb6b264",
  measurementId: "G-4BWH7SKJQH",
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  return true;
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

export const FIREBASE_VAPID_KEY = "";

