import { cn } from "@/lib/utils";
import type { AdminRecentActivity } from "@/types/types";
import { SkeletonRows } from "@/components/sections/admin/ui/feedback";
import RecentUsers from "./dashboard/RecentUsers";
import RecentBooks from "./dashboard/RecentBooks";
import RecentReviews from "./dashboard/RecentReviews";
import XpJournal from "./dashboard/XpJournal";

/** Onglet Dashboard : vue d'ensemble de l'activité récente. */
export function AdminDashboard({
    activity,
    loading,
}: {
    activity?: AdminRecentActivity;
    loading?: boolean;
}) {
    if (loading || !activity) {
        return (
            <div
                className={cn(
                    "grid grid-cols-1 items-start gap-6 lg:grid-cols-2",
                )}
            >
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-xl border-2 border-border bg-card"
                    >
                        <SkeletonRows rows={5} cols={4} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="fade-up grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <RecentUsers users={activity.recentUsers} />
                <RecentReviews reviews={activity.recentReviews} />
            </div>
            <div className="flex flex-col gap-6">
                <RecentBooks books={activity.recentBooks} />
                <XpJournal actions={activity.recentActions} />
            </div>
        </div>
    );
}
