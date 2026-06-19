import type { IconType } from "react-icons";
import type { ReactNode } from "react";

/** En-tête d'un bloc du dashboard. */
function BlockHead({
    icon: Icon,
    title,
    meta,
}: {
    icon: IconType;
    title: string;
    meta?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 border-b-2 border-border px-5 py-3.5">
            <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-border bg-popover text-primary/80">
                    <Icon size={16} />
                </span>
                <h3 className="font-quote text-base font-medium uppercase tracking-[0.16em] text-foreground/90">
                    {title}
                </h3>
            </div>
            {meta && (
                <span className="font-body text-xs uppercase tracking-[0.14em] text-muted-foreground/70">
                    {meta}
                </span>
            )}
        </div>
    );
}

/** Coque encadrée d'un bloc du dashboard (en-tête + contenu). */
export default function DashBlock({
    icon,
    title,
    meta,
    children,
}: {
    icon: IconType;
    title: string;
    meta?: string;
    children: ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
            <BlockHead icon={icon} title={title} meta={meta} />
            {children}
        </div>
    );
}
