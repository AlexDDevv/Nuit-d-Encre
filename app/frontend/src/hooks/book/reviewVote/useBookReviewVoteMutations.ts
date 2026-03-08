import {
    CreateBookReviewVoteInput,
    BookReviewVoteResult,
    BookReviewVote,
} from "@/types/types";
import { useMutation } from "@apollo/client";
import {
    VOTE_ON_REVIEW,
    REMOVE_VOTE_ON_REVIEW,
    TOGGLE_HELPFUL_VOTE,
    GET_MY_VOTE_ON_REVIEW,
} from "@/graphql/book/book-review-vote";

/**
 * Hook providing all GraphQL mutations related to review votes.
 *
 * @description
 * This hook encapsulates the logic for voting on reviews, removing votes,
 * and toggling helpful votes. It uses Apollo Client's `useMutation` and
 * exposes loading states, errors, as well as functions to reset them.
 * Automatically refetches relevant queries after mutations.
 *
 * @returns {Object} An object containing mutation functions and their states.
 * - voteOnReview(vote: CreateBookReviewVoteInput): Promise<BookReviewVoteResult | undefined>
 * - isVoting: boolean
 * - voteError: ApolloError | undefined
 * - resetVoteError(): void
 * - removeVote(reviewId: string): Promise<BookReviewVote | null | undefined>
 * - isRemovingVote: boolean
 * - removeVoteError: ApolloError | undefined
 * - resetRemoveVoteError(): void
 * - toggleHelpful(reviewId: string): Promise<BookReviewVoteResult | undefined>
 * - isTogglingHelpful: boolean
 * - toggleHelpfulError: ApolloError | undefined
 * - resetToggleHelpfulError(): void
 *
 * @example
 * ```ts
 * import { useBookReviewVoteMutations } from "@/hooks/book/useBookReviewVoteMutations";
 *
 * const {
 *   voteOnReview,
 *   isVoting,
 *   voteError,
 *   resetVoteError,
 *   removeVote,
 *   isRemovingVote,
 *   removeVoteError,
 *   resetRemoveVoteError,
 *   toggleHelpful,
 *   isTogglingHelpful,
 *   toggleHelpfulError,
 *   resetToggleHelpfulError,
 * } = useBookReviewVoteMutations();
 *
 * // Vote on a review (helpful or not)
 * const result = await voteOnReview({
 *   reviewId: 1,
 *   isHelpful: true,
 * });
 * console.log(result?.action); // "created" or "updated"
 *
 * // Toggle helpful vote (simpler for "thumbs up" buttons)
 * await toggleHelpful("123");
 *
 * // Remove a vote
 * await removeVote("123");
 * ```
 */

export function useBookReviewVoteMutations() {
    // ************************ VOTE (UPSERT) ************************
    const [
        voteOnReviewMutation,
        { loading: isVoting, error: voteError, reset: resetVoteError },
    ] = useMutation(VOTE_ON_REVIEW, {
        refetchQueries: [{ query: GET_MY_VOTE_ON_REVIEW }],
        update(cache, { data }) {
            const review = data?.voteOnReview?.vote?.review;
            if (!review) return;
            cache.modify({
                id: cache.identify({ __typename: "BookReview", id: review.id }),
                fields: {
                    helpfulCount: () => review.helpfulCount,
                    notHelpfulCount: () => review.notHelpfulCount,
                },
            });
        },
    });

    const voteOnReview = async (
        vote: CreateBookReviewVoteInput,
    ): Promise<BookReviewVoteResult | undefined> => {
        const result = await voteOnReviewMutation({
            variables: { data: vote },
        });
        return result.data?.voteOnReview;
    };

    // ************************ REMOVE VOTE ************************
    const [
        removeVoteOnReviewMutation,
        {
            loading: isRemovingVote,
            error: removeVoteError,
            reset: resetRemoveVoteError,
        },
    ] = useMutation(REMOVE_VOTE_ON_REVIEW, {
        refetchQueries: [{ query: GET_MY_VOTE_ON_REVIEW }],
        update(cache, { data }) {
            const review = data?.removeVoteOnReview?.review;
            if (!review) return;
            cache.modify({
                id: cache.identify({ __typename: "BookReview", id: review.id }),
                fields: {
                    helpfulCount: () => review.helpfulCount,
                    notHelpfulCount: () => review.notHelpfulCount,
                },
            });
        },
    });

    const removeVote = async (
        reviewId: string,
    ): Promise<BookReviewVote | null | undefined> => {
        const result = await removeVoteOnReviewMutation({
            variables: { reviewId },
        });
        return result.data?.removeVoteOnReview;
    };

    // ************************ TOGGLE HELPFUL ************************
    const [
        toggleHelpfulVoteMutation,
        {
            loading: isTogglingHelpful,
            error: toggleHelpfulError,
            reset: resetToggleHelpfulError,
        },
    ] = useMutation(TOGGLE_HELPFUL_VOTE, {
        refetchQueries: [{ query: GET_MY_VOTE_ON_REVIEW }],
        update(cache, { data }) {
            const review = data?.toggleHelpfulVote?.vote?.review;
            if (!review) return;
            cache.modify({
                id: cache.identify({ __typename: "BookReview", id: review.id }),
                fields: {
                    helpfulCount: () => review.helpfulCount,
                    notHelpfulCount: () => review.notHelpfulCount,
                },
            });
        },
    });

    const toggleHelpful = async (
        reviewId: string,
    ): Promise<BookReviewVoteResult | undefined> => {
        const result = await toggleHelpfulVoteMutation({
            variables: { reviewId },
        });
        return result.data?.toggleHelpfulVote;
    };

    return {
        // vote (upsert)
        voteOnReview,
        isVoting,
        voteError,
        resetVoteError,

        // remove vote
        removeVote,
        isRemovingVote,
        removeVoteError,
        resetRemoveVoteError,

        // toggle helpful
        toggleHelpful,
        isTogglingHelpful,
        toggleHelpfulError,
        resetToggleHelpfulError,
    };
}
