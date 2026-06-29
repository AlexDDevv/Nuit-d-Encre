import { Link } from "react-router-dom";
import { LuBookMarked, LuChevronRight } from "react-icons/lu";
import { feedTarget } from "./feedTargetHref";
import { FeedTargetLinkProps } from "@/types/types";

/**
 * Chip discret vers la fiche cible d'une entrée : mini-couverture toilée pour un
 * livre, médaillon plume pour un auteur. Rien si la cible n'est pas exploitable.
 */
export default function FeedTargetLink({ entry }: FeedTargetLinkProps) {
    const target = feedTarget(entry);
    if (!target) return null;

    return (
        <Link
            to={target.href}
            className="group/target border-border bg-popover/60 focus-visible:ring-primary/70 hover:border-primary/60 mt-2 inline-flex max-w-full items-center gap-2.5 rounded-lg border-2 py-1.5 pl-1.5 pr-2.5 transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2"
        >
            {target.kind === "book" ? (
                <span
                    aria-hidden="true"
                    className="border-primary/25 text-primary/40 bg-linear-to-br relative grid h-9 w-6 shrink-0 place-items-center overflow-hidden rounded border from-[hsl(34_34%_24%)] to-[hsl(28_30%_13%)]"
                >
                    <span className="text-xxxs leading-none">◆</span>
                    <span className="absolute left-0 top-0 h-full w-0.75 bg-black/30" />
                </span>
            ) : (
                <span
                    aria-hidden="true"
                    className="border-primary/30 bg-primary/5 text-primary/70 grid h-9 w-9 shrink-0 place-items-center rounded-full border"
                >
                    <LuBookMarked size={15} />
                </span>
            )}
            <span className="min-w-0 leading-tight">
                <span className="text-muted-foreground/80 font-title text-xxs block font-bold uppercase tracking-[0.18em]">
                    {target.kind === "book" ? "Livre" : "Auteur"}
                </span>
                <span className="text-foreground/90 font-quote group-hover/target:text-primary block truncate text-sm italic">
                    {target.label}
                </span>
            </span>
            <LuChevronRight
                size={15}
                className="text-muted-foreground group-hover/target:text-primary ml-auto shrink-0 transition-colors"
            />
        </Link>
    );
}
