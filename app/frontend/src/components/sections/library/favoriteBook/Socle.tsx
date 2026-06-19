import { FaStar, FaCrown, FaCheck } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Rank, Slot, PLACE_LABEL } from "./podium";

const ORDINAL: Record<Rank, string> = { 1: "ʳᵉ", 2: "ᵉ", 3: "ᵉ" };

/** Dégradés parchemin/or — hiérarchie par luminosité, jamais or/argent/bronze. */
const BASE_GRADIENT: Record<Rank, string> = {
    1: "bg-[linear-gradient(180deg,hsl(43_34%_31%)_0%,hsl(43_30%_21%)_55%,hsl(20_4%_16%)_100%)]",
    2: "bg-[linear-gradient(180deg,hsl(43_27%_27%)_0%,hsl(43_24%_19%)_55%,hsl(20_4%_16%)_100%)]",
    3: "bg-[linear-gradient(180deg,hsl(43_21%_23%)_0%,hsl(43_18%_18%)_55%,hsl(20_3%_16%)_100%)]",
};
const SELECTED_GRADIENT =
    "bg-[linear-gradient(180deg,hsl(43_46%_44%)_0%,hsl(43_38%_30%)_55%,hsl(43_32%_22%)_100%)]";

const HEIGHT: Record<Rank, string> = { 1: "h-37.5", 2: "h-29", 3: "h-23" };
const NUMERAL_COLOR: Record<Rank, string> = {
    1: "text-primary",
    2: "text-[hsl(43_50%_72%)]",
    3: "text-[hsl(43_40%_62%)]",
};

// ── Un socle du podium ────────────────────────────────────────────────────────
export default function Socle({
    rank,
    selected,
    current,
    occupant,
    bookTitle,
    onPick,
}: {
    rank: Rank;
    selected: boolean;
    current: boolean;
    occupant: Slot;
    bookTitle: string;
    onPick: (rank: Rank) => void;
}) {
    const occName = occupant && !selected ? occupant.title : null;
    const numColor = selected ? "text-[hsl(43_59%_21%)]" : NUMERAL_COLOR[rank];

    return (
        <div className="flex w-full flex-col items-center">
            {/* libellé de l'occupant (au-dessus) */}
            <div className="mb-2 flex h-9 flex-col items-center justify-end text-center">
                {selected ? (
                    <span className="border-primary/50 text-primary inline-flex items-center gap-1 whitespace-nowrap rounded-full border bg-[hsl(43_59%_81%/0.16)] px-2 py-0.75 font-body text-xxs font-bold">
                        <FaCheck size={10} aria-hidden="true" /> Ce livre
                    </span>
                ) : occName ? (
                    <span
                        className="max-w-32.5 truncate font-quote text-xs italic leading-tight text-[hsl(20_12%_58%)]"
                        title={`Occupée par « ${occName} »`}
                    >
                        occupée par
                        <br />
                        <span className="font-body text-xxs not-italic text-[hsl(43_30%_64%)]">
                            « {occName} »
                        </span>
                    </span>
                ) : (
                    <span className="font-quote text-xs italic text-[hsl(20_12%_46%)]">
                        libre
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={() => onPick(rank)}
                aria-pressed={selected}
                aria-label={`Placer « ${bookTitle} » en ${PLACE_LABEL[rank]}${
                    current ? " (position actuelle)" : ""
                }${
                    occName
                        ? `. Occupée par ${occName}, qui quittera vos favoris`
                        : ""
                }`}
                className={cn(
                    "focus-visible:ring-primary focus-visible:ring-offset-[hsl(20_3%_16%)] group relative flex w-full cursor-pointer flex-col items-center justify-start gap-2 overflow-hidden rounded-t-xl border-2 pt-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    HEIGHT[rank],
                    selected
                        ? cn(
                              SELECTED_GRADIENT,
                              "border-t-primary border-x-[hsl(43_59%_81%/0.6)] border-b-transparent shadow-[0_-2px_30px_-6px_hsl(43_59%_60%/0.55),inset_0_1px_0_hsl(43_59%_81%/0.4)]",
                          )
                        : cn(
                              BASE_GRADIENT[rank],
                              "border-[hsl(0_0%_24%)] shadow-[inset_0_1px_0_hsl(43_59%_81%/0.08)] hover:border-t-primary hover:border-x-[hsl(43_59%_81%/0.6)] hover:shadow-[0_-2px_22px_-10px_hsl(43_59%_60%/0.45),inset_0_1px_0_hsl(43_59%_81%/0.12)]",
                          ),
                )}
            >
                {/* emblème */}
                <span
                    className={cn(
                        "grid place-items-center transition-transform duration-200 group-hover:-translate-y-0.5",
                        numColor,
                    )}
                >
                    {rank === 1 ? (
                        <FaCrown size={24} aria-hidden="true" />
                    ) : (
                        <FaStar size={17} aria-hidden="true" />
                    )}
                </span>
                {/* numéral ordinal */}
                <span
                    className={cn(
                        "font-title flex items-start font-black leading-none",
                        rank === 1 ? "text-4xl" : "text-3xl",
                        numColor,
                    )}
                >
                    {rank}
                    <span className="font-quote mt-0.5 text-sm font-medium">
                        {ORDINAL[rank]}
                    </span>
                </span>
                {/* badge « actuel » */}
                {current && (
                    <span
                        className={cn(
                            "absolute left-1/2 top-1 -translate-x-1/2 rounded-full border bg-[hsl(20_3%_9%/0.55)] px-2 py-px font-mono text-xxxs font-medium uppercase tracking-wider",
                            selected
                                ? "border-[hsl(43_59%_21%/0.5)] text-[hsl(43_59%_21%)]"
                                : "border-primary/40 text-primary",
                        )}
                    >
                        actuel
                    </span>
                )}
                {/* veinure de la marche */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-[linear-gradient(to_top,hsl(20_3%_6%/0.5),transparent)]" />
            </button>

            {/* libellé de la place (sous le socle) */}
            <p
                className={cn(
                    "font-quote mt-3 text-center text-sm",
                    selected ? "text-primary" : "text-[hsl(20_12%_72%)]",
                )}
            >
                {PLACE_LABEL[rank]}
            </p>
        </div>
    );
}
