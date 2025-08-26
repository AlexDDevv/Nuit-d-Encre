import AuthorCard from "@/components/sections/author/AuthorCard";
import SearchAuthor from "@/components/sections/author/SearchAuthor";
import Loader from "@/components/UI/Loader";
import Pagination from "@/components/UI/Pagination";
import { useAuthor } from "@/hooks/useAuthor";
import { AuthorCardProps } from "@/types/types";
import { Helmet } from "react-helmet";

export default function Authors() {
    const { authors, isFetching, totalCount, currentPage, setCurrentPage, PER_PAGE } = useAuthor()

    const hasIncompleteInfo = (author: AuthorCardProps): boolean => {
        return Object.values(author).some(value => value === null || value === '');
    };

    return (
        <>
            {/* Update of the metadata */}
            <Helmet>
                <title>Auteurs enregistrés sur Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Page des auteurs enregistrés sur le site Nuit d'Encre."
                />
                <meta name="robots" content="noindex, nofollow" />
                {/* Open Graph */}
                <meta
                    property="og:title"
                    content="Auteurs enregistrés sur Nuit d'Encre"
                />
                <meta
                    property="og:description"
                    content="Page des auteurs enregistrés sur le site Nuit d'Encre."
                />
                <meta property="og:type" content="website" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:title"
                    content="Auteurs enregistrés sur Nuit d'Encre"
                />
                <meta
                    name="twitter:description"
                    content="Page des auteurs enregistrés sur le site Nuit d'Encre."
                />
            </Helmet>
            <section className="flex flex-col items-center justify-center gap-20">
                <div className="flex flex-col items-center justify-center gap-10">
                    <h1 className="text-foreground font-bold text-4xl">Rechercher un auteur</h1>
                    <div className="flex items-center justify-center gap-5">
                        <SearchAuthor />
                    </div>
                </div>
                {isFetching ? (
                    <div className="flex items-center justify-center">
                        <Loader />
                    </div>
                ) : totalCount === 0 ? (
                    <div className="flex w-full items-center justify-center">
                        <p className="text-foreground text-xl font-medium">
                            Aucun auteur n'a encore été enregistré...
                        </p>
                    </div>
                ) : (
                    <div className="w-full flex items-center justify-center gap-20 flex-wrap">
                        {authors.map((author: AuthorCardProps) => (
                            <AuthorCard
                                key={author.id}
                                id={author.id}
                                firstname={author.firstname}
                                lastname={author.lastname}
                                isIncomplete={hasIncompleteInfo(author)}
                            />
                        ))}
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
