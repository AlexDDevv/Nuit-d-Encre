/** Squelette de la page Fil d'activité. */
export default function FeedSkeleton() {
    return (
        <div className="mx-auto w-full max-w-2xl space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="border-border bg-card/40 h-20 animate-pulse rounded-xl border-2"
                />
            ))}
        </div>
    );
}
