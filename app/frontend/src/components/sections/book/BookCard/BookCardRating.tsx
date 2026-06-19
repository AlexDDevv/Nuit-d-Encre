import RatingStars from "@/components/sections/library/UI/RatingStars";

type BookCardRatingProps = {
    averageRating?: number;
    reviewCount?: number;
};

/**
 * Note d'une carte livre : étoiles (réutilise `RatingStars`) + note chiffrée et
 * nombre d'avis. Affiche un libellé littéraire « Pas encore de critique » lorsque
 * le livre n'a aucune note.
 */
export default function BookCardRating({
    averageRating,
    reviewCount,
}: BookCardRatingProps) {
    const hasRating = averageRating != null && (reviewCount ?? 0) > 0;

    if (!hasRating) {
        return (
            <span className="text-foreground/60 font-quote text-xs italic">
                Pas encore de critique
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1.5">
            <RatingStars value={averageRating!} readOnly size="sm" />
            <span className="text-foreground font-body text-xs font-bold">
                {averageRating!.toFixed(1).replace(".", ",")}
            </span>
            <span className="text-foreground/60 font-body text-xxs">
                ({reviewCount})
            </span>
        </span>
    );
}
