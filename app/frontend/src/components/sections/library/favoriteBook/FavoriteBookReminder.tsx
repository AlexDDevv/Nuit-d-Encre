import BookCover from "@/components/sections/book/BookCover";
import { FavoriteBookModalProps } from "@/types/types";

/** Carte de rappel de l'ouvrage à épingler (couverture + titre/auteur/méta). */
export default function FavoriteBookReminder({
    book,
}: {
    book: FavoriteBookModalProps["book"];
}) {
    const author = `${book.author.firstname} ${book.author.lastname}`;

    return (
        <div className="mx-auto mt-6 flex max-w-sm items-center gap-3.5 rounded-xl border border-[hsl(0_0%_24%)] bg-[hsl(20_3%_14%/0.6)] px-3.5 py-3">
            <BookCover
                coverUrl={book.coverUrl}
                title={book.title}
                author={author}
                className="aspect-2/3 w-15 shrink-0 rounded-md border border-[hsl(0_0%_24%)] shadow-[0_10px_22px_-10px_hsl(20_3%_3%/0.9)] sm:w-17"
            />
            <div className="min-w-0 flex-1">
                <p className="text-primary/55 font-mono text-[9.5px] uppercase tracking-[0.18em]">
                    Ouvrage à épingler
                </p>
                <h3 className="text-foreground font-quote mt-1 text-[19px] leading-tight">
                    {book.title}
                </h3>
                <p className="mt-0.5 font-body text-[12.5px] text-[hsl(20_12%_72%)]">
                    {author}
                </p>
                {(book.category?.name || book.publishedYear) && (
                    <p className="font-quote mt-0.5 text-[12px] italic text-[hsl(43_30%_62%)]">
                        {[book.category?.name, book.publishedYear]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                )}
            </div>
        </div>
    );
}
