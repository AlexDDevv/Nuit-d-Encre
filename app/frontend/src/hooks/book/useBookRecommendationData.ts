import { GET_BOOK_RECOMMENDATION } from "@/graphql/book/book-recommendation";
import { useQuery } from "@apollo/client";

/**
 * Hook to fetch book recommendations by book ID.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch book recommendation details.
 * If `bookId` is not provided, the query is skipped.
 *
 * @param {string} bookId - ID of the book to fetch recommendations for
 * @returns {Object} An object containing book recommendation data and query state
 *
 * @property {any | undefined} bookRecommendation - The book recommendation object returned by the query, or undefined if not loaded
 * @property {boolean} isLoadingBookRecommendation - Loading state of the query
 * @property {Error | undefined} bookRecommendationError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchBookRecommendation - Function to manually refetch the book recommendation data
 *
 * @example
 * ```ts
 * const { bookRecommendation, isLoadingBookRecommendation, bookRecommendationError, refetchBookRecommendation } = useBookRecommendationData("123xyz");
 *
 * if (isLoadingBookRecommendation) return <p>Loading...</p>;
 * if (bookRecommendationError) return <p>Error: {bookRecommendationError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>{bookRecommendation?.book.title}</h1>
 *     <p>Recommended by: {bookRecommendation?.user.userName}</p>
 *     <button onClick={() => refetchBookRecommendation()}>Refresh</button>
 *   </div>
 * );
 * ```
 */

export function useBookRecommendationData(bookId?: string) {
    const {
        data: bookRecommendationData,
        loading: isLoadingBookRecommendation,
        error: bookRecommendationError,
        refetch: refetchBookRecommendation,
    } = useQuery(GET_BOOK_RECOMMENDATION, {
        variables: { bookId: bookId },
        skip: !bookId,
    });

    return {
        bookRecommendation: bookRecommendationData?.bookRecommendation,
        isLoadingBookRecommendation,
        bookRecommendationError,
        refetchBookRecommendation,
    };
}
