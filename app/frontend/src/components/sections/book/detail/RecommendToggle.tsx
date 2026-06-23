import { FaFire } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type RecommendToggleProps = {
    on: boolean;
    count: number;
    onToggle: () => void;
    disabled?: boolean;
};

/**
 * Affordance « Je recommande » - rattachée à la veillée des lecteurs (critiques).
 * Toggle doré avec compteur, reprenant la flamme du jeton de statistiques.
 */
export default function RecommendToggle({
    on,
    count,
    onToggle,
    disabled,
}: RecommendToggleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={disabled}
            aria-pressed={on}
            aria-label={
                on ? "Retirer ma recommandation" : "Recommander cet ouvrage"
            }
            className={cn(
                "group focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-2.5 whitespace-nowrap rounded-xl border-2 px-4 py-3 font-body text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60",
                on
                    ? "border-primary/70 text-primary bg-[hsl(43_30%_25%/0.45)]"
                    : "border-border text-muted-foreground hover:border-primary/50",
            )}
        >
            <FaFire
                size={16}
                className={cn(
                    "transition-transform duration-200 group-hover:scale-110",
                    on ? "text-primary" : "text-[hsl(25_78%_58%)]",
                )}
                aria-hidden="true"
            />
            {on ? "Je recommande" : "Recommander"}
            <span
                className={cn(
                    "rounded-full bg-[hsl(20_3%_10%/0.6)] px-2 py-px font-mono text-xs",
                    on ? "text-primary" : "text-muted-foreground",
                )}
            >
                {count}
            </span>
        </button>
    );
}
