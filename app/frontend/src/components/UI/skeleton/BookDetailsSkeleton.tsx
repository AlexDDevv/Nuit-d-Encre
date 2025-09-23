import { Skeleton } from "@/components/UI/skeleton/Skeleton";

export default function BookDetailsSkeleton() {
    return (
        <div className="flex flex-col gap-20">
            <div className="flex gap-10">
                <div className="w-3xs h-96">
                    <Skeleton className="h-full w-full rounded-lg" />
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <Skeleton className="w-lg mb-4 h-10 rounded-lg" />
                        <Skeleton className="h-7 w-60 rounded-lg" />
                    </div>
                    <div className="w-lg">
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                    <div>
                        <Skeleton className="h-7 w-40 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-52 rounded-lg" />
                </div>
            </div>
            <div className="flex gap-20">
                <div id="summary" className="flex w-1/2 flex-col gap-5">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
                <div className="flex w-1/2 flex-col gap-5">
                    <Skeleton className="w-sm h-8 rounded-lg" />
                    <div>
                        <ul className="flex flex-col gap-4">
                            {[
                                "w-1/4",
                                "w-1/6",
                                "w-1/3",
                                "w-1/5",
                                "w-1/4",
                                "w-1/3",
                                "w-1/6",
                            ].map((width, index) => (
                                <Skeleton
                                    key={index}
                                    className={`h-7 rounded-lg ${width}`}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
