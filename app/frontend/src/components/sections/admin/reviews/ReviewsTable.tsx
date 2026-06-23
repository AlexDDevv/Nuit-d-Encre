import { LuEye } from "react-icons/lu";
import type { AdminReviewRow } from "@/types/types";
import { Avatar } from "@/components/sections/admin/ui/Avatar";
import { NoteBadge, StatusChip } from "@/components/sections/admin/ui/chips";
import { DeleteBtn } from "@/components/sections/admin/ui/DataTable";

const GRID = "lg:grid-cols-[1.4fr_1fr_auto_2fr_auto_auto_auto]";

/** Tableau des critiques (en-tête bureau + lignes desktop/mobile + dépliage). */
export default function ReviewsTable({
    reviews,
    expanded,
    setExpanded,
    onDelete,
}: {
    reviews: AdminReviewRow[];
    expanded: string | null;
    setExpanded: (v: string | null) => void;
    onDelete: (r: AdminReviewRow) => void;
}) {
    return (
        <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
            {/* En-tête bureau */}
            <div
                className={`hidden border-b-2 border-border bg-muted/30 px-4 py-3 lg:grid ${GRID} lg:items-center lg:gap-4`}
            >
                {[
                    "Livre",
                    "Utilisateur",
                    "Note",
                    "Extrait",
                    "Statut",
                    "Date",
                    "Actions",
                ].map((h, i) => (
                    <span
                        key={h}
                        className={`font-body text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground ${i === 6 ? "text-right" : ""
                            }`}
                    >
                        {h}
                    </span>
                ))}
            </div>
            <ul className="divide-y-2 divide-border/45">
                {reviews.map((r) => {
                    const open = expanded === r.id;
                    return (
                        <li
                            key={r.id}
                            className="group transition-colors hover:bg-muted/20"
                        >
                            {/* Ligne bureau */}
                            <div
                                className={`hidden items-center gap-4 px-4 py-3 lg:grid ${GRID}`}
                            >
                                <span className="truncate font-quote text-sm text-foreground">
                                    « {r.book.title} »
                                </span>
                                <span className="flex min-w-0 items-center gap-2">
                                    <Avatar
                                        name={r.user.userName}
                                        avatar={r.user.avatar}
                                        size={26}
                                        ring={false}
                                    />
                                    <span className="truncate font-body text-xs text-muted-foreground">
                                        {r.user.userName}
                                    </span>
                                </span>
                                <NoteBadge note={r.rating} />
                                <span className="truncate font-body text-xs italic text-muted-foreground/90">
                                    {r.reviewText || "-"}
                                </span>
                                <StatusChip />
                                <span className="whitespace-nowrap font-body text-xs text-muted-foreground">
                                    {new Date(r.createdAt).toLocaleDateString(
                                        "fr-FR",
                                    )}
                                </span>
                                <div className="flex items-center justify-end gap-1.5 opacity-75 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() =>
                                            setExpanded(open ? null : r.id)
                                        }
                                        aria-label="Voir la critique complète"
                                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-body text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        <LuEye size={14} />{" "}
                                        {open ? "Réduire" : "Lire"}
                                    </button>
                                    <DeleteBtn onClick={() => onDelete(r)} />
                                </div>
                            </div>

                            {/* Carte mobile */}
                            <div className="flex flex-col gap-2 px-4 py-3.5 lg:hidden">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="font-quote text-base text-foreground">
                                        « {r.book.title} »
                                    </span>
                                    <NoteBadge note={r.rating} />
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2">
                                        <Avatar
                                            name={r.user.userName}
                                            avatar={r.user.avatar}
                                            size={24}
                                            ring={false}
                                        />
                                        <span className="font-body text-xs text-muted-foreground">
                                            {r.user.userName}
                                        </span>
                                    </span>
                                    <StatusChip />
                                </div>
                                <p
                                    className={`font-body text-sm italic text-muted-foreground/90 ${open ? "" : "line-clamp-2"
                                        }`}
                                >
                                    {r.reviewText || "-"}
                                </p>
                                <div className="flex items-center justify-between gap-3 pt-1">
                                    <span className="font-body text-xs text-muted-foreground/80">
                                        {new Date(
                                            r.createdAt,
                                        ).toLocaleDateString("fr-FR")}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setExpanded(open ? null : r.id)
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-body text-xs font-bold text-muted-foreground hover:text-primary"
                                        >
                                            <LuEye size={14} />{" "}
                                            {open ? "Réduire" : "Lire"}
                                        </button>
                                        <DeleteBtn onClick={() => onDelete(r)} />
                                    </div>
                                </div>
                            </div>

                            {/* Panneau déplié */}
                            {open && r.reviewText && (
                                <div className="border-t-2 border-border/50 bg-popover/40 px-4 py-4 lg:px-6">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 text-sm text-primary/45">
                                            “
                                        </span>
                                        <div>
                                            <p className="font-quote text-base italic leading-relaxed text-foreground/90 text-pretty">
                                                {r.reviewText}
                                            </p>
                                            <p className="mt-2 font-body text-xs text-muted-foreground">
                                                - {r.user.userName} sur «{" "}
                                                {r.book.title} » de{" "}
                                                {r.book.author.firstname}{" "}
                                                {r.book.author.lastname}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
