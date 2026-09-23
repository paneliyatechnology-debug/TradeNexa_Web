import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
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
