import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/app/context/AppContext";
import { ReduxProvider } from "@/store/ReduxProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ActiveRoleProvider } from "@/context/ActiveRoleContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ChatProvider } from "@/context/ChatContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { GeoLocationProvider } from "@/context/GeoLocationContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AppChrome from "@/components/layout/AppChrome";
import { FcmListener } from "@/components/fcm/FcmListener";
import PwaInstallPrompt from "@/components/common/PwaInstallPrompt";
import RouteNavigationWatcher from "@/components/layout/RouteNavigationWatcher";
import { Toaster } from "react-hot-toast";
import { TOAST_DURATION_MS } from "@/utils/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeNexa - India's Smart B2B Marketplace",
  description:
    "Connect buyers with verified sellers across India. Grow your business through a powerful digital marketplace.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TradeNexa",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

/** Runs before React — if Chrome opened only "/", jump to last FCM deep link. */
const FCM_ROOT_RECOVER_SCRIPT = `
(function () {
  try {
    var p = location.pathname;
    if (p !== "/" && p !== "") return;
    var raw =
      localStorage.getItem("tradenexa_fcm_last_nav") ||
      sessionStorage.getItem("tradenexa_fcm_pending_path");
    if (!raw) return;
    var parsed = JSON.parse(raw);
    var path = (parsed && parsed.path) || "";
    var at = (parsed && parsed.at) || 0;
    if (!path || path === "/") return;
    if (Date.now() - at > 60000) return;
    location.replace(path);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a56db" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TradeNexa" />
      </head>
      <body suppressHydrationWarning className="flex min-h-dvh min-w-0 flex-col bg-background text-foreground">
        <Script
          id="fcm-root-recover"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: FCM_ROOT_RECOVER_SCRIPT }}
        />
        <ReduxProvider>
          <AuthProvider>
            <ActiveRoleProvider>
              <LanguageProvider>
                <WishlistProvider>
                  <ChatProvider>
                    <NotificationProvider>
                      <GeoLocationProvider>
                        <AppProvider>
                          <AppChrome>{children}</AppChrome>
                          <RouteNavigationWatcher />
                          <FcmListener />
                          <PwaInstallPrompt />
                        </AppProvider>
                      </GeoLocationProvider>
                    </NotificationProvider>
                  </ChatProvider>
                </WishlistProvider>
              </LanguageProvider>
            </ActiveRoleProvider>
            <Toaster position="top-center" toastOptions={{ duration: TOAST_DURATION_MS }} />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
