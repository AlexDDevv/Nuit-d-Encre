import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    size = "md",
}: ModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={cn(
                    "bg-card border-border relative w-full rounded-lg border-2 shadow-lg",
                    sizeClasses[size],
                    className,
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {title && (
                    <div className="border-border flex items-center justify-between border-b p-6">
                        <h2 className="text-foreground text-xl font-semibold">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
                            aria-label="Fermer la modale"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Close button (if no title) */}
                {!title && (
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground absolute right-4 top-4 rounded-md p-1 transition-colors"
                        aria-label="Fermer la modale"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Content */}
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}