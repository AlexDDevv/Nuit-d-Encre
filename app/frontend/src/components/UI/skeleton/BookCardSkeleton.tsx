import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import { cn } from "@/lib/utils";

export default function BookCardSkeleton({
    isInAuthor,
}: {
    isInAuthor?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex w-full flex-wrap items-center",
                isInAuthor ? "justify-between gap-10" : "justify-center gap-20",
            )}
        >
            {Array.from({ length: isInAuthor ? 4 : 12 }, (_, index) => (
                <div
                    className="border-border bg-card flex h-80 w-72 flex-col items-center justify-center gap-5 rounded-xl border-2 p-8"
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
