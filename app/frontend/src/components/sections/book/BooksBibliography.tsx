import { BookCardProps, BooksBibliographyProps } from "@/types/types";
import BookCard from "@/components/sections/book/BookCard";
import { slugify } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function BooksBibliography({
    author,
    excludeBookId,
    fromAuthorPage = false,
}: BooksBibliographyProps) {
    const books = author.books?.filter(
        (book) => !excludeBookId || book.id !== excludeBookId,
    );

    if (!books || books.length === 0) {
        return null;
    }

    const displayedBooks = fromAuthorPage ? books : books.slice(0, 5);
    const hasMore = !fromAuthorPage && books.length > 5;
    const authorPath = `/authors/${author.id}-${slugify(`${author.firstname} ${author.lastname}`)}`;

    return (
        <section className="bg-muted flex flex-col gap-10 rounded-lg p-6">
            <div className="bg-card flex items-center gap-6 rounded-md p-5">
                <h3 className="text-muted-foreground font-semibold uppercase tracking-wider">
                    {fromAuthorPage
                        ? "Bibliographie"
                        : `Autres livres de ${author.firstname} ${author.lastname}`}
                </h3>
                {hasMore && (
                    <Link
                        to={authorPath}
                        className="text-card-foreground font-bold italic hover:underline"
                        aria-label={`Voir tous les livres de ${author.firstname} ${author.lastname}`}
                    >
                        Voir plus
                    </Link>
                )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-5">
                {displayedBooks.map((book: BookCardProps) => (
                    <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={author}
                        className="w-60"
                        isInAuthorPage={fromAuthorPage}
                    />
                ))}
            </div>
        </section>
    );
}
