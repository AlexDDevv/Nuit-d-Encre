import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/toast/useToast";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useBookReviewVoteMutations } from "@/hooks/book/reviewVote/useBookReviewVoteMutations";
import { useMyVoteOnReview } from "@/hooks/book/reviewVote/useBookReviewVoteData";

interface ReviewVoteButtonsProps {
    reviewId: string;
    initialHelpfulCount: number;
    initialNotHelpfulCount: number;
    isOwnReview?: boolean;
}

export default function ReviewVoteButtons({
    reviewId,
    initialHelpfulCount,
    initialNotHelpfulCount,
    isOwnReview = false,
}: ReviewVoteButtonsProps) {
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const { myVote, isLoadingMyVote } = useMyVoteOnReview(reviewId);
    const { voteOnReview, isVoting } = useBookReviewVoteMutations();

    const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
    const [notHelpfulCount, setNotHelpfulCount] = useState(
        initialNotHelpfulCount,
    );
    const [currentVote, setCurrentVote] = useState<boolean | null>(null);

    // Update local state when vote data loads
    useEffect(() => {
        if (myVote) {
            setCurrentVote(myVote.isHelpful);
        }
    }, [myVote]);

    const handleVote = async (isHelpful: boolean) => {
        if (!user) {
            showToast({
                type: "error",
                title: "Connexion requise",
                description:
                    "Vous devez être connecté pour voter sur une critique.",
            });
            return;
        }

        if (isOwnReview) {
            showToast({
                type: "error",
                title: "Action non autorisée",
                description: "Vous ne pouvez pas voter sur votre propre critique.",
            });
            return;
        }

        try {
            const previousVote = currentVote;

            // Optimistic update
            if (previousVote === null) {
                // Creating new vote
                if (isHelpful) {
                    setHelpfulCount((prev) => prev + 1);
                } else {
                    setNotHelpfulCount((prev) => prev + 1);
                }
            } else if (previousVote !== isHelpful) {
                // Changing vote
                if (isHelpful) {
                    setHelpfulCount((prev) => prev + 1);
                    setNotHelpfulCount((prev) => prev - 1);
                } else {
                    setHelpfulCount((prev) => prev - 1);
                    setNotHelpfulCount((prev) => prev + 1);
                }
            }

            setCurrentVote(isHelpful);

            await voteOnReview({
                reviewId: Number(reviewId),
                isHelpful,
            });
        } catch (error) {
            // Revert optimistic update on error
            setHelpfulCount(initialHelpfulCount);
            setNotHelpfulCount(initialNotHelpfulCount);
            setCurrentVote(currentVote);

            showToast({
                type: "error",
                title: "Erreur",
                description: "Impossible d'enregistrer votre vote. Veuillez réessayer.",
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={() => handleVote(true)}
                disabled={isOwnReview || isVoting || isLoadingMyVote}
                ariaLabel="Marquer comme utile"
                size="sm"
                className={cn(
                    currentVote === true
                        ? "bg-primary border-primary text-primary-foreground"
                        : isOwnReview
                            ? "bg-muted border-muted text-muted-foreground"
                            : "bg-muted border-muted text-muted-foreground hover:bg-primary/10 hover:border-primary/10 hover:text-primary",
                    (isOwnReview || isVoting || isLoadingMyVote) && "opacity-50",
                )}
            >
                <ThumbsUp className="h-4 w-4" />
                <span>{helpfulCount}</span>
            </Button>
            <Button
                onClick={() => handleVote(false)}
                disabled={isOwnReview || isVoting || isLoadingMyVote}
                ariaLabel="Marquer comme pas utile"
                size="sm"
                className={cn(
                    currentVote === false
                        ? "bg-destructive border-destructive text-destructive-foreground"
                        : isOwnReview
                            ? "bg-muted border-muted text-muted-foreground"
                            : "bg-muted border-muted text-muted-foreground hover:bg-destructive/10 hover:border-destructive/10 hover:text-destructive",
                    (isOwnReview || isVoting || isLoadingMyVote) && "opacity-50",
                )}
            >
                <ThumbsDown className="h-4 w-4" />
                <span>{notHelpfulCount}</span>
            </Button>
        </div>
    );
}