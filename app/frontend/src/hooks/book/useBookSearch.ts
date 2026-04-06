import { useQuery } from "@apollo/client";
import { SEARCH_BOOKS } from "@/graphql/book/book-search";
import { BookSearchResult } from "@/types/types";

export function useBookSearch(query: string) {
    const { data, loading } = useQuery<{ searchBooks: BookSearchResult[] }>(
        SEARCH_BOOKS,
        {
            variables: { query },
            skip: query.trim().length < 3,
        }
    );

    const results = data?.searchBooks ?? [];

    return {
        dbResults: results.filter(r => r.isInDatabase),
        externalResults: results.filter(r => !r.isInDatabase),
        isSearching: loading,
    };
}
