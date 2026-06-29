/** Squelette d'une entrée du fil (médaillon + lignes + chip de cible). */
function SkeletonEntry() {
    return (
        <li className="relative flex items-start gap-4" aria-hidden="true">
            <span className="border-border bg-muted relative z-10 h-11 w-11 shrink-0 animate-pulse rounded-full border-2" />
            <div className="flex-1 space-y-2.5 pt-1">
                <div className="bg-muted/50 h-3.5 w-40 animate-pulse rounded" />
                <div className="flex items-center gap-2">
                    <span className="bg-muted/50 h-7 w-7 animate-pulse rounded-md" />
                    <div className="bg-muted/40 h-3 w-2/3 animate-pulse rounded" />
                </div>
                <div className="bg-muted/30 h-11 w-44 animate-pulse rounded-lg" />
            </div>
        </li>
    );
}

/** Frise de chargement du fil : filet vertical + entrées en pulsation. */
export function FeedTimelineSkeleton() {
    return (
        <ul
            className="relative flex flex-col gap-7"
            aria-busy="true"
            aria-label="Chargement du fil"
        >
            <span
                aria-hidden="true"
                className="bg-border absolute bottom-3 left-[21px] top-3 w-px"
            />
            {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonEntry key={i} />
            ))}
        </ul>
    );
}

/** Squelette plein écran de la page Fil (fallback de route et de chargement). */
export default function FeedSkeleton() {
    return (
        <section className="mx-auto w-full max-w-3xl px-4 py-7 md:px-6 md:py-9">
            <FeedTimelineSkeleton />
        </section>
    );
}
