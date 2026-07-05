import { Skeleton } from "@/components/UI/skeleton/Skeleton";

/**
 * Squelette des cartes auteur, calqué sur la nouvelle carte immersive : cadre
 * portrait 2:3, médaillon centré et deux lignes (nom + métadonnées) en bas, dans
 * la même grille que la page Auteurs.
 */
export default function AuthorCardSkeleton() {
    return (
        <div className="grid w-full grid-cols-[repeat(auto-fit,14rem)] justify-center gap-10">
            {Array.from({ length: 12 }, (_, index) => (
                <div
                    key={index}
                    className="border-border bg-card relative aspect-2/3 overflow-hidden rounded-xl border-2"
                >
                    {/* médaillon */}
                    <div className="absolute inset-x-0 top-[14%] flex justify-center">
                        <Skeleton className="aspect-square w-[58%] rounded-full" />
                    </div>
                    {/* nom + métadonnées */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3.5">
                        <Skeleton className="h-4 w-4/5 rounded" />
                        <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
