import { BookCardProps, BooksBibliographyProps } from "@/types/types";
import BookCard from "@/components/sections/book/BookCard";
import { slugify } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function BooksBibliography({
    author,
    excludedBookId,
    fromAuthorPage = false,
}: BooksBibliographyProps) {
    const books = author.books?.filter(
        (book) => !excludedBookId || book.id !== excludedBookId,
    );

    if (!books || books.length === 0) {
        return null;
    }

    const displayedBooks = fromAuthorPage ? books : books.slice(0, 5);
    const hasMore = !fromAuthorPage && books.length > 5;
    const authorPath = `/authors/${author.id}-${slugify(`${author.firstname} ${author.lastname}`)}`;

    return (
        <section className="flex flex-col gap-10">
            <div className="bg-card flex items-end gap-6 rounded-md p-5 border-border border-2">
                <h3 className="text-muted-foreground font-semibold uppercase tracking-wider">
                    {fromAuthorPage
                        ? "Bibliographie"
                        : "Du même auteur"}
                </h3>
                {hasMore && (
                    <Link
                        to={authorPath}
                        className="text-card-foreground font-semibold italic hover:underline text-sm"
                        aria-label={`Voir tous les livres de ${author.firstname} ${author.lastname}`}
                    >
                        Voir plus
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10">
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
