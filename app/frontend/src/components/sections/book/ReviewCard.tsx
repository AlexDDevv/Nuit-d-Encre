import { BookReview } from "@/types/types";
import ReviewVoteButtons from "@/components/sections/book/ReviewVoteButtons";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { Button } from "@/components/UI/Button";
import { Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import RatingStars from "@/components/sections/library/UI/RatingStars";

interface ReviewCardProps {
    review: BookReview;
    onEdit?: (review: BookReview) => void;
    onDelete?: (reviewId: string) => void;
    isDeletingReview?: boolean;
}

export default function ReviewCard({
    review,
    onEdit,
    onDelete,
    isDeletingReview,
}: ReviewCardProps) {
    const { user } = useAuthContext();
    const isOwnReview = user?.id === review.user.id;

    const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
        addSuffix: true,
        locale: fr,
    });

    return (
        <article className="border-border bg-card flex flex-col gap-4 rounded-lg border p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        <span className="text-muted-foreground text-sm font-semibold">
                            {review.user.userName
                                .charAt(0)
                                .toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-foreground font-semibold">
                            {review.user.userName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                            {timeAgo}
                        </p>
                    </div>
                </div>

                {/* Actions for own review */}
                {isOwnReview && (
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onEdit(review)}
                                ariaLabel="Modifier ma critique"
                                className="h-8 w-8 p-0"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(review.id)}
                                loading={isDeletingReview}
                                disabled={isDeletingReview}
                                ariaLabel="Supprimer ma critique"
                                className="h-8 w-8 p-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Rating */}
            <RatingStars value={review.rating} readOnly size="sm" />

            {/* Review text */}
            {review.reviewText && (
                <p className="text-secondary-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {review.reviewText}
                </p>
            )}

            {/* Vote buttons */}
            <div className="border-border flex items-center gap-4 border-t pt-4">
                <ReviewVoteButtons
                    reviewId={review.id}
                    initialHelpfulCount={review.helpfulCount || 0}
                    initialNotHelpfulCount={review.notHelpfulCount || 0}
                    isOwnReview={isOwnReview}
                />
            </div>
        </article>
    );
}