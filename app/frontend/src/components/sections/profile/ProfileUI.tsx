import { ReactNode } from "react";
import { FaMoon } from "react-icons/fa6";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

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
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap uppercase",
                tones[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}

/** Filet doré centré sur un losange — séparateur ornemental. */
export function Ornament({
    width = "w-10",
    className,
}: {
    width?: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "text-primary/55 inline-flex items-center gap-2",
                className,
            )}
            aria-hidden="true"
        >
            <span
                className={cn(
                    "to-primary/55 h-px bg-gradient-to-r from-transparent",
                    width,
                )}
            />
            <span className="rotate-45 text-[8px] leading-none">◆</span>
            <span
                className={cn(
                    "to-primary/55 h-px bg-gradient-to-l from-transparent",
                    width,
                )}
            />
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
                <h2 className="text-foreground/90 font-quote text-[20px] font-medium tracking-[0.22em] uppercase">
                    {children}
                </h2>
            </div>
            {right}
        </div>
    );
}

/** Médaillon lunaire doré, emblème des titres gamifiés. */
export function MoonMedallion({ size = 36 }: { size?: number }) {
    return (
        <span
            className="border-primary/55 text-primary grid shrink-0 place-items-center rounded-full border-2 bg-gradient-to-b from-[hsl(43_59%_81%/0.25)] to-transparent shadow-[0_0_18px_-3px_hsl(43_59%_70%/0.55)]"
            style={{ width: size, height: size }}
        >
            <FaMoon size={size * 0.45} />
        </span>
    );
}
