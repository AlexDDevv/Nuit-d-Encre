import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "@/graphql/book/book";
import { Book } from "@/types/types";

/**
 * Hook to fetch books from a specific category.
 *
 * @description
 * This hook fetches books that belong to a specific category.
 * Useful for displaying related books on a book details page.
 *
 * @param {string} categoryId - The ID of the category to filter by
 * @param {number} limit - Maximum number of books to fetch (default: 6)
 * @returns {Object} An object containing books data and query state
 *
 * @property {Book[]} books - The list of books in the category
 * @property {boolean} isLoadingBooks - Loading state of the query
 * @property {Error | undefined} booksError - Error returned by the query, if any
 *
 * @example
 * ```ts
 * const { books, isLoadingBooks } = useBooksByCategory("123", 5);
 * ```
 */
export function useBooksByCategory(categoryId?: string, limit: number = 6) {
    const {
        data: booksData,
        loading: isLoadingBooks,
        error: booksError,
    } = useQuery<{ books: { allBooks: Book[] } }>(GET_BOOKS, {
        variables: {
            filters: {
                categoryIds: categoryId ? [categoryId] : [],
                limit,
            },
        },
        skip: !categoryId,
    });

    return {
        books: booksData?.books.allBooks || [],
        isLoadingBooks,
        booksError,
    };
}
