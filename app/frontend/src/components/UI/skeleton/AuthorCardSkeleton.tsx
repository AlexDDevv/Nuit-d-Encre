import { Skeleton } from "@/components/UI/skeleton/Skeleton";

export default function AuthorCardSkeleton() {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-20">
            {Array.from({ length: 12 }, (_, index) => (
                <div
                    className="border-border bg-card flex w-fit items-center gap-5 rounded-xl border-2 px-10 py-5"
                    key={index}
                >
                    {/* Author icon skeleton */}
                    <Skeleton className="h-10 w-10" />
                    {/* Title and author skeleton */}
                    <div className="flex items-center justify-center gap-2">
                        {/* Title skeleton */}
                        <Skeleton className="h-5 w-20" />
                        {/* Author skeleton */}
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}
