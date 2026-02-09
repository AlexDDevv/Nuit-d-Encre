import { GET_AUTHOR } from "@/graphql/author/author";
import { Author } from "@/types/types";
import { useQuery } from "@apollo/client";

/**
 * Hook to fetch a single author's data by their ID.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch author details.
 * If `authorId` is not provided, the query is skipped.
 * For fetching multiple authors, consider using `useAuthorsData()`.
 *
 * @param {string} authorId - ID of the author to fetch
 * @returns {Object} An object containing author data and query state
 *
 * @property {Author | undefined} author - The author object returned by the query, or undefined if not loaded
 * @property {boolean} isLoadingAuthor - Loading state of the query
 * @property {Error | undefined} authorError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchAuthor - Function to manually refetch the author data
 *
 * @example
 * ```ts
 * const { author, isLoadingAuthor, authorError, refetchAuthor } = useAuthorData("456abc");
 *
 * if (isLoadingAuthor) return <p>Loading...</p>;
 * if (authorError) return <p>Error: {authorError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>{author?.firstname}</h1>
 *     <p>{author?.lastname}</p>
 *     <button onClick={() => refetchAuthor()}>Refresh</button>
 *   </div>
 * );
 * ```
 */

export function useAuthorData(authorId?: string) {
    const {
        data: authorData,
        loading: isLoadingAuthor,
        error: authorError,
        refetch: refetchAuthor,
    } = useQuery<{ author: Author }>(GET_AUTHOR, {
        variables: { authorId: authorId },
        skip: !authorId,
    });

    return {
        author: authorData?.author,
        isLoadingAuthor,
        authorError,
        refetchAuthor,
    };
}
