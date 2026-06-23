import { ReactNode } from "react";
import { BookSearchResult } from "@/types/types";
import { Glyph, GlyphName } from "./Glyph";
import { langLabel, sourceInfo } from "./previewLabels";

function NoticeRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: ReactNode;
    icon?: GlyphName;
}) {
    return (
        <div
            className="flex items-baseline justify-between gap-4 border-b border-dashed py-2.5"
            style={{ borderColor: "hsl(0 0% 100% / 0.07)" }}
        >
            <span
                className="inline-flex shrink-0 items-center gap-2 font-mono text-xxs uppercase tracking-[0.14em]"
                style={{ color: "hsl(20 12% 56%)" }}
            >
                {icon && <Glyph name={icon} size={12} style={{ color: "hsl(43 59% 81% / 0.55)" }} />}
                {label}
            </span>
            <span className="text-foreground/90 text-right font-mono text-xs">{value}</span>
        </div>
    );
}

export function PreviewNotice({ book }: { book: BookSearchResult }) {
    const { label: source } = sourceInfo(book.source);
    const lang = langLabel(book.language);

    return (
        <section className="border-border bg-card/60 mt-16 rounded-xl border-2 p-6">
            <div className="mb-3 flex items-center gap-2.5">
                <span
                    className="font-mono text-xs uppercase tracking-[0.2em]"
                    style={{ color: "hsl(43 30% 62%)" }}
                >
                    La notice - telle qu'on l'a trouvée
                </span>
                <span className="h-px flex-1" style={{ background: "hsl(43 59% 81% / 0.18)" }} />
            </div>
            <div className="grid gap-x-12 sm:grid-cols-2">
                <div>
                    <NoticeRow label="Source" value={source} icon="external" />
                    {book.isbn13 && <NoticeRow label="ISBN" value={book.isbn13} />}
                    {book.year && <NoticeRow label="Première parution" value={book.year} />}
                </div>
                <div>
                    {book.publisher && <NoticeRow label="Éditeur" value={book.publisher} />}
                    {lang && <NoticeRow label="Langue d'origine" value={lang} icon="globe" />}
                    {book.pageCount && <NoticeRow label="Pages" value={book.pageCount} />}
                </div>
            </div>
        </section>
    );
}
