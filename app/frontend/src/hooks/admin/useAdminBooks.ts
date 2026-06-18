import { useQuery } from "@apollo/client";
import { ADMIN_BOOKS } from "@/graphql/admin/admin";
import { AdminBooksQuery } from "@/types/types";

/** Liste de tous les livres (onglet Livres). */
export function useAdminBooks() {
    const { data, loading, error } = useQuery<AdminBooksQuery>(ADMIN_BOOKS);

    return {
        books: data?.books.allBooks ?? [],
        isLoadingBooks: loading,
        errorBooks: error,
    };
}
