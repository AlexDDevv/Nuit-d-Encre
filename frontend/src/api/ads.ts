import { gql } from "@apollo/client";

export const queryAds = gql`
    query Ads {
        ads {
            id
            title
            description
            owner
            price
            picture
            location
            createdBy
            createdAt
            category {
                id
                name
            }
            tags {
                id
                name
            }
        }
    }
`;
