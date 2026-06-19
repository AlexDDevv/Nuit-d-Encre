import { useState } from "react";
import { useAdminReviews } from "@/hooks/admin/useAdminReviews";
import { useAdminMutations } from "@/hooks/admin/useAdminMutations";
import { usePagination } from "@/hooks/admin/usePagination";
import { useToast } from "@/hooks/toast/useToast";
import type { AdminReviewRow } from "@/types/types";
import Pagination from "@/components/UI/Pagination";
import { EmptyState, SkeletonRows } from "@/components/sections/admin/ui/feedback";
import { ConfirmDialog } from "@/components/sections/admin/ui/ConfirmDialog";
import ReviewsTable from "../reviews/ReviewsTable";

/** Onglet Critiques : liste triée par date, dépliage inline et suppression. */
export function ReviewsTab() {
    const { reviews, isLoadingReviews } = useAdminReviews();
    const { deleteReview, isDeletingReview } = useAdminMutations();
    const { showToast } = useToast();

    const [expanded, setExpanded] = useState<string | null>(null);
    const [pending, setPending] = useState<AdminReviewRow | null>(null);
    const { page, setPage, slice, perPage } = usePagination(reviews, 20);

    const confirmDelete = async () => {
        if (!pending) return;
        try {
            await deleteReview(pending.id);
            showToast({
                type: "success",
                title: "Critique supprimée",
                description: `La critique de ${pending.user.userName} a été supprimée.`,
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Suppression impossible",
                description: (error as Error).message,
            });
        } finally {
            setPending(null);
        }
    };

    return (
        <section className="fade-up">
            {isLoadingReviews ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <SkeletonRows rows={8} cols={6} />
                </div>
            ) : reviews.length === 0 ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <EmptyState
                        message="Aucune critique"
                        hint="Les critiques publiées apparaîtront ici."
                    />
                </div>
            ) : (
                <>
                    <ReviewsTable
                        reviews={slice}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        onDelete={setPending}
                    />
                    <Pagination
                        currentPage={page}
                        totalCount={reviews.length}
                        perPage={perPage}
                        onPageChange={setPage}
                        className="my-6"
                    />
                </>
            )}

            <ConfirmDialog
                open={!!pending}
                onCancel={() => setPending(null)}
                onConfirm={confirmDelete}
                loading={isDeletingReview}
                title="Supprimer cette critique ?"
                confirmLabel="Supprimer la critique"
            >
                {pending && (
                    <>
                        La critique de{" "}
                        <span className="font-bold text-foreground">
                            {pending.user.userName}
                        </span>{" "}
                        sur «{" "}
                        <span className="font-quote text-foreground">
                            {pending.book.title}
                        </span>{" "}
                        » sera supprimée.
                    </>
                )}
            </ConfirmDialog>
        </section>
    );
}
