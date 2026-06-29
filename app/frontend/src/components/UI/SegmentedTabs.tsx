import { cn } from "@/lib/utils";
import { SegmentedTabsProps } from "@/types/types";

/**
 * Bascule segmentée dorée (rôle `tablist`) : une option active enfoncée, les
 * autres discrètes. Réutilisée par le fil (Abonnements/Communauté) et l'édition
 * de profil (Informations/Sécurité). Une option peut être désactivée (verrou).
 */
export default function SegmentedTabs<T extends string>({
    options,
    value,
    onChange,
    ariaLabel,
    fullWidth = false,
    className,
}: SegmentedTabsProps<T>) {
    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={cn(
                "border-border bg-popover flex items-center gap-1 rounded-lg border-2 p-1",
                fullWidth && "w-full",
                className,
            )}
        >
            {options.map((option) => {
                const Icon = option.icon;
                const active = !option.disabled && value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        disabled={option.disabled}
                        title={option.tooltip}
                        onClick={() =>
                            !option.disabled && onChange(option.value)
                        }
                        className={cn(
                            "font-body focus-visible:ring-primary/70 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
                            fullWidth && "flex-1",
                            active
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : option.disabled
                                  ? "text-muted-foreground/40 cursor-not-allowed"
                                  : "text-muted-foreground hover:text-foreground cursor-pointer",
                        )}
                    >
                        {Icon && <Icon size={14} />}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
