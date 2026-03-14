import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/Button";

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
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={cn(
                    "relative w-full overflow-hidden rounded-xl",
                    "border border-border",
                    "shadow-[0_0_0_1px_hsl(43_59%_81%/0.12),0_25px_60px_-10px_rgba(0,0,0,0.9)]",
                    sizeClasses[size],
                    className,
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-popover border-b border-border flex items-center justify-between px-6 py-4">
                    {title ? (
                        <h2 className="font-quote italic text-xl text-foreground">
                            {title}
                        </h2>
                    ) : (
                        <span />
                    )}
                    <Button
                        variant="ghost"
                        size="square_sm"
                        onClick={onClose}
                        ariaLabel="Fermer la modale"
                        icon={X}
                        className="text-muted-foreground hover:text-foreground [&_svg]:h-5 [&_svg]:w-5"
                    />
                </div>

                {/* Content */}
                <div className="bg-popover max-h-[calc(100vh-10rem)] overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
