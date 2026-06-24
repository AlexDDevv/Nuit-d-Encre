import { useMemo } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { BookReview } from "@/types/types";
import ReviewVoteButtons from "@/components/sections/book/ReviewVoteButtons";
import RatingStars from "@/components/sections/library/UI/RatingStars";
import Button from "@/components/UI/Button/Button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/hooks/auth/useAuthContext";

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

    const initials = review.user.userName.slice(0, 2).toUpperCase();
    const timeAgo = useMemo(
        () =>
            formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: fr,
            }),
        [review.createdAt],
    );

    return (
        <article
            className={cn(
                "flex flex-col gap-3.5 rounded-xl border-2 p-5 transition-colors duration-200",
                isOwnReview
                    ? "border-primary/45 bg-[hsl(43_30%_25%/0.18)]"
                    : "border-border bg-card/60 hover:border-primary/40",
            )}
        >
            <div className="flex items-start gap-3.5">
                {/* monogramme */}
                <span className="text-primary font-quote grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_26%,hsl(43_30%_31%),hsl(20_3%_13%)_82%)] text-lg shadow-[inset_0_0_0_1px_hsl(43_59%_81%/0.28)]">
                    {initials}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="text-foreground font-title text-sm font-medium">
                            {review.user.userName}
                        </span>
                        {isOwnReview && (
                            <span className="border-primary/35 bg-primary/15 text-primary rounded-full border px-2 py-px font-mono text-xxs uppercase tracking-[0.16em]">
                                Votre critique
                            </span>
                        )}
                    </div>
                    <div className="mt-1 flex items-center gap-2.5">
                        <RatingStars value={review.rating} readOnly size="sm" />
                        <span className="text-muted-foreground font-body text-xs">
                            {timeAgo}
                        </span>
                    </div>
                </div>

                {/* actions propriétaire */}
                {isOwnReview && (onEdit || onDelete) && (
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => onEdit(review)}
                                ariaLabel="Modifier ma critique"
                                icon={<LuPencil />}
                            />
                        )}
                        {onDelete && (
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => onDelete(review.id)}
                                loading={isDeletingReview}
                                disabled={isDeletingReview}
                                ariaLabel="Supprimer ma critique"
                                icon={<LuTrash2 />}
                            />
                        )}
                    </div>
                )}
            </div>

            {review.reviewText && (
                <p className="text-foreground/85 font-quote italic whitespace-pre-wrap">
                    {review.reviewText}
                </p>
            )}

            <div className="mt-auto">
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
