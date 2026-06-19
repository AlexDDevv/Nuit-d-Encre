import { Skeleton } from "@/components/UI/skeleton/Skeleton";

function NoticeRowSkeleton() {
    return (
        <div className="border-border flex items-center justify-between gap-4 border-b border-dashed py-2.5">
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-3 w-20 rounded-sm" />
        </div>
    );
}

export default function BookPreviewSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-7 sm:px-8">
            {/* retour */}
            <Skeleton className="h-4 w-24 rounded-sm" />

            {/* couture du seuil */}
            <div className="mb-7 mt-8 flex items-center gap-3">
                <Skeleton className="h-3 w-64 rounded-sm" />
                <span className="border-border flex-1 border-t border-dashed" />
                <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* héro */}
            <div className="grid gap-10 sm:gap-12 md:grid-cols-[300px_1fr] md:items-start">
                <div className="md:pt-2">
                    <Skeleton className="mx-auto aspect-2/3 w-full max-w-75 rounded-md" />
                    <Skeleton className="mx-auto mt-4 h-3 w-40 rounded-sm" />
                </div>

                <div className="min-w-0">
                    <Skeleton className="mb-3 h-4 w-1/2 rounded-sm" />
                    <Skeleton className="h-10 w-4/5 rounded-sm" />
                    <Skeleton className="mt-2 h-10 w-1/2 rounded-sm" />

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Skeleton className="h-5 w-32 rounded-sm" />
                        <Skeleton className="h-6 w-44 rounded-full" />
                    </div>

                    <div className="mt-6 flex max-w-125 flex-col gap-2 pl-7">
                        <Skeleton className="h-4 w-full rounded-sm" />
                        <Skeleton className="h-4 w-full rounded-sm" />
                        <Skeleton className="h-4 w-2/3 rounded-sm" />
                    </div>

                    <Skeleton className="mt-6 h-4 w-2/3 rounded-sm" />
                    <Skeleton className="mt-8 h-12 w-64 rounded-xl" />
                    <Skeleton className="mt-4 h-3 w-3/4 rounded-sm" />
                </div>
            </div>

            {/* notice */}
            <section className="border-border bg-card/60 mt-16 rounded-xl border-2 p-6">
                <Skeleton className="mb-4 h-4 w-64 rounded-sm" />
                <div className="grid gap-x-12 sm:grid-cols-2">
                    <div>
                        <NoticeRowSkeleton />
                        <NoticeRowSkeleton />
                        <NoticeRowSkeleton />
                    </div>
                    <div>
                        <NoticeRowSkeleton />
                        <NoticeRowSkeleton />
                        <NoticeRowSkeleton />
                    </div>
                </div>
            </section>
        </div>
    );
}
