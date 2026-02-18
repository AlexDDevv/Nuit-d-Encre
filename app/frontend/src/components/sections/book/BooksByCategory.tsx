import { BookCardProps, BooksByCategoryProps } from "@/types/types";
import BookCard from "@/components/sections/book/BookCard";
import { Link } from "react-router-dom";

export default function BooksByCategory({
    category,
    books,
    excludedBookId,
    excludedBookTitle,
}: BooksByCategoryProps) {
    const filteredBooks = books.filter(
        (book) => !excludedBookId || book.id !== excludedBookId,
    );

    if (!filteredBooks || filteredBooks.length === 0) {
        return null;
    }

    const hasMore = filteredBooks.length > 5;

    return (
        <section className="flex flex-col gap-10">
            <div className="bg-card flex items-end gap-6 rounded-md p-5 border-border border-2">
                <h3 className="text-muted-foreground font-semibold uppercase tracking-wider">
                    Que lire après {excludedBookTitle} ?
                </h3>
                {hasMore && (
                    <Link
                        to="#"
                        className="text-card-foreground font-semibold italic hover:underline text-sm"
                        aria-label={`Voir tous les livres de la catégorie ${category.name}`}
                    >
                        Voir plus
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10">
                {filteredBooks.map((book: BookCardProps) => (
                    <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        className="w-60"
                        isInAuthorPage={false}
                    />
                ))}
            </div>
        </section>
    );
}
