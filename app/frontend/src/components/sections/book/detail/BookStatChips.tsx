import { ReactNode } from "react";
import { FaFire, FaQuoteLeft } from "react-icons/fa6";
import RatingStars from "@/components/sections/library/UI/RatingStars";
import { Book } from "@/types/types";

function StatChip({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    return (
        <span
            className="border-border inline-flex items-center gap-2 rounded-full border-2 bg-[hsl(20_3%_14%/0.6)] px-3.5 py-2 font-body text-xs"
            title={title}
        >
            {children}
        </span>
    );
}

/**
 * Jetons de statistiques du héro : note moyenne (étoiles), nombre de critiques
 * et de recommandations.
 */
export default function BookStatChips({ book }: { book: Book }) {
    const hasRating =
        book.averageRating != null && (book.reviewCount ?? 0) > 0;
    const reviewCount = book.reviewCount ?? 0;
    const recCount = book.recommendationCount ?? 0;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <StatChip
                title={
                    hasRating
                        ? `Noté ${book.averageRating} sur 5`
                        : "Pas encore noté"
                }
            >
                {hasRating ? (
                    <>
                        <RatingStars
                            value={book.averageRating!}
                            readOnly
                            size="sm"
                        />
                        <span className="text-foreground font-body font-bold">
                            {book.averageRating!.toFixed(1).replace(".", ",")}
                        </span>
                        <span className="text-muted-foreground font-body text-xs">
                            / 5
                        </span>
                    </>
                ) : (
                    <span className="text-muted-foreground font-quote text-xs italic">
                        Pas encore noté
                    </span>
                )}
            </StatChip>

            <StatChip title={`${reviewCount} critiques`}>
                <FaQuoteLeft
                    size={12}
                    className="text-primary/70"
                    aria-hidden="true"
                />
                <span className="text-foreground font-body font-bold">
                    {reviewCount}
                </span>
                <span className="text-muted-foreground font-body text-xs">
                    critique{reviewCount > 1 ? "s" : ""}
                </span>
            </StatChip>

            <StatChip title={`${recCount} recommandations`}>
                <FaFire
                    size={13}
                    className="text-[hsl(25_78%_58%)]"
                    aria-hidden="true"
                />
                <span className="text-foreground font-body font-bold">
                    {recCount}
                </span>
                <span className="text-muted-foreground font-body text-xs">
                    recommandation{recCount > 1 ? "s" : ""}
                </span>
            </StatChip>
        </div>
    );
}
