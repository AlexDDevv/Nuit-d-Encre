import { BookReviewVote } from "@/types/types";
import { useQuery } from "@apollo/client";
import { GET_MY_VOTE_ON_REVIEW } from "@/graphql/book/book-review-vote";

/**
 * Hook to fetch the current user's vote on a specific review.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch the authenticated user's vote
 * on a given review. Useful for displaying the current vote state in the UI
 * (e.g., highlighting the "helpful" button if the user voted helpful).
 * If `reviewId` is not provided, the query is skipped.
 *
 * @param {string} reviewId - ID of the review to check the vote for
 * @returns {Object} An object containing vote data and query state
 *
 * @property {BookReviewVote | null | undefined} myVote - The user's vote object, null if no vote exists, or undefined if loading
 * @property {boolean} isLoadingMyVote - Loading state of the query
 * @property {Error | undefined} myVoteError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchMyVote - Function to manually refetch the vote data
 *
 * @example
 * ```ts
 * const { myVote, isLoadingMyVote, myVoteError, refetchMyVote } = useMyVoteOnReview("123");
 *
 * if (isLoadingMyVote) return <p>Loading...</p>;
 * if (myVoteError) return <p>Error: {myVoteError.message}</p>;
 *
 * if (!myVote) {
 *   return <p>You haven't voted on this review yet.</p>;
 * }
 *
 * return (
 *   <div>
 *     <p>Your vote: {myVote.isHelpful ? "Helpful" : "Not Helpful"}</p>
 *     <button onClick={() => refetchMyVote()}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useMyVoteOnReview(reviewId?: string) {
    const {
        data: myVoteData,
        loading: isLoadingMyVote,
        error: myVoteError,
        refetch: refetchMyVote,
    } = useQuery<{ myVoteOnReview: BookReviewVote | null }>(
        GET_MY_VOTE_ON_REVIEW,
        {
            variables: { reviewId },
            skip: !reviewId,
        },
    );

    return {
        myVote: myVoteData?.myVoteOnReview,
        isLoadingMyVote,
        myVoteError,
        refetchMyVote,
    };
}
