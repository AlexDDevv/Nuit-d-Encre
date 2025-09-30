import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/UI/Tooltip";
import { BookShelfProps } from "@/types/types";
import UserBookInfo from "./UserBookInfo";

export default function BookShelf({
    book,
    rating,
    recommended,
    statusLabel,
}: BookShelfProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <article className="border-border bg-card hover:border-primary focus-visible:ring-ring ring-offset-ring relative flex items-center justify-center overflow-hidden rounded-xl border-2 px-6 py-5 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                        <div className="relative w-28">
                            <img
                                src="/images/bookCover.svg"
                                alt={`Couverture du livre ${book.title}`}
                                width="112"
                                height="140"
                                loading="lazy"
                                className="rounded-md shadow-lg transition-shadow group-hover:shadow-xl"
                            />
                            <div className="bg-secondary absolute -left-10 -top-4 flex min-w-16 -rotate-45 items-center justify-center px-3 py-0.5 shadow-md">
                                <span className="text-secondary-foreground text-xs">
                                    {statusLabel}
                                </span>
                            </div>
                        </div>
                    </article>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-xs border-2 p-4"
                    sideOffset={5}
                >
                    <div className="flex flex-col gap-3">
                        <header>
                            <h3 className="line-clamp-2 text-base font-bold">
                                {book.title}
                            </h3>
                            <p className="text-muted-foreground text-sm font-semibold italic">
                                {book.author.firstname} {book.author.lastname}
                            </p>
                        </header>
                        <UserBookInfo
                            category={book.category.name}
                            rating={rating}
                            recommended={recommended}
                        />
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
