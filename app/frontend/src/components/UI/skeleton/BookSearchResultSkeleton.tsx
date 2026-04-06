import { Skeleton } from "@/components/UI/skeleton/Skeleton";

export default function BookSearchResultSkeleton() {
    return (
        <div className="border-border bg-card flex items-center gap-4 rounded-xl border-2 p-4">
            <Skeleton className="h-20 w-14 shrink-0 rounded" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
            </div>
        </div>
    );
}
