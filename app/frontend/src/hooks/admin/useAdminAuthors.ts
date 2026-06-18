import { useQuery } from "@apollo/client";
import { ADMIN_AUTHORS } from "@/graphql/admin/admin";
import { AdminAuthorsQuery } from "@/types/types";

/** Liste de tous les auteurs (onglet Auteurs). */
export function useAdminAuthors() {
    const { data, loading, error } = useQuery<AdminAuthorsQuery>(ADMIN_AUTHORS);

    return {
        authors: data?.authors.allAuthors ?? [],
        isLoadingAuthors: loading,
        errorAuthors: error,
    };
}
