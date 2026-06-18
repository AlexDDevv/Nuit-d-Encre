import { gql } from "@apollo/client";

/** Bannière de site active visible par le visiteur courant (audience résolue côté serveur). */
export const ACTIVE_SITE_BANNER = gql`
    query ActiveSiteBanner {
        activeSiteBanner {
            id
            title
            message
            variant
            audience
            dismissible
            actionLabel
            actionUrl
            updatedAt
        }
    }
`;
