import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

    if (isOwnReview) {
        return (
            <div className="flex items-center gap-2">
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{helpfulCount}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <ThumbsDown className="h-4 w-4" />
                    <span>{notHelpfulCount}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleVote(true)}
                disabled={isVoting || isLoadingMyVote}
                className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    currentVote === true
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
                    (isVoting || isLoadingMyVote) && "opacity-50",
                )}
                aria-label="Marquer comme utile"
            >
                <ThumbsUp className="h-4 w-4" />
                <span>{helpfulCount}</span>
            </button>

            <button
                onClick={() => handleVote(false)}
                disabled={isVoting || isLoadingMyVote}
                className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    currentVote === false
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                    (isVoting || isLoadingMyVote) && "opacity-50",
                )}
                aria-label="Marquer comme pas utile"
            >
                <ThumbsDown className="h-4 w-4" />
                <span>{notHelpfulCount}</span>
            </button>
        </div>
    );
}