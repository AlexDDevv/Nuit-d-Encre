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
        <DashBlock icon={LuSquarePen} title="Critiques récentes" meta="5 dernières">
            <ul className="divide-y-2 divide-border/55">
                {reviews.map((r) => (
                    <li
                        key={r.id}
                        className="px-5 py-3.5 transition-colors hover:bg-muted/25"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <span className="block truncate font-quote text-base text-foreground">
                                    « {r.book.title} »
                                </span>
                                <span className="font-body text-xs text-muted-foreground">
                                    par{" "}
                                    <span className="text-foreground/75">
                                        {r.user.userName}
                                    </span>{" "}
                                    · {formatDate(r.createdAt)}
                                </span>
                            </div>
                            <NoteBadge note={r.rating} />
                        </div>
                        {r.reviewText && (
                            <p className="mt-1.5 line-clamp-2 font-body text-sm italic leading-snug text-muted-foreground/90">
                                {r.reviewText}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </DashBlock>
    );
}
