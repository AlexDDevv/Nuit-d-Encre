import { FaFeatherPointed } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type FallbackCoverProps = {
    title: string;
    author: string;
    /**
     * Variante condensée (dégradé + plume seule, sans texte) pour les petites
     * vignettes (< ~150px) où le titre/auteur seraient illisibles.
     */
    compact?: boolean;
};

const gradient =
    "bg-[radial-gradient(125%_85%_at_50%_0%,hsl(43_30%_21%)_0%,hsl(20_3%_14%)_52%,hsl(20_3%_10%)_100%)]";

/**
 * Couverture de substitution stylée « Nuit d'Encre », affichée quand `coverUrl`
 * est absent. Dégradé sombre/doré, cadre intérieur, titre en serif et plume —
 * jamais une icône générique de livre.
 */
export default function FallbackCover({
    title,
    author,
    compact = false,
}: FallbackCoverProps) {
    if (compact) {
        return (
            <div
                className={cn(
                    "absolute inset-0 grid place-items-center",
                    gradient,
                )}
            >
                <div className="border-foreground/20 pointer-events-none absolute inset-1.5 rounded-md border" />
                <FaFeatherPointed
                    className="text-primary opacity-60"
                    size={26}
                    aria-hidden="true"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "absolute inset-0 flex flex-col items-center justify-between px-4 py-5 text-center",
                gradient,
            )}
        >
            <div className="border-foreground/20 pointer-events-none absolute inset-2.5 rounded-md border" />
            <div className="text-foreground/55 font-quote text-xxs uppercase tracking-[0.32em]">
                Nuit d'Encre
            </div>
            <div className="flex flex-col items-center gap-3">
                <span className="bg-foreground/40 h-px w-7" />
                <h4
                    className={cn(
                        "text-foreground font-quote",
                        title.length > 40 ? "text-base" : "text-xl",
                    )}
                >
                    {title}
                </h4>
                <span className="bg-foreground/40 h-px w-7" />
                <p className="text-foreground/60 font-body text-xxs uppercase tracking-[0.18em]">
                    {author}
                </p>
            </div>
            <FaFeatherPointed
                size={18}
                className="text-primary opacity-50"
                aria-hidden="true"
            />
        </div>
    );
}
