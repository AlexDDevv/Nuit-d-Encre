import { BookReview } from "@/types/types";
import ReviewVoteButtons from "@/components/sections/book/ReviewVoteButtons";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { Button } from "@/components/UI/Button";
import { Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import RatingStars from "@/components/sections/library/UI/RatingStars";
import { getRatingClasses } from "@/lib/utils";

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
        <article
            className={`bg-card border-2 border-border rounded-xl transition-all duration-200 flex flex-col gap-4 p-5 border-l-4 ${getRatingClasses(review.rating)}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <span className="text-secondary-foreground text-sm font-semibold">
                            {review.user.userName.charAt(0).toUpperCase()}
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
            <RatingStars value={review.rating} readOnly size="sm" />
            {review.reviewText && (
                <p className="font-quote italic text-base text-card-foreground whitespace-pre-wrap leading-relaxed">
                    {review.reviewText}
                </p>
            )}
            <div className="border-t border-border -mx-5 -mb-5 px-5 py-4 bg-muted/40 rounded-b-xl">
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
