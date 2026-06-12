import { FaMagnifyingGlass } from "react-icons/fa6";
import {
    BookCardData,
    BookSearchResult,
    BookSearchResultsProps,
} from "@/types/types";
import BookCard from "@/components/sections/book/BookCard/BookCard";
import ImportCard from "@/components/sections/book/search/ImportCard";
import SearchSectionHeading from "@/components/sections/book/search/SearchSectionHeading";

const GRID =
    "grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5";

/** Adapte un résultat DB (plat) vers la forme attendue par la carte d'accueil. */
function toBookCardData(result: BookSearchResult): BookCardData {
    const [firstname, ...rest] = (result.author ?? "").trim().split(" ");
    return {
        id: result.id ?? "",
        title: result.title,
        author: {
            id: result.authorId ?? "",
            firstname: firstname ?? "",
            lastname: rest.join(" "),
        },
        isImported: result.isImported,
        coverUrl: result.coverUrl,
        publishedYear: result.year,
        format: result.format,
        category: result.category
            ? { id: "", name: result.category }
            : undefined,
        averageRating: result.averageRating,
        reviewCount: result.reviewCount,
        isInLibrary: result.isInLibrary,
    };
}

export default function BookSearchResults({
    dbResults,
    externalResults,
    isSearching,
    hasError,
    query,
}: BookSearchResultsProps) {
    if (isSearching) {
        return (
            <div className="w-full">
                <div className={GRID}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-card border-border aspect-2/3 animate-pulse rounded-xl border-2"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="flex w-full items-center justify-center py-10">
                <p className="text-destructive text-xl font-medium">
                    La recherche a échoué. Réessayez dans un instant.
                </p>
            </div>
        );
    }

    const hasResults = dbResults.length > 0 || externalResults.length > 0;

    if (!hasResults) {
        return (
            <div className="mx-auto max-w-md py-20 text-center">
                <span className="bg-muted/50 ring-primary/20 mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full ring-1">
                    <FaMagnifyingGlass
                        size={20}
                        className="text-primary/60"
                        aria-hidden="true"
                    />
                </span>
                <h2 className="text-foreground font-title text-xl font-bold">
                    Aucun ouvrage trouvé
                </h2>
                <p className="text-muted-foreground mt-2 font-quote italic">
                    {query
                        ? `Rien pour « ${query} », ni dans vos rayons ni au-dehors.`
                        : "Aucun résultat, ni dans vos rayons ni au-dehors."}
                </p>
            </div>
        );
    }

    return (
        <div className=" w-full">
            {dbResults.length > 0 && (
                <section className="mb-16">
                    <SearchSectionHeading
                        kicker="Déjà dans vos rayons"
                        title="Dans Nuit d'Encre"
                        count={`${dbResults.length} ouvrage${dbResults.length > 1 ? "s" : ""
                            }`}
                    />
                    <div className={GRID}>
                        {dbResults.map((result, i) => (
                            <BookCard
                                key={result.id ?? result.isbn13 ?? i}
                                book={toBookCardData(result)}
                                className="w-full"
                            />
                        ))}
                    </div>
                </section>
            )}

            {externalResults.length > 0 && (
                <section>
                    <SearchSectionHeading
                        kicker="Trouvés au-dehors"
                        title="Résultats externes"
                        count={`${externalResults.length} à importer`}
                        note="Ces ouvrages ne figurent pas encore dans Nuit d'Encre. Importez-les depuis nos sources partenaires pour les ajouter à votre catalogue."
                    />
                    <div className={GRID}>
                        {externalResults.map((result, i) => (
                            <ImportCard
                                key={result.isbn13 ?? i}
                                result={result}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
