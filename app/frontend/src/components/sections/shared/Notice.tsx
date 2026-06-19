import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Ligne clé/valeur d'une notice monospace (séparateur pointillé sauf la dernière). */
export function NoticeRow({
    label,
    value,
    icon,
    last,
}: {
    label: string;
    value: ReactNode;
    icon?: ReactNode;
    last?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex items-baseline justify-between gap-4 py-2.5",
                !last && "border-b border-dashed border-[hsl(0_0%_100%/0.07)]",
            )}
        >
            <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[hsl(20_12%_56%)]">
                {icon}
                {label}
            </span>
            <span className="text-foreground/90 text-right font-mono text-xs">
                {value}
            </span>
        </div>
    );
}

/** Valeur absente, affichée « manquant » en ambre. */
export function Missing() {
    return (
        <span className="font-mono text-xs italic text-[hsl(25_80%_60%)]">
            manquant
        </span>
    );
}

/**
 * Panneau « notice » monospace des pages détail (livre/auteur) : coque encadrée,
 * en-tête à filet, et lignes clé/valeur passées en children.
 */
export default function NoticePanel({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="border-border bg-card/60 self-start rounded-xl border-2 p-6">
            <div className="mb-3 flex items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(43_30%_62%)]">
                    {title}
                </span>
                <span className="bg-primary/20 h-px flex-1" />
            </div>
            <div>{children}</div>
        </section>
    );
}
