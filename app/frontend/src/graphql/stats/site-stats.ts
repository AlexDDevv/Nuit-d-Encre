import { gql } from "@apollo/client";

/** Public global counters shown on the Contact page. */
export const SITE_STATS = gql`
    query SiteStats {
        siteStats {
            users
            books
            reviews
        }
    }
`;
