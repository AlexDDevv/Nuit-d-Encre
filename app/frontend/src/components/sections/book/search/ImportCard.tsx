import { Link } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { interactiveCardShell } from "@/components/UI/cardShell";
import { getSourceLabel } from "@/lib/filterMaps";
import { BookSearchResult } from "@/types/types";
import ExternalFallback from "./ExternalFallback";

type ImportCardProps = {
    result: BookSearchResult;
};

/**
 * Carte d'un résultat EXTERNE (importable). Même design overlay que la carte du
 * catalogue (couverture plein cadre, titre/auteur en superposition) mais signalée
 * comme « pas encore à nous » : bordure pointillée dorée, chip de source et
 * couverture désaturée. La carte mène à la page d'aperçu où se fait l'import.
 */
export default function ImportCard({ result }: ImportCardProps) {
    const to = `/books/preview/${result.isbn13}`;
    const author = result.author ?? "";
    const source = getSourceLabel(result.source);
    const ariaLabel = `Importer ${result.title}${author ? ` par ${author}` : ""
        } — résultat externe via ${source}`;

    return (
        <Link
            to={to}
            aria-label={ariaLabel}
            className={cn(
                interactiveCardShell,
                "border-primary/35 block aspect-2/3 border-dashed",
            )}
        >
            {/* couverture désaturée plein cadre (pas encore à nous) */}
            <div className="bg-background absolute inset-0">
                {result.coverUrl ? (
                    <img
                        src={result.coverUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover brightness-[.82] contrast-[.96] saturate-[.7] transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                ) : (
                    <ExternalFallback source={source} />
                )}
            </div>

            {/* voile dégradé pour la lisibilité du texte */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,hsl(20_3%_7%/0.96)_0%,hsl(20_3%_7%/0.78)_26%,hsl(20_3%_7%/0.18)_52%,transparent_72%)]" />

            {/* voile parchemin discret (signale « externe ») */}
            {result.coverUrl && (
                <div className="pointer-events-none absolute inset-0 bg-[hsl(43_20%_40%/0.10)]" />
            )}

            {/* chip source */}
            <span className="text-primary/90 border-primary/30 absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border bg-[hsl(20_3%_9%/0.82)] px-2 py-0.75 font-body text-xxs font-bold tracking-wide whitespace-nowrap backdrop-blur-sm">
                <FaArrowUpRightFromSquare size={9} aria-hidden="true" />
                {source}
            </span>

            {/* contenu en bas */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3.5">
                <h3
                    className="text-foreground font-title line-clamp-2 font-medium leading-snug [text-shadow:0_1px_8px_hsl(20_3%_5%/0.8)]"
                    title={result.title}
                >
                    {result.title}
                </h3>
                {author && (
                    <p className="text-foreground/70 font-body text-xs">
                        {author}
                    </p>
                )}
                {/* méta révélée au survol / focus */}
                {result.year != null && (
                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
                        <div className="overflow-hidden">
                            <p className="text-foreground/60 font-body pt-1.5 text-xs">
                                {result.year}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
