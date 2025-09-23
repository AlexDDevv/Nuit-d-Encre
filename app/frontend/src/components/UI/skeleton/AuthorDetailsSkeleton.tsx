import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import BookCardSkeleton from "./BookCardSkeleton";

export default function AuthorDetailsSkeleton() {
    return (
        <div className="flex flex-col gap-20">
            <div className="flex gap-10">
                <div className="h-40 w-40">
                    <Skeleton className="h-full w-full rounded-lg" />
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <Skeleton className="w-lg h-10 rounded-lg" />
                    </div>
                    <div className="w-lg">
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="flex gap-20">
                <div className="flex w-1/2 flex-col gap-5">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
                <div className="flex w-1/2 flex-col gap-5">
                    <Skeleton className="w-sm h-8 rounded-lg" />
                    <div>
                        <ul className="flex flex-col gap-4">
                            {["w-1/4", "w-1/6", "w-1/3", "w-1/5"].map(
                                (width, index) => (
                                    <Skeleton
                                        key={index}
                                        className={`h-7 rounded-lg ${width}`}
                                    />
                                ),
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col gap-10">
                <div>
                    <Skeleton className="h-16 w-full rounded-lg" />
                </div>
                <div className="bg-border w-full rounded-lg p-6">
                    <BookCardSkeleton isInAuthor />
                </div>
            </div>
        </div>
    );
}
