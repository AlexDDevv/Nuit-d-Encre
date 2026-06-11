import { useNavigate } from "react-router-dom";
import { FaBook, FaGlobe } from "react-icons/fa6";
import { activateOnKey, buildAuthorAriaLabel, cn, slugify } from "@/lib/utils";
import { getCountryLabel } from "@/lib/filterMaps";
import { interactiveCardShell } from "@/components/UI/cardShell";
import IncompleteChip from "@/components/UI/IncompleteChip";
import { AuthorCardProps } from "@/types/types";
import Monogram from "./Monogram";

/**
 * Carte auteur du catalogue. Monogramme doré en visuel, nom hiérarchisé,
 * nationalité décodée et nombre de livres en métadonnées. Hover cohérent avec la
 * carte livre (bordure dorée + léger scale). La carte mène à la fiche auteur.
 */
export default function AuthorCard({
    id,
    firstname,
    lastname,
    isIncomplete,
    nationality,
    bookCount,
}: AuthorCardProps) {
    const navigate = useNavigate();
    const name = `${firstname} ${lastname}`;
    const path = `/authors/${id}-${slugify(firstname)}-${slugify(lastname)}`;
    const ariaLabel = buildAuthorAriaLabel(firstname, lastname);
    const isCurrent = path === window.location.pathname;
    const country = getCountryLabel(nationality);
    const count = bookCount ?? 0;
    const booksLabel =
        count === 0 ? "Aucun livre" : `${count} livre${count > 1 ? "s" : ""}`;

    const openAuthor = () => navigate(path);

    return (
        <div
            role="link"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-current={isCurrent ? "page" : undefined}
            data-category="Auteur"
            onClick={openAuthor}
            onKeyDown={activateOnKey(openAuthor)}
            className={cn(
                interactiveCardShell,
                "w-64 flex-col items-center gap-3.5 px-5 pb-5 pt-7 text-center flex",
            )}
        >
            {/* halo doré discret au survol */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(to_right,transparent,hsl(43_59%_81%/0.5),transparent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            {isIncomplete && (
                <div className="absolute right-2.5 top-2.5 z-10">
                    <IncompleteChip />
                </div>
            )}

            <Monogram first={firstname} last={lastname} />

            <div className="flex flex-col items-center gap-1">
                <h2
                    className="text-foreground font-title line-clamp-2 flex min-h-[2.4em] items-center justify-center text-[16.5px] font-medium leading-tight"
                    title={name}
                >
                    {name}
                </h2>
                <div className="text-muted-foreground font-body flex items-center gap-2.5 text-[12px]">
                    {country && (
                        <>
                            <span className="inline-flex items-center gap-1">
                                <FaGlobe size={12} aria-hidden="true" />{" "}
                                {country}
                            </span>
                            <span className="opacity-40">·</span>
                        </>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <FaBook size={12} aria-hidden="true" /> {booksLabel}
                    </span>
                </div>
            </div>
        </div>
    );
}
