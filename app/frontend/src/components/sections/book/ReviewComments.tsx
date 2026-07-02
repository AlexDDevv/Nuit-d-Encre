import { useState } from "react";
import ReviewThreadToggle from "@/components/sections/book/ReviewThreadToggle";
import ReviewCommentItem from "@/components/sections/book/ReviewCommentItem";
import ReviewCommentForm from "@/components/sections/book/ReviewCommentForm";
import ReviewCommentLoginInvite from "@/components/sections/book/ReviewCommentLoginInvite";
import { SectionSeparator } from "@/components/sections/shared/ornaments";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useBookReviewCommentMutations } from "@/hooks/book/reviewComment/useBookReviewCommentMutations";
import { useToast } from "@/hooks/toast/useToast";
import { parseGraphQLError } from "@/utils/graphql-error";
import { cn } from "@/lib/utils";
import { ReviewCommentsProps } from "@/types/types";

export default function ReviewComments({
    reviewId,
    reviewAuthorId,
    comments,
    commentCount,
}: ReviewCommentsProps) {
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const { deleteComment, isDeletingComment } =
        useBookReviewCommentMutations();
    const [expanded, setExpanded] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (commentId: string) => {
        try {
            setDeletingId(commentId);
            await deleteComment(reviewId, commentId);
        } catch (error) {
            const { title, description } = parseGraphQLError(
                error,
                "deleteBookReviewComment",
            );
            showToast({ type: "error", title, description });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col">
            <SectionSeparator className="my-4" />
            <ReviewThreadToggle
                count={commentCount}
                open={expanded}
                onToggle={() => setExpanded((prev) => !prev)}
            />

            <div
                className={cn(
                    "grid transition-all duration-300 ease-out",
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="overflow-hidden">
                    <div className="mt-2 flex flex-col gap-4">
                        {comments.length > 0 ? (
                            <ul className="relative flex flex-col gap-5">
                                {/* Fil vertical doré discret reliant les monogrammes */}
                                <span
                                    aria-hidden="true"
                                    className="bg-primary/15 pointer-events-none absolute bottom-4 left-4 top-4 w-px"
                                />
                                {comments.map((comment) => (
                                    <ReviewCommentItem
                                        key={comment.id}
                                        comment={comment}
                                        isReviewAuthor={
                                            comment.user.id === reviewAuthorId
                                        }
                                        canDelete={
                                            !!user &&
                                            (user.id === comment.user.id ||
                                                user.role === "admin")
                                        }
                                        isDeleting={
                                            isDeletingComment &&
                                            deletingId === comment.id
                                        }
                                        disabled={isDeletingComment}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground font-quote px-1 py-1 text-sm italic">
                                Aucun commentaire pour l'instant - soyez le
                                premier à réagir.
                            </p>
                        )}

                        {user ? (
                            <ReviewCommentForm reviewId={reviewId} />
                        ) : (
                            <ReviewCommentLoginInvite />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
