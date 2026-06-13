import { ReactNode } from "react";
import { FaBook, FaCalendar, FaGlobe } from "react-icons/fa6";
import { Author } from "@/types/types";
import { getCountryLabel } from "@/lib/filterMaps";

function NoticeRow({
    label,
    value,
    icon,
    last,
}: {
    label: string;
    value: ReactNode;
    icon?: ReactNode;
    last?: boolean;
}) {
    return (
        <div
            className={`flex items-baseline justify-between gap-4 py-2.5 ${
                last ? "" : "border-b border-dashed border-[hsl(0_0%_100%/0.07)]"
            }`}
        >
            <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[hsl(20_12%_56%)]">
                {icon}
                {label}
            </span>
            <span className="text-foreground/90 text-right font-mono text-xs">
                {value}
            </span>
        </div>
    );
}

const Missing = () => (
    <span className="font-mono text-xs italic text-[hsl(25_80%_60%)]">
        manquant
    </span>
);

const Dash = () => <span className="text-[hsl(20_12%_50%)]">—</span>;

/**
 * Notice monospace « Informations » de la fiche auteur (jumelle de la notice
 * livre). Champs factuels en clé/valeur, « manquant » en ambre si absent.
 */
export default function AuthorNotice({ author }: { author: Author }) {
    const name = `${author.firstname} ${author.lastname}`;
    const country = getCountryLabel(author.nationality);
    const worksCount = author.books?.length ?? 0;
    const gold = "text-primary rounded underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    return (
        <section className="border-border bg-card/60 self-start rounded-xl border-2 p-6">
            <div className="mb-3 flex items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(43_30%_62%)]">
                    Informations
                </span>
                <span className="bg-primary/20 h-px flex-1" />
            </div>
            <div>
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
            </div>
        </section>
    );
}
