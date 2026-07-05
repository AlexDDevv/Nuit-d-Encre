import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaCalendar, FaGlobe } from "react-icons/fa6";
import { activateOnKey, buildAuthorAriaLabel, cn, slugify } from "@/lib/utils";
import { getCountryLabel } from "@/lib/filterMaps";
import { interactiveCardShell } from "@/components/UI/cardShell";
import Diamond from "@/components/UI/Diamond";
import IncompleteChip from "@/components/UI/IncompleteChip";
import { AuthorCardProps } from "@/types/types";
import MonogramCover from "./MonogramCover";
import AuthorCardLinks from "./AuthorCardLinks";

/**
 * Carte auteur du catalogue - variante « survol immersif », alignée sur la carte
 * livre. Un médaillon-monogramme doré tient lieu de couverture (cadre portrait
 * 2:3) ; le nom et la nationalité restent visibles, tandis que le nombre
 * d'ouvrages, la date de naissance, la biographie et les liens externes se
 * révèlent au survol / focus (et restent affichés sous « sm », faute de survol
 * sur mobile). La carte mène à la fiche auteur.
 */
function AuthorCard({
    id,
    firstname,
    lastname,
    isIncomplete,
    nationality,
    bookCount,
    birthDate,
    biography,
    wikipediaUrl,
    officialWebsite,
}: AuthorCardProps) {
    const navigate = useNavigate();
    const name = `${firstname} ${lastname}`;
    const path = `/authors/${id}-${slugify(firstname)}-${slugify(lastname)}`;
    const ariaLabel = buildAuthorAriaLabel(firstname, lastname);
    const isCurrent = path === window.location.pathname;
    const country = getCountryLabel(nationality);
    const birthYear = birthDate ? birthDate.slice(0, 4) : null;
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
            className={cn(interactiveCardShell, "aspect-2/3")}
        >
            <MonogramCover first={firstname} last={lastname} />

            {/* voile dégradé pour la lisibilité du texte */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,hsl(20_3%_7%/0.96)_0%,hsl(20_3%_7%/0.8)_25%,hsl(20_3%_7%/0.2)_52%,transparent_72%)]" />

            {isIncomplete && (
                <div className="absolute left-2 top-2 z-10">
                    <IncompleteChip />
                </div>
            )}

            {/* contenu en bas */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3.5">
                {/* ornement filet + losange */}
                <div className="mb-0.5 flex items-center gap-2">
                    <span className="bg-primary/45 h-px w-5" />
                    <Diamond className="text-primary/50 text-xxs" />
                </div>

                <h2
                    className="text-foreground font-title line-clamp-2 text-base font-medium leading-snug [text-shadow:0_1px_8px_hsl(20_3%_5%/0.85)]"
                    title={name}
                >
                    {name}
                </h2>

                {/* nationalité - information clé toujours visible */}
                {country && (
                    <p className="text-foreground/70 font-body flex items-center gap-1.5 text-xs">
                        <FaGlobe size={12} aria-hidden="true" /> {country}
                    </p>
                )}

                {/* méta, biographie et liens révélés au survol / focus */}
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 max-sm:grid-rows-[1fr] max-sm:opacity-100">
                    <div className="overflow-hidden">
                        <div className="flex flex-col gap-1.5 pt-1.5">
                            <p className="text-foreground/60 font-body text-xxs flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-none">
                                <span className="inline-flex items-center gap-1">
                                    <FaBook size={10} aria-hidden="true" />{" "}
                                    {booksLabel}
                                </span>
                                {birthYear && (
                                    <>
                                        <span className="opacity-40">·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <FaCalendar
                                                size={10}
                                                aria-hidden="true"
                                            />{" "}
                                            Né(e) en {birthYear}
                                        </span>
                                    </>
                                )}
                            </p>

                            {biography && (
                                <p className="text-foreground/80 font-quote line-clamp-2 text-xs italic leading-snug">
                                    {biography}
                                </p>
                            )}

                            <AuthorCardLinks
                                officialWebsite={officialWebsite}
                                wikipediaUrl={wikipediaUrl}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(AuthorCard);
