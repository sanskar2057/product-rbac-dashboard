"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/utils/cn";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  notify: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const ACCENTS: Record<ToastVariant, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-blue-500",
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++counter;
      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant];
          return (
            <div
              key={toast.id}
              role="alert"
              className="pointer-events-auto flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", ACCENTS[toast.variant])} />
              <p className="flex-1 text-sm text-zinc-700 dark:text-zinc-200">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
