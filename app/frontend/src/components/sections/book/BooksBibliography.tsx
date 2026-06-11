import { Book, BooksBibliographyProps } from "@/types/types";
import BookCard from "@/components/sections/book/BookCard";
import { slugify } from "@/lib/utils";
import BooksSectionLayout from "@/components/sections/book/BookSectionLayout";

export default function BooksBibliography({
    author,
    excludedBookId,
    fromAuthorPage = false,
}: BooksBibliographyProps) {
    const books = author.books?.filter(
        (book) => !excludedBookId || book.id !== excludedBookId,
    );

    if (!books?.length) return null;

    const displayedBooks = fromAuthorPage ? books : books.slice(0, 5);
    const hasMore = !fromAuthorPage && books.length > 5;

    const authorPath = `/authors/${author.id}-${slugify(
        `${author.firstname} ${author.lastname}`,
    )}`;

    return (
        <BooksSectionLayout
            title={fromAuthorPage ? "Bibliographie" : "Du même auteur"}
            seeMoreLink={
                hasMore
                    ? {
                        to: authorPath,
                        ariaLabel: `Voir tous les livres de ${author.firstname} ${author.lastname}`,
                    }
                    : undefined
            }
            className={
                books.length >= 5
                    ? "justify-between gap-5"
                    : "justify-start gap-10"
            }
        >
            {displayedBooks.map((book: Book) => (
                <BookCard
                    key={book.id}
                    book={{ ...book, author }}
                    className="w-52"
                    isInAuthorPage={fromAuthorPage}
                />
            ))}
        </BooksSectionLayout>
    );
}