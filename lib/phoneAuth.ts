import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export function formatFirebasePhoneAuthError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Authentication failed. Please try again.";
  }

  const err = error as { code?: string; message?: string };
  const code = err.code || "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid mobile number. Please enter a valid 10-digit phone number with country code.";
    case "auth/missing-phone-number":
      return "Phone number is required.";
    case "auth/invalid-verification-code":
      return "Invalid verification code. Please enter the correct 6-digit OTP.";
    case "auth/code-expired":
      return "Verification code has expired. Please request a new OTP.";
    case "auth/too-many-requests":
      return "Too many attempts from this device. Please wait a few minutes before trying again.";
    case "auth/quota-exceeded":
      return "SMS quota for this project has been reached. Please try again later.";
    case "auth/invalid-app-credential":
      return "Invalid app credential. If running on a custom domain, ensure it is added to Firebase Authorized Domains.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed or timed out. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/session-expired":
    case "auth/missing-verification-id":
      return "OTP session has expired. Please request a new verification code.";
    case "auth/sms-not-sent":
      return "Unable to send SMS to this number. Please verify the mobile number.";
    default:
      return err.message || "Failed to send or verify OTP. Please try again.";
  }
}

/**
 * Initializes and manages the invisible RecaptchaVerifier singleton.
 */
export function initRecaptchaVerifier(containerId: string = "recaptcha-container"): RecaptchaVerifier {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please check your environment variables.");
  }

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  } else {
    // Clear any leftover DOM from previous instances to avoid "reCAPTCHA already rendered"
    container.innerHTML = "";
  }

  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      // safe cleanup
    }
    window.recaptchaVerifier = undefined;
  }

  const verifier = new RecaptchaVerifier(auth, container, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved automatically
    },
    "expired-callback": () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {
          // safe cleanup
        }
        window.recaptchaVerifier = undefined;
      }
    },
  });

  window.recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Sends a real Firebase SMS OTP to an E.164 formatted phone number.
 */
export async function sendFirebasePhoneOtp(
  phoneNumber: string,
  containerId: string = "recaptcha-container"
): Promise<{ verificationId: string; confirmationResult: ConfirmationResult }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }

  const verifier = initRecaptchaVerifier(containerId);
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  window.confirmationResult = confirmationResult;

  return {
    verificationId: confirmationResult.verificationId,
    confirmationResult,
  };
}

/**
 * Confirms the 6-digit OTP code with Firebase and retrieves the UserCredential + Firebase ID Token.
 */
export async function confirmFirebaseOtp(
  otpCode: string,
  confirmationResult?: ConfirmationResult
): Promise<{ userCredential: UserCredential; idToken: string }> {
  const result = confirmationResult || window.confirmationResult;
  if (!result) {
    throw new Error("Verification session expired. Please request a new OTP.");
  }

  const userCredential = await result.confirm(otpCode);
  const idToken = await userCredential.user.getIdToken();

  return {
    userCredential,
    idToken,
  };
}

/**
 * Backward compatibility alias for sendFirebasePhoneOtp.
 */
export async function sendOtpViaClientFirebase(
  phoneNumber: string,
  containerId: string = "recaptcha-container"
): Promise<{ verificationId: string; confirmationResult: ConfirmationResult }> {
  return sendFirebasePhoneOtp(phoneNumber, containerId);
}

/**
 * Initializes and retrieves a reCAPTCHA token using Firebase invisible RecaptchaVerifier.
 */
export async function getRecaptchaToken(containerId: string = "recaptcha-container"): Promise<string | null> {
  try {
    const verifier = initRecaptchaVerifier(containerId);
    return await verifier.verify();
  } catch (error) {
    console.error("[PhoneAuth] Failed to generate reCAPTCHA token:", error);
    return null;
  }
}

