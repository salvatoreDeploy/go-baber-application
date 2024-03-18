import React from "react";
import { AuthProvider } from "./AuthContext";

interface AppProviderState {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderState) {
  return <AuthProvider>{children}</AuthProvider>;
}
