import { CreateBookReviewInput, UpdateBookReviewInput } from "@/types/types";
import { useMutation } from "@apollo/client";
import {
    CREATE_BOOK_REVIEW,
    UPDATE_BOOK_REVIEW,
    DELETE_BOOK_REVIEW,
} from "@/graphql/book/book-review";

/**
 * Hook providing all GraphQL mutations related to book reviews.
 *
 * @description
 * This hook encapsulates the logic for creating, updating, and deleting book reviews.
 * It uses Apollo Client's `useMutation` and exposes loading states,
 * errors, as well as functions to reset them.
 * Automatically refetches relevant queries after mutations.
 *
 * @returns {Object} An object containing mutation functions and their states.
 * - createReview(review: CreateBookReviewInput): Promise<{ id: string } | undefined>
 * - isCreatingReview: boolean
 * - createReviewError: ApolloError | undefined
 * - resetCreateReviewError(): void
 * - updateReview(id: string, review: Omit<UpdateBookReviewInput, "id">): Promise<any>
 * - isUpdatingReview: boolean
 * - updateReviewError: ApolloError | undefined
 * - resetUpdateReviewError(): void
 * - deleteReview(reviewId: string): Promise<void>
 * - isDeletingReview: boolean
 * - deleteReviewError: ApolloError | undefined
 * - resetDeleteReviewError(): void
 *
 * @example
 * ```ts
 * import { useBookReviewMutations } from "@/hooks/book/useBookReviewMutations";
 *
 * const {
 *   createReview,
 *   isCreatingReview,
 *   createReviewError,
 *   resetCreateReviewError,
 *   updateReview,
 *   isUpdatingReview,
 *   updateReviewError,
 *   resetUpdateReviewError,
 *   deleteReview,
 *   isDeletingReview,
 *   deleteReviewError,
 *   resetDeleteReviewError,
 * } = useBookReviewMutations();
 *
 * // Create a review
 * const created = await createReview({
 *   bookId: 1,
 *   rating: 5,
 *   reviewText: "Absolutely loved this book!",
 * });
 * console.log(created?.id);
 *
 * // Update a review
 * await updateReview("123", { rating: 4, reviewText: "Still good, but..." });
 *
 * // Delete a review
 * await deleteReview("123");
 * ```
 */

export function useBookReviewMutations() {
    // ************************ CREATE ************************
    const [
        createReviewMutation,
        {
            loading: isCreatingReview,
            error: createReviewError,
            reset: resetCreateReviewError,
        },
    ] = useMutation(CREATE_BOOK_REVIEW, {
        refetchQueries: ["BookReviews", "MyBookReview"],
    });

    const createReview = async (
        review: CreateBookReviewInput,
    ): Promise<{ id: string } | undefined> => {
        const result = await createReviewMutation({
            variables: { data: review },
        });
        return result.data?.createBookReview;
    };

    // ************************ UPDATE ************************
    const [
        updateReviewMutation,
        {
            loading: isUpdatingReview,
            error: updateReviewError,
            reset: resetUpdateReviewError,
        },
    ] = useMutation(UPDATE_BOOK_REVIEW, {
        refetchQueries: ["BookReviews", "MyBookReview"],
    });

    const updateReview = async (
        id: string,
        review: Omit<UpdateBookReviewInput, "id">,
    ) => {
        const result = await updateReviewMutation({
            variables: {
                data: {
                    ...review,
                    id: Number(id),
                },
            },
        });
        return result.data?.updateBookReview;
    };

    // ************************ DELETE ************************
    const [
        deleteReviewMutation,
        {
            loading: isDeletingReview,
            error: deleteReviewError,
            reset: resetDeleteReviewError,
        },
    ] = useMutation(DELETE_BOOK_REVIEW, {
        refetchQueries: ["BookReviews", "MyBookReview"],
    });

    const deleteReview = async (reviewId: string) => {
        await deleteReviewMutation({
            variables: { id: reviewId },
        });
    };

    return {
        // create
        createReview,
        isCreatingReview,
        createReviewError,
        resetCreateReviewError,

        // update
        updateReview,
        isUpdatingReview,
        updateReviewError,
        resetUpdateReviewError,

        // delete
        deleteReview,
        isDeletingReview,
        deleteReviewError,
        resetDeleteReviewError,
    };
}
