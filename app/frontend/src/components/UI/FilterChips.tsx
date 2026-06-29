import { cn } from "@/lib/utils";
import { FilterChipsProps } from "@/types/types";

/**
 * Rangée de pastilles-filtres exclusives (rôle `group`) : la pastille active se
 * pare d'or, les autres restent en contour discret. Générique sur la valeur.
 */
export default function FilterChips<T extends string>({
    options,
    value,
    onChange,
    ariaLabel,
    className,
}: FilterChipsProps<T>) {
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={cn(
                "flex flex-wrap items-center justify-center gap-2",
                className,
            )}
        >
            {options.map((option) => {
                const Icon = option.icon;
                const active = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "font-body focus-visible:ring-primary/70 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
                            active
                                ? "border-primary bg-primary/15 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/45 hover:text-foreground",
                        )}
                    >
                        {Icon && <Icon size={13} />}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
