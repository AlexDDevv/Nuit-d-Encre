import { Skeleton } from "@/components/UI/skeleton/Skeleton";

const NOTICE_ROWS = ["w-1/4", "w-1/6", "w-1/5", "w-1/3", "w-1/4", "w-1/5", "w-1/6"];

export default function BookDetailsSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
            {/* retour */}
            <Skeleton className="h-5 w-24 rounded-md" />

            {/* couture « chez nous » */}
            <div className="-mt-10 flex items-center gap-3">
                <Skeleton className="h-3 w-56 rounded-md" />
                <span className="bg-border h-px flex-1" />
                <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* héro */}
            <div className="grid gap-10 sm:gap-12 md:grid-cols-[300px_1fr] md:items-start">
                <div className="md:pt-2">
                    <Skeleton className="mx-auto aspect-2/3 w-full max-w-75 rounded-md" />
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-4 w-52 rounded-md" />
                        <Skeleton className="h-10 w-3/4 rounded-lg" />
                        <Skeleton className="h-5 w-44 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-11/12 rounded-md" />
                        <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-72 rounded-md" />
                    <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-9 w-28 rounded-full" />
                        <Skeleton className="h-9 w-28 rounded-full" />
                        <Skeleton className="h-9 w-36 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-52 rounded-lg" />
                </div>
            </div>

            {/* résumé + notice */}
            <div className="grid gap-8 md:grid-cols-[1fr_0.78fr]">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full rounded-md" />
                    ))}
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
                <div className="border-border bg-card/60 flex flex-col gap-3 self-start rounded-xl border-2 p-6">
                    <Skeleton className="h-4 w-48 rounded-md" />
                    {NOTICE_ROWS.map((width, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between gap-4"
                        >
                            <Skeleton className={`h-3 rounded-md ${width}`} />
                            <Skeleton className="h-3 w-20 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            {/* critiques */}
            <div className="flex flex-col gap-5">
                <Skeleton className="h-7 w-40 rounded-lg" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-xl" />
                    ))}
                </div>
            </div>

            {/* du même auteur */}
            <div className="flex flex-col gap-5">
                <Skeleton className="h-7 w-56 rounded-lg" />
                <div className="flex gap-5 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="aspect-2/3 w-44 shrink-0 rounded-xl"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
