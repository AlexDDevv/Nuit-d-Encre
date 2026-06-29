import { useQuery } from "@apollo/client";
import {
    GET_ACTIVITY_FEED,
    GET_GLOBAL_ACTIVITY_FEED,
} from "@/graphql/user/feed";
import { FeedEntry, FeedTab } from "@/types/types";

const PAGE = 20;

/**
 * Fil d'activité (page unique MVP) : actions des lecteurs suivis et flux global
 * de la communauté. Le flux global est chargé à la demande — quand l'onglet
 * « Communauté » est actif, ou en repli automatique si aucun abonnement.
 */
export function useActivityFeed(tab: FeedTab) {
    const following = useQuery(GET_ACTIVITY_FEED, {
        variables: { limit: PAGE, offset: 0 },
    });
    const followingEntries: FeedEntry[] = following.data?.activityFeed ?? [];
    const isEmpty =
        !following.loading &&
        following.data !== undefined &&
        followingEntries.length === 0;

    const wantGlobal = isEmpty || tab === "communaute";
    const global = useQuery(GET_GLOBAL_ACTIVITY_FEED, {
        variables: { limit: PAGE },
        skip: !wantGlobal,
    });
    const globalEntries: FeedEntry[] = global.data?.globalActivityFeed ?? [];

    return {
        followingEntries,
        globalEntries,
        isEmpty,
        loading: following.loading || (wantGlobal && global.loading),
    };
}
