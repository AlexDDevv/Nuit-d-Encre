import { BookSearchResultsProps } from "@/types/types";
import BookSearchResultCard from "@/components/sections/book/BookSearchResultCard";
import BookSearchResultSkeleton from "@/components/UI/skeleton/BookSearchResultSkeleton";

export default function BookSearchResults({
    dbResults,
    externalResults,
    isSearching,
}: BookSearchResultsProps) {
    if (isSearching) {
        return (
            <div className="flex w-full max-w-2xl flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <BookSearchResultSkeleton key={i} />
                ))}
            </div>
        );
    }

    const hasResults = dbResults.length > 0 || externalResults.length > 0;

    if (!hasResults) {
        return (
            <div className="flex w-full items-center justify-center py-10">
                <p className="text-foreground text-xl font-medium">
                    Aucun résultat trouvé.
                </p>
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-2xl flex-col gap-8">
            {dbResults.length > 0 && (
                <section>
                    <h2 className="text-foreground mb-3 text-lg font-semibold">
                        Dans Nuit d'Encre
                    </h2>
                    <div className="flex flex-col gap-3">
                        {dbResults.map((result, i) => (
                            <BookSearchResultCard
                                key={result.id ?? result.isbn13 ?? i}
                                result={result}
                            />
                        ))}
                    </div>
                </section>
            )}
            {externalResults.length > 0 && (
                <section>
                    <h2 className="text-foreground mb-3 text-lg font-semibold">
                        Résultats externes
                    </h2>
                    <div className="flex flex-col gap-3">
                        {externalResults.map((result, i) => (
                            <BookSearchResultCard
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
