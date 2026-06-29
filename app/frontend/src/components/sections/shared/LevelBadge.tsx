import { cn } from "@/lib/utils";
import { LevelBadgeProps } from "@/types/types";

/** Badge doré « Niv. N » — palier de gamification d'un lecteur. */
export default function LevelBadge({ level, className }: LevelBadgeProps) {
    return (
        <span
            className={cn(
                "border-primary/40 bg-primary/10 text-primary font-title inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-bold leading-none",
                className,
            )}
        >
            Niv.&nbsp;{level}
        </span>
    );
}
