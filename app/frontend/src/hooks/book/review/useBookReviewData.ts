import { BookReview } from "@/types/types";
import { useQuery } from "@apollo/client";
import {
    GET_BOOK_REVIEW,
    GET_MY_BOOK_REVIEW,
} from "@/graphql/book/book-review";

/**
 * Hook to fetch a single book review by its ID.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch a specific review's details.
 * If `reviewId` is not provided, the query is skipped.
 *
 * @param {string} reviewId - ID of the review to fetch
 * @returns {Object} An object containing review data and query state
 *
 * @property {BookReview | undefined} review - The review object returned by the query, or undefined if not loaded
 * @property {boolean} isLoadingReview - Loading state of the query
 * @property {Error | undefined} reviewError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchReview - Function to manually refetch the review data
 *
 * @example
 * ```ts
 * const { review, isLoadingReview, reviewError, refetchReview } = useBookReviewData("123");
 *
 * if (isLoadingReview) return <p>Loading...</p>;
 * if (reviewError) return <p>Error: {reviewError.message}</p>;
 *
 * return (
 *   <div>
 *     <p>Rating: {review?.rating}</p>
 *     <p>{review?.reviewText}</p>
 *     <button onClick={() => refetchReview()}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useBookReviewData(reviewId?: string) {
    const {
        data: reviewData,
        loading: isLoadingReview,
        error: reviewError,
        refetch: refetchReview,
    } = useQuery<{ bookReview: BookReview }>(GET_BOOK_REVIEW, {
        variables: { id: reviewId },
        skip: !reviewId,
    });

    return {
        review: reviewData?.bookReview,
        isLoadingReview,
        reviewError,
        refetchReview,
    };
}

/**
 * Hook to fetch the current user's review for a specific book.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch the authenticated user's review
 * for a given book. Useful for checking if the user has already reviewed a book
 * and for pre-filling edit forms.
 * If `bookId` is not provided, the query is skipped.
 *
 * @param {string} bookId - ID of the book
 * @returns {Object} An object containing the user's review data and query state
 *
 * @property {BookReview | null | undefined} myReview - The user's review object, null if no review exists, or undefined if loading
 * @property {boolean} isLoadingMyReview - Loading state of the query
 * @property {Error | undefined} myReviewError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchMyReview - Function to manually refetch the user's review
 *
 * @example
 * ```ts
 * const { myReview, isLoadingMyReview, myReviewError, refetchMyReview } = useMyBookReview("789");
 *
 * if (isLoadingMyReview) return <p>Loading...</p>;
 * if (myReviewError) return <p>Error: {myReviewError.message}</p>;
 *
 * if (!myReview) {
 *   return <p>You haven't reviewed this book yet.</p>;
 * }
 *
 * return (
 *   <div>
 *     <p>Your rating: {myReview.rating}</p>
 *     <p>Your review: {myReview.reviewText}</p>
 *     <button onClick={() => refetchMyReview()}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useMyBookReview(bookId?: string) {
    const {
        data: myReviewData,
        loading: isLoadingMyReview,
        error: myReviewError,
        refetch: refetchMyReview,
    } = useQuery<{ myBookReview: BookReview | undefined }>(GET_MY_BOOK_REVIEW, {
        variables: { bookId },
        skip: !bookId,
    });

    return {
        myReview: myReviewData?.myBookReview,
        isLoadingMyReview,
        myReviewError,
        refetchMyReview,
    };
}
