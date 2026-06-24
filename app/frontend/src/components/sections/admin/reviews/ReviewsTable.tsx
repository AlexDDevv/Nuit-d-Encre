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
        <div className="border-border bg-card overflow-hidden rounded-xl border-2">
            {/* En-tête bureau */}
            <div
                className={`border-border bg-muted/30 hidden border-b-2 px-4 py-3 lg:grid ${GRID} lg:items-center lg:gap-4`}
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
                        className={`font-body text-muted-foreground text-xs font-bold uppercase tracking-[0.13em] ${
                            i === 6 ? "text-right" : ""
                        }`}
                    >
                        {h}
                    </span>
                ))}
            </div>
            <ul className="divide-border/45 divide-y-2">
                {reviews.map((r) => {
                    const open = expanded === r.id;
                    return (
                        <li
                            key={r.id}
                            className="hover:bg-muted/20 group transition-colors"
                        >
                            {/* Ligne bureau */}
                            <div
                                className={`hidden items-center gap-4 px-4 py-3 lg:grid ${GRID}`}
                            >
                                <span className="font-quote text-foreground truncate text-sm">
                                    « {r.book.title} »
                                </span>
                                <span className="flex min-w-0 items-center gap-2">
                                    <Avatar
                                        name={r.user.userName}
                                        avatar={r.user.avatar}
                                        size={26}
                                        ring={false}
                                    />
                                    <span className="font-body text-muted-foreground truncate text-xs">
                                        {r.user.userName}
                                    </span>
                                </span>
                                <NoteBadge note={r.rating} />
                                <span className="font-body text-muted-foreground/90 truncate text-xs italic">
                                    {r.reviewText || "-"}
                                </span>
                                <StatusChip />
                                <span className="font-body text-muted-foreground whitespace-nowrap text-xs">
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
                                        className="font-body text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold transition-colors"
                                    >
                                        <LuEye /> {open ? "Réduire" : "Lire"}
                                    </button>
                                    <DeleteBtn onClick={() => onDelete(r)} />
                                </div>
                            </div>

                            {/* Carte mobile */}
                            <div className="flex flex-col gap-2 px-4 py-3.5 lg:hidden">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="font-quote text-foreground text-base">
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
                                        <span className="font-body text-muted-foreground text-xs">
                                            {r.user.userName}
                                        </span>
                                    </span>
                                    <StatusChip />
                                </div>
                                <p
                                    className={`font-body text-muted-foreground/90 text-sm italic ${
                                        open ? "" : "line-clamp-2"
                                    }`}
                                >
                                    {r.reviewText || "-"}
                                </p>
                                <div className="flex items-center justify-between gap-3 pt-1">
                                    <span className="font-body text-muted-foreground/80 text-xs">
                                        {new Date(
                                            r.createdAt,
                                        ).toLocaleDateString("fr-FR")}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setExpanded(open ? null : r.id)
                                            }
                                            className="font-body text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold"
                                        >
                                            <LuEye />{" "}
                                            {open ? "Réduire" : "Lire"}
                                        </button>
                                        <DeleteBtn
                                            onClick={() => onDelete(r)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Panneau déplié */}
                            {open && r.reviewText && (
                                <div className="border-border/50 bg-popover/40 border-t-2 px-4 py-4 lg:px-6">
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary/45 mt-0.5 text-sm">
                                            “
                                        </span>
                                        <div>
                                            <p className="font-quote text-foreground/90 text-pretty text-base italic leading-relaxed">
                                                {r.reviewText}
                                            </p>
                                            <p className="font-body text-muted-foreground mt-2 text-xs">
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
