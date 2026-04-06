import { Skeleton } from "@/components/UI/skeleton/Skeleton";

export default function BookPreviewSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
            <div className="flex gap-8">
                <Skeleton className="h-56 w-40 shrink-0 rounded-lg" />
                <div className="flex flex-1 flex-col gap-3">
                    <Skeleton className="h-8 w-3/4 rounded" />
                    <Skeleton className="h-5 w-1/2 rounded" />
                    <Skeleton className="h-5 w-1/3 rounded" />
                    <Skeleton className="h-5 w-1/4 rounded" />
                </div>
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    );
}
