"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  User,
  UserRole,
  SendOtpResponse,
  VerifyOtpResponse,
  RegisterResponse,
  RegisterRequest,
  CompleteProfileData,
} from "@/types/auth";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/endpoints";
import {
  formatMobileNumber,
  mapApiProfileToUser,
  parseAuthSession,
  unwrapApiPayload,
  userRoleToRoleId,
  ensureRolesLoaded,
  type ApiUserProfile,
} from "@/utils/authHelpers";
import {
  requestFirebasePhoneOtp,
  signOutOfFirebase,
  mapFirebasePhoneAuthError,
  clearRecaptchaVerifier,
} from "@/lib/phoneAuth";
import type { ConfirmationResult } from "firebase/auth";
import { buildProfileFormData } from "@/utils/buildProfileFormData";
import { buildLoginDevicePayload } from "@/services/fcmService";
import { deleteProfile } from "@/services/profileService";
import {
  AsyncOperationState,
  initialOpState,
  runApiAction,
} from "@/utils/runApiAction";
import { showErrorToast } from "@/utils/toast";
import {
  getDashboardPathForRole,
  getDefaultActiveRole,
  isPortalPath,
  writeStoredActiveRole,
} from "@/utils/roleNavigation";
import { requiresCompletedProfile } from "@/utils/profileGate";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalSession: number;
  authModalStep: "login" | "verify" | "role" | "register";
  authModalRole: UserRole | null;
  authModalPhone: string;
  authModalCountryCode: string;
  sessionMobileNumber: string | null;
  sendOtpState: AsyncOperationState<SendOtpResponse>;
  verifyOtpState: AsyncOperationState<VerifyOtpResponse>;
  resendOtpState: AsyncOperationState<SendOtpResponse>;
  registerState: AsyncOperationState<RegisterResponse>;
  isCompleteProfileOpen: boolean;
  completeProfileRole: UserRole | null;
  completeProfileState: AsyncOperationState<User>;
  loginUser: (token: string, user: User, refreshToken?: string) => void;
  logoutUser: () => Promise<void>;
  updateUser: (user: User) => void;
  openAuthModal: (step?: "login" | "register" | "role", role?: UserRole) => void;
  closeAuthModal: () => void;
  setAuthModalStep: (step: "login" | "verify" | "role" | "register") => void;
  setAuthModalPhone: (phone: string) => void;
  setAuthModalCountryCode: (code: string) => void;
  sendOtpAction: (phone: string, countryCode: string) => Promise<boolean>;
  verifyOtpAction: (otp: string) => Promise<VerifyOtpResponse | null>;
  resendOtpAction: () => Promise<boolean>;
  registerAction: (formData: RegisterRequest) => Promise<RegisterResponse | null>;
  openCompleteProfileModal: (role: UserRole) => void;
  closeCompleteProfileModal: () => void;
  skipCompleteProfile: () => void;
  completeProfileAction: (payload: CompleteProfileData) => Promise<boolean>;
  deleteAccountAction: () => Promise<boolean>;
  resetSendOtp: () => void;
  resetVerifyOtp: () => void;
  resetResendOtp: () => void;
  resetRegister: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalSession, setAuthModalSession] = useState(0);
  const [authModalStep, setAuthModalStep] = useState<"login" | "verify" | "role" | "register">("login");
  const [authModalRole, setAuthModalRole] = useState<UserRole | null>(null);
  const [authModalPhone, setAuthModalPhone] = useState("");
  const [authModalCountryCode, setAuthModalCountryCode] = useState("+91");
  const [sessionMobileNumber, setSessionMobileNumber] = useState<string | null>(null);
  const [sendOtpState, setSendOtpState] = useState<AsyncOperationState<SendOtpResponse>>(initialOpState());
  const [verifyOtpState, setVerifyOtpState] = useState<AsyncOperationState<VerifyOtpResponse>>(initialOpState());
  const [resendOtpState, setResendOtpState] = useState<AsyncOperationState<SendOtpResponse>>(initialOpState());
  const [registerState, setRegisterState] = useState<AsyncOperationState<RegisterResponse>>(initialOpState());
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
  const [completeProfileRole, setCompleteProfileRole] = useState<UserRole | null>(null);
  const [completeProfileState, setCompleteProfileState] = useState<AsyncOperationState<User>>(initialOpState());
  const closeModalTimerRef = useRef<number | null>(null);
  const skipProfileTimerRef = useRef<number | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  const redirectToDashboard = useCallback((userData: User) => {
    if (userData.role !== "both") {
      writeStoredActiveRole(getDefaultActiveRole(userData.role));
    }
    const path = getDashboardPathForRole(userData.role);
    if (typeof window !== "undefined") {
      window.location.replace(path);
    }
  }, []);

  const persistSession = (accessToken: string, userData: User, refreshToken?: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const storeTokens = (accessToken?: string, refreshToken?: string) => {
    if (typeof window === "undefined") return;
    if (accessToken) localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
  };

  const clearSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      // Reset language to default English ('en') on logout
      localStorage.setItem("tradenexa_language", "en");
      window.dispatchEvent(
        new CustomEvent("tradenexa_language_change", { detail: "en" })
      );
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const cachedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // Hydrate from cache immediately
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser) as User;
          setUser(parsedUser);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        } catch {
          // Bad cache, proceed to fetch profile from API below
        }
      }

      try {
        const res = await apiClient.get(API_ENDPOINTS.PROFILE);
        const profile = unwrapApiPayload<ApiUserProfile>(res.data);
        persistSession(token, mapApiProfileToUser(profile));
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleUnauthorized = () => {
      clearSession();
      // Do not auto-open login modal — only open on user action (Join, etc.)
    };

    const handleLanguageChange = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      try {
        const res = await apiClient.get(API_ENDPOINTS.PROFILE);
        const profile = unwrapApiPayload<ApiUserProfile>(res.data);
        const updated = mapApiProfileToUser(profile);
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      } catch {
        // ignore
      }
    };

    window.addEventListener("auth_unauthorized", handleUnauthorized);
    window.addEventListener("tradenexa_language_change", handleLanguageChange);
    return () => {
      window.removeEventListener("auth_unauthorized", handleUnauthorized);
      window.removeEventListener("tradenexa_language_change", handleLanguageChange);
      if (closeModalTimerRef.current) window.clearTimeout(closeModalTimerRef.current);
      if (skipProfileTimerRef.current) window.clearTimeout(skipProfileTimerRef.current);
    };
  }, []);

  const loginUser = (token: string, userData: User, refreshToken?: string) => {
    persistSession(token, userData, refreshToken);
    redirectToDashboard(userData);
  };

  const logoutUser = async () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    try {
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.LOGOUT, { refresh_token: refreshToken });
      }
    } catch {
      // Clear local session even if API logout fails
    }
    await signOutOfFirebase();
    clearSession();
  };

  const updateUser = (updatedUser: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
  };

  const openAuthModal = useCallback((step: "login" | "register" | "role" = "login", role?: UserRole) => {
    setAuthModalSession((session) => session + 1);
    setAuthModalStep(step);
    setAuthModalRole(role || null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    clearRecaptchaVerifier();
    confirmationResultRef.current = null;
    if (closeModalTimerRef.current) window.clearTimeout(closeModalTimerRef.current);
    closeModalTimerRef.current = window.setTimeout(() => {
      closeModalTimerRef.current = null;
      setAuthModalPhone("");
      setAuthModalRole(null);
      setSessionMobileNumber(null);
      setSendOtpState(initialOpState());
      setVerifyOtpState(initialOpState());
      setResendOtpState(initialOpState());
      setRegisterState(initialOpState());
    }, 300);
  }, []);

  const resetSendOtp = () => setSendOtpState(initialOpState());
  const resetVerifyOtp = () => setVerifyOtpState(initialOpState());
  const resetResendOtp = () => setResendOtpState(initialOpState());
  const resetRegister = () => setRegisterState(initialOpState());

  const openCompleteProfileModal = useCallback((role: UserRole) => {
    setCompleteProfileRole(role);
    setIsCompleteProfileOpen(true);
  }, []);

  const closeCompleteProfileModal = useCallback(() => {
    setIsCompleteProfileOpen(false);
    if (skipProfileTimerRef.current) window.clearTimeout(skipProfileTimerRef.current);
    skipProfileTimerRef.current = window.setTimeout(() => {
      skipProfileTimerRef.current = null;
      setCompleteProfileRole(null);
      setCompleteProfileState(initialOpState());
    }, 300);
  }, []);

  const skipCompleteProfile = useCallback(() => {
    const currentUser =
      typeof window !== "undefined"
        ? (() => {
            try {
              const cached = localStorage.getItem("user");
              return cached ? (JSON.parse(cached) as User) : user;
            } catch {
              return user;
            }
          })()
        : user;

    closeCompleteProfileModal();

    const path = typeof window !== "undefined" ? window.location.pathname : "";
    // Leaving a gated page (or marketing) without completing → go to a safe home.
    if (currentUser && (!isPortalPath(path) || requiresCompletedProfile(path))) {
      redirectToDashboard(currentUser);
    }
  }, [user, redirectToDashboard, closeCompleteProfileModal]);

  const sendOtpAction = async (phone: string, countryCode: string): Promise<boolean> => {
    const formattedMobile = formatMobileNumber(countryCode, phone);
    setSendOtpState({ loading: true, success: false, error: null, response: null });

    try {
      const confirmationResult = await requestFirebasePhoneOtp(formattedMobile, "recaptcha-container");
      confirmationResultRef.current = confirmationResult;
      setSessionMobileNumber(formattedMobile);
      setAuthModalPhone(phone);
      setAuthModalCountryCode(countryCode);

      const resp: SendOtpResponse = {
        mobile_number: formattedMobile,
        message: "OTP sent successfully via Firebase",
      };

      setSendOtpState({ loading: false, success: true, error: null, response: resp });
      return true;
    } catch (err) {
      const friendlyError = mapFirebasePhoneAuthError(err);
      setSendOtpState({ loading: false, success: false, error: friendlyError, response: null });
      showErrorToast(friendlyError);
      return false;
    }
  };

  const verifyOtpAction = async (otp: string): Promise<VerifyOtpResponse | null> => {
    if (!confirmationResultRef.current) {
      const errorMsg = "Verification session expired. Please request a new OTP.";
      setVerifyOtpState({ loading: false, success: false, error: errorMsg, response: null });
      showErrorToast(errorMsg);
      return null;
    }

    setVerifyOtpState({ loading: true, success: false, error: null, response: null });

    try {
      // 1. Confirm OTP code using Firebase Web Phone Auth
      const userCredential = await confirmationResultRef.current.confirm(otp.trim());
      const firebaseUser = userCredential.user;

      // Extract verified phone number from Firebase token / credentials
      const verifiedPhone = firebaseUser.phoneNumber || sessionMobileNumber;
      if (verifiedPhone) {
        setSessionMobileNumber(verifiedPhone);
      }

      // 2. Obtain Firebase ID Token with forced refresh
      const idToken = await firebaseUser.getIdToken(true);

      // 3. Send Firebase ID Token to TradeNexa backend
      const device = await buildLoginDevicePayload();
      const response = await apiClient.post(API_ENDPOINTS.FIREBASE_PHONE_LOGIN, {
        idToken,
        device,
      });

      const data = unwrapApiPayload<Record<string, unknown>>(response.data);
      const session = parseAuthSession(data);
      const backendMobile = ((data.mobile_number as string | undefined) || verifiedPhone) ?? undefined;
      if (backendMobile) {
        setSessionMobileNumber(backendMobile);
      }

      // Store TradeNexa JWT access & refresh tokens
      storeTokens(session.access_token, session.refresh_token);

      if (session.is_registered && session.access_token && session.user) {
        persistSession(session.access_token, session.user, session.refresh_token);
      }

      const verifyResp: VerifyOtpResponse = {
        is_registered: session.is_registered,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: session.user,
        mobile_number: backendMobile,
        message: String((response.data as { message?: string })?.message || "OTP verified successfully"),
      };

      setVerifyOtpState({ loading: false, success: true, error: null, response: verifyResp });
      return verifyResp;
    } catch (err) {
      const friendlyError = mapFirebasePhoneAuthError(err);
      setVerifyOtpState({ loading: false, success: false, error: friendlyError, response: null });
      showErrorToast(friendlyError);
      return null;
    }
  };

  const resendOtpAction = async (): Promise<boolean> => {
    if (!authModalPhone) return false;
    const formattedMobile = formatMobileNumber(authModalCountryCode, authModalPhone);
    setResendOtpState({ loading: true, success: false, error: null, response: null });

    try {
      clearRecaptchaVerifier();
      const confirmationResult = await requestFirebasePhoneOtp(formattedMobile, "recaptcha-container");
      confirmationResultRef.current = confirmationResult;
      setSessionMobileNumber(formattedMobile);

      const resp: SendOtpResponse = {
        mobile_number: formattedMobile,
        message: "OTP resent successfully via Firebase",
      };

      setResendOtpState({ loading: false, success: true, error: null, response: resp });
      return true;
    } catch (err) {
      const friendlyError = mapFirebasePhoneAuthError(err);
      setResendOtpState({ loading: false, success: false, error: friendlyError, response: null });
      showErrorToast(friendlyError);
      return false;
    }
  };

  const registerAction = async (formData: RegisterRequest): Promise<RegisterResponse | null> => {
    if (!sessionMobileNumber) {
      const errorMsg = "Phone session expired. Please verify OTP again.";
      setRegisterState({ loading: false, success: false, error: errorMsg, response: null });
      showErrorToast(errorMsg);
      return null;
    }

    return runApiAction({
      setState: setRegisterState,
      successMessage: "Registration successful",
      fallbackError: "Registration failed",
      action: async () => {
        await ensureRolesLoaded();
        const device = await buildLoginDevicePayload();

        const body = {
          mobile_number: sessionMobileNumber,
          full_name: formData.name.trim(),
          email: formData.email.trim(),
          role_id: userRoleToRoleId(formData.role),
          business_type_id: formData.businessTypeId,
          device,
        };

        const response = await apiClient.post(API_ENDPOINTS.REGISTER, body);
        const data = unwrapApiPayload<Record<string, unknown>>(response.data);
        const session = parseAuthSession(data);

        if (session.access_token && session.user) {
          persistSession(session.access_token, session.user, session.refresh_token);
        }

        return {
          is_registered: session.is_registered,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: session.user,
          message: String((response.data as { message?: string }).message || "Registration successful"),
        } as RegisterResponse;
      },
    });
  };

  const completeProfileAction = async (payload: CompleteProfileData): Promise<boolean> => {
    if (!user) {
      showErrorToast("Please sign in to update your profile.");
      return false;
    }

    const result = await runApiAction({
      setState: setCompleteProfileState,
      successMessage: "Profile updated successfully",
      fallbackError: "Failed to update profile",
      action: async () => {
        const formData = buildProfileFormData(payload);

        const response = await apiClient.put(API_ENDPOINTS.PROFILE, formData);
        const profile = unwrapApiPayload<ApiUserProfile>(response.data);
        const updatedUser = mapApiProfileToUser(profile);

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        setUser(updatedUser);
        return updatedUser;
      },
    });

    if (result) {
      closeCompleteProfileModal();
      // After registration on the marketing site, land in the portal.
      if (typeof window !== "undefined" && !isPortalPath(window.location.pathname)) {
        redirectToDashboard(result);
      }
      return true;
    }
    return false;
  };

  const deleteAccountAction = async (): Promise<boolean> => {
    try {
      await deleteProfile();
      await signOutOfFirebase();
      clearRecaptchaVerifier();
      confirmationResultRef.current = null;
      clearSession();
      setIsAuthModalOpen(false);
      setIsCompleteProfileOpen(false);
      setAuthModalStep("login");
      setAuthModalRole(null);
      setAuthModalPhone("");
      setSessionMobileNumber(null);
      resetSendOtp();
      resetVerifyOtp();
      resetResendOtp();
      resetRegister();
      return true;
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to delete account";
      showErrorToast(message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        isAuthModalOpen,
        authModalSession,
        authModalStep,
        authModalRole,
        authModalPhone,
        authModalCountryCode,
        sessionMobileNumber,
        sendOtpState,
        verifyOtpState,
        resendOtpState,
        registerState,
        isCompleteProfileOpen,
        completeProfileRole,
        completeProfileState,
        loginUser,
        logoutUser,
        updateUser,
        openAuthModal,
        closeAuthModal,
        setAuthModalStep,
        setAuthModalPhone,
        setAuthModalCountryCode,
        sendOtpAction,
        verifyOtpAction,
        resendOtpAction,
        registerAction,
        openCompleteProfileModal,
        closeCompleteProfileModal,
        skipCompleteProfile,
        completeProfileAction,
        deleteAccountAction,
        resetSendOtp,
        resetVerifyOtp,
        resetResendOtp,
        resetRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
