import { ReactNode } from "react";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

// Primitives ornementales mutualisées (réutilisées par profil, admin, legal).
export { default as Ornament } from "@/components/sections/shared/Ornament";
export { default as MoonMedallion } from "@/components/sections/shared/MoonMedallion";

/** Carte sombre à liseré, optionnellement réactive au survol (halo doré). */
export function Card({
    glow = true,
    className,
    children,
    ...rest
}: {
    glow?: boolean;
    className?: string;
    children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "border-border bg-card rounded-xl border-2 transition-all duration-200",
                glow &&
                    "hover:border-primary/55 hover:-translate-y-0.5 hover:shadow-[0_0_28px_-6px_hsl(43_59%_60%/0.30)]",
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

type PillTone = "deep" | "gold" | "muted";

/** Étiquette pilule en petites capitales (titre, palier…). */
export function Pill({
    tone = "deep",
    className,
    children,
}: {
    tone?: PillTone;
    className?: string;
    children: ReactNode;
}) {
    const tones: Record<PillTone, string> = {
        deep: "bg-secondary/55 text-secondary-foreground border-secondary/60",
        gold: "bg-primary/15 text-primary border-primary/40",
        muted: "bg-muted/70 text-muted-foreground border-border",
    };
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-[0.12em] whitespace-nowrap uppercase",
                tones[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}

/** En-tête de section : icône dorée + titre en capitales espacées. */
export function SectionHeading({
    icon: Icon,
    children,
    right,
}: {
    icon?: IconType;
    children: ReactNode;
    right?: ReactNode;
}) {
    return (
        <div className="mb-4 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2.5">
                {Icon && <Icon className="text-primary/80" size={18} />}
                <h2 className="text-foreground/90 font-quote text-xl font-medium tracking-[0.22em] uppercase">
                    {children}
                </h2>
            </div>
            {right}
        </div>
    );
}
