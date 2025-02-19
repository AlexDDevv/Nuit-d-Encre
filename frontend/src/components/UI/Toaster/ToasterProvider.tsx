import { useState, ReactNode } from "react";
import { Toaster, toast } from "sonner";
import { Toast, ToastContext } from "./ToasterContext";
import { BadgeCheck, BadgeInfo, BadgeAlert, BadgeX } from "lucide-react";

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: Toast["type"] = "info") => {
        const newToast = { id: Date.now(), message, type };
        setToasts((prev) => [...prev, newToast]);

        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "info":
                toast.info(message);
                break;
            case "error":
                toast.error(message);
                break;
            case "warning":
                toast.warning(message);
                break;
            default:
                toast(message);
        }
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast }}>
            {children}
            <Toaster
                toastOptions={{
                    style: {
                        backgroundColor: "var(--color-popover)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-popover-foreground)",
                        cursor: "pointer",
                        gap: "16px",
                    },
                }}
                icons={{
                    success: (
                        <BadgeCheck color="var(--color-popover-foreground)" />
                    ),
                    info: <BadgeInfo color="var(--color-primary)" />,
                    warning: <BadgeAlert color="var(--color-primary)" />,
                    error: <BadgeX color="var(--color-destructive)" />,
                }}
            />
        </ToastContext.Provider>
    );
};
