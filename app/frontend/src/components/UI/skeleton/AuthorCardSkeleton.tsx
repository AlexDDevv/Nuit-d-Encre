import { Skeleton } from "@/components/UI/skeleton/Skeleton";

/**
 * Squelette des cartes auteur, calqué sur la nouvelle carte : monogramme rond,
 * nom et ligne de métadonnées, dans la même grille centrée que la page Auteurs.
 */
export default function AuthorCardSkeleton() {
    return (
        <div className="grid w-full grid-cols-[repeat(auto-fit,16rem)] justify-center gap-10">
            {Array.from({ length: 12 }, (_, index) => (
                <div
                    key={index}
                    className="border-border bg-card flex w-64 flex-col items-center gap-3.5 rounded-xl border-2 px-5 pb-5 pt-7"
                >
                    {/* monogramme */}
                    <Skeleton className="h-21.5 w-21.5 rounded-full" />
                    {/* nom + métadonnées */}
                    <div className="flex w-full flex-col items-center gap-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3.5 w-32" />
                    </div>
                </div>
            ))}
        </div>
    );
}
