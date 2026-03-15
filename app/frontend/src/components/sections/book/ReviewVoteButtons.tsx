import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/toast/useToast";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useBookReviewVoteMutations } from "@/hooks/book/reviewVote/useBookReviewVoteMutations";
import { useMyVoteOnReview } from "@/hooks/book/reviewVote/useBookReviewVoteData";
import { parseGraphQLError } from "@/utils/graphql-error";

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
    const { voteOnReview, isVoting, removeVote, isRemovingVote } =
        useBookReviewVoteMutations();

    const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
    const [notHelpfulCount, setNotHelpfulCount] = useState(
        initialNotHelpfulCount,
    );
    const [currentVote, setCurrentVote] = useState<boolean | null>(null);

    useEffect(() => {
        if (myVote) {
            setCurrentVote(myVote.isHelpful);
        }
    }, [myVote]);

    const isDisabled =
        isOwnReview || isVoting || isRemovingVote || isLoadingMyVote;

    const getVoteButtonClasses = (
        isActive: boolean,
        activeClass: string,
        hoverClass: string,
    ) =>
        cn(
            isActive
                ? activeClass
                : cn(
                      "bg-muted border-muted text-muted-foreground",
                      !isOwnReview && hoverClass,
                  ),
            isDisabled && "opacity-50",
        );

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

        try {
            const previousVote = currentVote;

            if (previousVote === isHelpful) {
                // Removing vote
                if (isHelpful) {
                    setHelpfulCount((prev) => prev - 1);
                } else {
                    setNotHelpfulCount((prev) => prev - 1);
                }
                setCurrentVote(null);
                await removeVote(reviewId);
            } else {
                // Optimistic update
                if (previousVote === null) {
                    // Creating new vote
                    if (isHelpful) {
                        setHelpfulCount((prev) => prev + 1);
                    } else {
                        setNotHelpfulCount((prev) => prev + 1);
                    }
                } else {
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
            }
        } catch (error) {
            // Revert optimistic update on error
            setHelpfulCount(initialHelpfulCount);
            setNotHelpfulCount(initialNotHelpfulCount);
            setCurrentVote(currentVote);

            const { title, description } = parseGraphQLError(error, "voteOnReview");
            showToast({ type: "error", title, description });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={() => handleVote(true)}
                disabled={isDisabled}
                ariaLabel="Marquer comme utile"
                size="sm"
                className={getVoteButtonClasses(
                    currentVote === true,
                    "bg-primary border-primary text-primary-foreground",
                    "hover:bg-primary/10 hover:border-primary/10 hover:text-primary",
                )}
            >
                <ThumbsUp className="h-4 w-4" />
                <span>{helpfulCount}</span>
            </Button>
            <Button
                onClick={() => handleVote(false)}
                disabled={isDisabled}
                ariaLabel="Marquer comme pas utile"
                size="sm"
                className={getVoteButtonClasses(
                    currentVote === false,
                    "bg-destructive border-destructive text-destructive-foreground",
                    "hover:bg-destructive/10 hover:border-destructive/10 hover:text-destructive",
                )}
            >
                <ThumbsDown className="h-4 w-4" />
                <span>{notHelpfulCount}</span>
            </Button>
        </div>
    );
}
