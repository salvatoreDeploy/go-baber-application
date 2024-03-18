import React from "react";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./ToastContext";

interface AppProviderState {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderState) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
