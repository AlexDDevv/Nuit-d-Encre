import { FaCircleInfo, FaArrowRightArrowLeft } from "react-icons/fa6";
import { Rank, PLACE_LABEL } from "./podium";

/** Note explicative sous le podium (déplacement, éviction, retrait, aide). */
export default function FavoriteMoveNote({
    selectedRank,
    isFavorite,
    displaced,
    moved,
    favoriteRank,
}: {
    selectedRank: Rank | null;
    isFavorite: boolean;
    displaced: string | null;
    moved: boolean;
    favoriteRank?: number | null;
}) {
    return (
        <div className="mt-4 flex items-start justify-center gap-2 text-center">
            {moved || displaced ? (
                <FaArrowRightArrowLeft
                    size={13}
                    className="text-primary/55 mt-px shrink-0"
                    aria-hidden="true"
                />
            ) : (
                <FaCircleInfo
                    size={13}
                    className="text-primary/55 mt-px shrink-0"
                    aria-hidden="true"
                />
            )}
            <p className="font-body text-[12px] leading-snug text-[hsl(20_12%_64%)]">
                {selectedRank == null ? (
                    isFavorite ? (
                        <>Ce livre ne figurera plus dans vos favoris.</>
                    ) : (
                        <>
                            Touchez un socle pour épingler ce livre. Une place
                            occupée fera quitter l'autre ouvrage.
                        </>
                    )
                ) : displaced ? (
                    <>
                        Prendra la{" "}
                        <span className="text-primary">
                            {PLACE_LABEL[selectedRank]}
                        </span>{" "}
                        — «{" "}
                        <span className="text-primary">{displaced}</span> »
                        quittera vos favoris.
                    </>
                ) : moved ? (
                    <>
                        Sera déplacé de la{" "}
                        <span className="text-primary">
                            {PLACE_LABEL[favoriteRank as Rank]}
                        </span>{" "}
                        vers la{" "}
                        <span className="text-primary">
                            {PLACE_LABEL[selectedRank]}
                        </span>
                        .
                    </>
                ) : (
                    <>
                        Épinglé en{" "}
                        <span className="text-primary">
                            {PLACE_LABEL[selectedRank]}
                        </span>
                        . Touchez un autre socle pour le déplacer.
                    </>
                )}
            </p>
        </div>
    );
}
