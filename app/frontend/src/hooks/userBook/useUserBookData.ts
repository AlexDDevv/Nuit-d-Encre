import { GET_USER_BOOK } from "@/graphql/user/userBook";
import { UserBook } from "@/types/types";
import { useQuery } from "@apollo/client";

/**
 * Hook to fetch a single userBook's data by its ID.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch userBook details.
 * If `userBookId` is not provided, the query is skipped.
 * For fetching multiple userBooks, consider using `useUserBooksData()`.
 *
 * @param {string} userBookId - ID of the userBook to fetch
 * @returns {Object} An object containing userBook data and query state
 *
 * @property {UserBook | undefined} userBook - The userBook object returned by the query, or undefined if not loaded
 * @property {boolean} isLoadingUserBook - Loading state of the query
 * @property {Error | undefined} userBookError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchUserBook - Function to manually refetch the userBook data
 *
 * @example
 * ```ts
 * const { userBook, isLoadingUserBook, userBookError, refetchUserBook } = useUserBookData("123xyz");
 *
 * if (isLoadingUserBook) return <p>Loading...</p>;
 * if (userBookError) return <p>Error: {userBookError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>{userBook?.title}</h1>
 *     <p>{userBook?.author}</p>
 *     <button onClick={() => refetchUserBook()}>Refresh</button>
 *   </div>
 * );
 * ```
 */

export function useUserBookData(userBookId?: string) {
    const {
        data: userBookData,
        loading: isLoadingUserBook,
        error: userBookError,
        refetch: refetchUserBook,
    } = useQuery<{ userBook: UserBook }>(GET_USER_BOOK, {
        variables: { userBookId: userBookId },
        skip: !userBookId,
    });

    return {
        userBook: userBookData?.userBook,
        isLoadingUserBook,
        userBookError,
        refetchUserBook,
    };
}
