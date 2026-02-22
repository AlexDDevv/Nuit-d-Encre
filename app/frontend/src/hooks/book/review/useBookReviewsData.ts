import { GET_BOOK_REVIEWS } from "@/graphql/book/book-review";
import { BookReviewSortBy, BookReviewsResult } from "@/types/types";
import { useQuery } from "@apollo/client";

/**
 * Hook to fetch all reviews for a specific book with pagination and sorting.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch reviews for a given book.
 * Supports pagination and multiple sort options.
 * If `bookId` is not provided, the query is skipped.
 *
 * @param {string} bookId - ID of the book to fetch reviews for
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Number of reviews per page (default: 10)
 * @param {BookReviewSortBy} sortBy - Sort order (default: RECENT)
 * @returns {Object} An object containing reviews data and query state
 *
 * @property {BookReview[] | undefined} reviews - Array of review objects
 * @property {number | undefined} totalCount - Total number of reviews for the book
 * @property {number | undefined} currentPage - Current page number
 * @property {number | undefined} pageLimit - Number of reviews per page
 * @property {boolean} isLoadingReviews - Loading state of the query
 * @property {Error | undefined} reviewsError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchReviews - Function to manually refetch the reviews data
 *
 * @example
 * ```ts
 * const {
 *   reviews,
 *   totalCount,
 *   currentPage,
 *   pageLimit,
 *   isLoadingReviews,
 *   reviewsError,
 *   refetchReviews,
 * } = useBookReviewsData("456", 1, 10, BookReviewSortBy.HELPFUL);
 *
 * if (isLoadingReviews) return <p>Loading reviews...</p>;
 * if (reviewsError) return <p>Error: {reviewsError.message}</p>;
 *
 * return (
 *   <div>
 *     <p>Total reviews: {totalCount}</p>
 *     {reviews?.map((review) => (
 *       <div key={review.id}>
 *         <p>Rating: {review.rating}</p>
 *         <p>{review.reviewText}</p>
 *       </div>
 *     ))}
 *     <button onClick={() => refetchReviews()}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useBookReviewsData(
    bookId?: string,
    page: number = 1,
    limit: number = 10,
    sortBy: BookReviewSortBy = BookReviewSortBy.RECENT,
) {
    const {
        data: reviewsData,
        loading: isLoadingReviews,
        error: reviewsError,
        refetch: refetchReviews,
    } = useQuery<{ bookReviews: BookReviewsResult }>(GET_BOOK_REVIEWS, {
        variables: {
            bookId,
            page,
            limit,
            sortBy,
        },
        skip: !bookId,
    });

    return {
        reviews: reviewsData?.bookReviews.reviews,
        totalCount: reviewsData?.bookReviews.totalCount,
        currentPage: reviewsData?.bookReviews.page,
        pageLimit: reviewsData?.bookReviews.limit,
        isLoadingReviews,
        reviewsError,
        refetchReviews,
    };
}
