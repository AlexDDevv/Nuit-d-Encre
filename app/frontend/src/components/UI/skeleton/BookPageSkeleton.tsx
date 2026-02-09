import BookCardSkeleton from "./BookCardSkeleton";
import { Skeleton } from "./Skeleton";

export default function BookPageSkeleton() {
    return (
        <section className="flex min-h-[calc(100vh_-_var(--header-height))] flex-col items-center justify-center gap-20">
            <div className="flex flex-col items-center justify-center gap-10">
                <Skeleton className="w-xs h-10 rounded-lg" />
                <div className="flex items-center justify-center gap-5">
                    <Skeleton className="w-sm h-10 rounded-lg" />
                    <Skeleton className="h-10 w-60 rounded-lg" />
                </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-20">
                <BookCardSkeleton />
            </div>
            <div className="flex items-center justify-center">
                <Skeleton className="h-8 w-72 rounded-lg" />
            </div>
        </section>
    );
}
