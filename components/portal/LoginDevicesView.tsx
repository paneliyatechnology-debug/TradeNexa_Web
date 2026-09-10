"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  ShieldCheck,
  LogOut,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Shield,
  ChevronRight,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import PortalPageHeader from "@/components/portal/PortalPageHeader";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchActiveDevices,
  logoutDevice,
  logoutAllDevices,
  type LoginDevice,
} from "@/services/deviceService";

interface LoginDevicesViewProps {
  variant: "buyer" | "seller";
}

function getDeviceIcon(deviceType: string, os: string) {
  const normalizedType = (deviceType || "").toLowerCase();
  const normalizedOs = (os || "").toLowerCase();

  if (normalizedType === "mobile" || normalizedOs.includes("ios") || normalizedOs.includes("android")) {
    return Smartphone;
  }
  if (normalizedType === "tablet" || normalizedOs.includes("ipad")) {
    return Tablet;
  }
  if (normalizedOs.includes("mac") || normalizedOs.includes("windows") || normalizedOs.includes("linux")) {
    return Laptop;
  }
  return Monitor;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";

    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return "Active now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "Recently";
  }
}

export default function LoginDevicesView({ variant }: LoginDevicesViewProps) {
  const router = useRouter();
  const { user, logoutUser } = useAuth();
  const [devices, setDevices] = useState<LoginDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revokingId, setRevokingId] = useState<string | number | null>(null);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const profileHref = variant === "buyer" ? "/buyer/profile" : "/seller/profile";
  const settingsHref = variant === "buyer" ? "/buyer/settings" : "/seller/profile";

  async function loadDevices(isSilent = false) {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const list = await fetchActiveDevices();
      setDevices(list);
      const current = list.find((d) => d.is_current);
      if (current && typeof window !== "undefined") {
        sessionStorage.setItem("current_session_device_id", String(current.id));
      }
    } catch {
      toast.error("Failed to load active login devices.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadDevices();
  }, []);

  async function handleRevokeDevice(device: LoginDevice) {
    if (device.is_current) {
      // If logging out the current session
      if (!confirm("Logging out your current session will sign you out of TradeNexa on this browser. Continue?")) {
        return;
      }
      try {
        await logoutUser();
        router.replace("/");
      } catch {
        toast.error("Failed to sign out.");
      }
      return;
    }

    setRevokingId(device.id);
    try {
      await logoutDevice(device.id);
      setDevices((prev) => prev.filter((d) => d.id !== device.id));
      toast.success(`${device.title || "Device"} logged out successfully.`);
    } catch {
      toast.error("Failed to revoke device session.");
    } finally {
      setRevokingId(null);
    }
  }

  async function handleLogoutAllDevices() {
    startTransition(async () => {
      try {
        await logoutAllDevices();
        // Keep only current device
        setDevices((prev) => prev.filter((d) => d.is_current));
        setShowLogoutAllModal(false);
        toast.success("Successfully logged out from all other devices.");
      } catch {
        toast.error("Failed to log out from other devices.");
      }
    });
  }

  const otherDevicesCount = devices.filter((d) => !d.is_current).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs font-medium text-muted-fg">
        <Link href={profileHref} className="transition-colors hover:text-foreground">
          Profile
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-fg/60" />
        <Link href={settingsHref} className="transition-colors hover:text-foreground">
          Settings
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-fg/60" />
        <span className="font-semibold text-foreground">Login Devices</span>
      </nav>

      {/* Header with Title & Refresh Action */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PortalPageHeader
            title="Login Devices"
            subtitle="Manage and review all active devices and sessions logged into your account"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadDevices(true)}
            disabled={loading || refreshing}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-muted-fg transition hover:bg-muted hover:text-foreground disabled:opacity-50"
            title="Refresh device list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            Refresh
          </button>
          {otherDevicesCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowLogoutAllModal(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-error/30 bg-error-soft px-3 text-xs font-semibold text-error transition hover:bg-error/15"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out All Other Devices ({otherDevicesCount})
            </button>
          ) : null}
        </div>
      </div>

      {/* Security Tip Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary-soft/50 p-4 text-xs leading-relaxed text-foreground"
      >
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="font-semibold text-primary">Account Security & Active Sessions</p>
          <p className="mt-0.5 text-muted-fg">
            If you see any unfamiliar browser or device location, immediately click <strong>Log Out</strong> to revoke access, and ensure your registered mobile number is secure.
          </p>
        </div>
      </motion.div>

      {/* Devices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="surface-card flex animate-pulse items-center justify-between p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-44 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted/60" />
                  </div>
                </div>
                <div className="h-8 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : devices.length === 0 ? (
          <div className="surface-card flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">No active sessions found</p>
            <p className="mt-1 text-xs text-muted-fg">
              Your login activity will appear here once authenticated.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device, idx) => {
              const Icon = getDeviceIcon(device.device_type, device.os);
              const isRevoking = revokingId === device.id;

              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`surface-card relative flex flex-col gap-4 p-5 transition sm:flex-row sm:items-center sm:justify-between ${
                    device.is_current ? "border-primary/40 ring-1 ring-primary/20 bg-card" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                        device.is_current
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted text-muted-fg"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{device.title}</h4>
                        {device.is_current ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Current Device
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-fg">
                        <span className="inline-flex items-center gap-1">
                          <Globe className="h-3 w-3 text-muted-fg/70" />
                          IP: {device.ip_address}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-fg/70" />
                          {device.is_current ? "Active now" : "Active Session"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center justify-end border-t border-border pt-3 sm:border-t-0 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleRevokeDevice(device)}
                      disabled={isRevoking}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 ${
                        device.is_current
                          ? "border border-border bg-muted/60 text-muted-fg hover:border-error/40 hover:bg-error-soft hover:text-error focus-visible:ring-error/25"
                          : "border border-error/30 bg-card text-error hover:bg-error-soft focus-visible:ring-error/25"
                      }`}
                    >
                      {isRevoking ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Revoking...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-3.5 w-3.5" />
                          {device.is_current ? "Sign Out" : "Log Out Device"}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Logout All Devices */}
      <AnimatePresence>
        {showLogoutAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutAllModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error-soft text-error">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Log Out All Other Devices?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-fg">
                This will immediately invalidate all {otherDevicesCount} other active login session(s). Anyone using your account on other browsers, mobile apps, or computers will be required to log in again with OTP.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutAllModal(false)}
                  disabled={isPending}
                  className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutAllDevices}
                  disabled={isPending}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-error px-4 text-xs font-semibold text-white transition hover:bg-error/90 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-3.5 w-3.5" />
                      Confirm Log Out All
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
