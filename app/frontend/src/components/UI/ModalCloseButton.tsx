import { FaXmark } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { ModalCloseButtonProps } from "@/types/types";

/** Bouton de fermeture commun à toutes les modales (carré arrondi, bordure 2px). */
export default function ModalCloseButton({
    onClick,
    disabled,
    className,
}: ModalCloseButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label="Fermer"
            className={cn(
                "border-border bg-popover text-muted-foreground hover:border-primary hover:text-primary focus-visible:ring-primary/60 grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border-2 transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-default disabled:opacity-40",
                className,
            )}
        >
            <FaXmark size={18} aria-hidden="true" />
        </button>
    );
}
