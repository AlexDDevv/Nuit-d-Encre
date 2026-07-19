import { LuSquarePen } from "react-icons/lu";
import type { AdminRecentActivity } from "@/types/types";
import { NoteBadge } from "@/components/sections/admin/ui/chips";
import { formatDate } from "@/components/sections/admin/adminFormat";
import DashBlock from "./DashBlock";

export default function RecentReviews({
    reviews,
}: {
    reviews: AdminRecentActivity["recentReviews"];
}) {
    return (
        <DashBlock
            icon={LuSquarePen}
            title="Critiques récentes"
            meta="5 dernières"
        >
            <ul className="divide-border/55 divide-y-2">
                {reviews.map((r) => (
                    <li
                        key={r.id}
                        className="hover:bg-muted/25 px-5 py-3.5 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <span className="font-quote text-foreground block truncate text-base">
                                    « {r.book.title} »
                                </span>
                                <span className="font-body text-muted-foreground text-xs">
                                    par{" "}
                                    <span className="text-foreground/75">
                                        {r.user?.userName ?? "Lecteur supprimé"}
                                    </span>{" "}
                                    · {formatDate(r.createdAt)}
                                </span>
                            </div>
                            <NoteBadge note={r.rating} />
                        </div>
                        {r.reviewText && (
                            <p className="font-body text-muted-foreground/90 mt-1.5 line-clamp-2 text-sm italic leading-snug">
                                {r.reviewText}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </DashBlock>
    );
}
