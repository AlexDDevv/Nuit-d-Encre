import { ReactNode } from "react";

type BookCardMetaProps = {
    category?: string;
    year?: number;
    format?: string;
};

/**
 * Ligne de métadonnées discrètes d'une carte livre : catégorie · année · format.
 * Les segments absents sont omis (et les séparateurs ajustés en conséquence).
 */
export default function BookCardMeta({
    category,
    year,
    format,
}: BookCardMetaProps) {
    const parts: { key: string; node: ReactNode }[] = [];

    if (category) {
        parts.push({
            key: "category",
            node: (
                <span className="text-foreground/80 font-quote italic">
                    {category}
                </span>
            ),
        });
    }
    if (year) parts.push({ key: "year", node: <span>{year}</span> });
    if (format) parts.push({ key: "format", node: <span>{format}</span> });

    if (parts.length === 0) return null;

    return (
        <p className="text-foreground/60 font-body flex items-center gap-1.5 truncate text-xs">
            {parts.map((part, i) => (
                <span
                    key={part.key}
                    className="inline-flex items-center gap-1.5"
                >
                    {i > 0 && <span className="opacity-40">·</span>}
                    {part.node}
                </span>
            ))}
        </p>
    );
}
