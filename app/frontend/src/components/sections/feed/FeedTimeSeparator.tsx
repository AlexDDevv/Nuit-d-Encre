import { cn } from "@/lib/utils";
import { FeedTimeSeparatorProps } from "@/types/types";

/** Repère temporel posé sur le filet du fil (Aujourd'hui, Hier, Cette semaine…). */
export default function FeedTimeSeparator({
    label,
    discovery,
}: FeedTimeSeparatorProps) {
    return (
        <li className="relative flex items-center gap-4">
            <span
                aria-hidden="true"
                className="relative z-10 grid h-11 w-11 shrink-0 place-items-center"
            >
                <span
                    className={cn(
                        "bg-background text-xxxs grid h-6 w-6 place-items-center rounded-full border leading-none",
                        discovery
                            ? "border-secondary/70 text-secondary-foreground/70"
                            : "border-primary/45 text-primary/70",
                    )}
                >
                    ◆
                </span>
            </span>
            <span className="flex items-center gap-3">
                <span className="text-muted-foreground font-title text-xs font-bold uppercase tracking-[0.24em]">
                    {label}
                </span>
                <span className="from-border bg-linear-to-r h-px w-12 to-transparent" />
            </span>
        </li>
    );
}
