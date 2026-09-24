import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth } from "@/config/firebase";

/**
 * Singleton holder for the Firebase RecaptchaVerifier instance.
 * Avoids creating duplicate reCAPTCHA widgets during React re-renders.
 */
let recaptchaVerifierInstance: RecaptchaVerifier | null = null;
let currentContainerId: string | null = null;

/**
 * Check if the current environment is a browser.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Initialize or reuse a stable visible (normal) RecaptchaVerifier on a DOM container.
 * Reuses existing verifier if attached to the same container; clears and recreates if expired or missing.
 */
export async function getOrCreateRecaptchaVerifier(
  containerId: string = "recaptcha-container"
): Promise<RecaptchaVerifier> {
  if (!isBrowser()) {
    throw new Error("reCAPTCHA can only be initialized in the browser.");
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Check your Firebase web configuration.");
  }

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`reCAPTCHA container element with id '${containerId}' not found in DOM.`);
  }

  // Reuse existing verifier if it belongs to the same container and is still in DOM
  if (recaptchaVerifierInstance && currentContainerId === containerId) {
    return recaptchaVerifierInstance;
  }

  // Clear any stale verifier before creating a fresh one
  clearRecaptchaVerifier();

  try {
    // Clear container contents to prevent duplicate widgets
    container.innerHTML = "";

    recaptchaVerifierInstance = new RecaptchaVerifier(auth, containerId, {
      size: "normal",
      callback: () => {
        // reCAPTCHA solved
        console.log("[Firebase Phone Auth] reCAPTCHA solved.");
      },
      "expired-callback": () => {
        console.warn("[Firebase Phone Auth] reCAPTCHA expired, clearing verifier.");
        clearRecaptchaVerifier();
      },
      "error-callback": () => {
        console.error("[Firebase Phone Auth] reCAPTCHA error occurred.");
        clearRecaptchaVerifier();
      },
    });

    await recaptchaVerifierInstance.render();
    currentContainerId = containerId;
    return recaptchaVerifierInstance;
  } catch (error) {
    console.error("[Firebase Phone Auth] Failed to initialize RecaptchaVerifier:", error);
    clearRecaptchaVerifier();
    throw error;
  }
}

/**
 * Safely clean up and reset the RecaptchaVerifier widget.
 */
export function clearRecaptchaVerifier(): void {
  if (recaptchaVerifierInstance) {
    try {
      recaptchaVerifierInstance.clear();
    } catch (err) {
      console.warn("[Firebase Phone Auth] Error while clearing RecaptchaVerifier:", err);
    }
    recaptchaVerifierInstance = null;
    currentContainerId = null;
  }
}

/**
 * Request real SMS OTP using Firebase Phone Authentication with visible reCAPTCHA.
 *
 * @param formattedPhoneNumber - E.164 phone number (e.g. +919876543210)
 * @param containerId - ID of DOM element for reCAPTCHA (defaults to "recaptcha-container")
 * @returns Promise<ConfirmationResult>
 */
export async function requestFirebasePhoneOtp(
  formattedPhoneNumber: string,
  containerId: string = "recaptcha-container"
): Promise<ConfirmationResult> {
  if (!isBrowser()) {
    throw new Error("Firebase Phone Auth can only be requested in the browser.");
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please verify your Firebase configuration.");
  }

  console.log(`[Firebase Phone Auth] Sending OTP to ${formattedPhoneNumber}...`);

  try {
    const appVerifier = await getOrCreateRecaptchaVerifier(containerId);

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhoneNumber,
      appVerifier
    );

    console.log("[Firebase Phone Auth] OTP request successful.");
    return confirmationResult;
  } catch (error) {
    const errorCode = (error as { code?: string })?.code || "unknown";
    const errorMessage = (error as { message?: string })?.message || "Unknown error";

    console.error("[Firebase Phone Auth] OTP request failed:", {
      code: errorCode,
      message: errorMessage,
      hostname: typeof window !== "undefined" ? window.location.hostname : "unknown",
      authInitialized: Boolean(auth),
      containerExists: Boolean(document.getElementById(containerId)),
    });

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
 * Map Firebase error codes to friendly, user-facing error messages while logging actual codes.
 */
export function mapFirebasePhoneAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || "";
  const message = (error as { message?: string })?.message || "";

  // Always log the actual Firebase code and message for developer visibility (no sensitive credentials)
  if (code || message) {
    console.warn(`[Firebase Phone Auth Error] code: "${code}", message: "${message}"`);
  }

  switch (code) {
    case "auth/invalid-phone-number":
      return "Please enter a valid phone number with a valid country code.";
    case "auth/missing-phone-number":
      return "Phone number is required.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded for this project. Please try again later or contact support.";
    case "auth/too-many-requests":
      return "Too many attempts from this device. Please wait a few minutes and try again.";
    case "auth/captcha-check-failed":
      return "Security reCAPTCHA verification failed. Please check the box and try again.";
    case "auth/invalid-verification-code":
      return "Invalid OTP code. Please enter the correct 6-digit code received via SMS.";
    case "auth/code-expired":
      return "The OTP code has expired. Please click Resend OTP to receive a new code.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    case "auth/operation-not-allowed":
      return "Phone authentication is not enabled in Firebase Console. Please contact support.";
    case "auth/invalid-app-credential":
      return "Firebase app verification failed. Please refresh the page and try again.";
    case "auth/internal-error":
      return "Firebase authentication internal error. Please try again.";
    case "auth/popup-closed-by-user":
      return "Verification was closed before completion. Please try again.";
    default:
      if (message.includes("reCAPTCHA") || message.includes("recaptcha")) {
        return "Security verification failed. Please solve the reCAPTCHA and try again.";
      }
      return message || "Failed to complete phone verification. Please try again.";
  }
}
