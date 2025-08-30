import { Skeleton } from "@/components/UI/skeleton/Skeleton";

export default function BookCardSkeleton() {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-20">
            {Array.from({ length: 12 }, (_, index) => (
                <div
                    className="border-border bg-card flex h-80 w-72 flex-col items-center justify-center gap-5 rounded-lg border-2 p-8"
                    key={index}
                >
                    {/* Book icon skeleton */}
                    <div>
                        <Skeleton className="h-40 w-32" />
                    </div>
                    {/* Title and author skeleton */}
                    <div className="flex w-full flex-col items-center justify-center gap-3">
                        {/* Title skeleton */}
                        <Skeleton className="h-6 w-full" />
                        {/* Author skeleton */}
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
