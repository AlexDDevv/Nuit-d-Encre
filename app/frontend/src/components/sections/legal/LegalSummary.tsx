import { useState } from "react";
import { LuChevronDown, LuListTree } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import { cn } from "@/lib/utils";
import { LegalSection } from "./types";

type TocProps = {
    sections: LegalSection[];
    active: string;
    onJump: (id: string) => void;
};

// ── Entrée de sommaire ──────────────────────────────────────────
function TocEntry({
    section,
    active,
    onClick,
}: {
    section: LegalSection;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <a
            href={`#${section.id}`}
            onClick={onClick}
            className={cn(
                "group/toc focus-visible:ring-primary/70 relative flex items-baseline gap-3 rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2",
                active ? "bg-primary/8" : "hover:bg-muted/40",
            )}
        >
            {/* filet vertical qui s'illumine */}
            <span
                className={cn(
                    "absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-full transition-all duration-200",
                    active
                        ? "bg-primary w-0.75"
                        : "bg-border group-hover/toc:bg-primary/60 w-px",
                )}
            />
            <span
                className={cn(
                    "font-mono text-xs font-semibold tabular-nums transition-colors duration-200",
                    active
                        ? "text-primary"
                        : "text-primary/45 group-hover/toc:text-primary/80",
                )}
            >
                {section.num}
            </span>
            <span
                className={cn(
                    "font-body text-sm leading-snug transition-colors duration-200",
                    active
                        ? "text-foreground"
                        : "text-muted-foreground group-hover/toc:text-foreground/90",
                )}
            >
                {section.title}
            </span>
        </a>
    );
}

// ── Sommaire - colonne sticky (bureau) ──────────────────────────
export function TocDesktop({ sections, active, onJump }: TocProps) {
    return (
        <nav aria-label="Sommaire" className="sticky top-6">
            <div className="grain border-border bg-card/70 relative overflow-hidden rounded-xl border-2 p-2">
                <div className="flex items-center gap-2 px-3 pb-2 pt-2">
                    <LuListTree size={15} className="text-primary/70" />
                    <span className="text-foreground/80 font-quote text-xs font-medium uppercase tracking-[0.26em]">
                        Sommaire
                    </span>
                </div>
                <div className="from-primary/30 bg-linear-to-r mx-3 mb-1 h-px to-transparent" />
                <div className="flex flex-col gap-0.5 p-1">
                    {sections.map((s) => (
                        <TocEntry
                            key={s.id}
                            section={s}
                            active={active === s.id}
                            onClick={() => onJump(s.id)}
                        />
                    ))}
                </div>
            </div>
        </nav>
    );
}

// ── Sommaire - accordéon (mobile / sous lg) ─────────────────────
export function TocMobile({ sections, active, onJump }: TocProps) {
    const [open, setOpen] = useState(false);
    const activeSec = sections.find((s) => s.id === active);

    return (
        <nav
            aria-label="Sommaire"
            className="grain border-border bg-card/70 relative overflow-hidden rounded-xl border-2"
        >
            <Button
                variant="text"
                size="lg"
                fullWidth
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="hover:bg-muted/40 focus-visible:ring-primary/70 justify-between gap-3 rounded-xl px-4 py-3 text-left"
                rightIcon={
                    <LuChevronDown
                        size={18}
                        className={cn(
                            "text-primary/70 transition-transform duration-200",
                            open && "rotate-180",
                        )}
                    />
                }
            >
                <span className="flex items-center gap-2.5">
                    <LuListTree
                        size={16}
                        className="text-primary/70 shrink-0"
                    />
                    <span className="flex flex-col leading-tight">
                        <span className="text-foreground/80 font-quote text-xs font-medium uppercase tracking-[0.24em]">
                            Sommaire
                        </span>
                        {activeSec && (
                            <span className="text-primary/70 text-xxs font-mono">
                                {activeSec.num} ·{" "}
                                <span className="text-muted-foreground">
                                    {activeSec.title}
                                </span>
                            </span>
                        )}
                    </span>
                </span>
            </Button>
            <div
                className={cn(
                    "grid transition-all duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="overflow-hidden">
                    <div className="from-primary/30 bg-linear-to-r mx-4 h-px to-transparent" />
                    <div className="flex flex-col gap-0.5 p-2">
                        {sections.map((s) => (
                            <TocEntry
                                key={s.id}
                                section={s}
                                active={active === s.id}
                                onClick={() => {
                                    onJump(s.id);
                                    setOpen(false);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
