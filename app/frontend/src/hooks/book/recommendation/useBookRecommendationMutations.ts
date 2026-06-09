import { ApolloCache, useMutation } from "@apollo/client";
import {
    TOGGLE_BOOK_RECOMMENDATION,
    DELETE_BOOK_RECOMMENDATION,
    GET_BOOK_RECOMMENDATION,
} from "@/graphql/book/book-recommendation";

/**
 * Hook providing all GraphQL mutations related to book recommendations.
 *
 * @description
 * This hook encapsulates the logic for toggling (creating/removing) and deleting book recommendations.
 * It uses Apollo Client's `useMutation` and exposes loading states,
 * errors, as well as functions to reset them.
 *
 * @returns {Object} An object containing mutation functions and their states.
 * - toggleBookRecommendation(bookId: string): Promise<{ recommendation: any, action: string } | undefined>
 * - isTogglingBookRecommendation: boolean
 * - toggleBookRecommendationError: ApolloError | undefined
 * - resetToggleBookRecommendationError(): void
 * - deleteBookRecommendation(bookId: string): Promise<void>
 * - isDeletingBookRecommendation: boolean
 * - deleteBookRecommendationError: ApolloError | undefined
 * - resetDeleteBookRecommendationError(): void
 *
 * @example
 * ```ts
 * import { useBookRecommendationMutations } from "@/hooks/...";
 *
 * const {
 *   toggleBookRecommendation,
 *   isTogglingBookRecommendation,
 *   toggleBookRecommendationError,
 *   resetToggleBookRecommendationError,
 *   deleteBookRecommendation,
 *   isDeletingBookRecommendation,
 *   deleteBookRecommendationError,
 *   resetDeleteBookRecommendationError,
 * } = useBookRecommendationMutations();
 *
 * // Toggle a book recommendation (create or remove)
 * const result = await toggleBookRecommendation("bookId123");
 * console.log(result?.action); // "CREATED" or "DELETED"
 *
 * // Delete a book recommendation
 * await deleteBookRecommendation("bookId123");
 * ```
 */

export function useBookRecommendationMutations() {
    // ************************ TOGGLE ************************
    const [
        toggleBookRecommendationMutation,
        {
            loading: isTogglingBookRecommendation,
            error: toggleBookRecommendationError,
            reset: resetToggleBookRecommendationError,
        },
    ] = useMutation(TOGGLE_BOOK_RECOMMENDATION, {
        refetchQueries: [GET_BOOK_RECOMMENDATION],
        update(cache: ApolloCache<unknown>, { data }, { variables }) {
            const action = data?.toggleBookRecommendation?.action;
            const bookId = variables?.data?.bookId;
            if (!action || !bookId) return;

            cache.modify({
                id: cache.identify({ __typename: "Book", id: bookId }),
                fields: {
                    recommendationCount: (existing = 0) =>
                        action === "created" ? existing + 1 : Math.max(0, existing - 1),
                },
            });
        },
    });

    const toggleBookRecommendation = async (
        bookId: string,
    ): Promise<{ recommendation: unknown; action: string } | undefined> => {
        const result = await toggleBookRecommendationMutation({
            variables: { data: { bookId } },
        });
        return result.data?.toggleBookRecommendation;
    };

    // ************************ DELETE ************************
    const [
        deleteBookRecommendationMutation,
        {
            loading: isDeletingBookRecommendation,
            error: deleteBookRecommendationError,
            reset: resetDeleteBookRecommendationError,
        },
    ] = useMutation(DELETE_BOOK_RECOMMENDATION, {
        refetchQueries: [GET_BOOK_RECOMMENDATION],
    });

    const deleteBookRecommendation = async (bookId: string) => {
        await deleteBookRecommendationMutation({
            variables: { bookId },
        });
    };

    return {
        // toggle
        toggleBookRecommendation,
        isTogglingBookRecommendation,
        toggleBookRecommendationError,
        resetToggleBookRecommendationError,

        // delete
        deleteBookRecommendation,
        isDeletingBookRecommendation,
        deleteBookRecommendationError,
        resetDeleteBookRecommendationError,
    };
}
