import {
  type ConfirmationResult,
  type UserCredential,
} from "firebase/auth";
import {
  sendFirebasePhoneOtp,
  confirmFirebaseOtp,
  getRecaptchaToken,
  formatFirebasePhoneAuthError,
  initRecaptchaVerifier,
} from "@/lib/phoneAuth";

export {
  sendFirebasePhoneOtp,
  confirmFirebaseOtp,
  getRecaptchaToken,
  formatFirebasePhoneAuthError,
  initRecaptchaVerifier,
};

/**
 * Backward compatibility alias for sendFirebasePhoneOtp.
 */
export async function sendOtpViaClientFirebase(
  phoneNumber: string,
  containerId: string = "recaptcha-container"
): Promise<{ verificationId: string; confirmationResult: ConfirmationResult }> {
  return sendFirebasePhoneOtp(phoneNumber, containerId);
}

// Expose helper on window for manual verification in browser console
if (typeof window !== "undefined") {
  (window as unknown as { testSendOtp?: (phone: string) => Promise<unknown> }).testSendOtp = async (phone: string) => {
    return sendFirebasePhoneOtp(phone);
  };
}

