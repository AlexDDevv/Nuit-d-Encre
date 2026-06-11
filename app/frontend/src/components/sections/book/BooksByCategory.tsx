import { Book, BooksByCategoryProps } from "@/types/types";
import BookCard from "@/components/sections/book/BookCard";
import BooksSectionLayout from "@/components/sections/book/BookSectionLayout";

export default function BooksByCategory({
    category,
    books,
    excludedBookId,
    excludedBookTitle,
}: BooksByCategoryProps) {
    const filteredBooks = books.filter(
        (book) => !excludedBookId || book.id !== excludedBookId,
    );

    if (!filteredBooks.length) return null;

    const hasMore = filteredBooks.length > 5;

    return (
        <BooksSectionLayout
            title={`Que lire après ${excludedBookTitle} ?`}
            seeMoreLink={
                hasMore
                    ? {
                        to: "#",
                        ariaLabel: `Voir tous les livres de la catégorie ${category.name}`,
                    }
                    : undefined
            }
            className={
                filteredBooks.length >= 5
                    ? "justify-between gap-5"
                    : "justify-start gap-10"
            }
        >
            {filteredBooks.map((book: Book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    className="w-52"
                    isInAuthorPage={false}
                />
            ))}
        </BooksSectionLayout>
    );
}