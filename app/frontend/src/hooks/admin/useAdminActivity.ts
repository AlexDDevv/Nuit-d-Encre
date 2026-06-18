import { useQuery } from "@apollo/client";
import { ADMIN_RECENT_ACTIVITY } from "@/graphql/admin/admin";
import { AdminRecentActivityQuery } from "@/types/types";

/**
 * Récupère l'activité récente du dashboard admin : inscriptions, livres,
 * critiques et journal des dernières actions XP.
 */
export function useAdminActivity() {
    const { data, loading, error } =
        useQuery<AdminRecentActivityQuery>(ADMIN_RECENT_ACTIVITY);

    return {
        activity: data?.adminRecentActivity,
        isLoadingActivity: loading,
        errorActivity: error,
    };
}
