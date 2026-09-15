import BookCardSkeleton from "./BookCardSkeleton";
import { Skeleton } from "./Skeleton";

export default function BookPageSkeleton() {
    return (
        <section className="flex flex-1 flex-col items-center justify-center gap-20">
            <div className="flex w-full flex-col items-center justify-center gap-10">
                <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
                    <Skeleton className="h-10 w-full rounded-lg sm:max-w-sm" />
                    <Skeleton className="h-10 w-full rounded-lg sm:w-60 sm:shrink-0" />
                </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-20">
                <BookCardSkeleton />
            </div>
            <div className="flex items-center justify-center">
                <Skeleton className="h-8 w-full max-w-72 rounded-lg" />
            </div>
        </section>
    );
}
