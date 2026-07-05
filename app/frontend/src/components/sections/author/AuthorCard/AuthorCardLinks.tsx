import { FaGlobe } from "react-icons/fa6";

type AuthorCardLinksProps = {
    officialWebsite?: string;
    wikipediaUrl?: string;
};

/** Pastille sobre partagée par les deux ressources externes. */
const pillClass =
    "border-primary/30 text-primary/80 font-body inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xxs leading-none";

/**
 * Pastilles indiquant les ressources externes disponibles pour un auteur (site
 * officiel, notice Wikipédia). Purement indicatives : la carte entière est le
 * lien, ces marqueurs ne sont donc pas cliquables séparément. N'affiche rien si
 * aucune ressource n'est renseignée.
 */
export default function AuthorCardLinks({
    officialWebsite,
    wikipediaUrl,
}: AuthorCardLinksProps) {
    if (!officialWebsite && !wikipediaUrl) return null;

    return (
        <div
            className="mt-0.5 flex items-center gap-1.5"
            aria-label="Ressources disponibles"
        >
            {officialWebsite && (
                <span className={pillClass} title="Site officiel">
                    <FaGlobe size={10} aria-hidden="true" /> Site
                </span>
            )}
            {wikipediaUrl && (
                <span className={pillClass} title="Notice Wikipédia">
                    <span
                        className="font-quote text-xxs font-medium leading-none"
                        aria-hidden="true"
                    >
                        W
                    </span>{" "}
                    Wikipédia
                </span>
            )}
        </div>
    );
}
