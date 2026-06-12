import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BookCard from "@/components/sections/book/BookCard/BookCard";
import SearchBook from "@/components/sections/book/SearchBook";
import BookSearchResults from "@/components/sections/book/BookSearchResults";
import Pagination from "@/components/UI/Pagination";
import SelectCategory from "@/components/sections/book/SelectCategory";
import { useBooksData } from "@/hooks/book/useBooksData";
import { useBookSearch } from "@/hooks/book/useBookSearch";
import { BookCardData } from "@/types/types";
import BookPageSkeleton from "@/components/UI/skeleton/BookPageSkeleton";

export default function Books() {
    const [searchParams] = useSearchParams();
    const query = (searchParams.get("search") ?? "").trim();
    const isSearchMode = query.length >= 3;

    const {
        books,
        isLoadingBooks,
        booksError,
        totalCount,
        currentPage,
        setCurrentPage,
        PER_PAGE,
    } = useBooksData({ mode: "home", skip: isSearchMode });

    const { dbResults, externalResults, isSearching, searchError } =
        useBookSearch(query);

    if (!isSearchMode && !books && booksError) {
        const isNotFoundError = booksError.graphQLErrors.some((error) =>
            error.message.includes("Books not found"),
        );

        if (isNotFoundError) {
            throw new Response("Books not found", { status: 404 });
        }

        throw new Response("Failed to fetch books", { status: 500 });
    }

    if (!isSearchMode && !isLoadingBooks && !books) {
        throw new Response("Books not found", { status: 404 });
    }

    return (
        <>
            <Helmet>
                <title>Livres disponibles sur Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Page des livres disponibles sur le site Nuit d'Encre."
                />
                <meta name="robots" content="noindex, nofollow" />
                <meta
                    property="og:title"
                    content="Livres disponibles sur Nuit d'Encre"
                />
                <meta
                    property="og:description"
                    content="Page des livres disponibles sur le site Nuit d'Encre."
                />
                <meta property="og:type" content="website" />
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

            {!isSearchMode && isLoadingBooks ? (
                <BookPageSkeleton />
            ) : (
                <section className="flex min-h-dvh flex-col items-center justify-center gap-20">
                    <div className="flex flex-col items-center justify-center gap-6">
                        <h1 className="text-foreground text-4xl font-bold">
                            Rechercher un livre
                        </h1>
                        <p className="font-quote text-muted-foreground max-w-md text-center text-base italic">
                            Fouillez d'abord la maison, puis le vaste monde, et
                            faites entrer de nouveaux ouvrages dans votre
                            bibliothèque.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-5">
                            <SearchBook />
                            {!isSearchMode && <SelectCategory />}
                        </div>
                    </div>

                    {isSearchMode ? (
                        <BookSearchResults
                            dbResults={dbResults}
                            externalResults={externalResults}
                            isSearching={isSearching}
                            hasError={Boolean(searchError)}
                            query={query}
                        />
                    ) : (
                        <>
                            {totalCount === 0 ? (
                                <div className="flex w-full items-center justify-center">
                                    <p className="text-foreground text-xl font-medium">
                                        Aucun livre n'a encore été enregistré...
                                    </p>
                                </div>
                            ) : (
                                <div className="grid w-full grid-cols-[repeat(auto-fit,14rem)] justify-center gap-10">
                                    {books.map((book: BookCardData) => (
                                        <BookCard
                                            key={book.id}
                                            book={book}
                                            className="w-56"
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
                        </>
                    )}
                </section>
            )}
        </>
    );
}
