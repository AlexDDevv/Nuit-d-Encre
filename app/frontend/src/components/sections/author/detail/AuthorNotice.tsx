import { FaBook, FaCalendar, FaGlobe } from "react-icons/fa6";
import { Author } from "@/types/types";
import { getCountryLabel } from "@/lib/filterMaps";
import NoticePanel, {
    NoticeRow,
    Missing,
} from "@/components/sections/shared/Notice";

const Dash = () => <span className="text-[hsl(20_12%_50%)]">-</span>;

/**
 * Notice monospace « Informations » de la fiche auteur (jumelle de la notice
 * livre). Champs factuels en clé/valeur, « manquant » en ambre si absent.
 */
export default function AuthorNotice({ author }: { author: Author }) {
    const name = `${author.firstname} ${author.lastname}`;
    const country = getCountryLabel(author.nationality);
    const worksCount = author.books?.length ?? 0;
    const gold =
        "text-primary rounded-sm underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    return (
        <NoticePanel title="Informations">
            <NoticeRow label="Nom complet" value={name} />
            <NoticeRow
                label="Naissance"
                value={author.birthDate || <Missing />}
                icon={
                    <FaCalendar
                        size={11}
                        className="text-primary/55"
                        aria-hidden="true"
                    />
                }
            />
            <NoticeRow
                label="Nationalité"
                value={country || <Missing />}
                icon={
                    <FaGlobe
                        size={12}
                        className="text-primary/55"
                        aria-hidden="true"
                    />
                }
            />
            <NoticeRow
                label="Ouvrages"
                value={`${worksCount} au catalogue`}
                icon={
                    <FaBook
                        size={12}
                        className="text-primary/55"
                        aria-hidden="true"
                    />
                }
            />
            <NoticeRow
                label="Wikipédia"
                value={
                    author.wikipediaUrl ? (
                        <a
                            href={author.wikipediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Wikipédia (nouvel onglet)"
                            className={gold}
                        >
                            consulter ↗
                        </a>
                    ) : (
                        <Dash />
                    )
                }
            />
            <NoticeRow
                label="Site officiel"
                value={
                    author.officialWebsite ? (
                        <a
                            href={author.officialWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Site officiel (nouvel onglet)"
                            className={gold}
                        >
                            visiter ↗
                        </a>
                    ) : (
                        <Dash />
                    )
                }
                last
            />
        </NoticePanel>
    );
}
