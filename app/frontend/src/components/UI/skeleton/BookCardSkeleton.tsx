import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import { cn } from "@/lib/utils";

/**
 * Squelette des cartes livre, calqué sur la carte overlay : un cadre couverture
 * 2:3 qui scintille. Grille du catalogue par défaut, ou rangée flex-wrap pour la
 * bibliographie d'une page auteur.
 */
export default function BookCardSkeleton({
    isInAuthor,
}: {
    isInAuthor?: boolean;
}) {
    return (
        <div
            className={cn(
                "w-full",
                isInAuthor
                    ? "flex flex-wrap items-center justify-start gap-10"
                    : "grid grid-cols-[repeat(auto-fit,14rem)] justify-center gap-10",
            )}
        >
            {Array.from({ length: isInAuthor ? 4 : 12 }, (_, index) => (
                <Skeleton
                    key={index}
                    className={cn(
                        "aspect-2/3 rounded-xl",
                        isInAuthor ? "w-52" : "w-56",
                    )}
                />
            ))}
        </div>
    );
}
