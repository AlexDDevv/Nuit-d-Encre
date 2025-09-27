import { GET_BOOK } from "@/graphql/book/book";
import { Book } from "@/types/types";
import { useQuery } from "@apollo/client";

/**
 * Hook to fetch a single book's data by its ID.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch book details.
 * If `bookId` is not provided, the query is skipped.
 * For fetching multiple books, consider using `useBooksData()`.
 *
 * @param {string} bookId - ID of the book to fetch
 * @returns {Object} An object containing book data and query state
 *
 * @property {Book | undefined} book - The book object returned by the query, or undefined if not loaded
 * @property {boolean} isLoadingBook - Loading state of the query
 * @property {Error | undefined} bookError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchBook - Function to manually refetch the book data
 *
 * @example
 * ```ts
 * const { book, isLoadingBook, bookError, refetchBook } = useBookData("123xyz");
 *
 * if (isLoadingBook) return <p>Loading...</p>;
 * if (bookError) return <p>Error: {bookError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>{book?.title}</h1>
 *     <p>{book?.author}</p>
 *     <button onClick={() => refetchBook()}>Refresh</button>
 *   </div>
 * );
 * ```
 */

export function useBookData(bookId: string) {
    const {
        data: bookData,
        loading: isLoadingBook,
        error: bookError,
        refetch: refetchBook,
    } = useQuery<{ book: Book }>(GET_BOOK, {
        variables: { bookId: bookId },
        skip: !bookId,
    });

    return {
        book: bookData?.book,
        isLoadingBook,
        bookError,
        refetchBook,
    };
}
