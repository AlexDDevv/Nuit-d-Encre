import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "@/graphql/book/book";
import { useState } from "react";
import { UseBooksMode } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import {
    formatLabelMap,
    languageLabelMap,
    languageLabelToCode,
} from "@/lib/filterMaps";

/**
 * Hook to fetch and manage a list of books with filters, pagination, and modes.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch multiple books from the GraphQL API.
 * It supports pagination, filtering by category, format, and language, as well as two usage modes:
 * - `home` → returns fewer books (12 per page)
 * - `library` → returns more books (24 per page)
 *
 * @param {UseBooksMode} mode - Defines how many books per page to fetch (`home` or `library`)
 * @returns {Object} An object containing book data, pagination state, filters, and query status
 *
 * @property {Book[]} books - The list of books returned by the query (empty if not loaded)
 * @property {boolean} isLoadingBooks - Loading state of the query
 * @property {Error | undefined} booksError - Error returned by the query, if any
 * @property {number} currentPage - The current page number
 * @property {(page: number) => void} setCurrentPage - Setter to update the current page
 * @property {{ library: number; home: number }} PER_PAGE - Number of books per page depending on mode
 * @property {number} totalCount - Total number of books available given the filters
 * @property {string[]} filters - Active filters (by label, e.g. `"Livre broché"`, `"Français"`)
 * @property {(filters: string[]) => void} setFilters - Setter to update active filters
 * @property {Record<BookFormat, string>} formatLabelMap - Map to convert book formats into user-friendly labels
 *
 * @example
 * ```ts
 * const {
 *   books,
 *   isLoadingBooks,
 *   booksError,
 *   currentPage,
 *   setCurrentPage,
 *   totalCount,
 *   filters,
 *   setFilters,
 * } = useBooksData({ mode: "library" });
 *
 * if (isLoadingBooks) return <p>Loading...</p>;
 * if (booksError) return <p>Error: {booksError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>Books</h1>
 *     <ul>
 *       {books.map((book) => (
 *         <li key={book.id}>{book.title}</li>
 *       ))}
 *     </ul>
 *     <button onClick={() => setCurrentPage(currentPage + 1)}>Next Page</button>
 *   </div>
 * );
 * ```
 */

const PER_PAGE = { library: 24, home: 12 } as const;

export function useBooksData({ mode, skip = false }: UseBooksMode & { skip?: boolean }) {
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<string[]>([]);

    const limit = mode === "library" ? PER_PAGE.library : PER_PAGE.home;
    const categoryId = searchParams.get("categoryId");

    const selectedFormat = filters.filter((f) =>
        Object.values(formatLabelMap).includes(f),
    );

    const selectedLanguage = filters.find((f) =>
        Object.values(languageLabelMap).includes(f),
    );

    const {
        data: booksData,
        loading: isLoadingBooks,
        error: booksError,
    } = useQuery(GET_BOOKS, {
        skip,
        variables: {
            filters: {
                page: currentPage,
                limit,
                search: searchParams.get("search") || "",
                categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
                format: selectedFormat.map(
                    (label) =>
                        Object.entries(formatLabelMap).find(
                            ([, v]) => v === label,
                        )?.[0],
                ),
                language: selectedLanguage
                    ? languageLabelToCode[selectedLanguage]
                    : undefined,
            },
        },
    });

    return {
        books: booksData?.books.allBooks || [],
        isLoadingBooks,
        booksError,
        currentPage,
        setCurrentPage,
        PER_PAGE,
        totalCount: booksData?.books.totalCount ?? 0,
        setFilters,
    };
}
