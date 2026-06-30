"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { User, UserRole, SendOtpResponse, VerifyOtpResponse, RegisterResponse, RegisterRequest } from "@/types/auth";
import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/endpoints";

interface AsyncOperationState<T> {
  loading: boolean;
  success: boolean;
  error: string | null;
  response: T | null;
}

const initialOpState = <T,>(): AsyncOperationState<T> => ({
  loading: false,
  success: false,
  error: null,
  response: null,
});

interface AuthContextType {
  // Session States
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  
  // Modal Settings
  isAuthModalOpen: boolean;
  authModalStep: "login" | "verify" | "register";
  authModalRole: UserRole | null;
  authModalPhone: string;
  authModalCountryCode: string;
  
  // Async Operation States
  sendOtpState: AsyncOperationState<SendOtpResponse>;
  verifyOtpState: AsyncOperationState<VerifyOtpResponse>;
  resendOtpState: AsyncOperationState<SendOtpResponse>;
  registerState: AsyncOperationState<RegisterResponse>;

  // Session Methods
  loginUser: (token: string, user: User) => void;
  logoutUser: () => void;
  updateUser: (user: User) => void;
  openAuthModal: (step?: "login" | "register", role?: UserRole) => void;
  closeAuthModal: () => void;
  setAuthModalStep: (step: "login" | "verify" | "register") => void;
  setAuthModalPhone: (phone: string) => void;
  setAuthModalCountryCode: (code: string) => void;

  // Async Methods
  sendOtpAction: (phone: string, countryCode: string) => Promise<boolean>;
  verifyOtpAction: (phone: string, countryCode: string, otp: string) => Promise<VerifyOtpResponse | null>;
  resendOtpAction: (phone: string, countryCode: string) => Promise<boolean>;
  registerAction: (formData: RegisterRequest) => Promise<boolean>;
  resetSendOtp: () => void;
  resetVerifyOtp: () => void;
  resetResendOtp: () => void;
  resetRegister: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Session authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal Control states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalStep, setAuthModalStep] = useState<"login" | "verify" | "register">("login");
  const [authModalRole, setAuthModalRole] = useState<UserRole | null>(null);
  const [authModalPhone, setAuthModalPhone] = useState("");
  const [authModalCountryCode, setAuthModalCountryCode] = useState("+91");

  // Async Operations states
  const [sendOtpState, setSendOtpState] = useState<AsyncOperationState<SendOtpResponse>>(initialOpState());
  const [verifyOtpState, setVerifyOtpState] = useState<AsyncOperationState<VerifyOtpResponse>>(initialOpState());
  const [resendOtpState, setResendOtpState] = useState<AsyncOperationState<SendOtpResponse>>(initialOpState());
  const [registerState, setRegisterState] = useState<AsyncOperationState<RegisterResponse>>(initialOpState());

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const res = await apiClient.get<{ user: User }>(API_ENDPOINTS.ME);
            setUser(res.data.user);
            setIsAuthenticated(true);
          } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      setIsAuthModalOpen(true);
      setAuthModalStep("login");
    };

    window.addEventListener("auth_unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth_unauthorized", handleUnauthorized);
    };
  }, []);

  const loginUser = (token: string, userData: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
  };

  const openAuthModal = (step: "login" | "register" = "login", role?: UserRole) => {
    setAuthModalStep(step);
    setAuthModalRole(role || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setTimeout(() => {
      setAuthModalPhone("");
      setAuthModalRole(null);
      resetSendOtp();
      resetVerifyOtp();
      resetResendOtp();
      resetRegister();
    }, 300);
  };

  // Operation Resets
  const resetSendOtp = () => setSendOtpState(initialOpState());
  const resetVerifyOtp = () => setVerifyOtpState(initialOpState());
  const resetResendOtp = () => setResendOtpState(initialOpState());
  const resetRegister = () => setRegisterState(initialOpState());

  // Asynchronous Operations
  const sendOtpAction = async (phone: string, country_code: string): Promise<boolean> => {
    setSendOtpState({ loading: true, success: false, error: null, response: null });
    try {
      const response = await apiClient.post<SendOtpResponse>(API_ENDPOINTS.SEND_OTP, { phone, country_code });
      setSendOtpState({ loading: false, success: true, error: null, response: response.data });
        showSuccessToast('OTP sent successfully');
      return true;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to send OTP code";
      setSendOtpState({ loading: false, success: false, error: errorMsg, response: null });
        showErrorToast(errorMsg);
      return false;
    }
  };

  const verifyOtpAction = async (phone: string, country_code: string, otp: string): Promise<VerifyOtpResponse | null> => {
    setVerifyOtpState({ loading: true, success: false, error: null, response: null });
    try {
      const response = await apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.VERIFY_OTP, { phone, country_code, otp });
      setVerifyOtpState({ loading: false, success: true, error: null, response: response.data });
        showSuccessToast('OTP verified successfully');
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to verify OTP code";
      setVerifyOtpState({ loading: false, success: false, error: errorMsg, response: null });
        showErrorToast(errorMsg);
      return null;
    }
  };

  const resendOtpAction = async (phone: string, country_code: string): Promise<boolean> => {
    setResendOtpState({ loading: true, success: false, error: null, response: null });
    try {
      const response = await apiClient.post<SendOtpResponse>(API_ENDPOINTS.RESEND_OTP, { phone, country_code });
      setResendOtpState({ loading: false, success: true, error: null, response: response.data });
        showSuccessToast('OTP resent successfully');
      return true;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to resend OTP code";
      setResendOtpState({ loading: false, success: false, error: errorMsg, response: null });
        showErrorToast(errorMsg);
      return false;
    }
  };

  const registerAction = async (formData: RegisterRequest): Promise<boolean> => {
    setRegisterState({ loading: true, success: false, error: null, response: null });
    try {
      const response = await apiClient.post<RegisterResponse>(API_ENDPOINTS.REGISTER, formData);
      setRegisterState({ loading: false, success: true, error: null, response: response.data });
        showSuccessToast('Registration successful');
      return true;
    } catch (err: any) {
      const errorMsg = err.message || "Registration failed";
      setRegisterState({ loading: false, success: false, error: errorMsg, response: null });
        showErrorToast(errorMsg);
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
        authModalStep,
        authModalRole,
        authModalPhone,
        authModalCountryCode,
        sendOtpState,
        verifyOtpState,
        resendOtpState,
        registerState,
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
