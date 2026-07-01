import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Button from "@/components/UI/Button/Button";
import UserLink from "@/components/sections/profile/UserLink";
import ReviewCommentForm from "@/components/sections/book/ReviewCommentForm";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useBookReviewCommentMutations } from "@/hooks/book/reviewComment/useBookReviewCommentMutations";
import { useToast } from "@/hooks/toast/useToast";
import { parseGraphQLError } from "@/utils/graphql-error";
import { ReviewCommentsProps } from "@/types/types";

export default function ReviewComments({
    reviewId,
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
        <div className="flex flex-col gap-3">
            <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="text-muted-foreground hover:text-primary self-start text-xs transition-colors"
            >
                {commentCount > 0
                    ? `${commentCount} commentaire${commentCount > 1 ? "s" : ""}`
                    : "Commenter"}
            </button>

            {expanded && (
                <div className="flex flex-col gap-3">
                    {comments.map((comment) => {
                        const canDelete =
                            !!user &&
                            (user.id === comment.user.id ||
                                user.role === "admin");

                        return (
                            <div
                                key={comment.id}
                                className="flex items-start justify-between gap-3"
                            >
                                <div className="flex flex-col gap-1">
                                    <UserLink
                                        id={comment.user.id}
                                        userName={comment.user.userName}
                                        size="sm"
                                    />
                                    <p className="text-foreground/85 text-sm whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                    <span className="text-muted-foreground text-xxs">
                                        {formatDistanceToNow(
                                            new Date(comment.createdAt),
                                            { addSuffix: true, locale: fr },
                                        )}
                                    </span>
                                </div>
                                {canDelete && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(comment.id)}
                                        loading={
                                            isDeletingComment &&
                                            deletingId === comment.id
                                        }
                                        disabled={isDeletingComment}
                                        ariaLabel="Supprimer ce commentaire"
                                        icon={<LuTrash2 />}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {user && <ReviewCommentForm reviewId={reviewId} />}
                </div>
            )}
        </div>
    );
}
