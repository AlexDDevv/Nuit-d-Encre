import { useQuery } from "@apollo/client";
import { GET_AUTHORS } from "@/graphql/author/author";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UseAuthorsMode } from "@/types/types";

/**
 * Hook to fetch and manage a list of authors with search and pagination, supporting different modes.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch multiple authors from the GraphQL API.
 * It supports pagination and a search term taken from the URL query string, as well as two usage modes:
 * - `home` → fetches fewer authors (12 per page)
 * - `library` → fetches more authors (24 per page)
 *
 * @param {UseAuthorsMode} mode - Defines how many authors per page to fetch (`home` or `library`)
 * @returns {Object} An object containing author data, pagination state, and query status
 *
 * @property {Author[]} authors - The list of authors returned by the query (empty if not loaded)
 * @property {boolean} isLoadingAuthors - Loading state of the query
 * @property {Error | undefined} authorsError - Error returned by the query, if any
 * @property {number} currentPage - The current page number
 * @property {(page: number) => void} setCurrentPage - Setter to update the current page
 * @property {{ library: number; home: number }} PER_PAGE - Number of authors per page depending on mode
 * @property {number} totalCount - Total number of authors available given the current search
 *
 * @example
 * ```ts
 * const {
 *   authors,
 *   isLoadingAuthors,
 *   authorsError,
 *   currentPage,
 *   setCurrentPage,
 *   PER_PAGE,
 *   totalCount,
 * } = useAuthorsData({ mode: "library" });
 *
 * if (isLoadingAuthors) return <p>Loading...</p>;
 * if (authorsError) return <p>Error: {authorsError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>Authors</h1>
 *     <p>Total: {totalCount}</p>
 *     <ul>
 *       {authors.map((author) => (
 *         <li key={author.id}>
 *           {author.name}
 *         </li>
 *       ))}
 *     </ul>
 *     <button onClick={() => setCurrentPage(currentPage + 1)}>Next Page</button>
 *   </div>
 * );
 * ```
 */

export function useAuthorsData({ mode }: UseAuthorsMode) {
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const PER_PAGE = {
        library: 24,
        home: 12,
    };

    const getLimit = () => {
        if (!mode || mode === "home") return PER_PAGE.home;
        if (mode === "library") return PER_PAGE.library;
        return PER_PAGE.home;
    };

    // Apollo hooks
    const {
        data: authorsData,
        loading: isLoadingAuthors,
        error: authorsError,
    } = useQuery(GET_AUTHORS, {
        variables: {
            filters: {
                page: currentPage,
                limit: getLimit(),
                search: searchParams.get("search") || "",
            },
        },
    });

    return {
        authors: authorsData?.authors.allAuthors || [],
        isLoadingAuthors,
        authorsError,
        currentPage,
        setCurrentPage,
        PER_PAGE,
        totalCount: authorsData?.authors.totalCount ?? 0,
    };
}
