import { VITE_GRAPHQL_ENDPOINT } from "@/config/config";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: VITE_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    credentials: "include",
    defaultOptions: {
        // Hybride : le cache sert d'abord (navigation instantanée), puis
        // rafraîchissement réseau en arrière-plan. Les vues à fraîcheur
        // critique (whoami, bannières, admin, favoris) conservent un
        // `fetchPolicy: "network-only"` explicite au niveau de leur hook.
        watchQuery: {
            fetchPolicy: "cache-and-network",
            nextFetchPolicy: "cache-first",
        },
        query: {
            fetchPolicy: "cache-first",
        },
    },
});
