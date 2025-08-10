import BookCard from "@/components/sections/book/BookCard";
import SearchBook from "@/components/sections/book/SearchBook";
import Loader from "@/components/UI/Loader";
import Pagination from "@/components/UI/Pagination";
import { useBook } from "@/hooks/useBook";
import { BookCardProps } from "@/types/types";
import { Helmet } from "react-helmet";

export default function Books() {
    const { books, isFetching, totalCount, currentPage, setCurrentPage, PER_PAGE } = useBook()

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
            <section className="flex flex-col items-center justify-center gap-20">
                <div className="flex flex-col items-center justify-center gap-10">
                    <h1 className="text-foreground font-bold text-4xl">Rechercher un livre</h1>
                    <SearchBook />
                </div>
                {isFetching ? (
                    <div className="flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="w-full flex items-center justify-center gap-20 flex-wrap">
                        {books.map((book: BookCardProps) => (
                            <BookCard
                                key={book.id}
                                id={book.id}
                                title={book.title}
                                author={book.author}
                            />
                        ))}
                    </div>
                )}
                {totalCount === 0 && (
                    <div className="flex w-full items-center justify-center">
                        <p className="text-foreground text-xl font-medium">
                            Aucun livre n'a encore été enregistré...
                        </p>
                    </div>
                )}
                <Pagination
                    className="mx-auto my-0 w-max"
                    currentPage={currentPage}
                    totalCount={totalCount}
                    perPage={PER_PAGE.all}
                    onPageChange={setCurrentPage}
                />
            </section>
        </>
    );
}
