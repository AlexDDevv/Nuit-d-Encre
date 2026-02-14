import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import { cn } from "@/lib/utils";
import { BookCardLibraryProps, UserBookStatus } from "@/types/types";
import UserBookInfo from "@/components/sections/library/UserBookInfo";

export default function BookCardLibrary({
    id,
    book,
    rating,
    recommended,
    status,
    layout,
    onStatusChange,
}: BookCardLibraryProps) {
    const handleChange = (newStatus: UserBookStatus) => {
        onStatusChange?.({
            userBookId: id,
            bookId: book.id,
            status: newStatus,
        });
    };

    return (
        <article
            className={cn(
                "border-border bg-card w-lg flex rounded-xl border-2 p-8",
                layout === "grid"
                    ? "w-lg flex-col gap-8"
                    : "w-full flex-row items-center justify-between gap-10",
            )}
        >
            <div className="flex gap-8">
                <div className="w-32 flex-shrink-0">
                    <img
                        src="/images/bookCover.svg"
                        alt={`Couverture du livre ${book.title} de ${book.author.firstname} ${book.author.lastname}`}
                        width="128"
                        height="192"
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-col gap-5">
                    <header className="text-card-foreground flex flex-col">
                        <h2
                            className="line-clamp-1 max-w-80 text-2xl font-bold"
                            title={book.title}
                        >
                            {book.title}
                        </h2>
                        <p className="font-semibold italic">
                            {book.author.firstname} {book.author.lastname}
                        </p>
                    </header>
                    <ul className="text-secondary-foreground flex flex-col gap-1">
                        <li>Année de publication : {book.publishedYear}</li>
                        <li>{book.publisher}</li>
                        <li>Nombre de page : {book.pageCount}</li>
                    </ul>
                </div>
            </div>

            {layout === "grid" ? (
                <>
                    <div className="flex flex-col gap-5">
                        <UserBookInfo
                            category={book.category.name}
                            rating={rating}
                            recommended={recommended}
                        />
                    </div>
                    <SelectBookStatus
                        value={status}
                        onChange={onStatusChange ? handleChange : undefined}
                    />
                </>
            ) : (
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
                    <div className="flex flex-row items-center justify-center gap-10">
                        <UserBookInfo
                            category={book.category.name}
                            rating={rating}
                            recommended={recommended}
                        />
                    </div>
                    <SelectBookStatus
                        value={status}
                        onChange={onStatusChange ? handleChange : undefined}
                    />
                </div>
            )}
        </article>
    );
}
