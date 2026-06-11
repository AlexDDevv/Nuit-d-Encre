import { FaFeatherPointed } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type FallbackCoverProps = {
    title: string;
    author: string;
};

/**
 * Couverture de substitution stylée « Nuit d'Encre », affichée quand `coverUrl`
 * est absent. Dégradé sombre/doré, cadre intérieur, titre en serif et plume —
 * jamais une icône générique de livre.
 */
export default function FallbackCover({ title, author }: FallbackCoverProps) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-between bg-[radial-gradient(125%_85%_at_50%_0%,hsl(43_30%_21%)_0%,hsl(20_3%_14%)_52%,hsl(20_3%_10%)_100%)] px-4 py-5 text-center">
            <div className="border-foreground/20 pointer-events-none absolute inset-2.5 rounded-md border" />
            <div className="text-foreground/55 font-quote text-[9.5px] uppercase tracking-[0.32em]">
                Nuit d'Encre
            </div>
            <div className="flex flex-col items-center gap-3">
                <span className="bg-foreground/40 h-px w-7" />
                <h4
                    className={cn(
                        "text-foreground font-quote leading-[1.18]",
                        title.length > 40 ? "text-[15px]" : "text-[19px]",
                    )}
                >
                    {title}
                </h4>
                <span className="bg-foreground/40 h-px w-7" />
                <p className="text-foreground/60 font-body text-[10px] uppercase tracking-[0.18em]">
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
