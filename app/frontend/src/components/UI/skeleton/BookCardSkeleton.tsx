import { Skeleton } from "@/components/UI/skeleton/Skeleton";

export default function BookCardSkeleton() {
    return (
        <div className="w-full flex items-center justify-center gap-20 flex-wrap">
            {Array.from({ length: 12 }, (_, index) => (
                <div className="flex flex-col items-center justify-center gap-5 p-5 rounded-lg border-2 border-border w-3xs bg-card h-60" key={index}>
                    {/* Book icon skeleton */}
                    <div>
                        <Skeleton className="w-20 h-24" />
                    </div>
                    {/* Title and author skeleton */}
                    <div className="flex flex-col items-center justify-center gap-3 w-full">
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