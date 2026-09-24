import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth } from "@/config/firebase";

/**
 * Singleton holder for the Firebase RecaptchaVerifier instance.
 * Avoids creating duplicate reCAPTCHA instances during React Strict Mode or re-renders.
 */
let recaptchaVerifierInstance: RecaptchaVerifier | null = null;
let currentContainerId: string | null = null;

/**
 * Initialize or reuse an invisible RecaptchaVerifier on a stable DOM container.
 * Safely cleans up stale widgets if the DOM container was unmounted.
 */
export function getOrCreateRecaptchaVerifier(
  containerId: string = "recaptcha-container"
): RecaptchaVerifier {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Check your Firebase web config.");
  }

  if (typeof window === "undefined") {
    throw new Error("reCAPTCHA can only be initialized in the browser.");
  }

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`reCAPTCHA container element with id '${containerId}' not found in DOM.`);
  }

  // If already instantiated on the same container and still valid in DOM, reuse it
  if (recaptchaVerifierInstance && currentContainerId === containerId) {
    return recaptchaVerifierInstance;
  }

  // Clean up any existing verifier
  clearRecaptchaVerifier();

  recaptchaVerifierInstance = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved — will proceed with submit
    },
    "expired-callback": () => {
      clearRecaptchaVerifier();
    },
  });

  currentContainerId = containerId;
  return recaptchaVerifierInstance;
}

/**
 * Clean up and reset the RecaptchaVerifier widget.
 */
export function clearRecaptchaVerifier(): void {
  if (recaptchaVerifierInstance) {
    try {
      recaptchaVerifierInstance.clear();
    } catch {
      // Ignore cleanup error if widget was already removed from DOM
    }
    recaptchaVerifierInstance = null;
    currentContainerId = null;
  }
}

/**
 * Request real SMS OTP using Firebase Web Phone Authentication.
 *
 * @param formattedPhoneNumber - E.164 phone number (e.g. +919876543210)
 * @param containerId - ID of DOM element for reCAPTCHA (defaults to "recaptcha-container")
 * @returns Promise<ConfirmationResult>
 */
export async function requestFirebasePhoneOtp(
  formattedPhoneNumber: string,
  containerId: string = "recaptcha-container"
): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please configure Firebase.");
  }

  try {
    const appVerifier = getOrCreateRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhoneNumber,
      appVerifier
    );
    return confirmationResult;
  } catch (error) {
    // If reCAPTCHA or phone request fails, reset verifier so user can retry cleanly
    clearRecaptchaVerifier();
    throw error;
  }
}

/**
 * Sign out of Firebase Auth client session.
 */
export async function signOutOfFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth && auth.currentUser) {
    try {
      await signOut(auth);
    } catch {
      // Ignore client signout error
    }
  }
}

/**
 * Map Firebase error codes to friendly, user-facing error messages.
 */
export function mapFirebasePhoneAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || "";
  const message = (error as { message?: string })?.message || "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Please enter a valid phone number with country code.";
    case "auth/missing-phone-number":
      return "Phone number is required.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Please try again later or contact support.";
    case "auth/too-many-requests":
      return "Too many attempts from this device. Please wait a few minutes and try again.";
    case "auth/captcha-check-failed":
      return "Security verification failed. Please try again.";
    case "auth/invalid-verification-code":
      return "Invalid OTP code. Please check and try again.";
    case "auth/code-expired":
      return "OTP code has expired. Please request a new one.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    case "auth/popup-closed-by-user":
      return "Verification was closed before completion. Please try again.";
    case "auth/operation-not-allowed":
      return "Phone authentication is not enabled. Please contact support.";
    case "auth/internal-error":
      return "Firebase authentication error. Please try again.";
    default:
      if (message.includes("reCAPTCHA")) {
        return "Security verification failed. Please refresh and try again.";
      }
      return message || "Failed to complete phone verification. Please try again.";
  }
}
