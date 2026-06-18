import { useQuery } from "@apollo/client";
import { ADMIN_STATS } from "@/graphql/admin/admin";
import { AdminStatsQuery } from "@/types/types";

/**
 * Récupère les compteurs globaux affichés dans la barre d'analytics du panel admin.
 */
export function useAdminStats() {
    const { data, loading, error } = useQuery<AdminStatsQuery>(ADMIN_STATS);

    return {
        stats: data?.adminStats,
        isLoadingStats: loading,
        errorStats: error,
    };
}
