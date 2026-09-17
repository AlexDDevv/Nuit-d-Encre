import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import ModalCloseButton from "@/components/UI/ModalCloseButton";
import { useModalTransition } from "@/hooks/modal/useModalTransition";

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
    const { mounted, closing, requestClose } = useModalTransition({
        isOpen,
        onClose,
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) requestClose();
        };
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, requestClose]);

    if (!mounted) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
                closing ? "overlay-out" : "overlay-in",
            )}
            onClick={requestClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={cn(
                    "relative w-full overflow-hidden rounded-xl",
                    closing ? "modal-out" : "modal-in",
                    "border-border border",
                    "shadow-[0_0_0_1px_hsl(43_59%_81%/0.12),0_25px_60px_-10px_rgba(0,0,0,0.9)]",
                    sizeClasses[size],
                    className,
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-popover border-border flex items-center justify-between border-b px-6 py-4">
                    {title ? (
                        <h2 className="font-quote text-foreground text-xl italic">
                            {title}
                        </h2>
                    ) : (
                        <span />
                    )}
                    <ModalCloseButton onClick={requestClose} />
                </div>

                {/* Content */}
                <div className="bg-popover max-h-[calc(100vh-10rem)] overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
