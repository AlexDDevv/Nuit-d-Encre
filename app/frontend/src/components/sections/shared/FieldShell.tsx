import { ReactNode } from "react";
import { IconType } from "react-icons";
import { LuCircleAlert } from "react-icons/lu";
import { cn } from "@/lib/utils";

/** Compteur de caractères - ambre à l'approche de la limite, rouge au-delà. */
export function CharCounter({ value, max }: { value: number; max: number }) {
    const over = value > max;
    const near = !over && value >= max * 0.9;

    return (
        <span
            aria-live="polite"
            className={cn(
                "font-mono text-xxs tabular-nums tracking-wide transition-colors duration-200",
                over
                    ? "text-destructive"
                    : near
                      ? "text-warning"
                      : "text-muted-foreground/55",
            )}
        >
            {value.toLocaleString("fr-FR")} / {max.toLocaleString("fr-FR")}
        </span>
    );
}

type FieldShellProps = {
    htmlFor: string;
    label: string;
    icon?: IconType;
    required?: boolean;
    error?: string;
    hint?: string;
    counter?: { value: number; max: number };
    className?: string;
    children: ReactNode;
};

/**
 * Habillage d'un champ de l'atelier : libellé mono, icône en préfixe, compteur,
 * message d'erreur (ou indice). Le contrôle (Input/Textarea/TypeSelect) est passé
 * en `children` ; l'icône se superpose au centre vertical d'un contrôle de 44px.
 */
export default function FieldShell({
    htmlFor,
    label,
    icon: Icon,
    required,
    error,
    hint,
    counter,
    className,
    children,
}: FieldShellProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <div className="flex items-end justify-between gap-3">
                <label
                    htmlFor={htmlFor}
                    className="text-primary/65 font-mono text-xxs font-medium uppercase tracking-[0.18em]"
                >
                    {label}
                    {required && <span className="text-primary/40"> *</span>}
                </label>
                {counter && (
                    <CharCounter value={counter.value} max={counter.max} />
                )}
            </div>

            <div className="group relative">
                {Icon && (
                    <span className="text-primary/45 group-focus-within:text-primary pointer-events-none absolute left-3.5 top-[22px] z-10 -translate-y-1/2 transition-colors duration-200">
                        <Icon size={17} />
                    </span>
                )}
                {children}
            </div>

            {error ? (
                <span
                    role="alert"
                    className="text-destructive inline-flex items-center gap-1.5 text-xs"
                >
                    <LuCircleAlert size={13} /> {error}
                </span>
            ) : hint ? (
                <span className="text-muted-foreground/65 font-quote text-xs italic">
                    {hint}
                </span>
            ) : null}
        </div>
    );
}
