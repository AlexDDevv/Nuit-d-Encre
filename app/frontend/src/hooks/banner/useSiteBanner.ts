import { useQuery } from "@apollo/client";
import { ACTIVE_SITE_BANNER } from "@/graphql/banner/site-banner";
import type { ActiveSiteBannerQuery } from "@/types/types";

/** Récupère la bannière de site active (ou null) pour le visiteur courant. */
export function useSiteBanner() {
    const { data, loading } = useQuery<ActiveSiteBannerQuery>(
        ACTIVE_SITE_BANNER,
        { fetchPolicy: "network-only" },
    );

    return { banner: data?.activeSiteBanner ?? null, loading };
}
