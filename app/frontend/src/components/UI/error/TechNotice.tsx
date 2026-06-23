import { useState, type ReactNode } from "react";
import { LuWrench, LuChevronDown } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { ErrorTechDetails } from "@/types/types";

function TechRow({
    label,
    tone,
    children,
}: {
    label: string;
    tone?: "destructive";
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="text-primary/50 shrink-0 font-mono text-xxs font-medium uppercase tracking-[0.18em] sm:w-22">
                {label}
            </dt>
            <dd
                className={cn(
                    "min-w-0 wrap-break-word font-mono text-xs leading-relaxed",
                    tone === "destructive"
                        ? "font-semibold text-[hsl(3_84%_64%)]"
                        : "text-foreground/90",
                )}
            >
                {children}
            </dd>
        </div>
    );
}

/**
 * Bloc « Détails techniques » - notice de catalogue monospace, repliable.
 * Seul endroit où le monospace et le rouge destructif apparaissent.
 * Réservé au mode développement (le parent garde l'affichage par `import.meta.env.DEV`).
 */
export default function TechNotice({ tech }: { tech: ErrorTechDetails }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="grain border-border bg-popover/70 mx-auto mt-10 w-full max-w-xl overflow-hidden rounded-xl border-2 text-left shadow-[inset_0_1px_0_hsl(43_59%_81%/0.05)]">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="group border-border/70 hover:bg-primary/8 focus-visible:ring-primary/70 flex w-full items-center justify-between gap-3 border-b bg-primary/4 px-4 py-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
            >
                <span className="inline-flex items-center gap-2.5">
                    <LuWrench size={14} className="text-primary/70" />
                    <span className="text-primary/80 font-mono text-xxs font-semibold uppercase tracking-[0.26em]">
                        Détails techniques
                    </span>
                    <span className="border-warning/40 bg-warning/10 text-warning rounded border px-1.5 py-px font-mono text-xxxs font-semibold uppercase tracking-[0.18em]">
                        dev
                    </span>
                </span>
                <LuChevronDown
                    size={16}
                    className={cn(
                        "text-primary/60 transition-transform duration-200",
                        open && "rotate-180",
                    )}
                />
            </button>

            {open && (
                <dl className="divide-border/40 divide-y px-4 py-1 font-mono leading-relaxed">
                    <TechRow label="type" tone="destructive">
                        {tech.type}
                    </TechRow>
                    {tech.status && <TechRow label="status">{tech.status}</TechRow>}
                    {tech.message && (
                        <TechRow label="message">{tech.message}</TechRow>
                    )}
                    {tech.data && (
                        <TechRow label="data">
                            <span className="text-primary/85">{tech.data}</span>
                        </TechRow>
                    )}
                    {tech.stack && (
                        <div className="py-3">
                            <dt className="text-primary/50 mb-2 font-mono text-xxs font-medium uppercase tracking-[0.2em]">
                                stack trace
                            </dt>
                            <dd>
                                <pre className="border-border/60 bg-background/60 text-muted-foreground/85 overflow-x-auto whitespace-pre rounded-md border p-3 font-mono text-xs leading-relaxed">
                                    {tech.stack}
                                </pre>
                            </dd>
                        </div>
                    )}
                </dl>
            )}
        </div>
    );
}
