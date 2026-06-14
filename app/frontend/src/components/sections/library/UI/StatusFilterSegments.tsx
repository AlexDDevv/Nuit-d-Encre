import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants/bookStatus";
import { UserBookStatus } from "@/types/types";

const SEGMENTS: { value: UserBookStatus; label: string }[] = [
    { value: "TO_READ", label: "À lire" },
    { value: "READING", label: "En cours" },
    { value: "READ", label: "Lu" },
    { value: "PAUSED", label: "En pause" },
];

type StatusFilterSegmentsProps = {
    selectedStatus: UserBookStatus | "";
    onStatusChange: (status: UserBookStatus | "") => void;
    countByStatus: Record<UserBookStatus, number>;
    total: number;
};

const SEG_BASE =
    "focus-visible:ring-ring inline-flex items-center gap-2 whitespace-nowrap rounded-md border-2 px-3 py-1.5 font-body text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 cursor-pointer";
const ACTIVE = "border-primary/60 bg-[hsl(43_30%_25%/0.45)] text-primary";
const INACTIVE = "border-border text-muted-foreground hover:text-primary";

/**
 * Filtre par statut de lecture, en segments dorés (rayon réduit), avec un
 * compteur par statut sur l'ensemble de la collection.
 */
export default function StatusFilterSegments({
    selectedStatus,
    onStatusChange,
    countByStatus,
    total,
}: StatusFilterSegmentsProps) {
    return (
        <div
            role="group"
            aria-label="Filtrer par statut"
            className="flex flex-wrap items-center gap-2"
        >
            <button
                type="button"
                onClick={() => onStatusChange("")}
                aria-pressed={selectedStatus === ""}
                className={cn(SEG_BASE, selectedStatus === "" ? ACTIVE : INACTIVE)}
            >
                Tout
                <span className="font-mono text-[10.5px] font-medium opacity-70">
                    {total}
                </span>
            </button>
            {SEGMENTS.map((seg) => {
                const active = selectedStatus === seg.value;
                return (
                    <button
                        key={seg.value}
                        type="button"
                        onClick={() => onStatusChange(seg.value)}
                        aria-pressed={active}
                        className={cn(SEG_BASE, active ? ACTIVE : INACTIVE)}
                    >
                        <span
                            className={cn(
                                "h-2 w-2 rounded-full",
                                STATUS_COLORS[seg.value].dot,
                            )}
                        />
                        {seg.label}
                        <span className="font-mono text-[10.5px] font-medium opacity-70">
                            {countByStatus[seg.value]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
