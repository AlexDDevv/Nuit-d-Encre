import AuthorCard from "@/components/sections/author/AuthorCard/AuthorCard";
import SearchAuthor from "@/components/sections/author/SearchAuthor";
import Pagination from "@/components/UI/Pagination";
import AuthorCardSkeleton from "@/components/UI/skeleton/AuthorCardSkeleton";
import { useAuthorsData } from "@/hooks/author/useAuthorsData";
import { AuthorCardProps } from "@/types/types";
import { Helmet } from "react-helmet-async";

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
            <section className="flex min-h-dvh flex-col items-center justify-center gap-20">
                <div className="flex flex-col items-center justify-center gap-6">
                    <h1 className="text-foreground text-4xl font-bold">
                        Rechercher un auteur
                    </h1>
                    <p className="font-quote text-muted-foreground max-w-xl text-center text-base italic">
                        Derrière chaque ouvrage veille une plume. Partez à la
                        rencontre de celles et ceux qui habitent la maison.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-5">
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
                    <div className="grid w-full grid-cols-[repeat(auto-fit,16rem)] justify-center gap-10">
                        {authors.map((author: AuthorCardProps) => (
                            <AuthorCard
                                key={author.id}
                                id={author.id}
                                firstname={author.firstname}
                                lastname={author.lastname}
                                isIncomplete={author.isIncomplete}
                                nationality={author.nationality}
                                bookCount={author.bookCount}
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
