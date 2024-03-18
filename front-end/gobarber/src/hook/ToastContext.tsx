import React, { createContext, useContext, useCallback, useState } from "react";
import { ToastContainer } from "../components/ToatContainer";
import { v4 as uuid } from "uuid";

interface ToastProviderState {
  children: React.ReactNode;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, "id">): void;
  removeToast(id: string): void;
}

export interface ToastMessage {
  id: string;
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
}

export const ToastContext = createContext<ToastContextData>(
  {} as ToastContextData
);

export function ToastProvider({ children }: ToastProviderState) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ title, description, type }: Omit<ToastMessage, "id">) => {
      const id = uuid();

      const toast = {
        id,
        description,
        type,
        title,
      };

      setMessages((oldMessages) => [...oldMessages, toast]);
    },
    []
  );
  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastContainer messages={messages} />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must used within a ToasProvider");
  }

  return context;
}
