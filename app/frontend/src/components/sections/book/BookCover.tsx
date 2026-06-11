import { useState } from "react";
import { cn } from "@/lib/utils";
import FallbackCover from "./FallbackCover";

type BookCoverProps = {
    coverUrl?: string | null;
    title: string;
    author: string;
    /** Variante condensée du repli pour les petites vignettes (< ~150px). */
    compact?: boolean;
    /** Classes de dimension/forme appliquées au cadre (ex. "w-64 aspect-[2/3] rounded-lg"). */
    className?: string;
    /** Classes additionnelles pour l'image réelle. */
    imgClassName?: string;
};

/**
 * Couverture de livre unifiée : affiche l'image quand `coverUrl` est présent (et
 * se charge correctement), sinon la couverture de substitution « Nuit d'Encre ».
 * Bascule aussi sur le repli si l'image échoue au chargement. Centralise ainsi
 * le rendu des couvertures sur toutes les surfaces (cartes, détails, biblio…).
 */
export default function BookCover({
    coverUrl,
    title,
    author,
    compact = false,
    className,
    imgClassName,
}: BookCoverProps) {
    const [errored, setErrored] = useState(false);
    const showImage = Boolean(coverUrl) && !errored;

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {showImage ? (
                <img
                    src={coverUrl as string}
                    alt={`Couverture de ${title}`}
                    loading="lazy"
                    className={cn("h-full w-full object-cover", imgClassName)}
                    onError={() => setErrored(true)}
                />
            ) : (
                <FallbackCover
                    title={title}
                    author={author}
                    compact={compact}
                />
            )}
        </div>
    );
}
