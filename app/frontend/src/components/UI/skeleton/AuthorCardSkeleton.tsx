import { Skeleton } from "@/components/UI/skeleton/Skeleton";

export default function AuthorCardSkeleton() {
    return (
        <div className="w-full flex items-center justify-center gap-20 flex-wrap">
            {Array.from({ length: 12 }, (_, index) => (
                <div className="flex items-center gap-5 py-5 px-10 rounded-lg border-2 border-border w-fit bg-card" key={index}>
                    {/* Author icon skeleton */}
                    <Skeleton className="w-10 h-10" />
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