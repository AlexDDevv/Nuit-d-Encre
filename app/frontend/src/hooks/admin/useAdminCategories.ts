import { useQuery } from "@apollo/client";
import { ADMIN_CATEGORIES } from "@/graphql/admin/admin";
import { AdminCategoriesQuery } from "@/types/types";

/** Liste de toutes les catégories avec compteur de livres (onglet Catégories). */
export function useAdminCategories() {
    const { data, loading, error } =
        useQuery<AdminCategoriesQuery>(ADMIN_CATEGORIES);

    return {
        categories: data?.categories ?? [],
        isLoadingCategories: loading,
        errorCategories: error,
    };
}
