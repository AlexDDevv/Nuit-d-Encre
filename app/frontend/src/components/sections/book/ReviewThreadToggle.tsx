import { LuQuote, LuChevronDown } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { ReviewThreadToggleProps } from "@/types/types";

/**
 * Bascule du fil de commentaires greffé sous une critique : compteur
 * singulier/pluriel, chevron pivotant à l'ouverture.
 */
export default function ReviewThreadToggle({
    count,
    open,
    onToggle,
}: ReviewThreadToggleProps) {
    const label =
        count === 0
            ? "Commenter"
            : open
              ? `Masquer ${count === 1 ? "le commentaire" : `les ${count} commentaires`}`
              : `${count} commentaire${count > 1 ? "s" : ""}`;

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="text-muted-foreground hover:text-primary focus-visible:ring-primary/70 focus-visible:ring-offset-card group inline-flex items-center gap-2 self-start rounded-lg px-2 py-1.5 font-body text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
            <LuQuote className="text-primary/70" size={14} />
            {label}
            {count > 0 && (
                <LuChevronDown
                    size={14}
                    className={cn(
                        "text-primary/60 transition-transform duration-200",
                        open && "rotate-180",
                    )}
                />
            )}
        </button>
    );
}
