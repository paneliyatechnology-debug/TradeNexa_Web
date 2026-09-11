"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export function ClientToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 20,
        zIndex: 99999999,
        pointerEvents: "none",
      }}
      toastOptions={{
        duration: 4000,
        style: {
          zIndex: 99999999,
          pointerEvents: "auto",
          borderRadius: "14px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.15)",
        },
        success: {
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          duration: 4500,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
