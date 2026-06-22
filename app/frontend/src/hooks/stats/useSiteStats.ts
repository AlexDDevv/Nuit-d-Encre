import { useQuery } from "@apollo/client";
import { SITE_STATS } from "@/graphql/stats/site-stats";
import { SiteStatsQuery } from "@/types/types";

/**
 * Fetches the public global counters (users, books, reviews) shown on the
 * Contact page.
 */
export function useSiteStats() {
    const { data, loading, error } = useQuery<SiteStatsQuery>(SITE_STATS);

    return {
        stats: data?.siteStats,
        isLoadingStats: loading,
        errorStats: error,
    };
}
