import { useQuery } from "@apollo/client";
import {
    GET_ACTIVITY_FEED,
    GET_GLOBAL_ACTIVITY_FEED,
} from "@/graphql/user/feed";
import { FeedEntry } from "@/types/types";

const PAGE = 20;

/**
 * Fil d'activité : actions des personnes suivies (page unique MVP).
 * Si vide (0 abonnement), bascule sur l'activité globale (découverte).
 */
export function useActivityFeed() {
    const { data, loading } = useQuery(GET_ACTIVITY_FEED, {
        variables: { limit: PAGE, offset: 0 },
    });

    const entries: FeedEntry[] = data?.activityFeed ?? [];
    const isEmpty = !loading && data !== undefined && entries.length === 0;

    const { data: globalData, loading: globalLoading } = useQuery(
        GET_GLOBAL_ACTIVITY_FEED,
        { variables: { limit: PAGE }, skip: !isEmpty },
    );
    const globalEntries: FeedEntry[] = globalData?.globalActivityFeed ?? [];

    return {
        entries,
        isEmpty,
        globalEntries,
        loading: loading || globalLoading,
    };
}
