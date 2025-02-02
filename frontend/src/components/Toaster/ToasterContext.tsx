import { createContext } from "react";

export interface Toast {
    id: number;
    message: string;
    type?: "success" | "error" | "info" | "warning";
}

export interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: Toast["type"]) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
    undefined
);
