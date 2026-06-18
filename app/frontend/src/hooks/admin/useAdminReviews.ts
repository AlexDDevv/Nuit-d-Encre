import { useQuery } from "@apollo/client";
import { ADMIN_REVIEWS } from "@/graphql/admin/admin";
import { AdminReviewsQuery } from "@/types/types";

/** Liste de toutes les critiques, triées par date décroissante (onglet Critiques). */
export function useAdminReviews() {
    const { data, loading, error } = useQuery<AdminReviewsQuery>(ADMIN_REVIEWS);

    return {
        reviews: data?.adminReviews ?? [],
        isLoadingReviews: loading,
        errorReviews: error,
    };
}
