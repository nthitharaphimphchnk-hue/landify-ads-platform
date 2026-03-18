/**
 * AdCraft AI - Toast Hook
 * Custom hook for managing toast notifications using Sonner
 */

import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  duration?: number;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions
  ) => {
    const defaultDuration = 3000;
    const config = {
      duration: options?.duration || defaultDuration,
      position: options?.position || "bottom-right",
      action: options?.action,
    };

    switch (type) {
      case "success":
        toast.success(message, config);
        break;
      case "error":
        toast.error(message, config);
        break;
      case "warning":
        toast.warning(message, config);
        break;
      case "info":
      default:
        toast.info(message, config);
        break;
    }
  };

  const success = (message: string, options?: ToastOptions) => {
    showToast(message, "success", options);
  };

  const error = (message: string, options?: ToastOptions) => {
    showToast(message, "error", options);
  };

  const warning = (message: string, options?: ToastOptions) => {
    showToast(message, "warning", options);
  };

  const info = (message: string, options?: ToastOptions) => {
    showToast(message, "info", options);
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
}
