import { ReactNode } from "react";
import { FaGlobe } from "react-icons/fa6";
import { Book } from "@/types/types";
import { langLabel } from "../preview/previewLabels";
import { formatLabelMap } from "@/lib/filterMaps";

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
            className={`flex items-baseline justify-between gap-4 py-2.5 ${last ? "" : "border-b border-dashed border-[hsl(0_0%_100%/0.07)]"
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

/**
 * « Informations complémentaires » — notice de catalogue en monospace (façon
 * page d'import). Affiche « manquant » en ambre pour les champs absents.
 */
export default function BookNotice({ book }: { book: Book }) {
    const lang = langLabel(book.language);
    const format = book.format ? formatLabelMap[book.format] : null;

    return (
        <section className="border-border bg-card/60 self-start rounded-xl border-2 p-6">
            <div className="mb-3 flex items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(43_30%_62%)]">
                    Informations complémentaires
                </span>
                <span className="bg-primary/20 h-px flex-1" />
            </div>
            <div>
                <NoticeRow
                    label="ISBN-13"
                    value={book.isbn13 || <Missing />}
                />
                <NoticeRow
                    label="ISBN-10"
                    value={book.isbn10 || <Missing />}
                />
                <NoticeRow
                    label="Pages"
                    value={book.pageCount ? book.pageCount : <Missing />}
                />
                <NoticeRow label="Parution" value={book.publishedYear} />
                <NoticeRow
                    label="Langue"
                    value={lang ?? <Missing />}
                    icon={
                        <FaGlobe
                            size={12}
                            className="text-primary/55"
                            aria-hidden="true"
                        />
                    }
                />
                <NoticeRow
                    label="Éditeur"
                    value={book.publisher || <Missing />}
                />
                <NoticeRow label="Format" value={format ?? <Missing />} last />
            </div>
        </section>
    );
}
