import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA69_MjbZ22YnkFxPqLWOGSOfuJPB44Ni0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tradehub-b7b28.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tradehub-b7b28",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tradehub-b7b28.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "42547333485",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:42547333485:web:5c4dbbdc1ee9f95cb6b264",
};

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
  if (!isFirebaseConfigured()) {
    console.warn("[Firebase] Firebase is not properly configured. Missing required credentials.");
    return null;
  }
  try {
    if (getApps().length > 0) return getApps()[0]!;
    return initializeApp(firebaseConfig);
  } catch (err) {
    console.error("[Firebase] Error initializing Firebase app:", err);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  try {
    const app = getFirebaseApp();
    if (!app) {
      console.warn("[Firebase] Cannot initialize Auth: Firebase app is null.");
      return null;
    }
    return getAuth(app);
  } catch (err) {
    console.error("[Firebase] Error obtaining Firebase Auth instance:", err);
    return null;
  }
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;

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

export const FIREBASE_VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() || "";

