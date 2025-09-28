import AuthorCard from "@/components/sections/author/AuthorCard";
import SearchAuthor from "@/components/sections/author/SearchAuthor";
import Pagination from "@/components/UI/Pagination";
import AuthorCardSkeleton from "@/components/UI/skeleton/AuthorCardSkeleton";
import { useAuthorsData } from "@/hooks/author/useAuthorsData";
import { hasIncompleteInfo } from "@/lib/utils";
import { AuthorCardProps } from "@/types/types";
import { Helmet } from "react-helmet";

export default function Authors() {
    const {
        authors,
        isLoadingAuthors,
        totalCount,
        currentPage,
        setCurrentPage,
        PER_PAGE,
    } = useAuthorsData({ mode: "home" });

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
            <section className="flex min-h-[calc(100vh_-_var(--header-height))] flex-col items-center justify-center gap-20">
                <div className="flex flex-col items-center justify-center gap-10">
                    <h1 className="text-foreground text-4xl font-bold">
                        Rechercher un auteur
                    </h1>
                    <div className="flex items-center justify-center gap-5">
                        <SearchAuthor />
                    </div>
                </div>
                {isLoadingAuthors ? (
                    <AuthorCardSkeleton />
                ) : totalCount === 0 ? (
                    <div className="flex w-full items-center justify-center">
                        <p className="text-foreground text-xl font-medium">
                            Aucun auteur n'a encore été enregistré...
                        </p>
                    </div>
                ) : (
                    <div className="flex w-full flex-wrap items-center justify-center gap-20">
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
                    perPage={PER_PAGE.home}
                    onPageChange={setCurrentPage}
                />
            </section>
        </>
    );
}
