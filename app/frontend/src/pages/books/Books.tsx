import BookCard from "@/components/sections/book/BookCard";
import SearchBook from "@/components/sections/book/SearchBook";
import Pagination from "@/components/UI/Pagination";
import SelectCategory from "@/components/UI/SelectCategory";
import { useBooksData } from "@/hooks/book/useBooksData";
import { BookCardProps } from "@/types/types";
import { Helmet } from "react-helmet";
import BookPageSkeleton from "@/components/UI/skeleton/BookPageSkeleton";

export default function Books() {
    const {
        books,
        isLoadingBooks,
        booksError,
        totalCount,
        currentPage,
        setCurrentPage,
        PER_PAGE,
    } = useBooksData({ mode: "home" });

    if (!books && booksError) {
        const isNotFoundError = booksError.graphQLErrors.some((error) =>
            error.message.includes("Books not found"),
        );

        if (isNotFoundError) {
            throw new Response("Books not found", { status: 404 });
        }

        // Pour les autres erreurs GraphQL
        throw new Response("Failed to fetch books", { status: 500 });
    }

    if (!isLoadingBooks && !books) {
        throw new Response("Books not found", { status: 404 });
    }

    return (
        <>
            {/* Update of the metadata */}
            <Helmet>
                <title>Livres disponibles sur Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Page des livres disponibles sur le site Nuit d'Encre."
                />
                <meta name="robots" content="noindex, nofollow" />
                {/* Open Graph */}
                <meta
                    property="og:title"
                    content="Livres disponibles sur Nuit d'Encre"
                />
                <meta
                    property="og:description"
                    content="Page des livres disponibles sur le site Nuit d'Encre."
                />
                <meta property="og:type" content="website" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:title"
                    content="Livres disponibles sur Nuit d'Encre"
                />
                <meta
                    name="twitter:description"
                    content="Page des livres disponibles sur le site Nuit d'Encre."
                />
            </Helmet>
            {isLoadingBooks ? (
                <BookPageSkeleton />
            ) : (
                <section className="flex min-h-[calc(100vh_-_var(--header-height))] flex-col items-center justify-center gap-20">
                    <div className="flex flex-col items-center justify-center gap-10">
                        <h1 className="text-foreground text-4xl font-bold">
                            Rechercher un livre
                        </h1>
                        <div className="flex items-center justify-center gap-5">
                            <SearchBook />
                            <SelectCategory />
                        </div>
                    </div>
                    {totalCount === 0 ? (
                        <div className="flex w-full items-center justify-center">
                            <p className="text-foreground text-xl font-medium">
                                Aucun livre n'a encore été enregistré...
                            </p>
                        </div>
                    ) : (
                        <div className="flex w-full flex-wrap items-center justify-center gap-20">
                            {books.map((book: BookCardProps) => (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    title={book.title}
                                    author={book.author}
                                    className="w-72 hover:scale-105"
                                />
                            ))}
                        </div>
                    )}
                    <Pagination
                        className="mx-auto my-0 w-max"
                        currentPage={currentPage}
                        totalCount={totalCount}
                        perPage={PER_PAGE.home}
                        onPageChange={setCurrentPage}
                    />
                </section>
            )}
        </>
    );
}
