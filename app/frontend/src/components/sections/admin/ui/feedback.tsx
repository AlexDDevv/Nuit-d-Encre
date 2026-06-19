import { LuInbox } from "react-icons/lu";
import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import { Ornament } from "@/components/sections/admin/ui/chips";

/** État vide d'un tableau ou d'une liste. */
export function EmptyState({
    message = "Aucun résultat",
    hint,
}: {
    message?: string;
    hint?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-border bg-popover/60 text-muted-foreground/60">
                <LuInbox size={26} />
            </span>
            <div className="flex flex-col items-center gap-2">
                <p className="font-quote text-lg italic text-muted-foreground">
                    {message}
                </p>
                {hint && (
                    <p className="font-body text-sm text-muted-foreground/60">
                        {hint}
                    </p>
                )}
            </div>
            <Ornament width="w-12" />
        </div>
    );
}

/** Squelette de lignes pendant le chargement d'un tableau. */
export function SkeletonRows({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
    const widths = [28, 20, 14, 18];
    return (
        <div className="flex flex-col divide-y-2 divide-border/60">
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex items-center gap-4 px-4 py-3.5">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                    {Array.from({ length: cols - 1 }).map((_, c) => (
                        <Skeleton
                            key={c}
                            className="h-3.5 rounded"
                            style={{ width: `${widths[c % 4]}%` }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
